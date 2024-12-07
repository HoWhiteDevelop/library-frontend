import { useEffect, useState, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ConfigProvider, App as AntApp } from "antd";
import zhCN from "antd/locale/zh_CN";
import styled from "styled-components";
import SideNavbar from "./components/SideNavbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { restoreSession } from "./store/slices/authSlice";
import PageLoading from "./components/PageLoading";
import TopNavbar from "./components/TopNavbar";
import LoadingScreen from "./components/LoadingScreen";

// 页面组件导入
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const BookRecommend = lazy(() => import("./pages/BookRecommend"));
const BookBorrow = lazy(() => import("./pages/BookBorrow"));
const BookManagement = lazy(() => import("./pages/BookManagement"));
const Reports = lazy(() => import("./pages/Reports"));
const Profile = lazy(() => import("./pages/Profile"));
const OAuthCallback = lazy(() => import("./pages/OAuthCallback"));
// import BookUpload from "./pages/BookUpload";
// import Statistics from "./pages/Statistics";

// 类型定义
interface RootState {
  auth: {
    isAuthenticated: boolean;
    user: {
      role: string;
    } | null;
  };
}

const AppLayout = styled.div`
  min-height: 100vh;
  display: flex;
`;

const MainContent = styled.div<{ $hasNavbar: boolean }>`
  flex: 1;
  margin-left: ${(props) => (props.$hasNavbar ? "240px" : "0")};
  transition: margin 0.3s ease;
  display: flex;
  flex-direction: column;

  &.collapsed {
    margin-left: ${(props) => (props.$hasNavbar ? "80px" : "0")};
  }
`;

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const [collapsed, setCollapsed] = useState(false);

  // 添加初始化逻辑
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  // 在合适的时机预加载
  const prefetchDashboard = () => {
    import("./pages/Dashboard");
  };

  return (
    <AntApp>
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
          <AppLayout>
            {isAuthenticated && <SideNavbar onCollapse={setCollapsed} />}
            <MainContent
              $hasNavbar={isAuthenticated}
              className={collapsed ? "collapsed" : ""}
            >
              {isAuthenticated && <TopNavbar />}
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  <Route
                    path="/login"
                    element={
                      !isAuthenticated ? (
                        <Login />
                      ) : (
                        <Navigate to="/dashboard" />
                      )
                    }
                  />

                  <Route
                    element={
                      <ProtectedRoute isAuthenticated={isAuthenticated} />
                    }
                  >
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route
                      path="/books/recommend"
                      element={<BookRecommend />}
                    />
                    <Route path="/books/borrow" element={<BookBorrow />} />

                    <Route
                      element={
                        <ProtectedRoute
                          isAuthenticated={isAuthenticated}
                          requiredRole="admin"
                          userRole={user?.role}
                        />
                      }
                    >
                      <Route
                        path="/books/management"
                        element={<BookManagement />}
                      />
                      {/* <Route path="/books/upload" element={<BookUpload />} /> */}
                      <Route path="/reports" element={<Reports />} />
                      {/* <Route
                        path="/reports/statistics"
                        element={<Statistics />}
                      /> */}
                      <Route path="/reports/borrowing" element={<Reports />} />
                      <Route
                        path="/reports/recommendations"
                        element={<Reports />}
                      />
                    </Route>
                  </Route>

                  <Route
                    path="/auth/:provider/callback"
                    element={<OAuthCallback />}
                  />

                  <Route
                    path="/"
                    element={
                      <Navigate
                        to={isAuthenticated ? "/dashboard" : "/login"}
                      />
                    }
                  />
                </Routes>
              </Suspense>
            </MainContent>
          </AppLayout>
        </Router>
      </ConfigProvider>
    </AntApp>
  );
}

export default App;
