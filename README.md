# CoinPulse – Future Price Prediction System (LSTM)

This repo now includes a full-stack **Future Price Prediction System** using an **LSTM** time-series model.

## Architecture

- `frontend/` React (Vite)
- `backend/` Node.js (Express) – exposes `POST /api/predict`
- `ml-model/` Python (FastAPI) – exposes `POST /predict` (trains once per asset, then reuses saved model/scaler)

## 1) Run the ML service (FastAPI)

```bash
cd ml-model
py -3.11 -m venv .venv
# PowerShell:python --version
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
# Optional (recommended): use the same CoinGecko demo key as frontend
# $env:COINGECKO_DEMO_API_KEY="YOUR_KEY"
uvicorn app:app --host 0.0.0.0 --port 8000
```

Health check: `GET http://localhost:8000/health`

## 2) Run the backend (Express)

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
ML_SERVICE_URL=http://localhost:8000
```

Run:

```bash
npm run dev
```

Backend prediction endpoint:

- `POST http://localhost:5000/api/predict`
  - Body: `{ "assetType": "crypto"|"stocks", "asset": "bitcoin"|"AAPL", "days": 7 }`

## 3) Run the frontend (Vite)

```bash
cd frontend
npm install
npm run dev
```

Open the dashboard and use the **Future Price Prediction (LSTM)** widget:
- **Auto** shows the **7‑day** prediction for the selected asset.
- Use the form to predict \(1–365\) days ahead.

## Notes

- The ML service caches downloaded history in `ml-model/cache/` and saves trained artifacts in `ml-model/artifacts/`.
- First prediction call per asset may take longer (training). Subsequent calls reuse the saved model.

