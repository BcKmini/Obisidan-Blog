/* global kakao */
import React, { useEffect, useRef, useState } from "react";

/*
  KakaoMapModal.jsx
  - 초기 지도 위치를 (36.950008, 127.907596)으로 설정합니다.
  - 검색창, 내 위치 버튼, 지도 클릭 시 마커가 해당 위치로 부드럽게 이동(panTo)하며,
    역지오코딩한 결과가 검색 입력란에 반영되고 부모 콜백(onSelectLocation)으로 전달됩니다.
*/
const KakaoMapModal = ({ onClose, onSelectLocation }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null); // 마커 인스턴스를 저장합니다.
  const [map, setMap] = useState(null);
  // 검색 입력란 상태: 클릭 시 역지오코딩한 주소가 들어감
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!mapRef.current) return;

    // 초기 지도 좌표를 (36.950008, 127.907596)으로 설정
    const centerLatLng = new kakao.maps.LatLng(36.950008, 127.907596);
    const options = {
      center: centerLatLng,
      level: 3,
    };

    const _map = new kakao.maps.Map(mapRef.current, options);

    // 확대/축소 컨트롤 추가
    const zoomControl = new kakao.maps.ZoomControl();
    _map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    // 단일 마커 생성 및 markerRef에 저장 (재사용)
    markerRef.current = new kakao.maps.Marker({
      position: centerLatLng,
    });
    markerRef.current.setMap(_map);

    // 지도 클릭 시 이벤트 처리: 해당 위치로 마커 이동 및 panTo, 역지오코딩 수행
    const geocoder = new kakao.maps.services.Geocoder();
    kakao.maps.event.addListener(_map, "click", (mouseEvent) => {
      const latlng = mouseEvent.latLng;
      // 마커 위치 업데이트
      markerRef.current.setPosition(latlng);
      // 화면 부드럽게 이동
      _map.panTo(latlng);
      // 역지오코딩하여 주소 획득
      geocoder.coord2Address(latlng.getLng(), latlng.getLat(), (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const address = result[0].road_address
            ? result[0].road_address.address_name
            : result[0].address.address_name;
          // 검색 입력란 업데이트 및 부모 콜백 호출
          setSearchQuery(address);
          onSelectLocation(address);
        }
      });
    });

    setMap(_map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 빈 배열: 컴포넌트 마운트 시 한 번만 초기화

  // 주소 검색 처리
  const handleSearch = () => {
    if (!searchQuery || !map || !markerRef.current) return;
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(searchQuery, (result, status) => {
      if (status === kakao.maps.services.Status.OK && result[0]) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        map.panTo(coords);
        markerRef.current.setPosition(coords);
        const address = result[0].road_address?.address_name || result[0].address.address_name;
        setSearchQuery(address);
        onSelectLocation(address);
      } else {
        alert("검색 결과를 찾을 수 없습니다.");
      }
    });
  };

  // 내 위치 버튼: 사용자가 클릭하면 현재 위치로 이동
  const handleMyLocation = () => {
    if (!map || !markerRef.current) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const loc = new kakao.maps.LatLng(lat, lng);
          map.panTo(loc);
          markerRef.current.setPosition(loc);
          const geocoder = new kakao.maps.services.Geocoder();
          geocoder.coord2Address(lng, lat, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
              const address = result[0].road_address?.address_name || result[0].address.address_name;
              setSearchQuery(address);
              onSelectLocation(address);
            }
          });
        },
        (err) => {
          console.error("Geolocation error:", err);
        }
      );
    }
  };

  const handleComplete = () => {
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-4 shadow-lg w-[700px] h-[600px] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-3 text-center">관찰위치 입력</h2>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            className="flex-1 border p-2 rounded text-sm"
            placeholder="장소 또는 주소를 입력하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="bg-[#6C8372] text-white py-1 px-3 rounded text-sm"
            onClick={handleSearch}
          >
            찾기
          </button>
          <button
            className="bg-[#6C8372] text-white py-1 px-3 rounded text-sm"
            onClick={handleMyLocation}
          >
            내 위치
          </button>
        </div>
        <div ref={mapRef} className="w-full h-[450px] border border-gray-200 mb-3" />
        <div className="w-full text-center">
          <button
            onClick={handleComplete}
            className="bg-[#5a7464] text-white font-medium py-2 px-6 rounded"
          >
            위치 입력 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default KakaoMapModal;
