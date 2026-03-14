import { toast } from "react-toastify";

export const removeItemToWatchlist = async (e, id, setIsCoinAdded) => {
  e.preventDefault();
  if (window.confirm("Are you sure you want to remove this coin?")) {
    let watchlist = JSON.parse(localStorage.getItem("watchlist"));
    const newList = watchlist.filter((coin) => coin != id);
    setIsCoinAdded(false);
    localStorage.setItem("watchlist", JSON.stringify(newList));
    toast.success(
      `${id.substring(0, 1).toUpperCase() + id.substring(1)
      } - has been removed!`
    );

    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email) {
      try {
        await fetch("http://localhost:5000/api/user/watchlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, watchlist: newList }),
        });
      } catch (err) {
        console.error("Failed to sync watchlist with backend", err);
      }
    }

    window.location.reload();
  } else {
    toast.error(
      `${id.substring(0, 1).toUpperCase() + id.substring(1)
      } - could not be removed!`
    );
    setIsCoinAdded(true);
  }
};
