from __future__ import annotations

import os
import time
from typing import Optional

import pandas as pd
import requests
import yfinance as yf
from pycoingecko import CoinGeckoAPI


def _cache_path(cache_dir: str, key: str) -> str:
    os.makedirs(cache_dir, exist_ok=True)
    return os.path.join(cache_dir, f"{key}.csv")


def _read_cache(path: str, max_age_seconds: int) -> Optional[pd.DataFrame]:
    try:
        st = os.stat(path)
        if (time.time() - st.st_mtime) > max_age_seconds:
            return None
        df = pd.read_csv(path)
        if df.empty:
            return None
        return df
    except FileNotFoundError:
        return None
    except Exception:
        return None


def fetch_crypto_ohlcv(coin_id: str, cache_dir: str, force_refresh: bool = False) -> pd.DataFrame:
    """
    CoinGecko provides daily price + volume time series. OHLC isn't always available without paid endpoints.
    We approximate OHLC by using daily price as open/high/low/close to satisfy the model's feature shape.
    """
    coin_id = str(coin_id).strip().lower()
    if not coin_id:
        raise ValueError("coin id is required")

    # CoinGecko free/public API users are limited to 365 days of historical range.
    days = 365
    cache_key = f"crypto__{coin_id}__daily_{days}d"
    path = _cache_path(cache_dir, cache_key)
    if not force_refresh:
        cached = _read_cache(path, max_age_seconds=60 * 60 * 6)
        if cached is not None:
            return _normalize_df(cached)

    # Prefer direct HTTP so we can optionally pass demo API key header.
    # Set COINGECKO_DEMO_API_KEY to match your frontend config if you hit rate limits.
    headers = {}
    demo_key = os.environ.get("COINGECKO_DEMO_API_KEY", "").strip()
    if demo_key:
        headers["x-cg-demo-api-key"] = demo_key

    url = f"https://api.coingecko.com/api/v3/coins/{coin_id}/market_chart"
    resp = requests.get(
        url,
        params={"vs_currency": "usd", "days": days, "interval": "daily"},
        headers=headers,
        timeout=30,
    )
    resp.raise_for_status()
    data = resp.json()
    prices = data.get("prices", [])
    volumes = data.get("total_volumes", [])
    if not prices:
        raise ValueError("No historical data returned for this crypto asset.")

    df_prices = pd.DataFrame(prices, columns=["ts", "price"])
    df_vol = pd.DataFrame(volumes, columns=["ts", "volume"])
    df = df_prices.merge(df_vol, on="ts", how="left")

    df["open"] = df["price"]
    df["high"] = df["price"]
    df["low"] = df["price"]
    df["close"] = df["price"]
    df = df.drop(columns=["price"])
    df["date"] = pd.to_datetime(df["ts"], unit="ms").dt.date.astype(str)
    df = df[["date", "open", "high", "low", "close", "volume"]]
    df.to_csv(path, index=False)
    return _normalize_df(df)


def fetch_stock_ohlcv(ticker: str, cache_dir: str, force_refresh: bool = False) -> pd.DataFrame:
    ticker = str(ticker).strip().upper()
    if not ticker:
        raise ValueError("stock ticker is required")

    cache_key = f"stocks__{ticker}__1d_2y"
    path = _cache_path(cache_dir, cache_key)
    if not force_refresh:
        cached = _read_cache(path, max_age_seconds=60 * 60 * 6)
        if cached is not None:
            return _normalize_df(cached)

    hist = yf.download(ticker, period="2y", interval="1d", auto_adjust=False, progress=False)
    if hist is None or hist.empty:
        raise ValueError("No historical data returned for this stock ticker.")

    hist = hist.reset_index()
    # yfinance columns: Date, Open, High, Low, Close, Adj Close, Volume
    def _col(col_name: str):
        col = hist[col_name]
        # yfinance can return a DataFrame (MultiIndex columns) even for one ticker.
        if isinstance(col, pd.DataFrame):
            return col.iloc[:, 0]
        return col

    df = pd.DataFrame(
        {
            "date": hist["Date"].dt.date.astype(str),
            "open": _col("Open"),
            "high": _col("High"),
            "low": _col("Low"),
            "close": _col("Close"),
            "volume": _col("Volume"),
        }
    )
    df.to_csv(path, index=False)
    return _normalize_df(df)


def _normalize_df(df: pd.DataFrame) -> pd.DataFrame:
    for col in ["open", "high", "low", "close", "volume"]:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    df = df.dropna(subset=["open", "high", "low", "close", "volume"])
    df = df.reset_index(drop=True)
    return df

