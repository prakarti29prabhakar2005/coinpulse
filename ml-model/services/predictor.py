from __future__ import annotations

import os
import threading
import time
from dataclasses import dataclass

import numpy as np
import joblib
from sklearn.preprocessing import MinMaxScaler

from services.sources import fetch_crypto_ohlcv, fetch_stock_ohlcv
from services.training import build_lstm_model, make_sliding_windows


@dataclass(frozen=True)
class ModelArtifacts:
    model_path: str
    scaler_path: str


class Predictor:
    def __init__(self, models_dir: str, cache_dir: str):
        self.models_dir = models_dir
        self.cache_dir = cache_dir
        os.makedirs(self.models_dir, exist_ok=True)
        os.makedirs(self.cache_dir, exist_ok=True)
        self._locks: dict[str, threading.Lock] = {}

    def _key(self, asset_type: str, asset: str) -> str:
        return f"{asset_type.lower()}__{asset.strip().lower()}"

    def _paths(self, model_key: str) -> ModelArtifacts:
        return ModelArtifacts(
            model_path=os.path.join(self.models_dir, f"{model_key}.keras"),
            scaler_path=os.path.join(self.models_dir, f"{model_key}.scaler.joblib"),
        )

    def _lock_for(self, model_key: str) -> threading.Lock:
        if model_key not in self._locks:
            self._locks[model_key] = threading.Lock()
        return self._locks[model_key]

    def _load_or_train(self, asset_type: str, asset: str, model_key: str) -> tuple[object, MinMaxScaler, bool]:
        from tensorflow.keras.models import load_model

        paths = self._paths(model_key)

        if os.path.exists(paths.model_path) and os.path.exists(paths.scaler_path):
            model = load_model(paths.model_path, compile=False)
            scaler: MinMaxScaler = joblib.load(paths.scaler_path)
            return model, scaler, False

        if asset_type == "crypto":
            df = fetch_crypto_ohlcv(asset, cache_dir=self.cache_dir)
        elif asset_type == "stocks":
            df = fetch_stock_ohlcv(asset, cache_dir=self.cache_dir)
        else:
            raise ValueError("assetType must be 'crypto' or 'stocks'")

        feature_cols = ["open", "high", "low", "close", "volume"]
        values = df[feature_cols].astype("float32").values

        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled = scaler.fit_transform(values)

        window_size = 60
        X, y = make_sliding_windows(scaled, window_size=window_size, target_col_index=3)  # close
        if len(X) < 200:
            raise ValueError("Not enough historical data to train model for this asset.")

        model = build_lstm_model(window_size=window_size, num_features=X.shape[2])
        model.fit(X, y, epochs=3, batch_size=32, verbose=0)

        model.save(paths.model_path)
        joblib.dump(scaler, paths.scaler_path)
        return model, scaler, True

    def predict(self, asset_type: str, asset: str, days: int) -> dict:
        asset_type = str(asset_type).strip().lower()
        if asset_type == "stock":
            asset_type = "stocks"
        if asset_type not in ("crypto", "stocks"):
            raise ValueError("assetType must be 'crypto' or 'stocks'.")
        asset = str(asset or "").strip()
        if not asset:
            raise ValueError("asset is required.")
        if not isinstance(days, int) or days < 1 or days > 365:
            raise ValueError("days must be an integer between 1 and 365.")

        model_key = self._key(asset_type, asset)
        lock = self._lock_for(model_key)

        with lock:
            model, scaler, trained = self._load_or_train(asset_type, asset, model_key)

        # Fetch latest data for prediction seed
        if asset_type == "crypto":
            df = fetch_crypto_ohlcv(asset, cache_dir=self.cache_dir, force_refresh=False)
        else:
            df = fetch_stock_ohlcv(asset, cache_dir=self.cache_dir, force_refresh=False)

        feature_cols = ["open", "high", "low", "close", "volume"]
        values = df[feature_cols].astype("float32").values
        scaled = scaler.transform(values)

        window_size = 60
        if len(scaled) < window_size:
            raise ValueError("Not enough recent data to make prediction.")

        seq = scaled[-window_size:].copy()

        # Iterative multi-step forecasting: predict 'close' each day, roll window forward.
        # For unknown future OHLCV features, we copy last known row and only replace close with predicted close.
        predicted_close_scaled = None
        for _ in range(days):
            x = np.expand_dims(seq, axis=0)  # (1, window, features)
            yhat = model.predict(x, verbose=0)
            predicted_close_scaled = float(yhat[0][0])

            next_row = seq[-1].copy()
            next_row[3] = predicted_close_scaled
            seq = np.vstack([seq[1:], next_row])

        if predicted_close_scaled is None:
            raise RuntimeError("Prediction failed.")

        # Inverse transform for close: inject into a dummy row
        dummy = np.zeros((1, 5), dtype="float32")
        dummy[0] = scaled[-1]
        dummy[0, 3] = predicted_close_scaled
        inv = scaler.inverse_transform(dummy)
        predicted_price = float(inv[0, 3])

        return {
            "predicted_price": predicted_price,
            "trained": trained,
            "model_key": model_key,
            "ts": int(time.time()),
        }

