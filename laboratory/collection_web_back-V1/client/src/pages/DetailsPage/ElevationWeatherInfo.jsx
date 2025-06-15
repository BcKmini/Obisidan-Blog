// src/pages/DetailsPage/ElevationWeatherInfo.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

// 영문 날씨 상태 → 한글 매핑 (필요에 따라 확장)
const weatherDescriptionMap = {
  "clear sky": "맑음",
  "few clouds": "구름 조금",
  "scattered clouds": "구름 흩어짐",
  "broken clouds": "구름 많음",
  "overcast clouds": "흐림",
  "shower rain": "소나기",
  "rain": "비",
  "light rain": "이슬비 ",
  "thunderstorm": "뇌우",
  "snow": "눈",
  "mist": "안개",
};

export default function ElevationWeatherInfo({ lat, lon, address }) {
  // DB의 lat, lon이 비어있을 수 있으므로, 초깃값을 받거나 undefined로 설정
  const [coords, setCoords] = useState({ lat, lon });
  const [elevation, setElevation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vite 환경변수 사용 (루트 .env 파일에 VITE_OPENWEATHER_API_KEY=실제키 입력)
  const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  // 동일 좌표에 대한 중복 API 호출 방지를 위한 캐시
  const cacheRef = useRef({});

  // DB에 좌표가 없으면, address를 이용해 Kakao geocoder로 좌표 산출
  useEffect(() => {
    if (coords.lat && coords.lon) return; // 이미 좌표가 있으면 건너뜀
    if (address && window.kakao && window.kakao.maps && window.kakao.maps.services) {
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const newLat = result[0].y;
          const newLon = result[0].x;
          setCoords({ lat: newLat, lon: newLon });
        } else {
          console.error("주소 지오코딩 실패:", status);
          setLoading(false);
        }
      });
    } else {
      console.error("주소 정보 또는 Kakao SDK가 제공되지 않음");
      setLoading(false);
    }
  }, [coords.lat, coords.lon, address]);

  // 좌표가 확정되면 고도와 날씨 정보를 병렬로 요청
  useEffect(() => {
    if (!coords.lat || !coords.lon) return;
    async function fetchData() {
      const cacheKey = `${coords.lat}-${coords.lon}`;
      if (cacheRef.current[cacheKey]) {
        const { elevationValue, weatherData } = cacheRef.current[cacheKey];
        setElevation(elevationValue);
        setWeatherData(weatherData);
        setLoading(false);
        return;
      }

      try {
        const [elevRes, weatherRes] = await Promise.all([
          axios.get(`https://api.open-elevation.com/api/v1/lookup?locations=${coords.lat},${coords.lon}`),
          axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
          ),
        ]);
        const elevationValue = elevRes.data.results?.[0]?.elevation ?? null;
        const { temp } = weatherRes.data.main;
        const { speed: windSpeed } = weatherRes.data.wind;
        const rain = weatherRes.data.rain?.["1h"] || 0;
        const { description } = weatherRes.data.weather[0];
        const weatherInfo = { temp, windSpeed, rain, description };

        // 캐시 저장
        cacheRef.current[cacheKey] = { elevationValue, weatherData: weatherInfo };

        setElevation(elevationValue);
        setWeatherData(weatherInfo);
        setLoading(false);
      } catch (err) {
        console.error("고도/날씨 정보 가져오기 실패:", err);
        setLoading(false);
      }
    }
    fetchData();
  }, [coords.lat, coords.lon, OPENWEATHER_API_KEY]);

  if (loading) return <p>정보를 가져오는 중...</p>;
  if (elevation === null && !weatherData) return <p>고도/날씨 정보를 가져올 수 없음</p>;

  const weatherInKorean = weatherDescriptionMap[weatherData?.description] || weatherData?.description || "";

  return (
    <div style={{ fontSize: "16px", lineHeight: "1.6", textAlign: "left" }}>
      {elevation !== null && (
        <div style={{ marginBottom: "8px" }}>
          <strong style={{ display: "block", marginBottom: "4px" }}>🏔️ 고도</strong>
          <div>해발 {elevation}m</div>
        </div>
      )}
      {weatherData && (
        <div>
          <strong style={{ display: "block", marginBottom: "4px" }}>☁️ 날씨</strong>
          <div>
            {weatherInKorean} | 기온 {weatherData.temp}℃ | 강수량 {weatherData.rain}mm | 풍속 {weatherData.windSpeed}m/s
          </div>
        </div>
      )}
    </div>
  );
}
