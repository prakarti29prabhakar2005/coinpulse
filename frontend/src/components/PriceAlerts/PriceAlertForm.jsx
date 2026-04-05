import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { requestBrowserNotificationPermission } from "../../functions/browserNotifications";
import { createPriceAlert } from "../../functions/createPriceAlert";

const pad2 = (n) => String(n).padStart(2, "0");
const toDatetimeLocalValue = (d) => {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}T${pad2(
    dt.getHours()
  )}:${pad2(dt.getMinutes())}`;
};

export default function PriceAlertForm({ assetType, assetId, assetName, currentPrice }) {
  const [targetPrice, setTargetPrice] = useState("");
  const [direction, setDirection] = useState("above");
  const [enabledAt, setEnabledAt] = useState(toDatetimeLocalValue(new Date()));
  const [repeatMinutes, setRepeatMinutes] = useState(15);
  const [submitting, setSubmitting] = useState(false);

  const user = useMemo(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.email) {
      toast.error("Login to set price alerts");
      return;
    }
    const tp = Number(targetPrice);
    if (!Number.isFinite(tp) || tp <= 0) {
      toast.error("Enter a valid target price");
      return;
    }

    const enabledDate = new Date(enabledAt);
    if (Number.isNaN(enabledDate.getTime())) {
      toast.error("Enter a valid alarm start time");
      return;
    }

    const rm = Number(repeatMinutes);
    if (!Number.isFinite(rm) || rm < 0) {
      toast.error("repeat minutes must be >= 0");
      return;
    }

    setSubmitting(true);
    try {
      const permissionRequest = requestBrowserNotificationPermission();

      await createPriceAlert({
        email: user.email,
        assetType,
        assetId,
        assetName,
        targetPrice: tp,
        direction,
        enabledAt: enabledDate.toISOString(),
        repeatMinutes: rm,
      });

      await permissionRequest;
      toast.success("Alert created");
      setTargetPrice("");
    } catch (err) {
      toast.error(err?.message || "Failed to create alert");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <h3 style={{ marginBottom: "0.5rem" }}>Set Price Alert</h3>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.75rem", maxWidth: 520 }}>
        <div>
          <div style={{ marginBottom: 6, fontWeight: 600 }}>
            {assetType === "crypto" ? "Crypto" : "Stock"}:{" "}
            {assetName || assetId}
          </div>
          <div style={{ opacity: 0.9 }}>
            Current price: ${Number(currentPrice || 0).toLocaleString()}
          </div>
        </div>

        <label>
          Target Price (USD)
          <input
            type="number"
            step="0.01"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", marginTop: 6 }}
          />
        </label>

        <label>
          Notify When Price
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            style={{ width: "100%", padding: "10px", marginTop: 6 }}
          >
            <option value="above">Goes above / equals target</option>
            <option value="below">Goes below / equals target</option>
          </select>
        </label>

        <label>
          Alarm Start Time
          <input
            type="datetime-local"
            value={enabledAt}
            onChange={(e) => setEnabledAt(e.target.value)}
            style={{ width: "100%", padding: "10px", marginTop: 6 }}
          />
        </label>

        <label>
          Repeat Every Minutes While Condition Remains True
          <input
            type="number"
            step="1"
            min="0"
            value={repeatMinutes}
            onChange={(e) => setRepeatMinutes(e.target.value)}
            style={{ width: "100%", padding: "10px", marginTop: 6 }}
          />
          <div style={{ fontSize: 12, opacity: 0.85, marginTop: 6 }}>
            Set to `0` to notify only once when it first reaches the target.
          </div>
        </label>

        <button
          type="submit"
          disabled={submitting}
          style={{
            background: "var(--blue)",
            color: "white",
            border: "none",
            padding: "12px",
            borderRadius: 8,
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Creating..." : "Create Alert"}
        </button>
      </form>
    </div>
  );
}

