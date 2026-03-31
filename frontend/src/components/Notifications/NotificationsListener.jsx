import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { showBrowserNotification } from "../../functions/browserNotifications";
import { getUnreadNotifications } from "../../functions/getUnreadNotifications";

export default function NotificationsListener() {
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    setUserEmail(u ? JSON.parse(u)?.email : null);
  }, []);

  useEffect(() => {
    const onUserChanged = () => {
      const u = localStorage.getItem("user");
      setUserEmail(u ? JSON.parse(u)?.email : null);
    };
    window.addEventListener("userChanged", onUserChanged);
    return () => window.removeEventListener("userChanged", onUserChanged);
  }, []);

  const lastSeenCreatedAtKey = useMemo(() => {
    return userEmail ? `lastSeenCreatedAt:${userEmail}` : null;
  }, [userEmail]);

  const lastSeenCreatedAtRef = useRef(new Date());
  useEffect(() => {
    if (!lastSeenCreatedAtKey) return;
    const saved = localStorage.getItem(lastSeenCreatedAtKey);
    lastSeenCreatedAtRef.current = saved ? new Date(saved) : new Date();
  }, [lastSeenCreatedAtKey]);

  useEffect(() => {
    if (!userEmail) return;

    const fetchAndToast = async () => {
      try {
        const unread = await getUnreadNotifications(userEmail);
        if (!unread?.length) return;

        const lastSeen = lastSeenCreatedAtRef.current;
        let maxSeen = lastSeen;

        for (const n of unread) {
          const createdAt = n.createdAt ? new Date(n.createdAt) : null;
          if (!createdAt) continue;

          if (createdAt > lastSeen) {
            toast.info(n.message, {
              toastId: String(n._id),
            });
            showBrowserNotification({
              title: `${n.assetName || n.assetId} alert`,
              body: n.message,
              tag: String(n._id),
            });
          }

          if (createdAt > maxSeen) maxSeen = createdAt;
        }

        if (lastSeenCreatedAtKey && maxSeen) {
          localStorage.setItem(lastSeenCreatedAtKey, maxSeen.toISOString());
          lastSeenCreatedAtRef.current = maxSeen;
        }
      } catch (err) {
        // Avoid spamming console every interval
        console.error("Unread notifications fetch failed:", err?.message || err);
      }
    };

    // initial fetch + polling
    fetchAndToast();
    const interval = setInterval(fetchAndToast, 15000);
    return () => clearInterval(interval);
  }, [userEmail, lastSeenCreatedAtKey]);

  return null;
}

