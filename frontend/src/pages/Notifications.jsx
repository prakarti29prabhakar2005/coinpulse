import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Common/Header";
import Loader from "../components/Common/Loader";
import { getMyNotifications } from "../functions/getMyNotifications";
import { markNotificationRead } from "../functions/markNotificationRead";

export default function Notifications() {
  const userEmail = useMemo(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser)?.email : null;
  }, []);

  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadNotifications = async () => {
      if (!userEmail) return;

      setLoading(true);
      try {
        const data = await getMyNotifications(userEmail);
        setNotifications(data);
      } catch (error) {
        console.error(error?.message || error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [userEmail]);

  const unreadCount = notifications.filter((notification) => !notification.readAt).length;

  return (
    <div>
      <Header />
      <div style={{ padding: "1.25rem" }}>
        <h2 style={{ marginBottom: "0.25rem" }}>
          Notifications {unreadCount ? `(Unread: ${unreadCount})` : ""}
        </h2>
        <div style={{ color: "var(--white)", opacity: 0.85, marginBottom: "1rem" }}>
          Alerts will notify you here in the web app, in the browser if permission is granted,
          and by email when SMTP is configured on the backend.
        </div>

        {loading ? (
          <Loader />
        ) : !notifications.length ? (
          <div style={{ color: "var(--white)", opacity: 0.85 }}>No notifications yet.</div>
        ) : (
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {notifications.map((notification) => (
              <div
                key={notification._id}
                style={{
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: 10,
                  padding: "0.9rem",
                  background: notification.readAt
                    ? "transparent"
                    : "rgba(58,128,233,0.06)",
                }}
              >
                <div style={{ color: "var(--white)", fontSize: 13, opacity: 0.75, marginBottom: 6 }}>
                  {notification.assetType.toUpperCase()} |{" "}
                  {notification.assetName || notification.assetId}
                </div>
                <div style={{ color: "var(--white)", marginBottom: 8 }}>{notification.message}</div>
                <div style={{ color: "var(--white)", fontSize: 12, opacity: 0.7, marginBottom: 10 }}>
                  {notification.createdAt
                    ? new Date(notification.createdAt).toLocaleString()
                    : ""}
                  {!notification.readAt ? " | Unread" : ""}
                </div>
                {!notification.readAt && (
                  <button
                    onClick={async () => {
                      if (!userEmail) return;

                      try {
                        await markNotificationRead({
                          email: userEmail,
                          id: notification._id,
                        });
                        setNotifications((currentNotifications) =>
                          currentNotifications.map((item) =>
                            item._id === notification._id
                              ? { ...item, readAt: new Date().toISOString() }
                              : item
                          )
                        );
                      } catch (error) {
                        console.error(error?.message || error);
                      }
                    }}
                    style={{
                      border: "none",
                      background: "var(--blue)",
                      color: "white",
                      padding: "8px 12px",
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                  >
                    Mark as read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
