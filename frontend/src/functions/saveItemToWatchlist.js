import { toast } from "react-toastify";

export const saveItemToWatchlist = async (e, id, type) => {
  e.preventDefault();

  const key =
    type === "crypto"
      ? "cryptoWatchlist"
      : "stockWatchlist";

  let watchlist =
    JSON.parse(localStorage.getItem(key)) || [];

  if (watchlist.includes(id)) {
    toast.error(
      `${id.charAt(0).toUpperCase() + id.slice(1)} - is already added!`
    );
    return;
  }

  watchlist.push(id);

  localStorage.setItem(key, JSON.stringify(watchlist));

  toast.success(
    `${id.charAt(0).toUpperCase() + id.slice(1)} - added to watchlist`
  );

  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.email) {
    try {
      await fetch((import.meta.env.VITE_API_BASE_URL || "http://localhost:5000") + "/api/user/watchlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          type: type,
          watchlist: watchlist,
        }),
      });
    } catch (err) {
      console.error("Watchlist sync failed", err);
    }
  }
};
