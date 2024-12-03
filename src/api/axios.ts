import axios from "axios";
import { message } from "antd";
import { store } from "../store";
import { logout } from "../store/slices/authSlice";

const instance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 5000,
});

instance.interceptors.request.use(
  (config) => {
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
    if (error.response?.status === 401) {
      store.dispatch(logout());
      message.error("登录已过期，请重新登录");
    }
    return Promise.reject(error);
  }
);

export default instance;
