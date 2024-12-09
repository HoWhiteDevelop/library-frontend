import { Avatar, Dropdown, Layout, Space } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { logout } from "../store/slices/authSlice";

const { Header } = Layout;

const StyledHeader = styled(Header)`
  background: #fff;
  padding: 0 24px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
`;

interface RootState {
  auth: {
    user: {
      name?: string;
      avatar?: string;
    } | null;
  };
}

const TopNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleMenuClick = async (key: string) => {
    if (key === "profile") {
      navigate("/profile");
    } else if (key === "logout") {
      await dispatch(logout());
      navigate("/login");
    }
  };

  const items = [
    {
      key: "profile",
      label: "个人信息",
      icon: <UserOutlined />,
      onClick: () => handleMenuClick("profile"),
    },
    {
      key: "logout",
      label: "退出登录",
      icon: <LogoutOutlined />,
      onClick: () => handleMenuClick("logout"),
    },
  ];

  return (
    <StyledHeader>
      <Dropdown menu={{ items }} placement="bottomRight">
        <Space style={{ cursor: "pointer" }}>
          <Avatar src={user?.avatar} icon={<UserOutlined />} />
          <span>{user?.name || "用户"}</span>
        </Space>
      </Dropdown>
    </StyledHeader>
  );
};

export default TopNavbar;
