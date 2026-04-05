const mongoose = require("mongoose");

const priceAlertSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, index: true },
    assetType: { type: String, required: true, enum: ["crypto", "stock"] },
    assetId: { type: String, required: true, index: true }, // coin.id for crypto, symbol for stock
    assetName: { type: String, default: "" },

    targetPrice: { type: Number, required: true },
    direction: { type: String, required: true, enum: ["above", "below"] },

    // When monitoring should start for this specific alert
    enabledAt: { type: Date, required: true, index: true },

    // If > 0, resend notifications every N minutes while the condition remains true.
    // If 0, only send once when it first enters the condition.
    repeatMinutes: { type: Number, required: true, min: 0, default: 0 },

    // For "crosses/reaches" behavior
    wasInCondition: { type: Boolean, default: false },
    lastTriggeredAt: { type: Date, default: null },

    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PriceAlert", priceAlertSchema);

