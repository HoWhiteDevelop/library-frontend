import axios from "axios";
import { message } from "antd";

const instance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 5000,
});

instance.interceptors.request.use(
  (config) => {
    console.log("发送请求:", config.method, config.url, config.data);
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("请求错误:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default instance;
