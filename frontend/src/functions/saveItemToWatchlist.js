import { toast } from "react-toastify";

export const saveItemToWatchlist = async (e, id) => {
  e.preventDefault();
  let watchlist = JSON.parse(localStorage.getItem("watchlist"));

  if (watchlist) {
    if (!watchlist.includes(id)) {
      watchlist.push(id);
      toast.success(
        `${id.substring(0, 1).toUpperCase() + id.substring(1)
        } - added to the watchlist`
      );
    } else {
      toast.error(
        `${id.substring(0, 1).toUpperCase() + id.substring(1)
        } - is already added to the watchlist!`
      );
      return;
    }
  } else {
    watchlist = [id];
    toast.success(
      `${id.substring(0, 1).toUpperCase() + id.substring(1)
      } - added to the watchlist`
    );
  }
  localStorage.setItem("watchlist", JSON.stringify(watchlist));

  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.email) {
    try {
      await fetch("http://localhost:5000/api/user/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, watchlist }),
      });
    } catch (err) {
      console.error("Failed to sync watchlist with backend", err);
    }
  }
};
