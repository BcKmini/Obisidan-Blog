import React, { useState, useEffect } from "react";
import { Map, MapMarker, MarkerClusterer } from "react-kakao-maps-sdk";
import styles from "./KakaoMap.module.css";

const KakaoMap = ({ devices }) => {
  const [positions, setPositions] = useState([]); // 마커 위치 배열
  const [openMarkerIndex, setOpenMarkerIndex] = useState(null); // 현재 열려 있는 마커 인덱스
  const [zoomLevel, setZoomLevel] = useState(14); // 줌 레벨 상태

  // devices 데이터를 기반으로 지도에 표시할 위치 설정
  useEffect(() => {
    if (devices) {
      const newPositions = devices
        .filter((device) => {
          const { latitude: lat, longitude: lng } = device;

          // 대한민국 본토 범위 확인
          const isInMainland =
            lat >= 34.6 &&
            lat <= 37.9 &&
            lng >= 126 &&
            lng <= 129.3;

          // 제주도 범위 확인
          const isInJeju =
            lat >= 33.1 && lat <= 33.6 && lng >= 126.1 && lng <= 126.9;

          return isInMainland || isInJeju; // 본토와 제주도만 포함
        })
        .map((device) => ({
          lat: parseFloat(device.latitude), // 위도
          lng: parseFloat(device.longitude), // 경도
          name: device.name, // 장치 이름
        }));

      setPositions(newPositions);
    }
  }, [devices]);

  // 마커 클릭 핸들러
  const handleMarkerClick = (index) => {
    setOpenMarkerIndex(index === openMarkerIndex ? null : index); // 동일한 마커 클릭 시 닫기
  };

  // 줌 레벨 변경 핸들러
  const handleZoomChanged = (map) => {
    setZoomLevel(map.getLevel()); // 줌 레벨 업데이트
  };

  return (
    <Map
      center={{ lat: 36.2683, lng: 127.6358 }} // 초기 중심 좌표
      style={{ width: "100%", height: "450px" }} // 지도 크기
      level={12} // 초기 줌 레벨
      onZoomChanged={handleZoomChanged} // 줌 레벨 변경 핸들러
    >
      <MarkerClusterer averageCenter={true} minLevel={10}>
        {positions.map((pos, index) => (
          <React.Fragment key={`marker-${index}`}>
            <MapMarker
              position={{ lat: pos.lat, lng: pos.lng }}
              onClick={() => handleMarkerClick(index)} // 마커 클릭 시 실행
            >
              {/* 클릭된 마커에만 텍스트와 버튼 표시 */}
              {openMarkerIndex === index && (
                <div
                  style={{
                    width: "150px",
                    background: "#fff", // 흰색 배경
                    border: "1px solid #ccc", // 테두리
                    borderRadius: "5px", // 둥근 모서리
                    padding: "10px", // 내부 여백
                    textAlign: "center", // 텍스트 가운데 정렬
                    fontSize: "14px", // 텍스트 크기
                    zIndex: 999, // 팝업을 맨 위로 설정
                    right: "30px"
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold", // 텍스트 굵게
                      marginBottom: "1px", // 텍스트와 버튼 간격
                    }}
                  >
                    {pos.name}
                  </div>
                  <button
                    style={{
                      background: "#f5f5f5", // 버튼 배경색
                      border: "1px solid #ccc", // 버튼 테두리
                      padding: "5px 10px", // 버튼 여백
                      cursor: "pointer", // 마우스를 올리면 포인터 커서
                      fontSize: "12px", // 버튼 텍스트 크기
                      borderRadius: "3px", // 버튼 모서리 둥글게
                    }}
                    onClick={() => setOpenMarkerIndex(null)} // 닫기 버튼 클릭 시 팝업 닫기
                  >
                    닫기
                  </button>
                </div>
              )}
            </MapMarker>
          </React.Fragment>
        ))}
      </MarkerClusterer>
    </Map>
  );
};

export default KakaoMap;
