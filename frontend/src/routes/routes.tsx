import { ReactElement, Suspense, lazy, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Spinner from "../components/Spinner";

import useAuth from "../hooks/useAuth";

// Lazy-loaded pages for better performance
const LoginRegister = lazy(() => import("../pages/LoginRegister/LoginRegister"));
const Menu = lazy(() => import("../pages/Menu/Menu"));
const MenuDetailsPage = lazy(() => import("../pages/MenuDetailsPage/MenuDetailsPage"));
const MenuItemDetailPage = lazy(() => import("../pages/MenuItemDetailsPage/MenuItemDetailsPage"));
const Profile = lazy(() => import("../pages/Profile/Profile"));
const Unauthorized = lazy(() => import("../pages/error/Unauthorized"));
const Forbidden = lazy(() => import("../pages/error/Forbidden"));
const NotFound = lazy(() => import("../pages/error/NotFound"));
const ServerError = lazy(() => import("../pages/error/ServerError"));
const Orders = lazy(() => import("../pages/Order/OrdersPage"));
const ForgotPassword = lazy(() => import("../pages/ForgetPassword/ForgetPassword"));

interface RouteConfig {
  path: string;
  element: ReactElement;
  isPrivate?: boolean;
}

const useDelayedAuth = (): boolean | undefined => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const checkAuthentication = async () => {
      // Simulate 1-second delay
      const authStatus = await new Promise<boolean>((resolve) => {
        setTimeout(() => resolve(useAuth()), 1000);
      });
      setIsAuthenticated(authStatus);
    };
    checkAuthentication();
  }, []);

  return isAuthenticated;
};
// Component to handle authentication check
const AuthRoute = () => {
  const isAuthenticated = useDelayedAuth();

  if (isAuthenticated === undefined) {
    // Still loading
    return <Spinner />;
  }

  return isAuthenticated ? <Navigate to="/profile" replace /> : <LoginRegister />;
};

// Reusable Suspense wrapper with Spinner
const withSuspense = (Component: ReactElement) => (
  <Suspense fallback={<Spinner />}>{Component}</Suspense>
);

// Public routes
const publicRoutes: RouteConfig[] = [
  {
    path: "/",
    element: (
      <AuthRoute />
    ),
  },
  {
    path: "/forgetpassword",
    element: withSuspense(<ForgotPassword />),
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
