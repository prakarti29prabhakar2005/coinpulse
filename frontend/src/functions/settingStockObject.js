export const settingStockObject = (data, setStock) => {
  if (!data) return;
  setStock({
    id: data.symbol,
    name: data.companyName,
    symbol: data.symbol,
    image: data.image,
    desc: data.description,
    price_change_percentage_24h: data.changePercentage,
    total_volume: data.volume,
    current_price: data.price,
    market_cap: data.marketCap,
  });
};