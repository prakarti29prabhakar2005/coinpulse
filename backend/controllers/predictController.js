const axios = require("axios");

function normalizeAssetType(assetType) {
  const t = String(assetType || "").trim().toLowerCase();
  if (t === "stock" || t === "stocks") return "stocks";
  if (t === "crypto" || t === "cryptos" || t === "coin" || t === "coins") return "crypto";
  return null;
}

exports.predictFuturePrice = async (req, res) => {
  try {
    const assetType = normalizeAssetType(req.body?.assetType);
    const asset = String(req.body?.asset || "").trim();
    const days = Number(req.body?.days);

    if (!assetType) {
      return res.status(400).json({ message: "assetType must be 'stocks' or 'crypto'." });
    }
    if (!asset) {
      return res.status(400).json({ message: "asset is required." });
    }
    if (!Number.isFinite(days) || days < 1 || days > 365) {
      return res.status(400).json({ message: "days must be a number between 1 and 365." });
    }

    const mlBaseUrl = process.env.ML_SERVICE_URL || "http://localhost:8000";
    const response = await axios.post(
      `${mlBaseUrl.replace(/\/$/, "")}/predict`,
      { assetType, asset, days },
      { timeout: 120000 }
    );

    return res.json(response.data);
  } catch (error) {
    const status = error?.response?.status || 500;
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.detail ||
      error?.message ||
      "Prediction failed";
    return res.status(status).json({ message });
  }
};

