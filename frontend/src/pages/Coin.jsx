import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Info from "../components/CoinPage/Info";
import LineChart from "../components/CoinPage/LineChart";
import SelectDays from "../components/CoinPage/SelectDays";
import ToggleComponents from "../components/CoinPage/ToggleComponent";
import Button from "../components/Common/Button";
import Header from "../components/Common/Header";
import Loader from "../components/Common/Loader";
import CoinList from "../components/Dashboard/List/CoinList";
import { getCoinData } from "../functions/getCoinData";
import { getPrices } from "../functions/getPrices";
import { settingChartData } from "../functions/settingChartData";
import { settingCoinObject } from "../functions/settingCoinObject";
import PriceAlertForm from "../components/PriceAlerts/PriceAlertForm";

function Coin() {
  const { id } = useParams();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState({ labels: [], datasets: [{}] });
  const [coin, setCoin] = useState({});
  const [days, setDays] = useState(30);
  const [priceType, setPriceType] = useState("prices");

  const getData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const coinData = await getCoinData(id, setError);
    settingCoinObject(coinData, setCoin);
    if (coinData) {
      const prices = await getPrices(id, days, priceType, setError);
      if (prices) {
        settingChartData(setChartData, prices);
      }
    }
    setLoading(false);
  }, [days, id, priceType]);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleDaysChange = async (event) => {
    setLoading(true);
    const newDays = event.target.value;
    setDays(newDays);
    const prices = await getPrices(id, newDays, priceType, setError);
    if (prices) settingChartData(setChartData, prices);
    setLoading(false);
  };

  const handlePriceTypeChange = async (event) => {
    setLoading(true);
    const newType = event.target.value;
    setPriceType(newType);
    const prices = await getPrices(id, days, newType, setError);
    if (prices) settingChartData(setChartData, prices);
    setLoading(false);
  };

  return (
    <>
      <Header />
      {!error && !loading && coin.id ? (
        <>
          <div className="grey-wrapper">
            <CoinList coin={coin} delay={0.5} showQuickAlert={false} />
          </div>
          <div className="grey-wrapper">
            <SelectDays handleDaysChange={handleDaysChange} days={days} />
            <ToggleComponents
              priceType={priceType}
              handlePriceTypeChange={handlePriceTypeChange}
            />
            <LineChart chartData={chartData} />
          </div>
          <div className="grey-wrapper">
            <PriceAlertForm
              assetType="crypto"
              assetId={coin.id}
              assetName={coin.name}
              currentPrice={coin.current_price}
            />
          </div>
          <Info title={coin.name} desc={coin.desc} />
        </>
      ) : error ? (
        <div>
          <h1 style={{ textAlign: "center" }}>
            Sorry, Couldn't find the coin you're looking for 😞
          </h1>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "2rem",
            }}
          >
            <a href="/dashboard">
              <Button text="Dashboard" />
            </a>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default Coin;
