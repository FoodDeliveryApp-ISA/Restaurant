import React, { useEffect, useState } from "react";
import { Result, Button } from "antd";
import AuthService from "../services/auth.service"; // Adjust the path as needed

const RoutePermissionPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check if the user is authenticated when the component mounts
  useEffect(() => {
    setIsAuthenticated(AuthService.isAuthenticated());
  }, []);

  // Inline translation (English only)
  const t = (key: string) => {
    const translations: Record<string, string> = {
      "gloabal.tips.loginResult":
        "Your login was successful! You can now access protected routes.",
      "gloabal.tips.permissionDenied":
        "You are not authorized to access this page. Please log in.",
      "gloabal.tips.loginButton": "Log in to Continue",
    };
    return translations[key] || key;
  };

  const handleLoginRedirect = () => {
    // Redirect the user to the login page
    window.location.href = "/"; // Adjust as necessary
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {isAuthenticated ? (
        <Result
          status="success"
          title={t("gloabal.tips.loginResult")}
          extra={[
            <Button
              type="primary"
              key="home"
              onClick={() => (window.location.href = "/home")} // Redirect to home or another route
            >
              Go to Dashboard
            </Button>,
          ]}
        />
      ) : (
        <Result
          status="403"
          title="403"
          subTitle={t("gloabal.tips.permissionDenied")}
          extra={
            <Button type="primary" onClick={handleLoginRedirect}>
              {t("gloabal.tips.loginButton")}
            </Button>
          }
        />
      )}
    </div>
  );
};

export default RoutePermissionPage;
