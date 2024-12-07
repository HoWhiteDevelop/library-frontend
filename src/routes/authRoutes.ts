import { lazy } from "react";

const Login = lazy(() => import("../pages/auth/Login"));
const OAuthCallback = lazy(() => import("../pages/auth/OAuthCallback"));

export const authRoutes = [
  {
    path: "/login",
    element: Login,
  },
  {
    path: "/auth/:provider/callback",
    element: OAuthCallback,
  },
];
