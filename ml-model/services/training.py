from __future__ import annotations

import numpy as np
from tensorflow.keras import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout


def make_sliding_windows(scaled_values: np.ndarray, window_size: int, target_col_index: int):
    X = []
    y = []
    for i in range(window_size, len(scaled_values)):
        X.append(scaled_values[i - window_size : i, :])
        y.append(scaled_values[i, target_col_index])
    return np.array(X, dtype="float32"), np.array(y, dtype="float32")


def build_lstm_model(window_size: int, num_features: int):
    model = Sequential(
        [
            LSTM(64, return_sequences=True, input_shape=(window_size, num_features)),
            Dropout(0.2),
            LSTM(32),
            Dropout(0.2),
            Dense(1),
        ]
    )
    model.compile(optimizer="adam", loss="mean_squared_error")
    return model

