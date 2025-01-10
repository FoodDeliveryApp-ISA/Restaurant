import { ReactElement, Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import Spinner from "../components/Spinner";

import useAuth from "../hooks/useAuth";

// import LoginRegister from "../pages/LoginRegister/LoginRegister";
// import Menu from "../pages/Menu/Menu";
// import MenuDetailsPage from "../pages/MenuDetailsPage/MenuDetailsPage";
// import MenuItemDetailPage from "../pages/MenuItemDetailsPage/MenuItemDetailsPage";
// import Profile from "../pages/Profile/Profile";
// import { Unauthorized, Forbidden, NotFound, ServerError } from "../pages/error"; // Importing new error pages

// Lazy-loaded pages for better performance
const LoginRegister = lazy(
  () => import("../pages/LoginRegister/LoginRegister")
);
const Menu = lazy(() => import("../pages/Menu/Menu"));
const MenuDetailsPage = lazy(
  () => import("../pages/MenuDetailsPage/MenuDetailsPage")
);
const MenuItemDetailPage = lazy(
  () => import("../pages/MenuItemDetailsPage/MenuItemDetailsPage")
);
const Profile = lazy(() => import("../pages/Profile/Profile"));
const Unauthorized = lazy(() => import("../pages/error/Unauthorized"));
const Forbidden = lazy(() => import("../pages/error/Forbidden"));
const NotFound = lazy(() => import("../pages/error/NotFound"));
const ServerError = lazy(() => import("../pages/error/ServerError"));
const Orders = lazy(() => import("../pages/Order/OrdersPage"));

interface RouteConfig {
  path: string;
  element: ReactElement;
  isPrivate?: boolean;
}

const isAuthenticated = useAuth(); // Check authentication status

// Reusable Suspense wrapper with Spinner
const withSuspense = (Component: ReactElement) => (
  <Suspense fallback={<Spinner fullscreen={false} tip="Loading..." />}>
    {Component}
  </Suspense>
);

// Public routes
const publicRoutes: RouteConfig[] = [
  {
    path: "/",
    element: isAuthenticated ? (
      <Navigate to="/profile" replace />
    ) : (
      withSuspense(<LoginRegister />)
    ),
  },
  {
    path: "/401",
    element: withSuspense(<Unauthorized />),
  },
  {
    path: "/403",
    element: withSuspense(<Forbidden />),
  },
  {
    path: "/500",
    element: withSuspense(<ServerError />),
  },
];

// Private routes
const privateRoutes: RouteConfig[] = [
  {
    path: "/menu",
    element: withSuspense(<Menu />),
  },
  {
    path: "/menu/:menuId",
    element: withSuspense(<MenuDetailsPage />),
  },
  {
    path: "/menu/:menuId/item/:menuItemId",
    element: withSuspense(<MenuItemDetailPage />),
  },
  {
    path: "/profile",
    element: withSuspense(<Profile />),
  },
  {
    path: "/orders",
    element: withSuspense(<Orders />),
  },
  {
    path: "*",
    element: withSuspense(<NotFound />),
  },
];

export { publicRoutes, privateRoutes };
