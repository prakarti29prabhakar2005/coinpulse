const User = require("../models/User");

exports.updateWatchlist = async (req, res) => {
    try {
        const { email, type, watchlist } = req.body;

        let updateField = {};

        if (type === "crypto") {
            updateField.cryptoWatchlist = watchlist;
        }
        else if (type === "stock") {
            updateField.stockWatchlist = watchlist;
        }

        const user = await User.findOneAndUpdate(
            { email },
            updateField,
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Watchlist updated successfully",
            cryptoWatchlist: user.cryptoWatchlist,
            stockWatchlist: user.stockWatchlist
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
