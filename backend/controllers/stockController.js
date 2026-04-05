const axios = require("axios");

exports.getStockChart = async (req, res) => {
  try {
    const { id } = req.params;
    const {range} = req.query;

    const response = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${id}?range=${range}d&interval=1d`
    );

    const result = response.data.chart.result[0];

    const timestamps = result.timestamp;
    const quote = result.indicators.quote[0];

    const prices = quote.high;
    const volumes = quote.volume;

    const priceChart = timestamps
      .map((t, i) => prices[i] !== null && [t * 1000, prices[i]])
      .filter(Boolean);

    const volumeChart = timestamps
      .map((t, i) => volumes[i] !== null && [t * 1000, volumes[i]])
      .filter(Boolean);

    res.json({
      prices: priceChart,
      volumes: volumeChart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};