const express = require("express");
const router = express.Router();

const { predictFuturePrice } = require("../controllers/predictController");

router.post("/", predictFuturePrice);

module.exports = router;

