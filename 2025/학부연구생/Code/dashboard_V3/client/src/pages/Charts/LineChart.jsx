import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import styles from "./styles/LineChart.module.css";

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ chartData, options }) => {
  if (!chartData || !chartData.labels?.length || !chartData.datasets?.length) {
    return <div className={styles.loading}>Loading Line Chart...</div>;
  }

  return (
    <div className={styles.chartContainer} style={{ width: "100%", height: "400px" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
