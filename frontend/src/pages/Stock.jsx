import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Info from "../components/CoinPage/Info";
import LineChart from "../components/CoinPage/LineChart";
import SelectDays from "../components/CoinPage/SelectDays";
import ToggleComponents from "../components/CoinPage/ToggleComponent";
import Button from "../components/Common/Button";
import Header from "../components/Common/Header";
import Loader from "../components/Common/Loader";
import StockList from "../components/Dashboard/List/StockList";
import { getStockData } from "../functions/getStockData";
import { getStockPrices } from "../functions/getStockPrices";
import { settingStockChartData } from "../functions/settingStockChartData";

import { settingStockObject } from "../functions/settingStockObject";

function Stock() {
  const { id } = useParams();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState({ labels: [], datasets: [{}] });
  const [stock, setStock] = useState({});
  const [days, setDays] = useState(30);
  const [priceType, setPriceType] = useState("prices");

  const getData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const stockData = await getStockData(id, setError);
    settingStockObject(stockData, setStock);
    if (stockData) {
      const prices = await getStockPrices(id, days, priceType, setError);
      if (prices) {
        settingStockChartData(setChartData, prices);
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
    const prices = await getStockPrices(id, newDays, priceType, setError);
    if (prices) settingStockChartData(setChartData, prices);
    setLoading(false);
  };

  const handlePriceTypeChange = async (event) => {
    setLoading(true);
    const newType = event.target.value;
    setPriceType(newType);
    const prices = await getStockPrices(id, days, newType, setError);
    if (prices) settingStockChartData(setChartData, prices);
    setLoading(false);
  };

  return (
    <>
      <Header />
      {!error && !loading && stock.id ? (
        <>
          <div className="grey-wrapper">
            <StockList stock={stock} delay={0.5} />
          </div>
          <div className="grey-wrapper">
            <SelectDays handleDaysChange={handleDaysChange} days={days} />
            <ToggleComponents
              priceType={priceType}
              handlePriceTypeChange={handlePriceTypeChange}
            />
            <LineChart chartData={chartData} />
          </div>
          <Info title={stock.name} desc={stock.desc} />
        </>
      ) : error ? (
        <div>
          <h1 style={{ textAlign: "center" }}>
            Sorry, Couldn't find the stock you're looking for 😞
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

export default Stock;
