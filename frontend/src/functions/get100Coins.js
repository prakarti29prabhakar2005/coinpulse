import axios from "axios";
import { getApiKey, switchApiKey, API_KEYS } from "../config/coinConfig";

export const get100Coins = async () => {
  let retries = API_KEYS.length;

  while (retries > 0) {
    try {
      const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
        params: {
          vs_currency: "usd",
        },
        headers: {
          "x-cg-demo-api-key": getApiKey(),
        },
      });

      console.log("Coins fetched with key:", getApiKey());
      return response.data;
    } catch (error) {
      console.log("Rate limit hit, switching key");
      console.log("Error:", error.message);
      switchApiKey();
      retries--;
    }
  }

  console.log("All API Keys exhausted");
  return [];
};
