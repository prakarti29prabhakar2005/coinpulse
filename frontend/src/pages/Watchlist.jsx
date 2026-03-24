import React, { useCallback, useEffect, useState } from "react";
import Button from "../components/Common/Button";
import Header from "../components/Common/Header";
import CoinTabsComponent from "../components/Dashboard/Tabs/CoinTab";
import { get100Coins } from "../functions/get100Coins";

function Watchlist() {
  const watchlist = JSON.parse(localStorage.getItem("watchlist"));
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    let localWatchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.watchlist && (!localWatchlist || localWatchlist.length === 0)) {
      localWatchlist = user.watchlist;
      localStorage.setItem("watchlist", JSON.stringify(localWatchlist));
    }

    const getData = async () => {
      if (!localWatchlist?.length) return;
      const allCoins = await get100Coins();
      if (allCoins) {
        setCoins(allCoins.filter((coin) => localWatchlist.includes(coin.id)));
      }
    };

    getData();
  }, []);

  return (
    <div>
      <Header />
      {watchlist?.length > 0 ? (
        <TabsComponent coins={coins} />
      ) : (
        <div>
          <h1 style={{ textAlign: "center" }}>Sorry, No Items In The Watchlist.</h1>
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
