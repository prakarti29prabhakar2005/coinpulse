import React, { useState } from "react";
import "./styles.css";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { motion } from "framer-motion";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { saveItemToWatchlist } from "../../../../functions/saveItemToWatchlist";
import StarIcon from "@mui/icons-material/Star";
import { removeItemToWatchlist } from "../../../../functions/removeItemToWatchlist";

function StockGrid({ stock, delay }) {
  const watchlist = JSON.parse(localStorage.getItem("watchlist"));
  const [isStockAdded, setIsStockAdded] = useState(watchlist?.includes(stock.id));

  return (
    <a href={`/stock/${stock.id}`}>
      <motion.div
        className={`stock ${stock.price_change_percentage_24h < 0 && "stock-red"}`}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay }}
      >
        <div className="img-flex">
          <img src={stock.image} className="stock-image" />
          <div className="icon-flex">
            <div className="info-flex">
              <p className="stock-symbol">{stock.symbol}</p>
              <p className="stock-name">{stock.name}</p>
            </div>
            <div
              className={`watchlist-icon ${
                stock.price_change_percentage_24h < 0 && "watchlist-icon-red"
              }`}
              onClick={(e) => {
                if (isStockAdded) {
                  // remove coin

                  removeItemToWatchlist(e, stock.id, setIsStockAdded);
                } else {
                  setIsStockAdded(true);
                  saveItemToWatchlist(e, stock.id);
                }
              }}
            >
              {isStockAdded ? <StarIcon /> : <StarOutlineIcon />}
            </div>
          </div>
        </div>
        {stock.price_change_percentage_24h >= 0 ? (
          <div className="chip-flex">
            <div className="price-chip">
              {stock.price_change_percentage_24h.toFixed(2)}%
            </div>
            <div className="chip-icon">
              <TrendingUpRoundedIcon />
            </div>
          </div>
        ) : (
          <div className="chip-flex">
            <div className="price-chip red">
              {stock.price_change_percentage_24h.toFixed(2)}%
            </div>
            <div className="chip-icon red">
              <TrendingDownRoundedIcon />
            </div>
          </div>
        )}
        {stock.price_change_percentage_24h >= 0 ? (
          <p className="current-price">
            ${stock.current_price.toLocaleString()}
          </p>
        ) : (
          <p className="current-price-red">
            ${stock.current_price.toLocaleString()}
          </p>
        )}
        <p className="stock-name">
          Total Volume : {stock.total_volume.toLocaleString()}
        </p>
        <p className="stock-name">
          Market Capital : ${stock.market_cap.toLocaleString()}
        </p>
      </motion.div>
    </a>
  );
}

export default StockGrid;
