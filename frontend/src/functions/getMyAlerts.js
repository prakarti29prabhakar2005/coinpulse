const API_BASE = "http://localhost:5000/api";

export const getMyAlerts = async (email) => {
  const res = await fetch(`${API_BASE}/alerts?email=${encodeURIComponent(email)}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || data.error || "Failed to fetch alerts");
  }

  return data.alerts || [];
};
