import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  HomeOutlined,
  BookOutlined,
  UploadOutlined,
  UserOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

const SidebarWrapper = styled(motion.nav)<{ $collapsed: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  background: rgba(17, 25, 40, 0.85);
  backdrop-filter: blur(12px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  width: ${(props) => (props.$collapsed ? "80px" : "240px")};
  transition: width 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
`;

const LogoSection = styled.div<{ $collapsed: boolean }>`
  padding: 0 ${(props) => (props.$collapsed ? "1rem" : "1.5rem")};
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: ${(props) =>
    props.$collapsed ? "center" : "space-between"};
  margin-bottom: 2rem;

  .logo-text {
    font-size: 1.5rem;
    background: linear-gradient(45deg, #ff0080, #7928ca);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: ${(props) => (props.$collapsed ? "none" : "block")};
  }
`;

const MenuSection = styled.div`
  flex: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
`;

const MenuItem = styled(motion.div)<{ $active?: boolean }>`
  padding: 0.8rem 1.5rem;
  margin: 0.5rem 1rem;
  cursor: pointer;
  color: ${(props) => (props.$active ? "#fff" : "rgba(255, 255, 255, 0.7)")};
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  border-radius: 12px;
  background: ${(props) =>
    props.$active ? "rgba(255, 255, 255, 0.1)" : "transparent"};

  .icon {
    font-size: 1.2rem;
    min-width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .text {
    font-weight: 500;
    white-space: nowrap;
    opacity: ${(props) => (props.$active ? 1 : 0.7)};
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);

    &:before {
      opacity: 1;
    }
  }

  &:before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 12px;
    padding: 1px;
    background: linear-gradient(45deg, #ff0080, #7928ca);
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    opacity: ${(props) => (props.$active ? 1 : 0)};
    transition: opacity 0.3s ease;
  }
`;

const CollapseButton = styled(motion.div)`
  position: absolute;
  right: -12px;
  top: 70px;
  width: 24px;
  height: 24px;
  background: #7928ca;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const menuItems = [
  { icon: <HomeOutlined />, text: "首页", path: "/" },
  { icon: <BookOutlined />, text: "图书管理", path: "/books/management" },
  { icon: <UploadOutlined />, text: "图书上架", path: "/books/upload" },
  { icon: <UserOutlined />, text: "个人中心", path: "/profile" },
  { icon: <SettingOutlined />, text: "系统设置", path: "/settings" },
];

interface SideNavbarProps {
  onCollapse: (collapsed: boolean) => void;
}

const SideNavbar = ({ onCollapse }: SideNavbarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const handleCollapse = (value: boolean) => {
    setCollapsed(value);
    onCollapse(value);
  };

  return (
    <SidebarWrapper
      $collapsed={collapsed}
      initial={{ x: -240 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <LogoSection $collapsed={collapsed}>
        <motion.div whileHover={{ scale: 1.05 }}>
          {collapsed ? "L+" : <span className="logo-text">Library+</span>}
        </motion.div>
      </LogoSection>

      <CollapseButton
        onClick={() => handleCollapse(!collapsed)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </CollapseButton>

      <MenuSection>
        {menuItems.map((item) => (
          <Link to={item.path} key={item.path}>
            <MenuItem
              $active={location.pathname === item.path}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="icon">{item.icon}</span>
              {!collapsed && <span className="text">{item.text}</span>}
            </MenuItem>
          </Link>
        ))}
      </MenuSection>
    </SidebarWrapper>
  );
};

export default SideNavbar;
