
import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {axiosInstance} from "../../../utils/axios";
import "./stylesheet/ImageCanvas.css"; 

const ImageCanvas = () => {
  const { projectId, imageId } = useParams();
  const canvasRef = useRef(null);
  const [imageSrc, setImageSrc] = useState("");
  const [boxes, setBoxes] = useState([]); 
  const [startPos, setStartPos] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/images/${projectId}/${imageId}`);
        if (response.data.url) {
          setImageSrc(`${import.meta.env.VITE_API_URL}/${response.data.url}`);
        }
      } catch (err) {
        console.error("이미지 불러오기 오류:", err);
      }
    };
    fetchImage();
  }, [projectId, imageId]);

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    setStartPos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const handleMouseUp = (e) => {
    if (!startPos) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const endPos = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };

    const newBox = {
      x: (startPos.x + endPos.x) / 2,  
      y: (startPos.y + endPos.y) / 2,
      w: Math.abs(endPos.x - startPos.x),
      h: Math.abs(endPos.y - startPos.y),
      label: "bird"
    };

    setBoxes([...boxes, newBox]);
    setStartPos(null);
  };

  return (
    <div className="canvas-container">
      {imageSrc ? (
        <>
          <img src={imageSrc} className="canvas-image" alt="Labeling" />
          <canvas ref={canvasRef} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}></canvas>
          <button>Save Labels</button>
        </>
      ) : (
        <p className="error-message">이미지를 불러오는 중입니다...</p>
      )}
    </div>
  );
};

export default ImageCanvas;

