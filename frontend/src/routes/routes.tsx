import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service"; // Adjust path as needed
import LoginRegister from "../pages/LoginRegister/LoginRegister";
import Menu from "../pages/Menu/Menu";
import MenuDetailsPage from "../pages/MenuDetailsPage/MenuDetailsPage";
import MenuItemDetailPage from "../pages/MenuItemDetailsPage/MenuItemDetailsPage";
import Profile from "../pages/Profile/Profile";
import { Unauthorized, Forbidden, NotFound, ServerError } from "../pages/error"; // Importing new error pages

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
    path: "/401",
    element: <Unauthorized />, // Using the new Unauthorized page
  },
  {
    path: "/403",
    element: <Forbidden />, // Using the new Forbidden page
  },
  {
    path: "/500",
    element: <ServerError />, // Using the new ServerError page for 500 errors
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
    element: <NotFound />, // Using the new NotFound page for unmatched routes
  },
];

export { publicRoutes, privateRoutes };
