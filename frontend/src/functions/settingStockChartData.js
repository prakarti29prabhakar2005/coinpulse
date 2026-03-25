import { gettingDate } from "./getDate";

export const settingStockChartData = (setChartData, prices1, prices2) => {
  if (!prices1 || prices1.length === 0) return;

  const labels = prices1.map((data) => gettingDate(data[0]));

  if (prices2 && prices2.length > 0) {
    setChartData({
      labels,
      datasets: [
        {
          label: "Stock 1",
          data: prices1.map((data) => data[1]),
          borderWidth: 1,
          fill: false,
          tension: 0.25,
          borderColor: "#3a80e9",
          pointRadius: 0,
          yAxisID: "axis1",
        },
        {
          label: "Stock 2",
          data: prices2.map((data) => data[1]),
          borderWidth: 1,
          fill: false,
          tension: 0.25,
          borderColor: "#61c96f",
          pointRadius: 0,
          yAxisID: "axis2",
        },
      ],
    });
  } else {
    setChartData({
      labels,
      datasets: [
        {
          label: "Stock Price",
          data: prices1.map((data) => data[1]),
          borderWidth: 1,
          fill: true,
          backgroundColor: "rgba(58, 128, 233,0.1)",
          tension: 0.25,
          borderColor: "#3a80e9",
          pointRadius: 0,
          yAxisID: "axis1",
        },
      ],
    });
  }
};