import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import React from "react";

// 懒加载页面组件
const Login = lazy(() =>
  import("../pages/Login/Login").then((module) => ({ default: module.default }))
);
const Dashboard = lazy(() =>
  import("../pages/Dashboard").then((module) => ({ default: module.default }))
);
const BookRecommend = lazy(() =>
  import("../pages/Book/BookRecommend").then((module) => ({
    default: module.default,
  }))
);
const BookBorrow = lazy(() =>
  import("../pages/Book/BookBorrow").then((module) => ({
    default: module.default,
  }))
);
const BookManagement = lazy(() =>
  import("../pages/Book/BookManagement").then((module) => ({
    default: module.default,
  }))
);
const Reports = lazy(() =>
  import("../pages/Reports").then((module) => ({ default: module.default }))
);
const Profile = lazy(() =>
  import("../pages/Profile/Profile").then((module) => ({
    default: module.default,
  }))
);
const OAuthCallback = lazy(() =>
  import("../pages/OAuthCallback").then((module) => ({
    default: module.default,
  }))
);
const BorrowReport = lazy(() =>
  import("../pages/reports/BorrowReport").then((module) => ({
    default: module.default,
  }))
);
const BookStatusReport = lazy(() =>
  import("../pages/reports/BookStatusReport").then((module) => ({
    default: module.default,
  }))
);

// 公开路由
export const publicRoutes: RouteObject[] = [
  {
    path: "/login",
    element: React.createElement(Login),
  },
  {
    path: "/auth/:provider/callback",
    element: React.createElement(OAuthCallback),
  },
];

// 需要认证的路由
export const protectedRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: React.createElement(Dashboard),
  },
  {
    path: "/profile",
    element: React.createElement(Profile),
  },
  {
    path: "/books/recommend",
    element: React.createElement(BookRecommend),
  },
  {
    path: "/books/borrow",
    element: React.createElement(BookBorrow),
  },
  {
    path: "/books/management",
    element: React.createElement(BookManagement),
  },
  {
    path: "/reports",
    element: React.createElement(Reports),
  },
  {
    path: "/reports/borrowing",
    element: React.createElement(BorrowReport),
  },
  {
    path: "/reports/recommendations",
    element: React.createElement(BookStatusReport),
  },
];
