export interface User {
  id: string;
  role: string;
  // ...其他用户属性
}

export interface LoginCredentials {
  username: string;
  password: string;
}
