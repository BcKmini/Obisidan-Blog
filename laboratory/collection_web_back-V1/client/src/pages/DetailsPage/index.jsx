// src/pages/DetailsPage/index.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../../layout/Footer/footer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import KakaoMap from "./KakaoMap";
import CommentSection from "./CommentSection";
import ElevationWeatherInfo from "./ElevationWeatherInfo"; // 고도/날씨 정보 컴포넌트
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io";

// 커스텀 다음 화살표
function NextArrow(props) {
  const { onClick } = props;
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        right: "10px",
        transform: "translateY(-50%)",
        zIndex: 2,
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <IoIosArrowDroprightCircle size={36} color="#758C80" />
    </div>
  );
}

// 커스텀 이전 화살표
function PrevArrow(props) {
  const { onClick } = props;
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "10px",
        transform: "translateY(-50%)",
        zIndex: 2,
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <IoIosArrowDropleftCircle size={36} color="#758C80" />
    </div>
  );
}

// 날짜 포맷팅 함수 (오전/오후 포함)
function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "오후" : "오전";
  hours = hours % 12;
  hours = hours || 12; // 0일 경우 12로 표시
  minutes = minutes < 10 ? "0" + minutes : minutes;
  return `${ampm} ${hours}시${minutes !== "00" ? " " + minutes + "분" : ""}`;
}

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [observation, setObservation] = useState(null);

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  useEffect(() => {
    const fetchObservation = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/observations/${id}`);
        setObservation(response.data);
      } catch (error) {
        console.error("관찰 데이터 가져오기 오류:", error);
      }
    };
    fetchObservation();
  }, [id]);

  const handleUploadClick = () => {
    navigate("/upload");
  };

  if (!observation) {
    return <div style={{ marginTop: "91px", padding: "20px" }}>Loading...</div>;
  }

  // 이미지 목록 (콤마 분리)
  const imageList = observation.image_url
    ? observation.image_url.split(",").map((url) => url.trim()).filter(Boolean)
    : [];
  // 영상 목록 (콤마 분리)
  const videoList = observation.video_url
    ? observation.video_url.split(",").map((url) => url.trim()).filter(Boolean)
    : [];
  // 미디어 목록 생성
  const mediaList = [
    ...videoList.map((url) => ({ type: "video", url })),
    ...imageList.map((url) => ({ type: "image", url })),
  ];

  // 날짜 포맷팅
  const obsDate = new Date(observation.observation_date);
  const formattedDate = isNaN(obsDate)
    ? "날짜 정보 없음"
    : `${obsDate.getFullYear()}년 ${obsDate.getMonth() + 1}월 ${obsDate.getDate()}일 ${formatAMPM(obsDate)}`;

  return (
    <div
      style={{
        marginTop: "91px",
        display: "flex",
        justifyContent: "center",
        padding: "0 16px",
        backgroundColor: "#f6f6f6",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          padding: "24px",
        }}
      >
        {/* 상단: 기록하기 버튼 */}
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              width: "120px",
              height: "38px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "0 16px",
              backgroundColor: "#758C80",
              color: "white",
              borderRadius: "6px",
              cursor: "pointer",
            }}
            onClick={handleUploadClick}
          >
            <IoIosArrowBack style={{ fontSize: 24 }} />
            <span>기록</span>
          </div>
        </div>

        {/* 메인 영역 */}
        <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
          {/* 왼쪽: 미디어 슬라이더 */}
          <div style={{ flex: 1, maxWidth: "500px", borderRadius: "8px", overflow: "hidden" }}>
            {mediaList.length > 0 ? (
              <Slider {...sliderSettings} style={{ width: "100%", height: "100%" }}>
                {mediaList.map((media, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      overflow: "hidden",
                    }}
                  >
                    {media.type === "image" ? (
                      <img
                        src={media.url}
                        alt={`slide-${idx}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <video
                        src={media.url}
                        controls
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    )}
                  </div>
                ))}
              </Slider>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#eee",
                }}
              >
                <img
                  src="https://via.placeholder.com/500x300"
                  alt="No Media"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>
            )}
          </div>

          {/* 오른쪽: 관찰정보, 지도, 버튼 영역 */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
            {/* 관찰정보 섹션 */}
            <div style={{ marginBottom: "16px" }}>
              <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>관찰정보</h2>
              <hr style={{ marginBottom: "16px", border: "none", borderTop: "1px solid #ccc" }} />
              {/* 위치 */}
              <div style={{ marginBottom: "12px" }}>
                <strong style={{ display: "block", marginBottom: "4px" }}>📍 위치</strong>
                {observation.location || "위치정보 없음"}
              </div>
              {/* 고도 & 날씨 */}
              <div style={{ marginBottom: "12px" }}>
                <ElevationWeatherInfo
                  lat={observation.latitude}
                  lon={observation.longitude}
                  address={observation.location}
                />
              </div>
              {/* 관찰시각 */}
              <div style={{ marginBottom: "12px" }}>
                <strong style={{ display: "block", marginBottom: "4px" }}>⏰ 관찰시각</strong>
                {formattedDate}
              </div>
            </div>

            {/* 지도 영역 */}
            <div
              style={{
                width: "100%",
                height: "300px",
                borderRadius: "8px",
                overflow: "hidden",
                marginBottom: "16px",
              }}
            >
              <KakaoMap
                address={observation.location}
                lat={observation.latitude || 0}
                lon={observation.longitude || 0}
              />
            </div>

            {/* 버튼 영역 */}
            <div style={{ display: "flex", gap: "10px" }}>
              <a
                href={`https://ko.wikipedia.org/wiki/${observation.species_name}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  textAlign: "center",
                  backgroundColor: "#E3EBE7",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  color: "#000",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                위키피디아 정보
              </a>
              <a
               // href={`https://species.nibr.go.kr/home/mainHome.do?cont_link=009&subMenu=009002&contCd=009002&pageMode=view&ktsn=${
                //  observation.species_name === "참새" ? "120000002157" : "기본값"
                // }`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  textAlign: "center",
                  backgroundColor: "#E3EBE7",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  color: "#000",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                환경부 국립생물자원관 정보
              </a>
            </div>
          </div>
        </div>

        {/* 하단: 댓글 섹션 */}
        <div style={{ marginTop: "32px" }}>
          <CommentSection observationId={observation.id} />
        </div>

        <Footer />
      </div>
    </div>
  );
}
