import axios from "axios";
import { STOCK_SYMBOLS, getApiKey, switchApiKey } from "../config/stockConfig";

export const getAllStocks = async () => {
  const allStocks = [];

  for (let symbol of STOCK_SYMBOLS) {
    let success = false;

    while (!success) {
      try {
        const res = await axios.get(
          `https://financialmodelingprep.com/stable/profile?symbol=${symbol}&apikey=${getApiKey()}`
        );

        const item = res.data[0];

        allStocks.push({
          id: item.symbol,
          name: item.companyName,
          symbol: item.symbol,
          image: item.image,
          current_price: item.price,
          price_change_percentage_24h: item.changePercentage,
          market_cap: item.marketCap,
          total_volume: item.volume,
          description: item.description,
        });

        success = true;

      } catch (err) {
        console.log("Key limit reached → switching key");
        switchApiKey();
      }
    }
  }

  return allStocks;
};