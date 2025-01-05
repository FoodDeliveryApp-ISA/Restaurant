// src/routes/routes.ts
import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service"; // Adjust path as needed
import LoginRegister from "../pages/LoginRegister/LoginRegister";
import Menu from "../pages/Menu/Menu";
import MenuDetailsPage from "../pages/MenuDetailsPage/MenuDetailsPage";
import MenuItemDetailPage from "../pages/MenuItemDetailsPage/MenuItemDetailsPage";
import Profile from "../pages/Profile/Profile";
import ForbiddenPage from "../pages/403";
import NotFoundPage from "../pages/404";

interface RouteConfig {
  path: string;
  element: ReactElement;
  isPrivate?: boolean;
}

const isAuthenticated = AuthService.isAuthenticated(); // Check authentication status

const publicRoutes: RouteConfig[] = [
  {
    path: "/",
    element: isAuthenticated ? (
      <Navigate to="/profile" replace />
    ) : (
      <LoginRegister />
    ),
  },
  {
    path: "/403",
    element: <ForbiddenPage />,
  },
];

const privateRoutes: RouteConfig[] = [
  {
    path: "/menu",
    element: <Menu />,
  },
  {
    path: "/menu/:menuId",
    element: <MenuDetailsPage />,
  },
  {
    path: "/menu/:menuId/item/:menuItemId",
    element: <MenuItemDetailPage />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

export { publicRoutes, privateRoutes };
