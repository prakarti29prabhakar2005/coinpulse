const axios = require("axios");

const getCoingeckoSimplePrice = async (coinIds) => {
  // coinIds should be an array of CoinGecko ids (e.g., ["bitcoin", "ethereum"])
  const ids = coinIds.join(",");
  const headers = {};
  const apiKey =
    process.env.COINGECKO_API_KEY ||
    "CG-36LTv7AoNbH5EFnv8Xfjqwvq"; // fallback (used in frontend too)

  if (apiKey) headers["x-cg-demo-api-key"] = apiKey;

  const res = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
    params: { ids, vs_currencies: "usd" },
    headers,
  });

  // Expected shape: { bitcoin: { usd: 123 }, ethereum: { usd: 456 } }
  return res.data;
};

const getYahooLatestPricesViaChart = async (symbols, { concurrency = 4 } = {}) => {
  // Yahoo chart endpoint works without special auth.
  // We fetch range=1d & interval=1d and take the last non-null close price.
  const map = {};

  for (let i = 0; i < symbols.length; i += concurrency) {
    const chunk = symbols.slice(i, i + concurrency);

    const chunkResults = await Promise.all(
      chunk.map(async (symbol) => {
        const res = await axios.get(
          `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1d&interval=1d`
        );

        const quote = res.data?.chart?.result?.[0]?.indicators?.quote?.[0];
        const closeArr = quote?.close || [];
        const last = [...closeArr].reverse().find((x) => x !== null && x !== undefined);
        if (last !== undefined) {
          map[symbol] = Number(last);
        }
      })
    );

    // Silence unused var warning
    void chunkResults;
  }

  return map;
};

exports.fetchCurrentPrices = async ({ cryptoIds = [], stockSymbols = [] }) => {
  let cryptoMap = {};
  let stockMap = {};

  if (cryptoIds.length) {
    try {
      cryptoMap = await getCoingeckoSimplePrice(cryptoIds);
    } catch (err) {
      console.error("CoinGecko simple price failed:", err?.message || err);
      cryptoMap = {};
    }
  }

  if (stockSymbols.length) {
    try {
      stockMap = await getYahooLatestPricesViaChart(stockSymbols);
    } catch (err) {
      console.error("Yahoo latest price fetch failed:", err?.message || err);
      stockMap = {};
    }
  }

  return { cryptoMap, stockMap };
};

