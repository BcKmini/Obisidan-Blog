// src/pages/DetailsPage/KakaoMap.jsx
import React, { useRef, useEffect, useState, useCallback } from "react";
import { IoIosExpand, IoIosClose } from "react-icons/io";

const KakaoMap = ({ address, lat, lon }) => {
  const containerRef = useRef(null);
  const modalRef = useRef(null);
  const [isLargeView, setIsLargeView] = useState(false);

  // 지도 초기화 함수를 useCallback으로 래핑 (address, lat, lon 의존)
  const initializeMap = useCallback((container) => {
    const { kakao } = window;
    if (!container || !kakao) return;
    const options = {
      // lat, lon 값이 있으면 그 좌표로 중앙 설정
      center: new kakao.maps.LatLng(lat, lon),
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);

    // 좌표가 있으면 마커 표시, 없으면 주소 기반 지오코딩 처리
    if (lat && lon) {
      const markerPosition = new kakao.maps.LatLng(lat, lon);
      new kakao.maps.Marker({
        map,
        position: markerPosition,
      });
    } else if (address) {
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          map.setCenter(coords);
          new kakao.maps.Marker({
            map,
            position: coords,
          });
        }
      });
    }
  }, [address, lat, lon]);

  // inline 지도 초기화 (모달이 열리지 않은 경우)
  useEffect(() => {
    if (containerRef.current && !isLargeView) {
      initializeMap(containerRef.current);
    }
  }, [initializeMap, isLargeView]);

  // 모달 지도 초기화 (모달이 열렸을 경우)
  useEffect(() => {
    if (isLargeView && modalRef.current) {
      initializeMap(modalRef.current);
    }
  }, [initializeMap, isLargeView]);

  const openLargeView = () => setIsLargeView(true);
  const closeLargeView = () => setIsLargeView(false);

  return (
    <div style={{ position: "relative" }}>
      {/* inline 지도 컨테이너 */}
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "210px",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      />

      {/* 아이콘 버튼 (확대) */}
      <button
        onClick={openLargeView}
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          padding: "8px",
          backgroundColor: "#758C80",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          cursor: "pointer",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IoIosExpand style={{ fontSize: 24 }} />
      </button>

      {/* 모달 (오버레이) */}
      {isLargeView && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              position: "relative",
              width: "90%",
              height: "80vh",
              backgroundColor: "#fff",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {/* 모달 내 지도 컨테이너 */}
            <div ref={modalRef} style={{ width: "100%", height: "100%" }} />
            {/* 닫기 버튼 아이콘 */}
            <button
              onClick={closeLargeView}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                padding: "8px",
                backgroundColor: "#758C80",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IoIosClose style={{ fontSize: 24 }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KakaoMap;
