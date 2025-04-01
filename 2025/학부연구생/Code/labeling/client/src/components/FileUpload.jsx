import React from "react";
import Dropzone from "react-dropzone";
import {axiosInstance} from "../utils/axios";
import { BsImages } from "react-icons/bs";
import { TiDelete } from "react-icons/ti";

const FileUpload = ({ handleImagesSave, images }) => {
  // 드래그 앤 드롭 이미지 여러 장 한 번에 올리기 가능
  const handleDrop = async (acceptedFiles) => {
    if (images.length + acceptedFiles.length > 10) {
      alert("이미지는 최대 10장까지 업로드 가능합니다.");
      return;
    }

    const newImages = [];
    for (let file of acceptedFiles) {
      let formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axiosInstance.post("/api/v1/products/image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        newImages.push(response.data.fileName);
      } catch (err) {
        console.error(err);
      }
    }
    handleImagesSave([...images, ...newImages]);
  };

  // 이미지 삭제 함수
  const handleDelete = async (image) => {
    const updatedImages = images.filter((img) => img !== image);
    handleImagesSave(updatedImages);
  };

  return (
    <div>
      <Dropzone onDrop={handleDrop} multiple>
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            style={{
              border: "1px solid lightgray",
              padding: "10px",
              cursor: "pointer",
              borderRadius: "10px",
              width: "250px",
              height: "250px",
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <input {...getInputProps()} />
            <BsImages
              style={{
                width: "40%",
                height: "40%",
                color: "lightgray",
              }}
            />
          </div>
        )}
      </Dropzone>

      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}>
        {images.map((image) => (
          <div
            key={image}
            style={{
              position: "relative",
              width: "146px",
              height: "146px",
              marginTop: "10px",
              marginRight: "10px",
              border: "1px dashed gray",
              borderRadius: "5px",
              cursor: "pointer",
              overflow: "hidden",
            }}
          >
            <img
              src={images ? `${process.env.REACT_APP_BASE_URL}/${image}` : []}
              alt={image}
              style={{ width: "100%", height: "100%" }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation(); // 클릭 이벤트 버블링 방지
                handleDelete(image);
              }}
              style={{
                position: "absolute",
                top: "1px",
                right: "1px",
                border: "none",
                borderRadius: "50%",
                color: "white",
                cursor: "pointer",
              }}
            >
              <TiDelete size={25} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUpload;