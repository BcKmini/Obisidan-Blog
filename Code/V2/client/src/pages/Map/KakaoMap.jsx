import React, { useEffect } from "react";

const KakaoMap = ({ devices }) => {
  useEffect(() => {
    console.log("Devices for markers:", devices);

    const script = document.createElement("script");
    script.src =
      "//dapi.kakao.com/v2/maps/sdk.js?appkey=95ccf3041032837722da6a75b7374566&libraries=services";
    script.async = true;
  script.onload = () => {
    // 지도 로직
    if (!devices || devices.length === 0) {
      console.error("No devices data available for map rendering.");
      return;
    }

    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(36.5, 127.5), // 대한민국 중심 좌표
      level: 14, // 기본 확대 레벨
    };
    const map = new kakao.maps.Map(container, options);

    devices.forEach((device) => {
      const markerPosition = new kakao.maps.LatLng(device.latitude, device.longitude);
      const marker = new kakao.maps.Marker({
        position: markerPosition,
        map: map,
      });

      kakao.maps.event.addListener(marker, "click", () => {
        map.setCenter(markerPosition);
        map.setLevel(5);
        const infowindow = new kakao.maps.InfoWindow({
          content: `<div style="padding:5px;">${device.name}</div>`,
        });
        infowindow.open(map, marker);
      });
    });
  };
  script.onerror = () => {
    console.error("Kakao Map SDK failed to load.");
  };

  document.head.appendChild(script);

  return () => {
    document.head.removeChild(script);
  };
}, [devices]); // 의존성 배열에 `devices` 추가

  return <div id="map" style={{ width: "100%", height: "800px" }}></div>;
};

export default KakaoMap;