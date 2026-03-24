import axios from "axios";
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
import { getAllStocks } from "../functions/getAllStocks";

import "./styles.css"

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
    // Get 100 Coins
    getData();
    getStocksData();
  }, []);

  const getData = async () => {
    setLoading(true);
    axios
      .get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
        // "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin&names=Bitcoin&symbols=btc&category=layer-1&price_change_percentage=1h"
      )
      .then((response) => {
        console.log("RESPONSE>>>", response.data);
        setCoins(response.data);
        setPaginatedCoins(response.data.slice(0, 10));
        setLoading(false);
      })
      .catch((error) => {
        console.log("ERROR>>>", error.message);
      });
  };

  const getStocksData = async () => {
    setLoading(true);

    const allStocks = await getAllStocks();
    setStocks(allStocks);
    setPaginatedStocks(allStocks.slice(0,10));
    console.log("Stocks >>>", allStocks);

    setLoading(false);
  }

  const handleChange = (e) => {
    setSearch(e.target.value);
    console.log(e.target.value);
  };

  const handleStockChange = (e) => {
    setStockSearch(e.target.value);
  }

  // var filteredCoins = coins.filter((coin) => {
  //   if (
  //     coin.name.toLowerCase().includes(search.trim().toLowerCase()) ||
  //     coin.symbol.toLowerCase().includes(search.trim().toLowerCase())
  //   ) {
  //     return coin;
  //   }
  // });

  var filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.trim().toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.trim().toLowerCase())
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    // Value = new page number
    var initialCount = (value - 1) * 10;
    setPaginatedCoins(coins.slice(initialCount, initialCount + 10));
  };

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.name.toLowerCase().includes(stockSearch.trim().toLowerCase()) ||
      stock.symbol.toLowerCase().includes(stockSearch.trim().toLowerCase())
  );

  const handleStockPageChange = (event, value) => {
    setStockPage(value);
    var initialCount = (value - 1) * 10;
    setPaginatedStocks(stocks.slice(initialCount, initialCount + 10));
  };

  return (
    <>
      <Header />
      {loading ? (
        <Loader />
      ) : (
        <>

          <div className="dashboard-split">
            <div className="dashboard-panel">
              <h2 className="dashboard-panel-title">Crypto Coins</h2>
              <Search search={search} handleChange={handleChange} />
              <CoinTabsComponent
                coins={search ? filteredCoins : paginatedCoins}
                setSearch={setSearch}
              />
              {!search && (
                <CoinPaginationComponent
                  page={page}
                  handlePageChange={handlePageChange}
                />
              )}
            </div>

            <div className="dashboard-panel">
              <h2 className="dashboard-panel-title">Market Stocks</h2>
              <Search search={stockSearch} handleChange={handleStockChange} />
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

// coins == 100 coins

// PaginatedCoins -> Page 1 - coins.slice(0,10)
// PaginatedCoins -> Page 2 = coins.slice(10,20)
// PaginatedCoins -> Page 3 = coins.slice(20,30)
// .
// .
// PaginatedCoins -> Page 10 = coins.slice(90,100)

// PaginatedCoins -> Page X , then initial Count = (X-1)*10
// coins.slice(initialCount,initialCount+10)
