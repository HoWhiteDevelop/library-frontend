import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HomeOutlined,
  BookOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingCartOutlined,
  SwapOutlined,
  BarChartOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Logo from "./Logo";
import clsx from "clsx";

interface MenuItem {
  icon: React.ReactNode;
  text: string;
  path: string;
  children?: MenuItem[];
}

// 定义管理员菜单项
const adminMenuItems: MenuItem[] = [
  { icon: <HomeOutlined />, text: "首页", path: "/dashboard" },
  { icon: <BookOutlined />, text: "图书管理", path: "/books/management" },
  {
    icon: <BarChartOutlined />,
    text: "统计报表",
    path: "/reports",
    children: [
      {
        icon: <FileTextOutlined />,
        text: "借阅报表",
        path: "/reports/borrowing",
      },
      {
        icon: <FileTextOutlined />,
        text: "推荐报表",
        path: "/reports/recommendations",
      },
    ],
  },
  { icon: <UserOutlined />, text: "个人中心", path: "/profile" },
];

// 定义普通用户菜单项
const userMenuItems: MenuItem[] = [
  { icon: <HomeOutlined />, text: "首页", path: "/dashboard" },
  { icon: <SwapOutlined />, text: "借阅图书", path: "/books/borrow" },
  {
    icon: <ShoppingCartOutlined />,
    text: "推荐购买",
    path: "/books/recommend",
  },
  { icon: <UserOutlined />, text: "个人中心", path: "/profile" },
];

interface SideNavbarProps {
  onCollapse: (collapsed: boolean) => void;
}

const SideNavbar = ({ onCollapse }: SideNavbarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleCollapse = (value: boolean) => {
    setCollapsed(value);
    onCollapse(value);
  };

  const menuItems = user?.role === "admin" ? adminMenuItems : userMenuItems;

  return (
    <motion.nav
      className={clsx(
        "fixed left-0 top-0 h-screen bg-[rgba(17,25,40,0.85)] backdrop-blur-md border-r border-white/10",
        "flex flex-col transition-[width] duration-300 ease-in-out z-50",
        collapsed ? "w-20" : "w-60"
      )}
      initial={{ x: -240 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Logo collapsed={collapsed} />

      <motion.div
        className="absolute -right-3 top-[70px] w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer text-white text-xs shadow-lg"
        onClick={() => handleCollapse(!collapsed)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </motion.div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {menuItems.map((item) => (
          <div key={item.path}>
            <Link to={item.path}>
              <motion.div
                className={clsx(
                  "mx-4 my-2 px-4 py-3 rounded-xl cursor-pointer",
                  "flex items-center gap-4 relative",
                  "hover:bg-white/10",
                  (location.pathname === item.path ||
                    item.children?.some(
                      (child) => location.pathname === child.path
                    )) &&
                    "bg-white/10 text-white before:content-[''] before:absolute before:inset-0 before:border before:border-transparent before:bg-gradient-to-r before:from-pink-500 before:to-purple-600 before:rounded-xl before:-z-10 before:p-[1px] before:mask-gradient"
                )}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-lg min-w-[24px] flex items-center justify-center">
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className="font-medium whitespace-nowrap text-sm">
                    {item.text}
                  </span>
                )}
              </motion.div>
            </Link>

            {!collapsed &&
              item.children?.map((child) => (
                <Link to={child.path} key={child.path}>
                  <motion.div
                    className={clsx(
                      "pl-12 pr-4 py-3 mx-4 my-2 rounded-xl cursor-pointer",
                      "flex items-center gap-4 relative",
                      "hover:bg-white/10",
                      location.pathname === child.path &&
                        "bg-white/10 text-white before:content-[''] before:absolute before:inset-0 before:border before:border-transparent before:bg-gradient-to-r before:from-pink-500 before:to-purple-600 before:rounded-xl before:-z-10 before:p-[1px] before:mask-gradient"
                    )}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-lg min-w-[24px] flex items-center justify-center">
                      {child.icon}
                    </span>
                    <span className="font-medium whitespace-nowrap text-sm">
                      {child.text}
                    </span>
                  </motion.div>
                </Link>
              ))}
          </div>
        ))}
      </div>
    </motion.nav>
  );
};

export default SideNavbar;
