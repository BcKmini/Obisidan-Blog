import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChart = ({ chartData }) => {
  return <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />;
};

export default BarChart;
