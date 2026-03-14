const express = require("express");
const router = express.Router();
const { updateWatchlist } = require("../controllers/userController");

router.post("/watchlist", updateWatchlist);

module.exports = router;
