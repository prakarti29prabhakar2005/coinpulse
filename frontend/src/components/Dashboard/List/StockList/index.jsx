import React, { useState } from "react";
import "./styles.css";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { convertNumber } from "../../../../functions/convertNumber";
import { motion } from "framer-motion";
import { Tooltip } from "@mui/material";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { saveItemToWatchlist } from "../../../../functions/saveItemToWatchlist";
import StarIcon from "@mui/icons-material/Star";
import { removeItemToWatchlist } from "../../../../functions/removeItemToWatchlist";

function StockList({ stock, delay }) {
  const watchlist = JSON.parse(localStorage.getItem("watchlist"));
  const [isStockAdded, setIsStockAdded] = useState(watchlist?.includes(stock.id));
  return (
    <a href={`/stock/${stock.id}`}>
      <motion.tr
        className="list-row"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: delay }}
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
        <Tooltip
          title="Stock Price Percentage In 24hrs"
          placement="bottom-start"
        >
          {stock.price_change_percentage_24h >= 0 ? (
            <td>
              <div className="chip-flex">
                <div className="price-chip">
                  {stock.price_change_percentage_24h.toFixed(2)}%
                </div>
                <div className="chip-icon td-chip-icon">
                  <TrendingUpRoundedIcon />
                </div>
              </div>
            </td>
          ) : (
            <td>
              <div className="chip-flex">
                <div className="price-chip red">
                  {stock.price_change_percentage_24h.toFixed(2)}%
                </div>
                <div className="chip-icon td-chip-icon red">
                  <TrendingDownRoundedIcon />
                </div>
              </div>
            </td>
          )}
        </Tooltip>
        <Tooltip title="Stock Price In USD" placement="bottom-end">
          {stock.price_change_percentage_24h >= 0 ? (
            <td className="current-price  td-current-price">
              ${stock.current_price.toLocaleString()}
            </td>
          ) : (
            <td className="current-price-red td-current-price">
              ${stock.current_price.toLocaleString()}
            </td>
          )}
        </Tooltip>
        <Tooltip title="Stock Total Volume" placement="bottom-end">
          <td className="stock-name td-totalVolume">
            {stock.total_volume.toLocaleString()}
          </td>
        </Tooltip>
        <Tooltip title="Stock Market Capital" placement="bottom-end">
          <td className="stock-name td-marketCap">
            ${stock.market_cap.toLocaleString()}
          </td>
        </Tooltip>
        <td className="stock-name mobile">${convertNumber(stock.market_cap)}</td>
        <td
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
        </td>
      </motion.tr>
    </a>
  );
}

export default StockList;
