import React, { useEffect, useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import Info from "../components/CoinPage/Info";
import LineChart from "../components/CoinPage/LineChart";
import ToggleComponents from "../components/CoinPage/ToggleComponent";
import Header from "../components/Common/Header";
import Loader from "../components/Common/Loader";
import SelectCoins from "../components/ComparePage/SelectCoins";
import SelectMarkets from "../components/ComparePage/SelectMarkets";
import CoinList from "../components/Dashboard/List/CoinList";
import StockList from "../components/Dashboard/List/StockList";

import { get100Coins } from "../functions/get100Coins";
import { getCoinData } from "../functions/getCoinData";
import { getPrices } from "../functions/getPrices";
import { settingChartData } from "../functions/settingChartData";
import { settingCoinObject } from "../functions/settingCoinObject";

import { getAllStocks } from "../functions/getAllStocks";
import { getStockData } from "../functions/getStockData";
import { getStockPrices } from "../functions/getStockPrices";
import { settingStockObject } from "../functions/settingStockObject";
import { settingStockChartData } from "../functions/settingStockChartData";


function Compare() {

  const [mode, setMode] = useState("crypto");
  const isCrypto = mode === "crypto";

  const [days, setDays] = useState(30);
  const [priceType, setPriceType] = useState("prices");

  const [loading, setLoading] = useState(false);

  // crypto state
  const [allCoins, setAllCoins] = useState([]);
  const [crypto1, setCrypto1] = useState("bitcoin");
  const [crypto2, setCrypto2] = useState("ethereum");
  const [coin1Data, setCoin1Data] = useState(null);
  const [coin2Data, setCoin2Data] = useState(null);
  const [cryptoChart, setCryptoChart] = useState(null);

  // stock state
  const [allStocks, setAllStocks] = useState([]);
  const [market1, setMarket1] = useState("AAPL");
  const [market2, setMarket2] = useState("MSFT");
  const [stock1, setStock1] = useState(null);
  const [stock2, setStock2] = useState(null);
  const [stockChart, setStockChart] = useState(null);

  // ---------- CRYPTO LOAD ----------
  const loadCrypto = async (c1 = crypto1, c2 = crypto2, d = days, p = priceType) => {
    setLoading(true);

    const coins = await get100Coins();
    setAllCoins(coins);

    const data1 = await getCoinData(c1);
    const data2 = await getCoinData(c2);

    settingCoinObject(data1, setCoin1Data);
    settingCoinObject(data2, setCoin2Data);

    const prices1 = await getPrices(c1, d, p);
    const prices2 = await getPrices(c2, d, p);

    settingChartData(setCryptoChart, prices1, prices2);

    setLoading(false);
  };

  // ---------- STOCK LOAD ----------
  const loadStocks = async (m1 = market1, m2 = market2, d = days, p = priceType) => {
    setLoading(true);

    const stocks = await getAllStocks();
    setAllStocks(stocks);

    const data1 = await getStockData(m1);
    const data2 = await getStockData(m2);

    settingStockObject(data1, setStock1);
    settingStockObject(data2, setStock2);

    const prices1 = await getStockPrices(m1, d, p);
    const prices2 = await getStockPrices(m2, d, p);

    settingStockChartData(setStockChart, prices1, prices2);

    setLoading(false);
  };

  useEffect(() => {
    loadCrypto();
  }, []);

  useEffect(() => {
    if (!isCrypto) loadStocks();
  }, [mode]);

  // ---------- CRYPTO CHANGE ----------
  const onCoinChange = async (e, isSecond) => {
    const val = e.target.value;

    if (isSecond) {
      setCrypto2(val);
      loadCrypto(crypto1, val);
    } else {
      setCrypto1(val);
      loadCrypto(val, crypto2);
    }
  };

  // ---------- STOCK CHANGE ----------
  const onMarketChange = async (e, isSecond) => {
    const val = e.target.value;

    if (isSecond) {
      setMarket2(val);
      loadStocks(market1, val);
    } else {
      setMarket1(val);
      loadStocks(val, market2);
    }
  };

  // ---------- RANGE ----------
  const handleDaysChange = async (e) => {
    const d = e.target.value;
    setDays(d);

    if (isCrypto) loadCrypto(crypto1, crypto2, d, priceType);
    else loadStocks(market1, market2, d, priceType);
  };

  // ---------- PRICE TYPE ----------
  const handlePriceTypeChange = async (e) => {
    const p = e.target.value;
    setPriceType(p);

    if (isCrypto) loadCrypto(crypto1, crypto2, days, p);
    else loadStocks(market1, market2, days, p);
  };

  if (
    loading ||
    (isCrypto && (!coin1Data || !coin2Data)) ||
    (!isCrypto && (!stock1 || !stock2))
  ) {
    return <Loader />;
  }

  return (
    <div>
      <Header />

      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={(e, v) => v && setMode(v)}
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 2,

          "& .MuiToggleButton-root": {
            color: "#3a80e9",
            borderColor: "#3a80e9",
          },

          "& .Mui-selected": {
            backgroundColor: "#3a80e9 !important",
            color: "#fff !important",
          },

          "& .MuiToggleButton-root:hover": {
            backgroundColor: "rgba(58,128,233,0.1)",
          },
        }}
      >
        <ToggleButton value="crypto">Crypto</ToggleButton>
        <ToggleButton value="stocks">Stocks</ToggleButton>
      </ToggleButtonGroup>

      {isCrypto ? (
        <SelectCoins
          allCoins={allCoins}
          crypto1={crypto1}
          crypto2={crypto2}
          onCoinChange={onCoinChange}
          days={days}
          handleDaysChange={handleDaysChange}
        />
      ) : (
        <SelectMarkets
          allMarkets={allStocks}
          market1={market1}
          market2={market2}
          onMarketChange={onMarketChange}
          days={days}
          handleDaysChange={handleDaysChange}
        />
      )}

      <div className="grey-wrapper">
        {isCrypto ? <CoinList coin={coin1Data} /> : <StockList stock={stock1} />}
      </div>

      <div className="grey-wrapper">
        {isCrypto ? <CoinList coin={coin2Data} /> : <StockList stock={stock2} />}
      </div>

      <div className="grey-wrapper">
        <ToggleComponents
          priceType={priceType}
          handlePriceTypeChange={handlePriceTypeChange}
        />
        <LineChart chartData={isCrypto ? cryptoChart : stockChart} multiAxis />
      </div>

      <Info
        title={isCrypto ? coin1Data.name : stock1.name}
        desc={isCrypto ? coin1Data.desc : stock1.desc}
      />

      <Info
        title={isCrypto ? coin2Data.name : stock2.name}
        desc={isCrypto ? coin2Data.desc : stock2.desc}
      />
    </div>
  );
}

export default Compare;