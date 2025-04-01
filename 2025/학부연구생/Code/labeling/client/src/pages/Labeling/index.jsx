import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { axiosInstance } from "../../utils/axios"; // named export로 수정됨
import ProjectList from "./Sections/ProjectList";
import ImageList from "./Sections/ImageList";
import LabelList from "./Sections/LabelList";
import "./stylesheet/index.css";
import { v4 as uuidv4 } from 'uuid';

const Labeling = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const selectedImageIdsFromState = location.state?.selectedImageIds || [];

  const [selectedImageIds, setSelectedImageIds] = useState(selectedImageIdsFromState);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 표시중인 이미지 인덱스
  const [boundingBoxes, setBoundingBoxes] = useState([]); // 현재 이미지의 Bounding Box 목록
  const [selectedBox, setSelectedBox] = useState(null); // 선택된 Bounding Box 인덱스
  const [startPos, setStartPos] = useState(null); // 박스 그리기/이동/리사이즈 관련 시작 위치
  const [draggingBox, setDraggingBox] = useState(null); // 드래그하여 생성 중인 Bounding Box
  const [moving, setMoving] = useState(false); // Bounding Box 이동 여부
  const [resizing, setResizing] = useState(false); // 리사이즈 여부
  const [resizeDirection, setResizeDirection] = useState(null);

  // 확대/축소
  const [scale, setScale] = useState(1);
  const zoomIn = () => setScale(prev => Math.min(prev + 0.1, 2)); // 최대 200%
  const zoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5)); // 최소 50%

  // panning 관련 상태
  const [isPanMode, setIsPanMode] = useState(false); // false: bounding box 모드, true: panning 모드
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState(null);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const [projectName, setProjectName] = useState("");
  const containerRef = useRef(null);
  const currentImage = images.length > 0 ? images[currentIndex] : null;

  // *** 검수(inspection) 상태 (0: 미검수, 1: 검수) ***
  const [inspection, setInspection] = useState(0);

  // 좌우 패널 보이기/숨기기
  const [showSidePanels, setShowSidePanels] = useState(true);

  // *** (Custom Class Map) ***
  const [classMap, setClassMap] = useState(() => {
    const stored = localStorage.getItem(`project_${projectId}_classMap`);
    return stored ? JSON.parse(stored) : [];
  });
  const [defaultClass, setDefaultClass] = useState(() => {
    return classMap.length > 0 ? classMap[0].id : 0;
  });

  const addClass = (name) => {
    const newClass = { id: classMap.length, name };
    const newMap = [...classMap, newClass];
    setClassMap(newMap);
    localStorage.setItem(`project_${projectId}_classMap`, JSON.stringify(newMap));
    if (classMap.length === 0) setDefaultClass(newClass.id);
  };

  const removeClass = (idToRemove) => {
    const newMap = classMap.filter((cls) => cls.id !== idToRemove)
      .map((cls, index) => ({ id: index, name: cls.name }));
    setClassMap(newMap);
    localStorage.setItem(`project_${projectId}_classMap`, JSON.stringify(newMap));
    setDefaultClass(newMap.length > 0 ? newMap[0].id : 0);
  };

  const updateSelectedBoxClass = (newClassId) => {
    if (selectedBox === null) return;
    setBoundingBoxes((prev) =>
      prev.map((box, i) =>
        i === selectedBox ? { ...box, class_id: newClassId } : box
      )
    );
  };

  // 숫자 키 입력 시 박스 class_id 변경
  useEffect(() => {
    const handleNumberKey = (e) => {
      if (selectedBox !== null && /^[0-9]$/.test(e.key)) {
        updateSelectedBoxClass(parseInt(e.key, 10));
      }
    };
    window.addEventListener("keydown", handleNumberKey);
    return () => window.removeEventListener("keydown", handleNumberKey);
  }, [selectedBox]);

  // "-" / "=" / "+" 단축키로 zoom in/out
  useEffect(() => {
    const handleZoomKey = (e) => {
      if (e.key === '-') {
        zoomOut();
      } else if (e.key === '=' || e.key === '+') {
        zoomIn();
      }
    };
    window.addEventListener("keydown", handleZoomKey);
    return () => window.removeEventListener("keydown", handleZoomKey);
  }, []);

  // 화살표 키로 이전/다음 이미지 이동
  const goPrev = async () => {
    if (!currentImage) return;
    // 이동 전 라벨과 검수 상태 저장
    await handleSaveForCurrentImage();
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goNext = async () => {
    if (!currentImage) return;
    await handleSaveForCurrentImage();
    setCurrentIndex((prev) => Math.min(images.length - 1, prev + 1));
  };

  useEffect(() => {
    const handleArrowKey = (e) => {
      if (e.key === "ArrowLeft") {
        goPrev();
      } else if (e.key === "ArrowRight") {
        goNext();
      }
    };
    window.addEventListener("keydown", handleArrowKey);
    return () => window.removeEventListener("keydown", handleArrowKey);
  }, [currentImage, images]);

  // 컨트롤 키를 눌러 모드 토글 (bounding box 모드 <-> panning 모드)
  useEffect(() => {
    const handleToggleMode = (e) => {
      if (e.key === "Control" && !e.repeat) {
        setIsPanMode((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleToggleMode);
    return () => window.removeEventListener("keydown", handleToggleMode);
  }, []);

  // 프로젝트 내 이미지 불러오기
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/projects/${projectId}`);
        if (response.data && Array.isArray(response.data.images)) {
          setImages(
            selectedImageIds.length > 0
              ? response.data.images.filter((img) =>
                  selectedImageIds.includes(String(img.id))
                )
              : response.data.images
          );
        } else {
          setImages([]);
        }
        if (response.data.project_name) {
          setProjectName(response.data.project_name);
        }
      } catch (err) {
        console.error("이미지 목록 불러오기 오류:", err);
      }
    };
    fetchImages();
  }, [projectId, selectedImageIds]);

  // Bounding Box 데이터 + 검수 상태 불러오기
  const fetchLabels = async (imageId) => {
    try {
      const response = await axiosInstance.get(`/api/v1/labels/${imageId}`);
      if (response.data.inspection !== undefined) {
        setInspection(response.data.inspection);
      } else {
        setInspection(0);
      }
      if (response.data.labels && response.data.labels.length > 0) {
        setBoundingBoxes(
          response.data.labels.map((label) => ({
            id: Math.random(),
            class_id: label.class_id,
            x: label.x_center * 800 - (label.width * 800) / 2,
            y: label.y_center * 600 - (label.height * 600) / 2,
            width: label.width * 800,
            height: label.height * 600,
          }))
        );
      } else {
        console.warn("해당 이미지의 라벨 파일이 없습니다.");
        setBoundingBoxes([]);
      }
    } catch (error) {
      console.error("라벨 데이터 불러오기 실패:", error);
      setInspection(0);
      setBoundingBoxes([]);
    }
  };

  useEffect(() => {
    if (currentImage) {
      fetchLabels(currentImage.id);
    } else {
      setBoundingBoxes([]);
      setInspection(0);
    }
  }, [currentImage]);

  // Bounding Box 삭제하기
  useEffect(() => {
    const handleDeleteKey = (e) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedBox !== null) {
        setBoundingBoxes((prev) => prev.filter((_, i) => i !== selectedBox));
        setSelectedBox(null);
      }
    };
    window.addEventListener("keydown", handleDeleteKey);
    return () => window.removeEventListener("keydown", handleDeleteKey);
  }, [selectedBox]);

  // 개별 저장 여부 (예: 검수)
  const [individualSaveMap, setIndividualSaveMap] = useState({});
  useEffect(() => {
    if (images.length > 0) {
      const initMap = {};
      images.forEach((img) => {
        if (!(img.id in individualSaveMap)) {
          initMap[img.id] = false;
        }
      });
      setIndividualSaveMap((prev) => ({ ...prev, ...initMap }));
    }
  }, [images]);
  const toggleIndividualSave = () => {
    if (!currentImage) return;
    setIndividualSaveMap((prev) => ({
      ...prev,
      [currentImage.id]: !prev[currentImage.id],
    }));
  };

  // 좌표 보정(스크린 좌표 -> 이미지 좌표)
  const getAdjustedMousePos = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - panOffset.x) / scale;
    const y = (e.clientY - rect.top - panOffset.y) / scale;
    return { x, y };
  };

  // 마우스 이벤트 처리 (panning / bounding box 모드)
  const handleMouseDown = (e) => {
    if (!containerRef.current) return;
    e.preventDefault();

    if (isPanMode) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      return;
    }

    const { x, y } = getAdjustedMousePos(e);
    if (e.target.classList.contains("resize-handle")) {
      setResizing(true);
      setResizeDirection(e.target.dataset.direction);
      setStartPos({ x, y });
      boundingBoxes.forEach((box, i) => {
        if (x >= box.x && x <= box.x + box.width && y >= box.y && y <= box.y + box.height) {
          setSelectedBox(i);
        }
      });
      return;
    }
    let boxSelected = false;
    boundingBoxes.forEach((box, i) => {
      if (x >= box.x && x <= box.x + box.width && y >= box.y && y <= box.y + box.height) {
        setSelectedBox(i);
        setMoving(true);
        setStartPos({ x, y });
        boxSelected = true;
      }
    });
    if (!boxSelected) {
      setSelectedBox(null);
      setStartPos({ x, y });
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      setPanStart({ x: e.clientX, y: e.clientY });
      return;
    }
    if (!startPos || !containerRef.current) return;
    const { x, y } = getAdjustedMousePos(e);
    if (moving && selectedBox !== null) {
      setBoundingBoxes((prev) =>
        prev.map((box, i) =>
          i === selectedBox
            ? { ...box, x: box.x + (x - startPos.x), y: box.y + (y - startPos.y) }
            : box
        )
      );
      setStartPos({ x, y });
    } else if (resizing && selectedBox !== null) {
      setBoundingBoxes((prev) =>
        prev.map((box, i) => {
          if (i !== selectedBox) return box;
          let newBox = { ...box };
          if (resizeDirection.includes("right")) {
            newBox.width = Math.max(10, x - box.x);
          }
          if (resizeDirection.includes("bottom")) {
            newBox.height = Math.max(10, y - box.y);
          }
          if (resizeDirection.includes("left")) {
            const newWidth = box.width + (box.x - x);
            if (newWidth > 10) {
              newBox.x = x;
              newBox.width = newWidth;
            }
          }
          if (resizeDirection.includes("top")) {
            const newHeight = box.height + (box.y - y);
            if (newHeight > 10) {
              newBox.y = y;
              newBox.height = newHeight;
            }
          }
          return newBox;
        })
      );
      setStartPos({ x, y });
    } else {
      setDraggingBox({
        id: uuidv4(),
        class_id: defaultClass,
        x: Math.min(startPos.x, x),
        y: Math.min(startPos.y, y),
        width: Math.abs(startPos.x - x),
        height: Math.abs(startPos.y - y),
      });
    }
  };

  const handleMouseUp = (e) => {
    if (isPanning) {
      setIsPanning(false);
      setPanStart(null);
      return;
    }
    if (!startPos) return;
    if (moving) {
      setMoving(false);
    } else if (resizing) {
      setResizing(false);
      setResizeDirection(null);
    } else if (draggingBox) {
      setBoundingBoxes((prev) => [...prev, draggingBox]);
      setDraggingBox(null);
    }
    setStartPos(null);
  };

  // 라벨 저장은 /upload 엔드포인트를 호출 (파일의 검수 상태는 별도 업데이트)
  const handleSaveForCurrentImage = async () => {
    if (!currentImage) return;
    const imageId = currentImage.id;
    const cw = 800;
    const ch = 600;

    const labelData = boundingBoxes.map((box) => ({
      class_id: box.class_id,
      x_center: ((box.x + box.width / 2) / cw).toFixed(6),
      y_center: ((box.y + box.height / 2) / ch).toFixed(6),
      width: (box.width / cw).toFixed(6),
      height: (box.height / ch).toFixed(6),
    }));

    try {
      await axiosInstance.post("/api/v1/labels/upload", {
        project_id: projectId,
        image_id: imageId,
        labels: labelData,
      });
      console.log(`이미지 ${imageId} 라벨 저장 완료`);
    } catch (err) {
      console.error(err);
    }
  };

  // 전체 저장 후 종료
  const handleSaveAndExit = async () => {
    if (!images.length) return;
    const results = await Promise.all(
      images.map(async (image) => {
        const imageId = image.id;
        const cw = 800;
        const ch = 600;
        const labelData = boundingBoxes.map((box) => ({
          class_id: box.class_id,
          x_center: ((box.x + box.width / 2) / cw).toFixed(6),
          y_center: ((box.y + box.height / 2) / ch).toFixed(6),
          width: (box.width / cw).toFixed(6),
          height: (box.height / ch).toFixed(6),
        }));
        try {
          await axiosInstance.post("/api/v1/labels/upload", {
            project_id: projectId,
            image_id: imageId,
            labels: labelData,
          });
          return { imageId, success: true };
        } catch (err) {
          console.error(`이미지 ${imageId} 저장 오류:`, err);
          return { imageId, success: false };
        }
      })
    );
    const failed = results.filter((r) => !r.success);
    if (failed.length === 0) {
      alert("모든 라벨 데이터가 정상적으로 저장되었습니다.");
    } else {
      alert(`일부 라벨 저장 실패 (${failed.length}개 이미지). 콘솔을 확인하세요.`);
    }
  };

  // 검수 상태 업데이트 전용 API 호출 (새로운 엔드포인트 사용)
  const updateInspectionOnServer = async (newVal) => {
    if (!currentImage) return;
    try {
      await axiosInstance.patch("/api/v1/labels/update-inspection", {
        image_id: currentImage.id,
        inspection: newVal,
      });
      console.log(`이미지 ${currentImage.id} 검수 상태 업데이트 완료: ${newVal}`);
    } catch (error) {
      console.error("검수 상태 업데이트 실패:", error);
    }
  };

  // 검수 버튼 동작: 검수 상태 토글 후 별도 API 호출
  const toggleInspection = async () => {
    const newVal = inspection === 0 ? 1 : 0;
    setInspection(newVal);
    await updateInspectionOnServer(newVal);
  };

  // 라벨 파일 내용 문자열 생성 함수
  const getLabelFileContent = () => {
    const cw = 800, ch = 600;
    let content = `${inspection}\n`;
    boundingBoxes.forEach((box) => {
      const x_center = ((box.x + box.width / 2) / cw).toFixed(6);
      const y_center = ((box.y + box.height / 2) / ch).toFixed(6);
      const width = (box.width / cw).toFixed(6);
      const height = (box.height / ch).toFixed(6);
      content += `${box.class_id} ${x_center} ${y_center} ${width} ${height}\n`;
    });
    return content;
  };

  // 라벨 파일 내용 모달 상태 및 핸들러
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [labelFileContent, setLabelFileContent] = useState("");
  const handleOpenLabelModal = () => {
    const content = getLabelFileContent();
    setLabelFileContent(content);
    setIsLabelModalOpen(true);
  };

  return (
    <div
      className="labeling-container"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh", // 전체 화면 높이를 차지하도록
        overflow: "hidden",
      }}
    >
      {/* 상단: 사이드 패널 토글 버튼 + 프로젝트명 + 검수 상태 표시 + 검수 버튼 */}
      <div
        style={{
          height: "40px",
          display: "flex",
          alignItems: "center",
          padding: "0 8px",
          background: "#f2f2f2",
        }}
      >
        <button onClick={() => setShowSidePanels((prev) => !prev)}>
          {showSidePanels ? "양쪽 숨기기" : "양쪽 보이기"}
        </button>
        <div style={{ marginLeft: "10px", fontWeight: "bold" }}>
          {projectName ? `프로젝트: ${projectName}` : "프로젝트 선택됨"}
        </div>
        <div style={{ marginLeft: "10px" }}>
          현재 상태: <b>{inspection === 0 ? "미검수" : "검수"}</b>
        </div>
        <button
          onClick={toggleInspection}
          style={{ marginLeft: "auto", marginRight: "10px" }}
        >
          {inspection === 0 ? "검수" : "검수 취소"}
        </button>
      </div>

      {/* 하단: 메인 레이아웃 (좌측 패널 + 중앙 영역 + 우측 패널) */}
      <div
        className="main-layout"
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* 좌측 패널 */}
        {showSidePanels && (
          <div
            style={{
              width: "220px",
              minWidth: "220px",
              flexShrink: 0,
              borderRight: "1px solid #ccc",
              overflowY: "auto",
            }}
          >
            <ProjectList projectName={projectName} />
          </div>
        )}

        {/* 중앙 이미지 영역 */}
        <div
          className="center-panel"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflow: "auto",
          }}
        >
          <div className="image-section" style={{ padding: "10px" }}>
            <div className="zoom-controls" style={{ marginBottom: "10px" }}>
              <button onClick={zoomOut}>Zoom Out</button>
              <span> {Math.round(scale * 100)}% </span>
              <button onClick={zoomIn}>Zoom In</button>
            </div>

            {/* 실제 이미지/박스 컨테이너 */}
            <div
              ref={containerRef}
              className="image-container"
              style={{
                width: "100%",
                height: "600px",
                overflow: "auto",
                position: "relative",
                background: "#fafafa",
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <div
                className="image-inner-wrapper"
                style={{
                  width: "800px",
                  height: "600px",
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${scale})`,
                  transformOrigin: "center",
                  position: "relative",
                  margin: "0 auto",
                  border: "1px solid #ddd",
                  background: "#fff",
                }}
              >
                {currentImage && (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/${currentImage.url}`}
                    alt="Labeling"
                    style={{
                      pointerEvents: "none",
                      width: "800px",
                      height: "600px",
                    }}
                  />
                )}

                {boundingBoxes.map((box, index) => (
                  <div
                    key={index}
                    className={`bounding-box ${selectedBox === index ? "selected" : ""}`}
                    style={{
                      position: "absolute",
                      border:
                        selectedBox === index
                          ? "2px solid red"
                          : "2px solid #00bfff",
                      left: `${box.x}px`,
                      top: `${box.y}px`,
                      width: `${box.width}px`,
                      height: `${box.height}px`,
                    }}
                    onClick={() => setSelectedBox(index)}
                  >
                    <span
                      className="box-label"
                      style={{ background: "rgba(255,255,255,0.7)" }}
                    >
                      Class: {box.class_id}
                    </span>
                    <div
                      className="resize-handle top-left"
                      data-direction="top-left"
                    ></div>
                    <div
                      className="resize-handle top-right"
                      data-direction="top-right"
                    ></div>
                    <div
                      className="resize-handle bottom-left"
                      data-direction="bottom-left"
                    ></div>
                    <div
                      className="resize-handle bottom-right"
                      data-direction="bottom-right"
                    ></div>
                  </div>
                ))}

                {draggingBox && (
                  <div
                    className="bounding-box"
                    style={{
                      position: "absolute",
                      border: "2px dashed red",
                      left: `${draggingBox.x}px`,
                      top: `${draggingBox.y}px`,
                      width: `${draggingBox.width}px`,
                      height: `${draggingBox.height}px`,
                    }}
                  />
                )}
              </div>
            </div>

            {/* 하단: 썸네일 및 이전/다음 버튼 */}
            <div className="bottom-panel" style={{ marginTop: "10px" }}>
              <div className="image-list-wrapper">
                <ImageList
                  images={images}
                  onSelectImage={(imageId) => {
                    handleSaveForCurrentImage().then(() => {
                      const idx = images.findIndex((img) => img.id === imageId);
                      if (idx !== -1) setCurrentIndex(idx);
                    });
                  }}
                  handleSaveForCurrentImage={handleSaveForCurrentImage}
                />
              </div>
              <div className="image-navigation" style={{ marginTop: "10px" }}>
                <button onClick={goPrev}>⬅ 이전</button>
                <span style={{ margin: "0 10px" }}>
                  {currentIndex + 1} / {images.length}
                </span>
                <button onClick={goNext}>다음 ➡</button>
              </div>
            </div>
          </div>
        </div>

        {/* 우측 패널 */}
        {showSidePanels && (
          <div
            style={{
              width: "270px",
              minWidth: "270px",
              flexShrink: 0,
              borderLeft: "1px solid #ccc",
              overflowY: "auto",
            }}
          >
            {/* 우측 패널 상단: 라벨 파일 내용 보기 버튼 */}
            <div style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>
              <button
                onClick={() => {
                  const content = getLabelFileContent();
                  setLabelFileContent(content);
                  setIsLabelModalOpen(true);
                }}
                style={{ width: "100%" }}
              >
                라벨 파일 내용 보기
              </button>
            </div>
            {/* 클래스 토글 섹션 */}
            <div style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>
              <div style={{ marginBottom: "4px", fontWeight: "bold" }}>클래스 선택</div>
              {classMap.map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => setDefaultClass(cls.id)}
                  style={{
                    marginRight: "4px",
                    marginBottom: "4px",
                    background: defaultClass === cls.id ? "#00bfff" : "#f2f2f2",
                    border: "1px solid #ccc",
                    padding: "4px 8px",
                    cursor: "pointer",
                  }}
                >
                  {cls.name}
                </button>
              ))}
            </div>
            <LabelList
              boundingBoxes={boundingBoxes}
              deleteBox={(index) =>
                setBoundingBoxes((prev) => prev.filter((_, i) => i !== index))
              }
              classMap={classMap}
              addClass={addClass}
              removeClass={removeClass}
              handleSaveAndExit={handleSaveAndExit}
            />
          </div>
        )}
      </div>

      {/* 라벨 파일 내용 모달 (팝업) */}
      {isLabelModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setIsLabelModalOpen(false)}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "4px",
              maxWidth: "90%",
              maxHeight: "90%",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>라벨 파일 내용</h3>
            <pre style={{ whiteSpace: "pre-wrap" }}>{labelFileContent}</pre>
            <button onClick={() => setIsLabelModalOpen(false)} style={{ marginTop: "10px" }}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Labeling;
