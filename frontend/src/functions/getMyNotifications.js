const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000") + "/api";

export const getMyNotifications = async (email) => {
  const res = await fetch(
    `${API_BASE}/notifications?email=${encodeURIComponent(email)}`
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || "Failed to fetch notifications");
  }
  return data.notifications || [];
};

