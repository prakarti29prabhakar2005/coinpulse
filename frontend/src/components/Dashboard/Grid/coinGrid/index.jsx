import React, { useState } from "react";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import { motion } from "framer-motion";
import QuickAlertDialog from "../../../PriceAlerts/QuickAlertDialog";
import { saveItemToWatchlist } from "../../../../functions/saveItemToWatchlist";
import { removeItemToWatchlist } from "../../../../functions/removeItemToWatchlist";
import Inline7dPrediction from "../../Prediction/Inline7dPrediction";
import "./styles.css";

function CoinGrid({ coin, delay, showQuickAlert = true }) {
  const cryptoWatchlist = JSON.parse(localStorage.getItem("cryptoWatchlist")) || [];
  const [isCoinAdded, setIsCoinAdded] = useState(cryptoWatchlist.includes(coin.id));
  const isNegative = coin.price_change_percentage_24h < 0;

  return (
    <a href={`/coin/${coin.id}`}>
      <motion.div
        className={`grid ${isNegative ? "grid-red" : ""}`}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
      >
        <div className="img-flex">
          <img src={coin.image} className="coin-image" />

          <div className="icon-flex">
            <div className="info-flex">
              <p className="coin-symbol">{coin.symbol}</p>
              <p className="coin-name">{coin.name}</p>
            </div>

            <div className="asset-actions">
              <div className="asset-actions-row">
                <div
                  className={`watchlist-icon ${isNegative ? "watchlist-icon-red" : ""}`}
                  onClick={(event) => {
                    if (isCoinAdded) {
                      removeItemToWatchlist(event, coin.id, setIsCoinAdded, "crypto");
                    } else {
                      setIsCoinAdded(true);
                      saveItemToWatchlist(event, coin.id, "crypto");
                    }
                  }}
                >
                  {isCoinAdded ? <StarIcon /> : <StarOutlineIcon />}
                </div>

                {showQuickAlert && (
                  <QuickAlertDialog
                    assetType="crypto"
                    assetId={coin.id}
                    assetName={coin.name}
                    currentPrice={coin.current_price}
                    buttonClassName="alert-action-btn"
                  />
                )}
              </div>

              <Inline7dPrediction assetType="crypto" asset={coin.id} className="inline-7d-card" />
            </div>
          </div>
        </div>

        {isNegative ? (
          <div className="chip-flex">
            <div className="price-chip red">
              {coin.price_change_percentage_24h.toFixed(2)}%
            </div>
            <div className="chip-icon red">
              <TrendingDownRoundedIcon />
            </div>
          </div>
        ) : (
          <div className="chip-flex">
            <div className="price-chip">{coin.price_change_percentage_24h.toFixed(2)}%</div>
            <div className="chip-icon">
              <TrendingUpRoundedIcon />
            </div>
          </div>
        )}

        <p className={isNegative ? "current-price-red" : "current-price"}>
          ${coin.current_price.toLocaleString()}
        </p>

        <p className="coin-name">Total Volume : {coin.total_volume.toLocaleString()}</p>
        <p className="coin-name">Market Capital : ${coin.market_cap.toLocaleString()}</p>
      </motion.div>
    </a>
  );
}

export default CoinGrid;
