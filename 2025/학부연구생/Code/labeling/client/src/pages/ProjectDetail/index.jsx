import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {axiosInstance, gpuAxiosInstance} from "../../utils/axios";
import "./stylesheet/index.css";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // ================================
  // (프로젝트 내 이미지 목록 + 라벨링 상태)
  // ================================
  const [images, setImages] = useState([]);
  const [labelCache, setLabelCache] = useState({});
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [projectName, setProjectName] = useState("")
  const [serverImagePath, setServerImagePath] = useState("");
  const [gpuImages, setGpuImages] = useState([])
  const [folderName, setFolderName] = useState("")
  // *** CHANGED END (A) ***

  // ================================
  // (새로운) 서버 디렉토리 조회용
  // ================================
  // *** CHANGED START (B): 새로운 상태 - 서버 디렉토리 경로, 조회된 파일 목록, 선택된 파일들 ***
  const [serverDirectoryPath, setServerDirectoryPath] = useState("");
  const [directoryFiles, setDirectoryFiles] = useState([]);  
  const [selectedFiles, setSelectedFiles] = useState([]);
  // *** CHANGED END (B) ***

  useEffect(() => {
    const fetchProjectInfo = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/projects/${projectId}`)
        setProjectName(response.data.project_name)
      } catch(err) {
        console.error(err)
      }
    }
    fetchProjectInfo()
  }, [projectId])

  // 프로젝트 내의 이미지 전체 로드(70서버 로컬에 저장된 이미지)
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/images/${projectId}`)
        setImages(response.data)
      } catch(err) {
        console.error(err)
      }
    }
    fetchImages()
  }, [projectId])

  // GPU에서 이미지 업로드
  const fetchGpuImages = async () => {
    if (!folderName.trim()) {
      alert("폴더명을 입력하세요!")
      return;
    }

    try {
      const response = await gpuAxiosInstance.get(`/api/v1/uploads/list-images`, {
        params: { folder: folderName }
      });
      console.log("GPU 이미지 목록:", response.data);
  
      if (response.data.images) {
        setGpuImages(response.data.images);
      } else {
        alert("서버 응답이 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("GPU 이미지 목록 가져오기 오류:", error);
      alert("GPU 이미지 목록 가져오는 중 오류 발생");
    }
  };

  // 디렉토리 내 파일 목록 조회
  const handleDirectoryLookup = async () => {
    if (!serverDirectoryPath) {
      alert("서버 디렉토리 경로를 입력하세요!");
      return;
    }
    try {
      // GET /api/v1/images/list?dir=...
      const response = await axiosInstance.get(
        `/api/v1/images/list?dir=${encodeURIComponent(serverDirectoryPath)}`
      );
      console.log("디렉토리 조회 응답:", response.data);
      if (response.data.files && Array.isArray(response.data.files)) {
        setDirectoryFiles(response.data.files);
      } else {
        alert("서버 응답이 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("서버 디렉토리 조회 중 오류 발생:", error);
      alert("서버 디렉토리 조회 중 오류가 발생했습니다. 콘솔을 확인하세요.");
    }
  };

  // 파일 선택/해제
  const handleToggleFileSelection = (filePath) => {
    setSelectedFiles((prev) => {
      if (prev.includes(filePath)) {
        // 이미 선택되어 있다면 해제
        return prev.filter((fp) => fp !== filePath);
      } else {
        // 미선택 상태 → 새로 추가
        return [...prev, filePath];
      }
    });
  };

  // "전체 선택" 버튼 (디렉토리 목록)
  const handleSelectAllDirectoryFiles = () => {
    // 이미 전부 선택되어 있다면 전부 해제, 아니면 전체 선택
    if (selectedFiles.length === directoryFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(directoryFiles);
    }
  };

  // 선택된 파일들 업로드 (다중)
  const handleDirectoryUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("업로드할 파일을 선택하세요!");
      return;
    }
    try {
      // POST /api/v1/images/:projectId/import-multi
      const response = await axiosInstance.post(
        `/api/v1/images/${projectId}/import-multi`,
        { paths: selectedFiles }
      );
      console.log("서버 응답 (다중 업로드):", response.data);

      if (response.data.images && Array.isArray(response.data.images)) {
        setImages((prev) => [...prev, ...response.data.images]);
        alert("서버 디렉토리 업로드가 완료되었습니다.");
      } else {
        alert("서버 응답이 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("서버 디렉토리 업로드(등록) 중 오류 발생:", error);
      alert("서버 디렉토리 업로드 중 오류가 발생했습니다. 콘솔을 확인하세요.");
    }
  };
  // *** CHANGED END (D) ***

  // ================================
  // 체크박스 핸들러 (프로젝트 내 이미지)
  // ================================
  const handleCheckboxChange = (imageId) => {
    setLabelCache((prev) => ({
      ...prev,
      [imageId]: !prev[imageId],
    }));
  };

  // "전체 선택" 체크박스 (프로젝트 내 이미지)
  const handleSelectAll = () => {
    const newSelectAllState = !selectAllChecked;
    setSelectAllChecked(newSelectAllState);

    const updatedLabelCache = {};
    images.forEach((img) => {
      updatedLabelCache[img.id] = newSelectAllState;
    });
    setLabelCache(updatedLabelCache);
  };

  // 라벨링 페이지로 이동 (선택된 이미지만 라벨링)
  const handleLabeling = () => {
    const selectedImageIds = Object.keys(labelCache).filter((id) => labelCache[id]);
    if (selectedImageIds.length === 0) {
      alert("라벨링할 이미지를 선택하세요!");
      return;
    }
    localStorage.setItem(`project_${projectId}_selectedImages`, JSON.stringify(selectedImageIds));
    navigate(`/labeling/${projectId}`, { state: { selectedImageIds } });
  };

  // ================================
  // 렌더
  // ================================
  return (
    <div className="project-detail-container">
      {/* 상단 헤더 */}
      <div className="header">
        <h2 className="project-title">📁 프로젝트 이름: {projectName}</h2>
        <button className="labeling-button" onClick={handleLabeling}>
          선택된 이미지 라벨링
        </button>
      </div>

      {/* (C) 서버 경로 입력 (단일) */}
      <div className="server-upload-container">
        <input
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="GPU 서버의 폴더명을 입력하세요"
          className="server-path-input"
        />
        <button onClick={fetchGpuImages} className="upload-button">
          📤 폴더 내 이미지 가져오기
        </button>
      </div>
      {gpuImages.length > 0 ? (
        <ul>
          {gpuImages.map((image, index) => (
            <li key={index}>
              <img
                src={`${import.meta.env.VITE_GPU_API_URL}/uploads/${folderName}/${image}`}
                alt={image}
                className="gpu-image-preview"
              />
              <span>{image}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>선택한  폴더에 저장된 이미지가 없습니다.</p>
      )}

      {/* (D) 서버 디렉토리 조회 (다중) */}
      <div className="server-directory-container">
        <input
          type="text"
          value={serverDirectoryPath}
          onChange={(e) => setServerDirectoryPath(e.target.value)}
          placeholder="서버 디렉토리 경로를 입력"
          className="server-path-input"
        />
        <button onClick={handleDirectoryLookup} className="lookup-button">
          📂 서버 디렉토리 조회
        </button>
      </div>

      {/* 조회된 파일 목록 + "전체 선택" + 업로드 버튼 */}
      {directoryFiles.length > 0 && (
        <div className="directory-file-list-container">
          <div className="directory-actions">
            <button onClick={handleSelectAllDirectoryFiles} className="upload-button">
              {selectedFiles.length === directoryFiles.length
                ? "전체 해제"
                : "전체 선택"}
            </button>
            <button onClick={handleDirectoryUpload} className="upload-button">
              ⬆ 선택된 이미지 업로드
            </button>
          </div>

          <div className="directory-file-list">
            {directoryFiles.map((file, idx) => (
              <div
                key={idx}
                className={`directory-file-item ${selectedFiles.includes(file) ? "selected" : ""}`}
                onClick={() => handleToggleFileSelection(file)}
              >
                {file}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 프로젝트 내 이미지 목록: "전체 선택" 체크박스 */}
      <div className="select-all-container">
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={selectAllChecked}
            onChange={handleSelectAll}
          />
          <span className="checkmark"></span> 전체 선택
        </label>
      </div>

      {/* 업로드된 이미지 목록 (프로젝트에 속하는 이미지) */}
      <div className="detail-image-list">
        {images.length > 0 ? (
          images.map((image) => (
            <div
              key={image.id}
              className={`image-item ${labelCache[image.id] ? "labeled" : ""}`}
              onClick={() => handleCheckboxChange(image.id)}
            >
              {/* 체크박스 - 상단 왼쪽 */}
              <input
                type="checkbox"
                className="image-checkbox"
                checked={labelCache[image.id] || false}
                onChange={() => handleCheckboxChange(image.id)}
                onClick={(e) => e.stopPropagation()} // 클릭 이벤트 전파 방지
              />

              {/* 이미지 미리보기 */}
              <img
                src={`${import.meta.env.VITE_API_URL}${
                  image.url.startsWith("/") ? image.url : "/" + image.url
                }`}
                alt={image.name}
                className="image-preview"
              />
              <span className="image-name">{image.name}</span>
            </div>
          ))
        ) : (
          <p className="no-images">업로드된 이미지가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
