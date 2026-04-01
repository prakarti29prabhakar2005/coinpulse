from __future__ import annotations

import os
import time
from typing import Literal

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from services.predictor import Predictor


class PredictRequest(BaseModel):
    assetType: Literal["crypto", "stocks"] = Field(..., description="Asset type")
    asset: str = Field(..., min_length=1, description="CoinGecko coin id or stock ticker symbol")
    days: int = Field(..., ge=1, le=365)


class PredictResponse(BaseModel):
    assetType: Literal["crypto", "stocks"]
    asset: str
    days: int
    predictedPrice: float
    currency: str = "usd"
    trained: bool
    modelKey: str
    generatedAt: int
    latencyMs: int


app = FastAPI(title="CoinPulse ML Service", version="1.0.0")

_predictor = Predictor(
    models_dir=os.path.join(os.path.dirname(__file__), "artifacts"),
    cache_dir=os.path.join(os.path.dirname(__file__), "cache"),
)


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    start = time.time()
    try:
        result = _predictor.predict(asset_type=req.assetType, asset=req.asset, days=req.days)
        latency_ms = int((time.time() - start) * 1000)
        return PredictResponse(
            assetType=req.assetType,
            asset=req.asset,
            days=req.days,
            predictedPrice=float(result["predicted_price"]),
            currency="usd",
            trained=bool(result["trained"]),
            modelKey=str(result["model_key"]),
            generatedAt=int(time.time()),
            latencyMs=latency_ms,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

