const User = require("../models/User");
const PriceAlert = require("../models/PriceAlert");
const Notification = require("../models/Notification");

const isValidNumber = (n) => typeof n === "number" && Number.isFinite(n);
const normalizeString = (value) => String(value || "").trim();

exports.createAlert = async (req, res) => {
  try {
    const {
      email,
      assetType,
      assetId,
      assetName,
      targetPrice,
      direction,
      enabledAt,
      repeatMinutes,
    } = req.body;

    if (!email || !assetType || !assetId || targetPrice === undefined || !direction) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!["crypto", "stock"].includes(assetType)) {
      return res.status(400).json({ message: "Invalid assetType" });
    }

    if (!["above", "below"].includes(direction)) {
      return res.status(400).json({ message: "Invalid direction" });
    }

    const normalizedAssetId = normalizeString(assetId);
    if (!normalizedAssetId) {
      return res.status(400).json({ message: "Invalid assetId" });
    }

    const tp = Number(targetPrice);
    if (!isValidNumber(tp) || tp <= 0) {
      return res.status(400).json({ message: "Invalid targetPrice" });
    }

    const rm = repeatMinutes === undefined ? 0 : Number(repeatMinutes);
    if (!isValidNumber(rm) || rm < 0) {
      return res.status(400).json({ message: "Invalid repeatMinutes" });
    }

    const enabledDate = enabledAt ? new Date(enabledAt) : new Date();
    if (Number.isNaN(enabledDate.getTime())) {
      return res.status(400).json({ message: "Invalid enabledAt" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const normalizedAssetName = normalizeString(assetName);

    const existingAlert = await PriceAlert.findOne({
      userEmail: email,
      assetType,
      assetId: normalizedAssetId,
      targetPrice: tp,
      direction,
      active: true,
    });

    if (existingAlert) {
      return res.status(409).json({
        message: "An active alert with the same target already exists",
        alert: existingAlert,
      });
    }

    const alert = await PriceAlert.create({
      userEmail: email,
      assetType,
      assetId: normalizedAssetId,
      assetName: normalizedAssetName,
      targetPrice: tp,
      direction,
      enabledAt: enabledDate,
      repeatMinutes: rm,
    });

    return res.status(201).json({ message: "Alert created", alert });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "email is required" });

    const alerts = await PriceAlert.find({ userEmail: email, active: true })
      .sort({ enabledAt: -1 })
      .limit(200);

    res.json({ alerts });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteAlert = async (req, res) => {
  try {
    const { email } = req.query;
    const { id } = req.params;

    if (!email) return res.status(400).json({ message: "email is required" });
    if (!id) return res.status(400).json({ message: "Alert id is required" });

    // Delete notifications linked to this alert
    await Notification.deleteMany({ alertId: id });

    const result = await PriceAlert.findOneAndDelete({
      _id: id,
      userEmail: email,
    });

    if (!result) return res.status(404).json({ message: "Alert not found" });

    res.json({ message: "Alert deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

