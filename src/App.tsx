import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { restoreSession } from "./store/slices/authSlice";

// 页面组件导入
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BookRecommend from "./pages/BookRecommend";
import BookBorrow from "./pages/BookBorrow";
import BookManagement from "./pages/BookManagement";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";

// 类型定义
interface RootState {
  auth: {
    isAuthenticated: boolean;
    user: {
      role: string;
    } | null;
  };
}

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  // 添加初始化逻辑
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1890ff",
          borderRadius: 4,
        },
      }}
      locale={zhCN}
    >
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              !isAuthenticated ? <Login /> : <Navigate to="/dashboard" />
            }
          />

          <Route element={<Layout />}>
            {/* 需要认证的路由 */}
            <Route
              element={<ProtectedRoute isAuthenticated={isAuthenticated} />}
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />

              {/* 读者路由 */}
              <Route path="/books/recommend" element={<BookRecommend />} />
              <Route path="/books/borrow" element={<BookBorrow />} />

              {/* 管理员路由 */}
              <Route
                element={
                  <ProtectedRoute
                    isAuthenticated={isAuthenticated}
                    requiredRole="admin"
                    userRole={user?.role}
                  />
                }
              >
                <Route path="/books/management" element={<BookManagement />} />
                <Route path="/reports/*" element={<Reports />} />
              </Route>
            </Route>
          </Route>

          {/* 默认路由重定向 */}
          <Route
            path="/"
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
            }
          />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
