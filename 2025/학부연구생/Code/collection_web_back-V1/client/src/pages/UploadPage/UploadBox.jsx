// UploadBox.jsx
import React, { useState } from "react";

const UploadBox = ({ onFileChange }) => {
  const [previewList, setPreviewList] = useState([]);

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    // 선택한 파일 배열 전체를 상위에 전달
    onFileChange?.(fileArray);
    console.log("Selected files:", fileArray);

    // 각 파일에 대해 미리보기를 생성
    const previews = fileArray.map((file) => {
      if (file.type.startsWith("image/")) {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({ preview: reader.result, type: "image", name: file.name });
          };
          reader.readAsDataURL(file);
        });
      } else if (file.type.startsWith("video/")) {
        const videoUrl = URL.createObjectURL(file);
        return Promise.resolve({ preview: videoUrl, type: "video", name: file.name });
      } else if (file.type.startsWith("audio/")) {
        const audioUrl = URL.createObjectURL(file);
        return Promise.resolve({ preview: audioUrl, type: "audio", name: file.name });
      } else {
        return Promise.resolve(null);
      }
    });

    Promise.all(previews).then((results) => {
      // null이 아닌 값만 저장
      setPreviewList(results.filter((item) => item));
    });
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      handleFiles(event.dataTransfer.files);
    }
  };

  const handleDragOver = (event) => event.preventDefault();

  const handleChangeFile = (event) => {
    if (event.target.files) {
      handleFiles(event.target.files);
    }
  };

  return (
    <div>
      <label
        className="w-[250px] h-[250px] border-2 text-[#E3EBE7] text-center flex flex-col justify-center items-center text-xs cursor-pointer mx-auto rounded"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input type="file" className="hidden" multiple onChange={handleChangeFile} />
        <div className="dropZoneContent">
          <p className="text-[#E3EBE7] text-[70px]">+</p>
          <p className="text-[#758C80]">업로드.여기에 파일을 끌어다 놓으세요</p>
          <p className="text-[#758C80]">업로드하거나 + 버튼을 클릭하세요</p>
        </div>
      </label>

      {/* 미리보기 목록 */}
      <div className="flex flex-wrap justify-center mt-4">
        {previewList.map((item, idx) => (
          <div key={idx} className="m-1 flex flex-col items-center">
            {item.type === "image" && (
              <img src={item.preview} alt={item.name} className="w-[80px] h-[80px]" />
            )}
            {item.type === "video" && (
              <video src={item.preview} controls className="w-[80px] h-[80px]" />
            )}
            {item.type === "audio" && (
              <audio controls style={{ width: "160px" }}>
                <source src={item.preview} type="audio/*" />
                귀하의 브라우저는 오디오 요소를 지원하지 않습니다.
              </audio>
            )}
            <p className="text-xs mt-1">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadBox;
