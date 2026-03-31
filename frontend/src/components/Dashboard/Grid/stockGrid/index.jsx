import React, { useState } from "react";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import { motion } from "framer-motion";
import QuickAlertDialog from "../../../PriceAlerts/QuickAlertDialog";
import { saveItemToWatchlist } from "../../../../functions/saveItemToWatchlist";
import { removeItemToWatchlist } from "../../../../functions/removeItemToWatchlist";
import "./styles.css";

function StockGrid({ stock, delay, showQuickAlert = true }) {
  const stockWatchlist = JSON.parse(localStorage.getItem("stockWatchlist")) || [];
  const [isStockAdded, setIsStockAdded] = useState(stockWatchlist.includes(stock.id));
  const isNegative = stock.price_change_percentage_24h < 0;

  return (
    <a href={`/stock/${stock.id}`}>
      <motion.div
        className={`stock ${isNegative ? "stock-red" : ""}`}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
      >
        <div className="img-flex">
          <img src={stock.image} className="stock-image" />

          <div className="icon-flex">
            <div className="info-flex">
              <p className="stock-symbol">{stock.symbol}</p>
              <p className="stock-name">{stock.name}</p>
            </div>

            <div className="asset-actions">
              <div
                className={`watchlist-icon ${isNegative ? "watchlist-icon-red" : ""}`}
                onClick={(event) => {
                  if (isStockAdded) {
                    removeItemToWatchlist(event, stock.id, setIsStockAdded, "stock");
                  } else {
                    setIsStockAdded(true);
                    saveItemToWatchlist(event, stock.id, "stock");
                  }
                }}
              >
                {isStockAdded ? <StarIcon /> : <StarOutlineIcon />}
              </div>

              {showQuickAlert && (
                <QuickAlertDialog
                  assetType="stock"
                  assetId={stock.id}
                  assetName={stock.name}
                  currentPrice={stock.current_price}
                  buttonClassName="alert-action-btn"
                />
              )}
            </div>
          </div>
        </div>

        {isNegative ? (
          <div className="chip-flex">
            <div className="price-chip red">
              {stock.price_change_percentage_24h.toFixed(2)}%
            </div>
            <div className="chip-icon red">
              <TrendingDownRoundedIcon />
            </div>
          </div>
        ) : (
          <div className="chip-flex">
            <div className="price-chip">{stock.price_change_percentage_24h.toFixed(2)}%</div>
            <div className="chip-icon">
              <TrendingUpRoundedIcon />
            </div>
          </div>
        )}

        <p className={isNegative ? "current-price-red" : "current-price"}>
          ${stock.current_price.toLocaleString()}
        </p>

        <p className="stock-name">Total Volume : {stock.total_volume.toLocaleString()}</p>
        <p className="stock-name">Market Capital : ${stock.market_cap.toLocaleString()}</p>
      </motion.div>
    </a>
  );
}

export default StockGrid;
