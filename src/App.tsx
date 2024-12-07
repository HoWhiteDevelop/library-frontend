import { useEffect, useState, Suspense } from "react";
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
import { publicRoutes, protectedRoutes } from "./routes";

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
                  {publicRoutes.map((route) => (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={
                        !isAuthenticated ? (
                          route.element
                        ) : (
                          <Navigate to="/dashboard" />
                        )
                      }
                    />
                  ))}
                  <Route
                    element={
                      <ProtectedRoute isAuthenticated={isAuthenticated} />
                    }
                  >
                    {protectedRoutes.map((route) => (
                      <Route key={route.path} {...route} />
                    ))}
                  </Route>
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
