import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utils/axios";
import "./stylesheet/index.css";

const Main = () => {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const navigate = useNavigate();

  // 백엔드에서 프로젝트 목록 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/projects");
        setProjects(response.data);
      } catch (err) {
        console.error("프로젝트 목록 가져오기 오류:", err);
      }
    };
    fetchData();
  }, []);

  // 프로젝트 생성 요청
  const handleCreateProject = async () => {
    try {
      const response = await axiosInstance.post(`/api/v1/projects`, { name: projectName });
      setProjects([...projects, response.data]); // 새로운 프로젝트 추가
      setProjectName(""); // 입력 필드 초기화
    } catch (error) {
      console.error("프로젝트 생성 중 오류 발생:", error);
    }
  };

  // 프로젝트 삭제 요청
  const handleDeleteProject = async (projectId) => {
    const confirmDelete = window.confirm("정말로 이 프로젝트를 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/api/v1/projects/${projectId}`);
      setProjects(projects.filter((project) => project.id !== projectId)); // 목록에서 제거
    } catch (error) {
      console.error("프로젝트 삭제 중 오류 발생:", error);
    }
  };

  // 프로젝트 상세 페이지 이동
  const handleProjectDetail = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  // 라벨링 페이지 이동 (바로 라벨링 버튼)
  const handleDirectLabeling = (project) => {
    navigate(`/labeling/${project.id}`, {
      state: { projectName: project.name },
    });
  };

  return (
    <div className="main-container">
      <h2 className="main-title">📂 프로젝트 관리</h2>

      {/* 프로젝트 생성 */}
      <div className="project-create">
        <input
          type="text"
          placeholder="새 프로젝트 이름 입력"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="project-input"
        />
        <button onClick={handleCreateProject} className="create-button">
          ➕ 프로젝트 추가
        </button>
      </div>

      {/* 프로젝트 목록 */}
      <div className="project-list">
        {projects.length > 0 ? (
          <table className="project-table">
            <thead>
              <tr>
                <th>프로젝트 이름</th>
                <th>생성 시간</th>
                <th>상태</th>
                <th>🔄 라벨링</th>
                <th>🗑️ 삭제</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="project-row">
                  {/* 프로젝트 상세 페이지로 이동 */}
                  <td onClick={() => handleProjectDetail(project.id)}>
                    {project.name}
                  </td>

                  {/* 생성 시간 */}
                  <td onClick={() => handleProjectDetail(project.id)}>
                    {project.created_at}
                  </td>

                  {/* 상태 (is_completed 여부) */}
                  <td
                    onClick={() => handleProjectDetail(project.id)}
                    className={project.is_completed ? "status-completed" : "status-inprogress"}
                  >
                    {project.is_completed ? "✅ 완료" : "⏳ 진행 중"}
                  </td>

                  {/* 🔄 바로 라벨링 버튼 */}
                  <td>
                    <button
                      className="labeling-button"
                      onClick={() => handleDirectLabeling(project)}
                    >
                      라벨링 페이지 이동
                    </button>
                  </td>

                  {/* 삭제 버튼 */}
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      🗑️ 삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-projects">현재 생성된 프로젝트가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default Main;