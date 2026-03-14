const User = require("../models/User");

exports.updateWatchlist = async (req, res) => {
    try {
        const { email, watchlist } = req.body;
        const user = await User.findOneAndUpdate(
            { email },
            { watchlist },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Watchlist updated successfully",
            watchlist: user.watchlist,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
