import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";
import { login as loginApi } from "../../api/auth";
import { AxiosError } from "axios";

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { username: string; password: string },
    { rejectWithValue }
  ) => {
    console.log("发送登录请求:", credentials);
    try {
      const response = await loginApi(credentials);
      console.log("登录响应:", response);

      const { access_token } = response.data;

      const tokenPayload = JSON.parse(atob(access_token.split(".")[1]));

      return {
        token: access_token,
        user: {
          id: tokenPayload.sub,
          name: tokenPayload.username,
          role: tokenPayload.role,
        },
      };
    } catch (error: unknown) {
      console.error("登录错误:", error);
      const err = error as AxiosError<{ message: string }>;
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error("登录失败");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userAvatar");
    },
    restoreSession: (state) => {
      const token = localStorage.getItem("token");
      const avatar = localStorage.getItem("userAvatar");

      if (token) {
        try {
          const tokenPayload = JSON.parse(atob(token.split(".")[1]));
          state.isAuthenticated = true;
          state.user = {
            id: tokenPayload.sub,
            name: tokenPayload.username,
            role: tokenPayload.role,
            avatar: avatar || undefined,
          };
        } catch (error) {
          localStorage.removeItem("token");
          localStorage.removeItem("userAvatar");
        }
      }
    },
    updateUserAvatar: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.avatar = action.payload;
        localStorage.setItem("userAvatar", action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = {
          ...action.payload.user,
          avatar: localStorage.getItem("userAvatar") || undefined,
        };
        state.loading = false;
        state.error = null;
        localStorage.setItem("token", action.payload.token);
        message.success("登录成功");
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "登录失败";
        message.error(state.error);
      });
  },
});

export const { logout, restoreSession, updateUserAvatar } = authSlice.actions;
export default authSlice.reducer;
