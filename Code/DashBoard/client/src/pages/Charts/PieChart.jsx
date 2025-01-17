import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import styles from "./styles/PieChart.module.css";

// Chart.js 등록
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChart = ({ chartData, title }) => {
  if (!chartData || !chartData.labels || !chartData.datasets) {
    return <div className={styles.loading}>Loading Pie Chart...</div>;
  }

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.chartWrapper}>
        <Pie
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
                labels: {
                  font: {
                    size: 14,
                    family: "Arial",
                  },
                  color: "#333",
                },
              },
              tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                titleFont: {
                  size: 14,
                },
                bodyFont: {
                  size: 12,
                },
                bodyColor: "#fff",
                borderColor: "#fff",
                borderWidth: 1,
              },
            },
            animation: {
              animateRotate: true, // 회전 애니메이션
              animateScale: true, // 크기 애니메이션
            },
            hover: {
              mode: "nearest",
              animationDuration: 400,
            },
            elements: {
              arc: {
                hoverOffset: 10, // 마우스 오버 시 입체 효과
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default PieChart;
