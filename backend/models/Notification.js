const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, index: true },
    alertId: { type: mongoose.Schema.Types.ObjectId, ref: "PriceAlert", index: true },

    assetType: { type: String, required: true, enum: ["crypto", "stock"] },
    assetId: { type: String, required: true },
    assetName: { type: String, default: "" },

    targetPrice: { type: Number, required: true },
    direction: { type: String, required: true, enum: ["above", "below"] },

    // Price observed when the alert triggered
    currentPrice: { type: Number, required: true },

    message: { type: String, required: true },

    // Read state for web UI
    readAt: { type: Date, default: null, index: true },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

module.exports = mongoose.model("Notification", notificationSchema);

