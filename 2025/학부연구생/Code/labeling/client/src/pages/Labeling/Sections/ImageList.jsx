import React, { useState } from "react";
import "./stylesheet/ImageList.css";

const ImageList = ({ images, onSelectImage, handleSaveForCurrentImage }) => {
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 (캐러셀 인덱스)
  const imagesPerPage = 5; // 한 번에 표시할 이미지 개수

  const handleClickImage = async (imageId) => {
    await handleSaveForCurrentImage(); // 🔹 현재 라벨 저장
    onSelectImage(imageId); // 🔹 새로운 이미지 선택
  };

  // 현재 페이지에 해당하는 이미지 슬라이싱
  const startIndex = currentPage * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  const visibleImages = images.slice(startIndex, endIndex);

  // 다음 페이지 이동
  const nextPage = () => {
    if (endIndex < images.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // 이전 페이지 이동
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="labeling-image-list">
      {/* 이전 버튼 (첫 페이지에서는 비활성화) */}
      <button className="carousel-button left" onClick={prevPage} disabled={currentPage === 0}>
        ⬅
      </button>

      <div className="image-thumbnails">
        {visibleImages.length > 0 ? (
          visibleImages.map((image) => (
            <div key={image.id} className="thumbnail-container">
              {/* 체크박스 - undefined 방지 */}
              <input
                type="checkbox"
                checked={false}
                readOnly
                className="thumbnail-checkbox"
              />

              {/* 썸네일 클릭 시 이미지 변경 (라벨 저장 후 이동) */}
              <img
                src={`${import.meta.env.VITE_API_URL}/${image.url}`}
                alt={`이미지 ${image.id}`}
                className="thumbnail"
                onClick={() => handleClickImage(image.id)}
              />
            </div>
          ))
        ) : (
          <p>이미지가 없습니다.</p>
        )}
      </div>

      {/* 다음 버튼 (마지막 페이지에서는 비활성화) */}
      <button className="carousel-button right" onClick={nextPage} disabled={endIndex >= images.length}>
        ➡
      </button>
    </div>
  );
};

export default ImageList;