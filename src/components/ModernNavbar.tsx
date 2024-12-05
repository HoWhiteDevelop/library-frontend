import { useState, useEffect } from "react";
import { Menu, Avatar } from "antd";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import { HomeOutlined, BookOutlined, UserOutlined } from "@ant-design/icons";

const NavWrapper = styled(motion.nav)`
  background: rgba(10, 10, 20, 0.8);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0.8rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const MenuWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
`;

const MenuItem = styled(motion.div)`
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  position: relative;
  color: white;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      rgba(255, 0, 128, 0.2),
      rgba(0, 128, 255, 0.2)
    );
    border-radius: 8px;
    opacity: 0;
    transition: all 0.3s ease;
  }

  &:hover:before {
    opacity: 1;
  }

  &:after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #ff0080, #7928ca, #0070f3);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover:after {
    transform: scaleX(1);
  }
`;

const LogoWrapper = styled(motion.div)`
  background: linear-gradient(45deg, #ff0080, #7928ca);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 1px;
  padding: 0.5rem;
  border-radius: 8px;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 8px;
    padding: 2px;
    background: linear-gradient(45deg, #ff0080, #7928ca);
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover:before {
    opacity: 1;
  }
`;

const AvatarWrapper = styled(motion.div)`
  position: relative;

  &:before {
    content: "";
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    padding: 3px;
    background: linear-gradient(45deg, #ff0080, #7928ca);
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover:before {
    opacity: 1;
  }
`;

const menuItems = [
  { icon: <HomeOutlined />, text: "首页", path: "/" },
  { icon: <BookOutlined />, text: "书籍管理", path: "/books/management" },
  { icon: <UserOutlined />, text: "个人中心", path: "/profile" },
];

const ModernNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <NavWrapper
      animate={{
        backgroundColor: scrolled
          ? "rgba(10, 10, 20, 0.9)"
          : "rgba(10, 10, 20, 0.7)",
        padding: scrolled ? "0.6rem 2rem" : "0.8rem 2rem",
      }}
      transition={{ duration: 0.3 }}
    >
      <MenuWrapper>
        <Link to="/">
          <LogoWrapper whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Library+
          </LogoWrapper>
        </Link>

        <div style={{ display: "flex", gap: "1rem" }}>
          {menuItems.map((item) => (
            <Link to={item.path} key={item.path}>
              <MenuItem
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                style={{
                  background:
                    location.pathname === item.path
                      ? "linear-gradient(45deg, rgba(255, 0, 128, 0.15), rgba(0, 128, 255, 0.15))"
                      : "transparent",
                  borderRadius: "8px",
                }}
              >
                {item.icon}
                {item.text}
              </MenuItem>
            </Link>
          ))}
        </div>

        <AvatarWrapper whileHover={{ scale: 1.05 }}>
          <Avatar
            size={40}
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
            style={{ cursor: "pointer" }}
          />
        </AvatarWrapper>
      </MenuWrapper>
    </NavWrapper>
  );
};

export default ModernNavbar;
