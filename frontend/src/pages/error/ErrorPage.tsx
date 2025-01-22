// src/error/ErrorPage.tsx
import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

interface ErrorPageProps {
  title: string;
  subTitle: string;
  status: number;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ title, subTitle, status }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  const handleGoHome = () => {
    navigate("/"); // Navigate to the home page
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <Result
        status={String(status)}
        title={title}
        subTitle={subTitle}
        extra={
          <>
            <Button type="primary" onClick={handleGoBack}>
              Go Back
            </Button>
            <Button type="primary" onClick={handleGoHome} style={{ marginLeft: "10px" }}>
              Go to Home
            </Button>
          </>
        }
      />
    </div>
  );
};

export default ErrorPage;

