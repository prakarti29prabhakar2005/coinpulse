const express = require("express");
const router = express.Router();

const { getStockChart } = require("../controllers/stockController");

router.get("/chart/:id", getStockChart);

module.exports = router;