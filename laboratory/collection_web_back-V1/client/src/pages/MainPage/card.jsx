// src/pages/MainPage/components/SocialCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { IoIosPlayCircle } from "react-icons/io";
import "./card.css"; // 스타일 예시

export default function SocialCard({ observation }) {
  const navigate = useNavigate();

  const navigateToDetails = () => {
    navigate(`/details/${observation.id}`);
  };

  // 이미지·영상 배열 만들기
  const imageList = observation.image_url
    ? observation.image_url.split(",").map((url) => url.trim()).filter(Boolean)
    : [];
  const videoList = observation.video_url
    ? observation.video_url.split(",").map((url) => url.trim()).filter(Boolean)
    : [];

  // 전체 미디어 개수
  const totalCount = imageList.length + videoList.length;

  // 우선순위: 영상이 있으면 첫 영상, 없으면 첫 이미지
  let thumbnail = "";
  let isVideo = false;
  if (videoList.length > 0) {
    thumbnail = videoList[0]; // 첫 번째 영상 URL
    isVideo = true;
  } else if (imageList.length > 0) {
    thumbnail = imageList[0]; // 첫 번째 이미지 URL
    isVideo = false;
  } else {
    // 아무것도 없으면 placeholder
    thumbnail = "https://via.placeholder.com/200";
    isVideo = false;
  }

  return (
    <div className="post-card" onClick={navigateToDetails}>
      <div
        className="post-image-container"
        style={{
          width: "280px",
          height: "230px",
          overflow: "hidden",
          position: "relative"
        }}
      >
        {isVideo ? (
          // 영상 썸네일
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            {/* 실제 영상 태그: 첫 프레임이 썸네일이 됨 */}
            <video
              src={thumbnail}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
              muted
            />
            {/* 재생 아이콘 오버레이 */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none"
              }}
            >
              <IoIosPlayCircle size={50} color="rgba(255,255,255,0.9)" />
            </div>
          </div>
        ) : (
          // 이미지 썸네일
          <img
            src={thumbnail}
            alt={observation.species_name}
            className="post-image"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
        )}

        {/* 여러 개 업로드된 경우 왼쪽 아래에 총 개수 표시 */}
        {totalCount > 1 && (
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "10px",
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "5px"
            }}
          >
            <span style={{ fontSize: "16px" }}>📷</span>
            <span>{totalCount}</span>
          </div>
        )}
      </div>

      <div className="post-content">
        <div className="post-text">
          <h3>{observation.species_name}</h3>
          <p>{observation.location || "장소미정"}</p>
        </div>
        <div className="author-info">
          <p className="author-date">
            {new Date(observation.created_at).toLocaleDateString("ko-KR")}
          </p>
        </div>
      </div>
    </div>
  );
}
