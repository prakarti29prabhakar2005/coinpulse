const express = require("express");
const router = express.Router();
const { updateWatchlist, updateUserProfile } = require("../controllers/userController");

router.post("/watchlist", updateWatchlist);
router.put("/profile", updateUserProfile);

module.exports = router;
