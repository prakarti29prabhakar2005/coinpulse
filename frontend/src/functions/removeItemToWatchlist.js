import { toast } from "react-toastify";

export const removeItemToWatchlist = async (
  e,
  id,
  setIsAdded,
  type
) => {
  e.preventDefault();

  const confirmDelete = window.confirm(
    "Are you sure you want to remove this item?"
  );

  if (!confirmDelete) {
    toast.error(
      `${id.charAt(0).toUpperCase() + id.slice(1)} - could not be removed!`
    );
    return;
  }

  const key =
    type === "crypto"
      ? "cryptoWatchlist"
      : "stockWatchlist";

  let watchlist =
    JSON.parse(localStorage.getItem(key)) || [];

  const newList = watchlist.filter((item) => item !== id);

  localStorage.setItem(key, JSON.stringify(newList));

  setIsAdded(false);

  toast.success(
    `${id.charAt(0).toUpperCase() + id.slice(1)} - removed from watchlist`
  );

  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.email) {
    try {
      await fetch("http://localhost:5000/api/user/watchlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          type: type,
          watchlist: newList,
        }),
      });
    } catch (err) {
      console.error("Watchlist sync failed", err);
    }
  }
};
