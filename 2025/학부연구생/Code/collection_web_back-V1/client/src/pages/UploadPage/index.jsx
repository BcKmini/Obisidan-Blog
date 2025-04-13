// UploadPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";
import axios from "axios";
import KakaoMapModal from "./KakaoMapModal";
import UploadBox from "./UploadBox";

const UploadPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const changelangeuageToKo = () => i18n.changeLanguage("ko");
  const changelangeuageToEn = () => i18n.changeLanguage("en");

  // 모달 상태 관리
  const [speciesSelectModelOpen, setSpeciesSelectModelOpen] = useState(false);
  const [speciesNameModelOpen, setSpeciesNameModelOpen] = useState(false);
  const [habitatModalOpen, setHabitatModalOpen] = useState(false);
  const [kakaoMapOpen, setKakaoMapOpen] = useState(false);

  // 생물 정보 관련 상태
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isEditingSpecies, setIsEditingSpecies] = useState(false);

  // 서식지 및 위치 관련 상태
  const [selectedHabitat, setSelectedHabitat] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [locationState, setLocationState] = useState("");

  // 파일 업로드: 파일 배열 전체를 상태에 저장
  const [photoVideoFiles, setPhotoVideoFiles] = useState([]);

  // 날짜 및 시간 관련 상태
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);

  // 관찰 메모
  const [memoText, setMemoText] = useState("");

  // 기본값 설정 (예시)
  const defaultSpeciesCategory = "조류";
  const defaultSpeciesName = "기본이름";
  const defaultHabitatType = "산림/계곡";

  // 모달 관련 함수
  const openFirstModal = () => setSpeciesSelectModelOpen(true);
  const openSecondModal = (category) => {
    setSelectedCategory(category);
    setSpeciesSelectModelOpen(false);
    setSpeciesNameModelOpen(true);
  };
  const closeSecondModal = () => {
    if (inputValue.trim() !== "") {
      setSelectedSpecies({ category: selectedCategory, name: inputValue });
      setSpeciesNameModelOpen(false);
      if (!isEditingSpecies) {
        setHabitatModalOpen(true);
      }
      setInputValue("");
      setIsEditingSpecies(false);
    }
  };

  const handleSelectLocation = (addr) => {
    setSelectedLocation(addr);
    setLocationState(addr);
  };

  const handleObservationSubmit = async () => {
    if (!selectedCategory && !selectedSpecies && !selectedHabitat && !selectedDate) {
      alert("필수 항목(종 분류, 생물 이름, 서식지, 관찰 일시)을 모두 입력하세요.");
      return;
    }

    // 날짜 포맷: yyyy-MM-dd HH:mm:ss
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const d = String(selectedDate.getDate()).padStart(2, "0");
    const hh = String(hour).padStart(2, "0");
    const mm = String(minute).padStart(2, "0");
    const dateString = `${y}-${m}-${d} ${hh}:${mm}:00`;

    // FormData 생성 및 필드 추가
    const formData = new FormData();
    formData.append("species_category", selectedCategory || defaultSpeciesCategory);
    formData.append("species_name", (selectedSpecies && selectedSpecies.name) || defaultSpeciesName);
    formData.append("habitat_type", selectedHabitat || defaultHabitatType);
    formData.append("observation_date", dateString);
    formData.append("location", locationState || selectedLocation || "");
    formData.append("memo", memoText || "");

    // 파일 추가: photoVideoFiles 배열의 모든 파일 추가
    if (photoVideoFiles.length > 0) {
      console.log("Number of selected files:", photoVideoFiles.length);
      photoVideoFiles.forEach((file) => {
        if (file && file.name) {
          formData.append("photoVideo", file);
        }
      });
    }

    try {
      // POST 요청 (URL 끝에 슬래시 포함)
      await axios.post("http://localhost:4000/observations/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("등록이 완료되었습니다!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  const navigateToMain = () => navigate("/");

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white">
      <div className="w-[41%] p-4 flex flex-col gap-6">
        {/* 상단 입력 영역 */}
        <div className="w-full flex items-center space-x-4 mt-7">
          <div className="text-[#00240A] font-bold text-[20px]">
            {t("upload.creature name")}
          </div>
          <div
            className="w-[300px] px-4 py-2 border border-[#758C80] cursor-pointer text-sm rounded-md"
            onClick={() => {
              if (selectedSpecies) {
                setIsEditingSpecies(true);
                setSpeciesNameModelOpen(true);
              } else {
                setIsEditingSpecies(false);
                openFirstModal();
              }
            }}
          >
            {selectedSpecies ? selectedSpecies.name : t("upload.select_species_name")}
          </div>
          <div
            className="w-[300px] px-4 py-2 border border-[#758C80] cursor-pointer text-sm rounded-md"
            onClick={() => setHabitatModalOpen(true)}
          >
            {selectedHabitat ? selectedHabitat : t("upload.select_habitat_type")}
          </div>
          <button onClick={changelangeuageToKo}>Korean</button>
          <button onClick={changelangeuageToEn}>English</button>
        </div>

        <div className="border-t border-[#758C80] pt-6 mt-6"></div>

        {speciesSelectModelOpen && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setSpeciesSelectModelOpen(false)}
          >
            <div
              className="bg-white rounded-lg p-6 shadow-lg w-[400px] text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">
                {t("upload.select_biological_classification")}
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => openSecondModal("조류")}
                  className="bg-[#6C8372] text-white font-medium py-2 px-4 rounded hover:bg-[#5a7464]"
                >
                  {t("upload.avian")}
                </button>
                <button
                  onClick={() => openSecondModal("포유류")}
                  className="bg-[#6C8372] text-white font-medium py-2 px-4 rounded hover:bg-[#5a7464]"
                >
                  {t("upload.mammalia")}
                </button>
                <button
                  onClick={() => openSecondModal("어류")}
                  className="bg-[#6C8372] text-white font-medium py-2 px-4 rounded hover:bg-[#5a7464]"
                >
                  {t("upload.pisces")}
                </button>
                <button
                  onClick={() => openSecondModal("곤충")}
                  className="bg-[#6C8372] text-white font-medium py-2 px-4 rounded hover:bg-[#5a7464]"
                >
                  {t("upload.insect")}
                </button>
                <button
                  onClick={() => openSecondModal("파충류")}
                  className="bg-[#6C8372] text-white font-medium py-2 px-4 rounded hover:bg-[#5a7464]"
                >
                  {t("upload.reptiles")}
                </button>
                <button
                  onClick={() => openSecondModal("양서류")}
                  className="bg-[#6C8372] text-white font-medium py-2 px-4 rounded hover:bg-[#5a7464]"
                >
                  {t("upload.amphibia")}
                </button>
                <button
                  onClick={() => openSecondModal("거미류")}
                  className="bg-[#6C8372] text-white font-medium py-2 px-4 rounded hover:bg-[#5a7464]"
                >
                  {t("upload.arachnid")}
                </button>
              </div>
            </div>
          </div>
        )}

        {speciesNameModelOpen && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setSpeciesNameModelOpen(false)}
          >
            <div
              className="bg-white rounded-lg p-6 shadow-lg w-[320px] text-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-1 left-1 text-gray-400 text-sm hover:bg-gray-100 hover:text-gray-800 px-2 py-1 rounded"
                onClick={() => {
                  setSpeciesNameModelOpen(false);
                  setSpeciesSelectModelOpen(true);
                }}
              >
                {"< 생물 분류 선택"}
              </button>
              <h3 className="text-lg font-semibold mt-6 mb-4">
                {selectedCategory} 입력
              </h3>
              <input
                type="text"
                placeholder={`${selectedCategory} 이름을 입력하세요`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
              <button
                onClick={closeSecondModal}
                className="bg-[#6C8372] text-white font-medium py-2 px-6 rounded hover:bg-[#5a7464]"
              >
                확인
              </button>
            </div>
          </div>
        )}

        {habitatModalOpen && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setHabitatModalOpen(false)}
          >
            <div
              className="bg-white rounded-lg p-6 shadow-lg w-[300px] text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">
                {t("upload.select_habitat_type")}
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => {
                    setSelectedHabitat("산림/계곡");
                    setHabitatModalOpen(false);
                  }}
                  className="bg-[#6C8372] text-white font-medium py-2 px-4 rounded hover:bg-[#5a7464]"
                >
                  {t("upload.forest/valley")}
                </button>
                <button
                  onClick={() => {
                    setSelectedHabitat("평지숲");
                    setHabitatModalOpen(false);
                  }}
                  className="bg-[#6C8372] text-white font-medium py-2 px-4 rounded hover:bg-[#5a7464]"
                >
                  {t("upload.flat forest")}
                </button>
                <button
                  onClick={() => {
                    setSelectedHabitat("경작지/들판");
                    setHabitatModalOpen(false);
                  }}
                  className="bg-[#6C8372] text-white font-medium py-2 px-4 rounded hover:bg-[#5a7464]"
                >
                  {t("upload.plow/field")}
                </button>
                <button
                  onClick={() => {
                    setSelectedHabitat("동굴");
                    setHabitatModalOpen(false);
                  }}
                  className="bg-[#6C8372] text-white font-medium py-2 px-4 rounded hover:bg-[#5a7464]"
                >
                  {t("upload.cave")}
                </button>
                <button
                  onClick={() => {
                    setSelectedHabitat("해양");
                    setHabitatModalOpen(false);
                  }}
                  className="bg-[#6C8372] text-white font-medium py-2 px-4 rounded hover:bg-[#5a7464]"
                >
                  {t("upload.marine")}
                </button>
                <button
                  onClick={() => {
                    setSelectedHabitat("하천/호수");
                    setHabitatModalOpen(false);
                  }}
                  className="bg-[#6C8372] text-white font-medium py-2 px-4 rounded hover:bg-[#5a7464]"
                >
                  {t("upload.river/lake")}
                </button>
                <button
                  onClick={() => {
                    setSelectedHabitat("습지");
                    setHabitatModalOpen(false);
                  }}
                  className="bg-[#6C8372] text-white font-medium py-2 px-4 rounded hover:bg-[#5a7464]"
                >
                  {t("upload.marsh")}
                </button>
                <button
                  onClick={() => {
                    setSelectedHabitat("거주지역");
                    setHabitatModalOpen(false);
                  }}
                  className="bg-[#6C8372] text-white font-medium py-2 px-4 rounded hover:bg-[#5a7464]"
                >
                  {t("upload.residential district")}
                </button>
                <button
                  onClick={() => {
                    setSelectedHabitat("인공시설");
                    setHabitatModalOpen(false);
                  }}
                  className="bg-[#6C8372] text-white font-medium py-2 px-4 rounded hover:bg-[#5a7464]"
                >
                  {t("upload.artificial facility")}
                </button>
                <button
                  onClick={() => {
                    setSelectedHabitat("기타");
                    setHabitatModalOpen(false);
                  }}
                  className="bg-[#6C8372] text-white font-medium py-2 px-4 rounded hover:bg-[#5a7464]"
                >
                  {t("upload.etc")}
                </button>
              </div>
            </div>
          </div>
        )}

        {kakaoMapOpen && (
          <KakaoMapModal
            onClose={() => setKakaoMapOpen(false)}
            onSelectLocation={handleSelectLocation}
          />
        )}

        <div className="data">
          <div className="text-[#00240A] font-bold text-left text-[20px]">
            {t("upload.register photos, videos, and sounds")}
          </div>
          <div className="flex gap-10 text-xs mb-4 mt-3">
            <div className="flex-1 bg-[#E3EBE7] text-[15px] text-center cursor-pointer rounded py-3 hover:bg-[#5a7464]">
              📷 {t("upload.photos")}
            </div>
            <div className="flex-1 bg-[#E3EBE7] text-[15px] text-center cursor-pointer rounded py-3 hover:bg-[#5a7464]">
              📷 {t("upload.videos")}
            </div>
            <div className="flex-1 bg-[#E3EBE7] text-[15px] text-center cursor-pointer rounded py-3 hover:bg-[#5a7464]">
              🔊 {t("upload.sounds")}
            </div>
          </div>

          <div className="flex gap-10 w-full mt-12">
            <div className="flex-1">
              <UploadBox onFileChange={(files) => {
                console.log("Selected files:", files);
                setPhotoVideoFiles(files);
              }} />
            </div>

            <div className="flex-1 flex flex-col gap-6 px-2">
              <div className="flex flex-col gap-2 text-md text-[#00240A] font-bold">
                <div className="text-[#00240A] font-bold text-left text-[18px]">
                  {t("upload.observation time")}
                </div>
                <div className="flex gap-2">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="yyyy-MM-dd"
                    className="p-2 border border-gray-300 bg-gray-100 rounded text-center w-full"
                  />
                  <select className="p-2 border border-gray-300 bg-gray-100 rounded" onChange={(e) => setHour(Number(e.target.value))}>
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i} 시
                      </option>
                    ))}
                  </select>
                  <select className="p-2 border border-gray-300 bg-gray-100 rounded" onChange={(e) => setMinute(Number(e.target.value))}>
                    {Array.from({ length: 60 }, (_, i) => (
                      <option key={i} value={i}>
                        {i} 분
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col text-[#00240A] font-bold gap-2 text-[15px] w-full">
                <div className="text-[#00240A] font-bold text-left text-[18px]">
                  {t("upload.observation location")}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t("upload.please enter your observation location")}
                    value={selectedLocation}
                    readOnly
                    onClick={() => setKakaoMapOpen(true)}
                    className="p-2 border border-gray-300 bg-gray-100 rounded"
                  />
                  <button
                    className="px-4 py-2 border border-[#6C8372] text-[#6C8372] rounded text-sm"
                    onClick={() => setKakaoMapOpen(true)}
                  >
                    {t("upload.my location")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="text-[#00240A] font-bold text-left text-[20px] mb-2">
            {t("upload.observation notes")}
          </div>
          <textarea
            className="w-full border border-gray-300 p-3 rounded h-24 bg-gray-50"
            value={memoText}
            onChange={(e) => setMemoText(e.target.value)}
          />
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            className="px-6 py-2 bg-[#E3EBE7] text-[#758C80] rounded hover:bg-[#5a7464] hover:text-white"
            onClick={handleObservationSubmit}
          >
            {t("upload.register")}
          </button>
          <button
            className="px-6 py-2 bg-[#E3EBE7] text-[#758C80] rounded hover:bg-[#5a7464] hover:text-white"
            onClick={navigateToMain}
          >
            {t("upload.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
