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
