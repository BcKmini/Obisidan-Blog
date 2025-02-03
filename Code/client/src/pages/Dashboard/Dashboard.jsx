import React, { useEffect, useState, useMemo } from "react";
import PieChart from "../Charts/PieChart";
import LineChart from "../Charts/LineChart";
import BarChart from "../Charts/BarChart";
import StatCard from "../StatCard/StatCard";
import styles from "./Dashboard.module.css";
import KakaoMap from "../../components/KakaoMap";
import axios from "axios";


const Dashboard = () => {
  const [repellentData, setRepellentData] = useState([]);
  const [repellentDevice, setRepellentDevice] = useState([]);
  const [repellentSound, setRepellentSound] = useState([]);
  const [filteredSpecies, setFilteredSpecies] = useState(null); // 종 필터 상태
  const [isLoading, setIsLoading] = useState(true);
  const [monthFilter, setMonthFilter] = useState("All"); // 월 필터링 상태
  const [yearFilter, setYearFilter] = useState("All"); // 년도 필터링 상태

  // 데이터 Fetch
  
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const ApiUrl = import.meta.env.VITE_API_URL; // Vite 환경 변수 사용
        
        // repellent_data 데이터 요청
        const repellentDataResponse = await axios.get(`${ApiUrl}/data/repellent_data/`);
        setRepellentData(repellentDataResponse.data);
  
        // repellent_device 데이터 요청
        const repellentDeviceResponse = await axios.get(`${ApiUrl}/data/repellent_device/`);
        setRepellentDevice(repellentDeviceResponse.data);
  
        // repellent_sound 데이터 요청
        const repellentSoundResponse = await axios.get(`${ApiUrl}/data/repellent_sound/`);
        setRepellentSound(repellentSoundResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchAllData();
  }, []);
  
  // filteredData 수정: "All"을 선택하면 모든 연도의 데이터를 포함하도록 변경
  const filteredData = repellentData.filter((item) => {
    const itemDate = new Date(item.detection_time);
    const itemYear = itemDate.getFullYear();
    const itemMonth = itemDate.getMonth() + 1;
  
    const yearMatch = yearFilter === "All" || itemYear === Number(yearFilter);
    const monthMatch =
      monthFilter === "All" || monthFilter === "" || itemMonth === Number(monthFilter);
  
    return yearMatch && monthMatch;
  });

//  generateChartData 수정: "All"이 선택되었을 때 전체 데이터를 포함하도록 변경
const generateChartData = useMemo(() => {
  if (!yearFilter && !monthFilter) return { labels: [], datasets: [] };

  let labels = [];
  let data = [];

  if (yearFilter === "All" && monthFilter === "All") {
    //  모든 연도 & 모든 월 데이터를 집계
    const yearMonthCounts = {};

    repellentData.forEach((item) => {
      const itemDate = new Date(item.detection_time);
      const yearMonth = `${itemDate.getFullYear()}-${itemDate.getMonth() + 1}`;

      if (!yearMonthCounts[yearMonth]) {
        yearMonthCounts[yearMonth] = 0;
      }
      yearMonthCounts[yearMonth] += item.detection_num || 0;
    });

    labels = Object.keys(yearMonthCounts);
    data = Object.values(yearMonthCounts);
  } else if (yearFilter === "All") {
    //  모든 연도를 포함하고 특정 월을 선택한 경우
    labels = Array.from(new Set(repellentData.map((item) => item.detection_time.split("T")[0]))).sort();
    data = Array(labels.length).fill(0);

    repellentData.forEach((item) => {
      const itemDate = new Date(item.detection_time);
      const formattedDate = item.detection_time.split("T")[0]; // YYYY-MM-DD 형태

      const month = itemDate.getMonth() + 1;
      if (monthFilter === "All" || month === Number(monthFilter)) {
        const index = labels.indexOf(formattedDate);
        if (index !== -1) {
          data[index] += item.detection_num || 0;
        }
      }
    });
  } else if (monthFilter === "All" || monthFilter === "") {
    //  특정 연도에서 월별 데이터 집계
    labels = Array.from({ length: 12 }, (_, i) => `${i + 1}월`);
    data = Array(12).fill(0);

    filteredData.forEach((item) => {
      const itemDate = new Date(item.detection_time);
      const month = itemDate.getMonth();
      data[month] += item.detection_num || 0;
    });
  } else {
    //  특정 연도 및 특정 월 선택 시 (일별 데이터 집계)
    const parsedYear = parseInt(yearFilter, 10);
    const parsedMonth = parseInt(monthFilter, 10);

    if (isNaN(parsedYear) || isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
      console.error("Invalid year or month selected", { yearFilter, monthFilter });
      return { labels: [], datasets: [] };
    }

    const daysInMonth = new Date(parsedYear, parsedMonth, 0).getDate();

    if (isNaN(daysInMonth) || daysInMonth <= 0) {
      console.error("Invalid daysInMonth value:", daysInMonth);
      return { labels: [], datasets: [] };
    }

    labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    data = Array(daysInMonth).fill(0);

    filteredData.forEach((item) => {
      const itemDate = new Date(item.detection_time);
      const day = itemDate.getDate();
      data[day - 1] += item.detection_num || 0;
    });
  }

  return {
    labels,
    datasets: [
      {
        label: "Detection Count",
        data,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 2,
      },
    ],
  };
}, [repellentData, filteredData, yearFilter, monthFilter]);

//
const chartData = generateChartData;

  // 히스토그램 데이터 생성
  const generateHistogramData = () => {
    const hourCounts = Array(24).fill(0);
    const speciesCounts = {};
  
    repellentData.forEach((item) => {
      if (!item.species || item.species === "Unknown") return; // 빈 값과 Unknown 제거
      const itemDate = new Date(item.detection_time);
      const hour = itemDate.getHours();
  
      if (!speciesCounts[item.species]) {
        speciesCounts[item.species] = Array(24).fill(0);
      }
      speciesCounts[item.species][hour] += 1;
    });
  
    const availableSpecies = Object.keys(speciesCounts);
    const selectedSpecies =
      filteredSpecies && availableSpecies.includes(filteredSpecies)
        ? filteredSpecies
        : availableSpecies[0] || null;
  
    return {
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      datasets: selectedSpecies
        ? [
            {
              label: selectedSpecies,
              data: speciesCounts[selectedSpecies],
              backgroundColor: "rgba(54, 162, 235, 0.8)",
              borderWidth: 1,
            },
          ]
        : [],
    };
  };
  
  
  

  const histogramData = useMemo(generateHistogramData, [
    repellentData,
    filteredSpecies,
  ]);

  const uniqueSpecies = Array.from(
    new Set(repellentData.map((item) => item.species))
  ).filter((species) => species && species !== "Unknown"); // "Unknown" 및 빈 값 제거
  
  
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
      <h1>Repellent_Dashboard</h1>

      {/* 통계 카드 */}
      <div className={styles.statCards}>
        <StatCard
          className={styles.statCard}
          title="Total Repellent Data"
          value={repellentData.length}
        />
        <StatCard
          className={styles.statCard}
          title="Total Devices"
          value={repellentDevice.length}
        />
        <StatCard
          className={styles.statCard}
          title="Total Sounds"
          value={repellentSound.length}
        />
      </div>

      {/* 테이블과 차트 섹션 */}
      <div className={styles.tableRow}>
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
          <option value="All">All</option>
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

      {/* 종 필터 버튼 */}
      <div className={styles.filterSection}>
  {uniqueSpecies.map((species) => (
    <button
      key={species}
      className={`${styles.filterButton} ${filteredSpecies === species ? styles.activeFilter : ""}`}
      onClick={() => setFilteredSpecies(species)}
    >
      {species}
    </button>
  ))}
</div>


      {/* 히스토그램 차트 */}
      <div className={styles.dataSection}>
        <h1>Bird Detection Frequency </h1>
        <div className={styles.chartContainer}>
          <BarChart chartData={histogramData} />
        </div>
      </div>

      {/* 지도 표시 */}
      <div className={styles.mapSection}>
        <h2>Repellent Device Map</h2>
        <KakaoMap devices={repellentDevice} />
      </div>
    </div>
  );
};

export default Dashboard;