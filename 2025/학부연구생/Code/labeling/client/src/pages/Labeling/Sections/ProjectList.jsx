import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../utils/axios";
import "./stylesheet/ProjectList.css";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  // 프로젝트 목록 가져오기
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/projects");
        setProjects(response.data);
      } catch (err) {
        console.error("프로젝트 목록 불러오기 오류:", err);
      }
    };
    fetchProjects();
  }, []);

  // 홈으로 이동 버튼
  const handleMoveButton = () => {
    navigate("/");
  };

  // 프로젝트 클릭 시 이동 후 새로고침
  const handleProjectClick = (project) => {
    navigate(`/labeling/${project.id}`, {
      state: { projectName: projectName },
    });
    window.location.reload();
  };

  return (
    <div className="project-list">
      <button onClick={handleMoveButton} className="move-button">
        🏠 홈으로 돌아가기
      </button>
      <h2>📂 프로젝트 목록</h2>
      <ul>
        {projects.map((project) => (
          <li key={project.id} className="project-item" onClick={() => handleProjectClick(project)}>
            {project.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;