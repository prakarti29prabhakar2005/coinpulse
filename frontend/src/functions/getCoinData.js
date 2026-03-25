import axios from "axios";
import { getApiKey, switchApiKey, API_KEYS } from "../config/coinConfig";

export const getCoinData = async (id, setError) => {

  let retries = API_KEYS.length;

  while (retries > 0) {
    try {

      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${id}`,
        {
          headers: {
            "x-cg-demo-api-key": getApiKey(),
          },
        }
      );

      console.log("Coin Data fetched with key:", getApiKey());
      return response.data;

    } catch (error) {

      console.log("Coin Data Error:", error.message);
      console.log("Rate limit hit → Switching Coin API Key");
      switchApiKey();
      if (setError) setError(true);
      retries--;
    }
  }

  console.log("All Coin API Keys exhausted");
  if (setError) setError(true);
  return null;
};

