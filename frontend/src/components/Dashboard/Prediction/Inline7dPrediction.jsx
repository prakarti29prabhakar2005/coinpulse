import React, { useEffect, useMemo, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { predictFuturePrice } from "../../../functions/predictFuturePrice";

const cache = new Map(); // key -> { price }
const inflight = new Map(); // key -> Promise<number>

function formatUsd(value) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 100 ? 2 : 6,
  }).format(value);
}

async function getPredictedPriceCached({ assetType, asset, days }) {
  const key = `${String(assetType)}:${String(asset)}:${Number(days)}`;
  const cached = cache.get(key);
  if (cached && Number.isFinite(cached.price)) return cached.price;

  const existing = inflight.get(key);
  if (existing) return await existing;

  const p = (async () => {
    const res = await predictFuturePrice({ assetType, asset, days });
    const price = Number(res?.predictedPrice);
    if (Number.isFinite(price)) cache.set(key, { price });
    return price;
  })();

  inflight.set(key, p);
  try {
    return await p;
  } finally {
    inflight.delete(key);
  }
}

export default function Inline7dPrediction({ assetType, asset, className = "" }) {
  const normalizedAsset = String(asset || "").trim();
  const key = useMemo(() => `${assetType}:${normalizedAsset}`, [assetType, normalizedAsset]);
  const [state, setState] = useState({ loading: true, price: NaN });

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!normalizedAsset) {
        setState({ loading: false, price: NaN });
        return;
      }
      setState((s) => ({ ...s, loading: true }));
      try {
        const price = await getPredictedPriceCached({ assetType, asset: normalizedAsset, days: 7 });
        if (cancelled) return;
        setState({ loading: false, price });
      } catch {
        if (cancelled) return;
        setState({ loading: false, price: NaN });
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [key]);

  return (
    <div className={`inline-7d ${className}`.trim()}>
      <span className="inline-7d-label">7D Pred</span>
      <span className="inline-7d-value">{formatUsd(state.price)}</span>
      {state.loading ? <CircularProgress size={12} sx={{ color: "var(--grey)" }} /> : null}
    </div>
  );
}

