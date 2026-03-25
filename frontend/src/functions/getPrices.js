import axios from "axios";
import { getApiKey, switchApiKey, API_KEYS } from "../config/coinConfig";

export const getPrices = async (id, days, priceType, setError) => {

  let retries = API_KEYS.length;

  while (retries > 0) {
    try {

      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
        {
          params: {
            vs_currency: "usd",
            days: days,
            interval: "daily",
          },
          headers: {
            "x-cg-demo-api-key": getApiKey(),
          },
        }
      );

      console.log("Prices fetched with key:", getApiKey());

      if (response.data) {
        if (priceType === "market_caps") {
          return response.data.market_caps;
        } 
        else if (priceType === "total_volumes") {
          return response.data.total_volumes;
        } 
        else {
          return response.data.prices;
        }
      }

    } catch (error) {

      console.log("Rate limit hit → Switching Coin API Key");
        switchApiKey();
        console.log("Prices Error:", error.message);
        if (setError) setError(true);
        retries--;
    }
  }

  console.log("All Coin API Keys exhausted");
  if (setError) setError(true);
  return null;
};

