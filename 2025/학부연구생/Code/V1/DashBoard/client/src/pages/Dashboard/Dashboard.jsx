import React, { useEffect, useState } from "react";
import PieChart from "../Charts/PieChart";
import LineChart from "../Charts/LineChart";
import StatCard from "../StatCard/StatCard";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [repellentData, setRepellentData] = useState([]);
  const [repellentDevice, setRepellentDevice] = useState([]);
  const [repellentSound, setRepellentSound] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [monthFilter, setMonthFilter] = useState(""); // 월 필터링 상태
  const [yearFilter, setYearFilter] = useState(""); // 년도 필터링 상태

  // 데이터 Fetch
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const responses = await Promise.all([
          fetch("http://127.0.0.1:7090/data/repellent_data/"),
          fetch("http://127.0.0.1:7090/data/repellent_device/"),
          fetch("http://127.0.0.1:7090/data/repellent_sound/"),
        ]);

        const data = await Promise.all(
          responses.map((res) => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
          })
        );

        setRepellentData(data[0]);
        setRepellentDevice(data[1]);
        setRepellentSound(data[2]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // 필터링된 Detection Data
  const filteredData = repellentData.filter((item) => {
    const itemDate = new Date(item.detection_time);
    const itemYear = itemDate.getFullYear();
    const itemMonth = itemDate.getMonth() + 1;

    const yearMatch = yearFilter && yearFilter !== "All" ? itemYear === parseInt(yearFilter) : true; // All 처리
    const monthMatch = monthFilter ? itemMonth === parseInt(monthFilter) : true;

    return yearMatch && monthMatch;
  });

  // 그래프 데이터 생성
  const generateChartData = () => {
    if (!yearFilter && !monthFilter) return { labels: [], datasets: [] };

    // 선택된 월의 마지막 일 수 계산
    const daysInMonth =
      monthFilter && yearFilter !== "All"
        ? new Date(yearFilter, monthFilter, 0).getDate()
        : 31; // All 연도일 경우 최대 31일까지 표시

    const dayCounts = Array(daysInMonth).fill(0);

    // 날짜별 합산
    filteredData.forEach((item) => {
      const itemDate = new Date(item.detection_time);
      const day = itemDate.getDate(); // 일자 가져오기
      dayCounts[day - 1] += item.detection_num || 0; // detection_num 합산
    });

    return {
      labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
      datasets: [
        {
          label: "Detection Count",
          data: dayCounts,
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderWidth: 2,
        },
      ],
    };
  };

  const chartData = generateChartData();

  // Sound Detection 차트 데이터
  const soundChartData = {
    labels: repellentSound.slice(0, 5).map((item) => item.sound_name),
    datasets: [
      {
        data: repellentSound.slice(0, 5).map((item) => item.sound_level),
        backgroundColor: [
          "rgba(255,99,132,0.6)",
          "rgba(54,162,235,0.6)",
          "rgba(255,206,86,0.6)",
          "rgba(75,192,192,0.6)",
          "rgba(153,102,255,0.6)",
        ],
      },
    ],
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <h1>Bird Detection Dashboard</h1>

      {/* 통계 카드 */}
      <div className={styles.statCards}>
        <StatCard className={styles.statCard} title="Total Repellent Data" value={repellentData.length} />
        <StatCard className={styles.statCard} title="Total Devices" value={repellentDevice.length} />
        <StatCard className={styles.statCard} title="Total Sounds" value={repellentSound.length} />
      </div>

      {/* 테이블과 차트 섹션 */}
      <div className={styles.tableRow}>
        {/* Repellent Data 테이블 */}
        <div className={styles.tableColumn}>
          <h2>Repellent Data Overview</h2>
          <div className={styles.tableContainer}>
            <table>
              <thead>
                <tr>
                  <th>Detection Time</th>
                  <th>Gateway ID</th>
                  <th>Repellent Device ID</th>
                  <th>Repellent Sound ID</th>
                  <th>Species</th>
                </tr>
              </thead>
              <tbody>
                {repellentData.map((row, index) => (
                  <tr key={index}>
                    <td>{new Date(row.detection_time).toLocaleDateString()}</td>
                    <td>{row.gateway_id}</td>
                    <td>{row.repellent_device_id}</td>
                    <td>{row.repellent_sound_id}</td>
                    <td>{row.species}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sound Detection 차트 */}
        <div className={styles.tableColumn}>
          <h2>Sound Detection Overview</h2>
          <PieChart chartData={soundChartData} title="Top 1-5 Sounds" />
        </div>

        {/* Repellent Device 테이블 */}
        <div className={styles.tableColumn}>
          <h2>Repellent Device Overview</h2>
          <div className={styles.tableContainer}>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>Activated</th>
                  <th>Working</th>
                </tr>
              </thead>
              <tbody>
                {repellentDevice.map((row, index) => (
                  <tr key={index}>
                    <td>{row.id}</td>
                    <td>{row.name}</td>
                    <td>{row.latitude}</td>
                    <td>{row.longitude}</td>
                    <td>{row.is_activated ? "Yes" : "No"}</td>
                    <td>{row.is_working ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>



      {/* 필터 섹션 */}
      <div className={styles.filterSection}>
        <label htmlFor="yearFilter">Select Year: </label>
        <select
          id="yearFilter"
          value={yearFilter}
          onChange={(event) => setYearFilter(event.target.value)}
        >
          <option value="All">All</option> {/* All 옵션 추가 */}
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>

        <label htmlFor="monthFilter">Select Month: </label>
        <select
          id="monthFilter"
          value={monthFilter}
          onChange={(event) => setMonthFilter(event.target.value)}
        >
          <option value="">All</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
        </select>
      </div>

      {/* Detection Data 그래프 */}
      <div className={styles.dataSection}>
        <h1>Detection Data Over Time</h1>
        <LineChart
          chartData={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Day of Month",
                },
                ticks: {
                  callback: (value) => `${value + 1}일`, // X축에 1을 더해 출력
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Detection Count",
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;