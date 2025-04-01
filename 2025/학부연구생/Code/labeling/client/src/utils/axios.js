import axios from "axios";

// 기본 백엔드 (70 서버) API 인스턴스
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (err) => {
    if (err.response?.data === "jwt expired") {
      window.location.reload();
      alert("로그인 기간이 만료되었습니다. 다시 로그인해주세요.");
    }
    return Promise.reject(err);
  }
);

// 추가: GPU 서버와 연동할 별도 인스턴스
const gpuAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_GPU_API_URL, // GPU 서버 (ex. http://10.108.90.21:5174)
});

// 공통 인터셉터 적용 (토큰)
gpuAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export { axiosInstance, gpuAxiosInstance };