const API_BASE = "http://localhost:5000/api";

export const createPriceAlert = async ({
  email,
  assetType,
  assetId,
  assetName,
  targetPrice,
  direction,
  enabledAt,
  repeatMinutes,
}) => {
  const res = await fetch(`${API_BASE}/alerts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      assetType,
      assetId,
      assetName,
      targetPrice,
      direction,
      enabledAt,
      repeatMinutes,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || "Failed to create alert");
  }

  return data.alert;
};

