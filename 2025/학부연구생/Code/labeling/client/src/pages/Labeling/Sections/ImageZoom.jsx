import React, { useRef, useState, useEffect } from "react";
import "./stylesheet/ImageZoom.css"; // 스타일 파일 추가

const ImageZoom = ({ src, children }) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // 확대/축소 상태
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // 마우스 휠로 확대/축소
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = 0.1;
    setScale((prev) => Math.min(5, Math.max(0.5, prev - e.deltaY * zoomFactor * 0.01)));
  };

  // 마우스 드래그로 이동
  const handleMouseDown = (e) => {
    setDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("wheel", handleWheel);
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="zoom-container"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="zoom-content"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
        }}
      >
        <img ref={imageRef} src={src} className="zoom-image" alt="Zoomable" />
        {children} {/* 바운딩 박스 등 추가 */}
      </div>
    </div>
  );
};

export default ImageZoom;