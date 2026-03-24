import axios from "axios";
import { getApiKey, switchApiKey } from "../config/stockConfig";

export const getStockData = async (id, setError) => {
  let success = false;
  let stockData = null;

  while (!success) {
    try {
      const res = await axios.get(
        `https://financialmodelingprep.com/stable/profile?symbol=${id}&apikey=${getApiKey()}`
      );

      if (res.data && res.data.length > 0) {
        stockData = res.data[0];
      }

      success = true;

    } catch (e) {
      console.log("API key limit reached → switching key");
      switchApiKey();
    }
  }

  return stockData;
};
