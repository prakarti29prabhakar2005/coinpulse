const PriceAlert = require("../models/PriceAlert");
const Notification = require("../models/Notification");
const { fetchCurrentPrices } = require("../services/priceFetchers");
const { sendAlertEmail } = require("../services/mailer");

const REPEAT_MINUTES_TO_MS = (m) => Math.max(0, m) * 60 * 1000;
const formatPrice = (value) => `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 8 })}`;

const buildMessage = ({
  assetType,
  assetId,
  assetName,
  targetPrice,
  direction,
  currentPrice,
}) => {
  const assetLabel = assetType === "crypto" ? "crypto" : "stock";
  const comparison =
    direction === "above"
      ? `at or above ${formatPrice(targetPrice)}`
      : `at or below ${formatPrice(targetPrice)}`;
  const displayName = assetName || assetId;

  return `Your ${assetLabel} alert for ${displayName} was triggered. Current price: ${formatPrice(currentPrice)}. Target: ${comparison}.`;
};

exports.startPriceAlertJob = ({ intervalMs = 60000 } = {}) => {
  // Prevent accidental multiple job loops in dev.
  if (global.__priceAlertJobStarted) return;
  global.__priceAlertJobStarted = true;

  setInterval(async () => {
    const now = new Date();

    try {
      const alerts = await PriceAlert.find({
        active: true,
        enabledAt: { $lte: now },
      });

      if (!alerts.length) return;

      const cryptoIds = Array.from(
        new Set(alerts.filter((a) => a.assetType === "crypto").map((a) => a.assetId))
      );
      const stockSymbols = Array.from(
        new Set(alerts.filter((a) => a.assetType === "stock").map((a) => a.assetId))
      );

      const { cryptoMap, stockMap } = await fetchCurrentPrices({
        cryptoIds,
        stockSymbols,
      });

      for (const alert of alerts) {
        const rawPrice = alert.assetType === "crypto" ? cryptoMap[alert.assetId] : stockMap[alert.assetId];
        const price =
          alert.assetType === "crypto"
            ? rawPrice?.usd ?? rawPrice
            : rawPrice;

        if (price === undefined || price === null || Number.isNaN(Number(price))) {
          continue;
        }

        const currentPrice = Number(price);
        const inCondition =
          alert.direction === "above" ? currentPrice >= alert.targetPrice : currentPrice <= alert.targetPrice;

        const shouldNotify =
          inCondition &&
          ((!alert.wasInCondition && true) ||
            (alert.wasInCondition &&
              alert.repeatMinutes > 0 &&
              alert.lastTriggeredAt &&
              now.getTime() - alert.lastTriggeredAt.getTime() >= REPEAT_MINUTES_TO_MS(alert.repeatMinutes)));

        // Update alert state only when needed
        const shouldUpdate =
          (inCondition && !alert.wasInCondition) ||
          (!inCondition && alert.wasInCondition) ||
          shouldNotify;

        if (!shouldUpdate) continue;

        // Trigger notification/email
        if (shouldNotify) {
          const message = buildMessage({
            assetType: alert.assetType,
            assetId: alert.assetId,
            assetName: alert.assetName,
            targetPrice: alert.targetPrice,
            direction: alert.direction,
            currentPrice,
          });

          // Store web notification
          await Notification.create({
            userEmail: alert.userEmail,
            alertId: alert._id,
            assetType: alert.assetType,
            assetId: alert.assetId,
            assetName: alert.assetName,
            targetPrice: alert.targetPrice,
            direction: alert.direction,
            currentPrice,
            message,
            readAt: null,
          });

          // Send email if SMTP is configured
          try {
            await sendAlertEmail({
              to: alert.userEmail,
              subject: "Price Alert Triggered",
              text: message,
            });
          } catch (emailError) {
            // Keep web notification anyway
            console.error("Email send failed:", emailError?.message || emailError);
          }
        }

        // Persist wasInCondition + lastTriggeredAt (if we notified)
        await PriceAlert.updateOne(
          { _id: alert._id },
          {
            $set: {
              wasInCondition: inCondition,
              ...(shouldNotify ? { lastTriggeredAt: now } : {}),
            },
          }
        );
      }
    } catch (jobError) {
      console.error("Price alert job error:", jobError?.message || jobError);
    }
  }, intervalMs);
};

