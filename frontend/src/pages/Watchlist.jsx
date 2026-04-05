import React, { useEffect, useState } from "react";
import Button from "../components/Common/Button";
import Header from "../components/Common/Header";
import CoinTabsComponent from "../components/Dashboard/Tabs/CoinTab";
import StockTabsComponent from "../components/Dashboard/Tabs/StockTab";

import { get100Coins } from "../functions/get100Coins";
import { getAllStocks } from "../functions/getAllStocks";
import { handleExportPDF } from "../functions/exportPDF";
import { FiDownload } from "react-icons/fi";
import "./styles.css";

function Watchlist() {

  const [cryptoCoins, setCryptoCoins] = useState([]);
  const [stocks, setStocks] = useState([]);

  const cryptoWatchlist =
    JSON.parse(localStorage.getItem("cryptoWatchlist")) || [];

  const stockWatchlist =
    JSON.parse(localStorage.getItem("stockWatchlist")) || [];

  useEffect(() => {

    const loadCrypto = async () => {
      if (!cryptoWatchlist.length) return;

      const allCoins = await get100Coins();

      if (allCoins) {
        setCryptoCoins(
          allCoins.filter((coin) =>
            cryptoWatchlist.includes(coin.id)
          )
        );
      }
    };

    const loadStocks = async () => {
      if (!stockWatchlist.length) return;

      const allStocks = await getAllStocks();

      if (allStocks) {
        setStocks(
          allStocks.filter((stock) =>
            stockWatchlist.includes(stock.id)
          )
        );
      }
    };

    loadCrypto();
    loadStocks();

  }, []);

  const isEmpty =
    cryptoWatchlist.length === 0 &&
    stockWatchlist.length === 0;

  return (
    <div>
      <Header />

      {!isEmpty ? (

        <div className="watchlist-split">

          {/* CRYPTO PANEL */}
          <div className="watchlist-panel">
            <div className="panel-header">
              <h2 className="watchlist-panel-title">Crypto Coins</h2>
              {cryptoCoins.length > 0 && (
                <button
                  className="export-btn"
                  onClick={() => handleExportPDF(cryptoCoins, "Crypto Watchlist")}
                  title="Export Crypto Watchlist"
                >
                  <FiDownload /> Export
                </button>
              )}
            </div>

            {cryptoCoins.length > 0 ? (
              <CoinTabsComponent coins={cryptoCoins} />
            ) : (
              // ... rest of code
              <>
                <h1 style={{ textAlign: "center", marginTop: "2rem" }}>
                  No Crypto Coins Saved.
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
              </>
            )}
          </div>

          {/* STOCK PANEL */}
          <div className="watchlist-panel">
            <div className="panel-header">
              <h2 className="watchlist-panel-title">Market Stocks</h2>
              {stocks.length > 0 && (
                <button
                  className="export-btn"
                  onClick={() => handleExportPDF(stocks, "Stock Watchlist")}
                  title="Export Stock Watchlist"
                >
                  <FiDownload /> Export
                </button>
              )}
            </div>

            {stocks.length > 0 ? (
              <StockTabsComponent stocks={stocks} />
            ) : (
              <>
                <h1 style={{ textAlign: "center", marginTop: "2rem" }}>
                  No Market Stocks Saved.
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
              </>

            )}
          </div>

        </div>

      ) : (
        <div>
          <h1 style={{ textAlign: "center" }}>
            Sorry, No Items In The Watchlist.
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
      )}
    </div>
  );
}

export default Watchlist;













// import React, { useCallback, useEffect, useState } from "react";
// import Button from "../components/Common/Button";
// import Header from "../components/Common/Header";
// import CoinTabsComponent from "../components/Dashboard/Tabs/CoinTab";
// import { get100Coins } from "../functions/get100Coins";

// function Watchlist() {
//   const watchlist = JSON.parse(localStorage.getItem("watchlist"));
//   const [coins, setCoins] = useState([]);

//   useEffect(() => {
//     let localWatchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (user && user.watchlist && (!localWatchlist || localWatchlist.length === 0)) {
//       localWatchlist = user.watchlist;
//       localStorage.setItem("watchlist", JSON.stringify(localWatchlist));
//     }

//     const getData = async () => {
//       if (!localWatchlist?.length) return;
//       const allCoins = await get100Coins();
//       if (allCoins) {
//         setCoins(allCoins.filter((coin) => localWatchlist.includes(coin.id)));
//       }
//     };

//     getData();
//   }, []);

//   return (
//     <div>
//       <Header />
//       {watchlist?.length > 0 ? (
//         <CoinTabsComponent coins={coins} />
//       ) : (
//         <div>
//           <h1 style={{ textAlign: "center" }}>Sorry, No Items In The Watchlist.</h1>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               margin: "2rem",
//             }}
//           >
//             <a href="/dashboard">
//               <Button text="Dashboard" />
//             </a>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Watchlist;
