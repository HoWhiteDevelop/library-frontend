import { useState } from "react";
import { Layout as AntLayout, Menu, Avatar, Dropdown } from "antd";
import { useNavigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BookOutlined,
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = AntLayout;

interface RootState {
  auth: {
    user: {
      role: string;
      name: string;
    } | null;
  };
}

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "首页",
    },
    {
      key: "books",
      icon: <BookOutlined />,
      label: "图书管理",
      children: [
        {
          key: "books/borrow",
          label: "借阅图书",
        },
        {
          key: "books/recommend",
          label: "图书荐购",
        },
        ...(user?.role === "admin"
          ? [
              {
                key: "books/management",
                label: "图书上架",
              },
            ]
          : []),
      ],
    },
    ...(user?.role === "admin"
      ? [
          {
            key: "reports",
            icon: <FileTextOutlined />,
            label: "统计报表",
          },
        ]
      : []),
  ];

  const userMenu = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "个人信息",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "logout") {
      dispatch(logout());
      navigate("/login");
      return;
    }
    navigate(`/${key}`);
  };

  return (
    <AntLayout className="min-h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="h-8 m-4 bg-white/10" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <AntLayout>
        <Header className="bg-white px-4 flex justify-between items-center">
          {collapsed ? (
            <MenuUnfoldOutlined
              className="text-lg"
              onClick={() => setCollapsed(!collapsed)}
            />
          ) : (
            <MenuFoldOutlined
              className="text-lg"
              onClick={() => setCollapsed(!collapsed)}
            />
          )}
          <Dropdown
            menu={{
              items: userMenu,
              onClick: handleMenuClick,
            }}
            placement="bottomRight"
          >
            <div className="flex items-center cursor-pointer">
              <Avatar icon={<UserOutlined />} />
              <span className="ml-2">{user?.name}</span>
            </div>
          </Dropdown>
        </Header>
        <Content className="m-6 p-6 bg-white">
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
