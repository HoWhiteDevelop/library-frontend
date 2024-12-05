import { useState, useEffect } from "react";
import { Menu, Button, Avatar } from "antd";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Link } from "react-router-dom";

const NavWrapper = styled(motion.nav)`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0.5rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const MenuWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
`;

const MenuItem = styled(motion.div)`
  padding: 0.5rem 1rem;
  cursor: pointer;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: #1890ff;
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover:after {
    transform: scaleX(1);
  }
`;

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
          ? "rgba(255, 255, 255, 0.8)"
          : "rgba(255, 255, 255, 0)",
        height: scrolled ? "60px" : "70px",
      }}
    >
      <MenuWrapper>
        <Link to="/">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <img src="/logo.png" alt="Logo" height="40" />
          </motion.div>
        </Link>

        <Menu mode="horizontal" selectedKeys={[location.pathname]}>
          {["首页", "书籍管理", "个人中心"].map((item, index) => (
            <MenuItem key={index} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              {item}
            </MenuItem>
          ))}
        </Menu>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Avatar src="https://joeschmoe.io/api/v1/random" />
        </motion.div>
      </MenuWrapper>
    </NavWrapper>
  );
};

export default ModernNavbar;
