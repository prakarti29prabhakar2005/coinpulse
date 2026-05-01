import axios from "axios";

export async function predictFuturePrice({ assetType, asset, days }) {
  const response = await axios.post((import.meta.env.VITE_API_BASE_URL || "http://localhost:5000") + "/api/predict", {
    assetType,
    asset,
    days,
  });
  return response.data;
}

