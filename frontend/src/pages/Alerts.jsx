import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Header from "../components/Common/Header";
import Loader from "../components/Common/Loader";
import { deletePriceAlert } from "../functions/deletePriceAlert";
import { getMyAlerts } from "../functions/getMyAlerts";

const formatPrice = (value) =>
  `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 8 })}`;

export default function Alerts() {
  const userEmail = useMemo(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser)?.email : null;
  }, []);

  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const loadAlerts = async () => {
      if (!userEmail) return;

      setLoading(true);
      try {
        const data = await getMyAlerts(userEmail);
        setAlerts(data);
      } catch (error) {
        toast.error(error?.message || "Failed to load alerts");
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
  }, [userEmail]);

  return (
    <div>
      <Header />
      <div style={{ padding: "1.25rem" }}>
        <h2 style={{ marginBottom: "0.25rem" }}>Active Alerts</h2>
        <div style={{ color: "var(--white)", opacity: 0.85, marginBottom: "1rem" }}>
          Alerts created from the dashboard or detail pages will show here until you delete them.
        </div>

        {!userEmail ? (
          <div style={{ color: "var(--white)", opacity: 0.85 }}>Login to manage your alerts.</div>
        ) : loading ? (
          <Loader />
        ) : !alerts.length ? (
          <div style={{ color: "var(--white)", opacity: 0.85 }}>No active alerts yet.</div>
        ) : (
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {alerts.map((alert) => (
              <div
                key={alert._id}
                style={{
                  border: "1px solid rgba(0,0,0,0.12)",
                  borderRadius: 12,
                  padding: "1rem",
                  background: "var(--darkgrey)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    flexWrap: "wrap",
                    marginBottom: "0.6rem",
                  }}
                >
                  <div>
                    <div style={{ color: "var(--white)", fontSize: 13, opacity: 0.75, marginBottom: 6 }}>
                      {alert.assetType.toUpperCase()}
                    </div>
                    <div style={{ color: "var(--white)", fontWeight: 600 }}>
                      {alert.assetName || alert.assetId}
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        await deletePriceAlert({ email: userEmail, id: alert._id });
                        setAlerts((prev) => prev.filter((item) => item._id !== alert._id));
                        toast.success("Alert deleted");
                      } catch (error) {
                        toast.error(error?.message || "Failed to delete alert");
                      }
                    }}
                    style={{
                      border: "1px solid rgba(249,65,65,0.5)",
                      background: "transparent",
                      color: "var(--red)",
                      padding: "8px 12px",
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>

                <div style={{ color: "var(--white)", opacity: 0.92, marginBottom: 6 }}>
                  Notify when price goes {alert.direction} {formatPrice(alert.targetPrice)}
                </div>
                <div style={{ color: "var(--white)", fontSize: 13, opacity: 0.75 }}>
                  Starts: {new Date(alert.enabledAt).toLocaleString()}
                </div>
                <div style={{ color: "var(--white)", fontSize: 13, opacity: 0.75 }}>
                  Repeat: {alert.repeatMinutes > 0 ? `every ${alert.repeatMinutes} minute(s)` : "once"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
