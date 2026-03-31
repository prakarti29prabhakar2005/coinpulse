const API_BASE = "http://localhost:5000/api";

export const deletePriceAlert = async ({ email, id }) => {
  const res = await fetch(
    `${API_BASE}/alerts/${id}?email=${encodeURIComponent(email)}`,
    { method: "DELETE" }
  );
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || data.error || "Failed to delete alert");
  }

  return data;
};
