import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto"; //Dont get rid of this

function LineChart({ chartData, multiAxis }) {
  const options = {
    plugins: {
      legend: {
        display: multiAxis ? true : false,
      },
    },
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      axis1: {
        position: "left",
      },
      axis2: multiAxis && {
        position: "right",
      },
    },
  };

  return <Line data={chartData} options={options} />;
}

export default LineChart;
