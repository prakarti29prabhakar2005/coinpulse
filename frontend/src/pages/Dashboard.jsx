import React, { useEffect, useState } from "react";
import Header from "../components/Common/Header";
import Loader from "../components/Common/Loader";
import Search from "../components/Dashboard/Search";
import CoinTabsComponent from "../components/Dashboard/Tabs/CoinTab";
import StockTabsComponent from "../components/Dashboard/Tabs/StockTab";
import CoinPaginationComponent from "../components/Dashboard/Pagination/CoinPagination";
import StockPaginationComponent from "../components/Dashboard/Pagination/StockPagination";
import TopButton from "../components/Common/TopButton";
import Footer from "../components/Common/Footer";
import { get100Coins } from "../functions/get100Coins";
import { getAllStocks } from "../functions/getAllStocks";
import PredictionWidget from "../components/Dashboard/Prediction";
import "./styles.css";

function Dashboard() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [paginatedCoins, setPaginatedCoins] = useState([]);

  const [stocks, setStocks] = useState([]);
  const [stockSearch, setStockSearch] = useState("");
  const [stockPage, setStockPage] = useState(1);
  const [paginatedStocks, setPaginatedStocks] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);

      const [coinData, stockData] = await Promise.all([get100Coins(), getAllStocks()]);

      setCoins(coinData);
      setPaginatedCoins(coinData.slice(0, 10));
      setStocks(stockData);
      setPaginatedStocks(stockData.slice(0, 10));
      setLoading(false);
    };

    loadDashboardData();
  }, []);

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.trim().toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.trim().toLowerCase())
  );

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.name.toLowerCase().includes(stockSearch.trim().toLowerCase()) ||
      stock.symbol.toLowerCase().includes(stockSearch.trim().toLowerCase())
  );

  const handlePageChange = (_event, value) => {
    setPage(value);
    const initialCount = (value - 1) * 10;
    setPaginatedCoins(coins.slice(initialCount, initialCount + 10));
  };

  const handleStockPageChange = (_event, value) => {
    setStockPage(value);
    const initialCount = (value - 1) * 10;
    setPaginatedStocks(stocks.slice(initialCount, initialCount + 10));
  };

  return (
    <>
      <Header />
      {loading ? (
        <Loader />
      ) : (
        <>
          <PredictionWidget coins={coins} stocks={stocks} />
          <div className="dashboard-split">
            <div className="dashboard-panel">
              <h2 className="dashboard-panel-title">Crypto Coins</h2>
              <Search search={search} handleChange={(event) => setSearch(event.target.value)} />
              <CoinTabsComponent
                coins={search ? filteredCoins : paginatedCoins}
                setSearch={setSearch}
              />
              {!search && (
                <CoinPaginationComponent page={page} handlePageChange={handlePageChange} />
              )}
            </div>

            <div className="dashboard-panel">
              <h2 className="dashboard-panel-title">Market Stocks</h2>
              <Search
                search={stockSearch}
                handleChange={(event) => setStockSearch(event.target.value)}
              />
              <StockTabsComponent
                stocks={stockSearch ? filteredStocks : paginatedStocks}
                setSearch={setStockSearch}
              />
              {!stockSearch && (
                <StockPaginationComponent
                  page={stockPage}
                  handlePageChange={handleStockPageChange}
                />
              )}
            </div>
          </div>
        </>
      )}
      <TopButton />
      <Footer />
    </>
  );
}

export default Dashboard;
