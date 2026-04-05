const User = require("../models/User");
const bcrypt = require("bcryptjs");

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

exports.updateUserProfile = async (req, res) => {
    try {
        const { currentEmail, name, email, password } = req.body;

        const user = await User.findOne({ email: currentEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (name) user.name = name;
        if (email) {
            // Check if new email is already taken by another user
            if (email !== currentEmail) {
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    return res.status(400).json({ message: "Email already in use" });
                }
                user.email = email;
            }
        }
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ message: "Password must be at least 6 characters" });
            }
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
