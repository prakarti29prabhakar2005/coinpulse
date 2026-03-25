import axios from "axios";
import { STOCK_SYMBOLS, getApiKey, switchApiKey } from "../config/stockConfig";

export const getAllStocks = async () => {
  try {
    const requests = STOCK_SYMBOLS.map((symbol) =>
      axios.get(
        `https://financialmodelingprep.com/stable/profile?symbol=${symbol}&apikey=${getApiKey()}`
      )
    );

    const responses = await Promise.all(requests);

    const allStocks = responses.map((res) => {
      const item = res.data[0];

      return {
        id: item.symbol,
        name: item.companyName,
        symbol: item.symbol,
        image: item.image,
        current_price: item.price,
        price_change_percentage_24h: item.changePercentage,
        market_cap: item.marketCap,
        total_volume: item.volume,
        description: item.description,
      };
    });

    return allStocks;

  } catch (err) {
    console.log("Some API failed → switching key and retrying");

    switchApiKey();

    return getAllStocks();
  }
};