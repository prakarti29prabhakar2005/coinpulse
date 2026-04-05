import React, { useState } from "react";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import { Tooltip } from "@mui/material";
import { motion } from "framer-motion";
import { convertNumber } from "../../../../functions/convertNumber";
import QuickAlertDialog from "../../../PriceAlerts/QuickAlertDialog";
import { saveItemToWatchlist } from "../../../../functions/saveItemToWatchlist";
import { removeItemToWatchlist } from "../../../../functions/removeItemToWatchlist";
import "./styles.css";

function CoinList({ coin, delay, showQuickAlert = true }) {
  const cryptoWatchlist = JSON.parse(localStorage.getItem("cryptoWatchlist")) || [];
  const [isCoinAdded, setIsCoinAdded] = useState(cryptoWatchlist.includes(coin.id));
  const isNegative = coin.price_change_percentage_24h < 0;

  return (
    <a href={`/coin/${coin.id}`}>
      <motion.tr
        className="list-row"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay }}
      >
        <Tooltip title="Coin Image">
          <td className="td-img">
            <img src={coin.image} className="coin-image coin-image-td" />
          </td>
        </Tooltip>

        <Tooltip title="Coin Info" placement="bottom-start">
          <td className="td-info">
            <div className="info-flex">
              <p className="coin-symbol td-p">{coin.symbol}</p>
              <p className="coin-name td-p">{coin.name}</p>
            </div>
          </td>
        </Tooltip>

        <Tooltip title="Coin Price Percentage">
          <td>
            <div className="chip-flex">
              <div className={`price-chip ${isNegative ? "red" : ""}`}>
                {coin.price_change_percentage_24h.toFixed(2)}%
              </div>
              <div className={`chip-icon td-chip-icon ${isNegative ? "red" : ""}`}>
                {isNegative ? <TrendingDownRoundedIcon /> : <TrendingUpRoundedIcon />}
              </div>
            </div>
          </td>
        </Tooltip>

        <Tooltip title="Price">
          <td className="td-current-price">${coin.current_price.toLocaleString()}</td>
        </Tooltip>

        <td className="coin-name td-totalVolume">{coin.total_volume.toLocaleString()}</td>
        <td className="coin-name td-marketCap">${coin.market_cap.toLocaleString()}</td>
        <td className="coin-name mobile">${convertNumber(coin.market_cap)}</td>

        <td>
          <div className="list-actions">
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
                buttonClassName="list-alert-btn"
              />
            )}
          </div>
        </td>
      </motion.tr>
    </a>
  );
}

export default CoinList;
