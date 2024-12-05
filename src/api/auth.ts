import axios from "./axios";

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

export const login = (credentials: LoginCredentials) => {
  return axios.post<LoginResponse>("/auth/login", credentials);
};

export const logout = () => {
  return axios.post("/auth/logout");
};

// 第三方登录 URL
export const getOAuthURL = (provider: "github" | "wechat" | "email") => {
  return `${import.meta.env.VITE_API_URL}/auth/${provider}/login`;
};

// 处理 OAuth 回调
export const handleOAuthCallback = (provider: string, code: string) => {
  return axios.get(`/auth/${provider}/callback?code=${code}`);
};
