// components/ImageCanvas.jsx (새로 생성)
import React, { useRef, useState } from 'react';

const ImageCanvas = ({ image }) => {
  const canvasRef = useRef(null);
  const [boxes, setBoxes] = useState([]); // 라벨링 박스 목록
  const [startPos, setStartPos] = useState(null);

  // 마우스 다운 → 드래그 시작
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    setStartPos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  // 마우스 업 → 드래그 끝
  const handleMouseUp = (e) => {
    if (!startPos) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const endPos = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };

    const newBox = {
      x: (startPos.x + endPos.x) / 2,  // YOLO txt 형식 중심 좌표
      y: (startPos.y + endPos.y) / 2,
      w: Math.abs(endPos.x - startPos.x),
      h: Math.abs(endPos.y - startPos.y),
      label: "bird" // 기본 클래스 (추후 선택 가능)
    };

    setBoxes([...boxes, newBox]);
    setStartPos(null);
  };

  // 저장 버튼 클릭 시 YOLO txt 형식으로 변환
  const saveLabels = () => {
    const txtData = boxes.map(b => `${b.label} ${b.x} ${b.y} ${b.w} ${b.h}`).join('\n');
    console.log(txtData);
  };

  return (
    <div>
      <canvas ref={canvasRef} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}></canvas>
      <button onClick={saveLabels}>Save Labels</button>
    </div>
  );
};

export default ImageCanvas;
