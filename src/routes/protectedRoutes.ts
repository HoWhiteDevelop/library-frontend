import { lazy } from "react";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const BookRecommend = lazy(() => import("../pages/books/Recommend"));
const BookBorrow = lazy(() => import("../pages/books/Borrow"));
const BookManagement = lazy(() => import("../pages/books/Management"));
const BookList = lazy(() => import("../pages/Book/BookList"));

export const protectedRoutes = [
  {
    path: "/dashboard",
    element: Dashboard,
  },
  {
    path: "/books/recommend",
    element: BookRecommend,
  },
  {
    path: "/books/borrow",
    element: BookBorrow,
  },
  {
    path: "/books/management",
    element: BookManagement,
  },
  {
    path: "/books/list",
    element: BookList,
  },
];
