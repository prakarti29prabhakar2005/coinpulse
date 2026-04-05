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

function StockList({ stock, delay, showQuickAlert = true }) {
  const stockWatchlist = JSON.parse(localStorage.getItem("stockWatchlist")) || [];
  const [isStockAdded, setIsStockAdded] = useState(stockWatchlist.includes(stock.id));
  const isNegative = stock.price_change_percentage_24h < 0;

  return (
    <a href={`/stock/${stock.id}`}>
      <motion.tr
        className="list-row"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay }}
      >
        <Tooltip title="Stock Image">
          <td className="td-img">
            <img src={stock.image} className="stock-image stock-image-td" />
          </td>
        </Tooltip>

        <Tooltip title="Stock Info" placement="bottom-start">
          <td className="td-info">
            <div className="info-flex">
              <p className="stock-symbol td-p">{stock.symbol}</p>
              <p className="stock-name td-p">{stock.name}</p>
            </div>
          </td>
        </Tooltip>

        <Tooltip title="Stock Price Percentage">
          <td>
            <div className="chip-flex">
              <div className={`price-chip ${isNegative ? "red" : ""}`}>
                {stock.price_change_percentage_24h.toFixed(2)}%
              </div>
              <div className={`chip-icon td-chip-icon ${isNegative ? "red" : ""}`}>
                {isNegative ? <TrendingDownRoundedIcon /> : <TrendingUpRoundedIcon />}
              </div>
            </div>
          </td>
        </Tooltip>

        <Tooltip title="Stock Price">
          <td className="td-current-price">${stock.current_price.toLocaleString()}</td>
        </Tooltip>

        <td className="stock-name td-totalVolume">{stock.total_volume.toLocaleString()}</td>
        <td className="stock-name td-marketCap">${stock.market_cap.toLocaleString()}</td>
        <td className="stock-name mobile">${convertNumber(stock.market_cap)}</td>

        <td>
          <div className="list-actions">
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
                buttonClassName="list-alert-btn"
              />
            )}
          </div>
        </td>
      </motion.tr>
    </a>
  );
}

export default StockList;
