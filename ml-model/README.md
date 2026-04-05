# CoinPulse ML Model Service (LSTM)

This is a separate Python service that trains (once per asset) and serves **future price predictions** via an LSTM model.

## Endpoints

- `GET /health`
- `POST /predict`
  - Body: `{ "assetType": "crypto" | "stocks", "asset": "<coingeckoId|ticker>", "days": 7 }`
  - Returns: `{ predictedPrice, trained, ... }`

## Run locally

```bash
cd ml-model
python -m venv .venv
# Windows PowerShell:
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
# Optional (recommended): use the same CoinGecko demo key your frontend uses
# PowerShell:
# $env:COINGECKO_DEMO_API_KEY="YOUR_KEY"
uvicorn app:app --host 0.0.0.0 --port 8000
```

Artifacts are saved to `ml-model/artifacts/` so the service **does not retrain** on every request.

