const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000") + "/api";

export const markNotificationRead = async ({ email, id }) => {
  const res = await fetch(
    `${API_BASE}/notifications/${id}/read?email=${encodeURIComponent(email)}`,
    { method: "PUT" }
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || "Failed to mark read");
  }

  return data.notification;
};

