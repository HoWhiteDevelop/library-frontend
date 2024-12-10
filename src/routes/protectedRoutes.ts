import { lazy } from "react";

const Dashboard = lazy(() => import("../pages/dashboard"));
const BookRecommend = lazy(() => import("../pages/books/Recommend"));
const BookBorrow = lazy(() => import("../pages/books/Borrow"));
const BookManagement = lazy(() => import("../pages/books/Management"));

const BookList =lazy() => import("../pages/book/BookList");

export const protectedRoutes = [
  {
    path: "/dashboard",
    element: Dashboard,
  },
  {
    path: "/books/recommend",
    element: BookRecommend,
  },
  // ... 其他受保护路由
];
