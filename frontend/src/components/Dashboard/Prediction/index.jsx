import React, { useEffect, useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "../../Common/Button";
import { predictFuturePrice } from "../../../functions/predictFuturePrice";
import "./styles.css";

const DEFAULT_CRYPTO = "bitcoin";
const DEFAULT_STOCK = "AAPL";

function formatUsd(value) {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 100 ? 2 : 6,
  }).format(value);
}

export default function PredictionWidget({ coins, stocks }) {
  const [assetType, setAssetType] = useState("crypto");
  const [asset, setAsset] = useState(DEFAULT_CRYPTO);
  const [days, setDays] = useState(7);

  const [auto7, setAuto7] = useState({ loading: false, error: "", price: null });
  const [manual, setManual] = useState({ loading: false, error: "", price: null });

  const options = useMemo(() => {
    if (assetType === "crypto") {
      return (coins || [])
        .map((c) => ({ value: c.id, label: `${c.name} (${String(c.symbol || "").toUpperCase()})` }))
        .slice(0, 50);
    }
    return (stocks || [])
      .map((s) => ({ value: s.symbol || s.id, label: `${s.name} (${s.symbol || s.id})` }))
      .slice(0, 50);
  }, [assetType, coins, stocks]);

  useEffect(() => {
    if (assetType === "crypto") setAsset(DEFAULT_CRYPTO);
    else setAsset(DEFAULT_STOCK);
  }, [assetType]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!asset) return;
      setAuto7({ loading: true, error: "", price: null });
      try {
        const res = await predictFuturePrice({ assetType, asset, days: 7 });
        if (cancelled) return;
        setAuto7({ loading: false, error: "", price: res.predictedPrice });
      } catch (e) {
        if (cancelled) return;
        const msg = e?.response?.data?.message || e?.message || "Failed to fetch 7-day prediction";
        setAuto7({ loading: false, error: msg, price: null });
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [assetType, asset]);

  const handlePredict = async () => {
    setManual({ loading: true, error: "", price: null });
    try {
      const res = await predictFuturePrice({ assetType, asset, days: Number(days) });
      setManual({ loading: false, error: "", price: res.predictedPrice });
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || "Prediction failed";
      setManual({ loading: false, error: msg, price: null });
    }
  };

  return (
    <div className="prediction-panel">
      <div className="prediction-header">
        <div>
          <p className="prediction-title">Future Price Prediction (LSTM)</p>
          <p className="prediction-subtitle">Select an asset and forecast its future close price.</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {auto7.loading ? <CircularProgress size={18} /> : null}
          <span style={{ color: "var(--grey)" }}>7-day:</span>
          <span className="prediction-price">{formatUsd(auto7.price ?? NaN)}</span>
        </div>
      </div>

      {auto7.error ? <div className="prediction-error">{auto7.error}</div> : null}

      <div className="prediction-grid">
        <TextField
          select
          label="Market"
          value={assetType}
          onChange={(e) => setAssetType(e.target.value)}
          size="small"
          fullWidth
          sx={{
            "& .MuiInputBase-root": { color: "var(--white)" },
            "& .MuiInputLabel-root": { color: "var(--grey)" },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--grey)" },
            "& .MuiSvgIcon-root": { color: "var(--white)" },
          }}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                sx: {
                  backgroundColor: "var(--black)",
                  color: "var(--white)",
                },
              },
            },
          }}
        >
          <MenuItem value="crypto">Crypto</MenuItem>
          <MenuItem value="stocks">Stocks</MenuItem>
        </TextField>

        <TextField
          select
          label="Asset"
          value={asset}
          onChange={(e) => setAsset(e.target.value)}
          size="small"
          fullWidth
          sx={{
            "& .MuiInputBase-root": { color: "var(--white)" },
            "& .MuiInputLabel-root": { color: "var(--grey)" },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--grey)" },
            "& .MuiSvgIcon-root": { color: "var(--white)" },
          }}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                sx: {
                  backgroundColor: "var(--black)",
                  color: "var(--white)",
                  maxHeight: 300,
                },
              },
            },
          }}
        >
          {options.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Days ahead"
          type="number"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          size="small"
          fullWidth
          inputProps={{ min: 1, max: 365 }}
          sx={{
            "& .MuiInputBase-root": { color: "var(--white)" },
            "& .MuiInputLabel-root": { color: "var(--grey)" },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--grey)" },
            "& .MuiSvgIcon-root": { color: "var(--white)" },
          }}
        />

        <div style={{ justifySelf: "end" }}>
          <Button text={manual.loading ? "Predicting..." : "Predict"} onClick={handlePredict} />
        </div>
      </div>

      <div className="prediction-result">
        <div>
          <div style={{ color: "var(--grey)", fontSize: "0.95rem" }}>Prediction result</div>
          <div className="prediction-price">{formatUsd(manual.price ?? NaN)}</div>
        </div>
        {manual.loading ? <CircularProgress size={20} /> : null}
      </div>

      {manual.error ? <div className="prediction-error">{manual.error}</div> : null}
    </div>
  );
}

