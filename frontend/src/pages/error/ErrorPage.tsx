// src/error/ErrorPage.tsx
import React from "react";
import { Result, Button } from "antd";
import { useHistory } from "react-router-dom";

interface ErrorPageProps {
  title: string;
  subTitle: string;
  status: number;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ title, subTitle, status }) => {
  const history = useHistory();

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <Result
        status={String(status)}
        title={title}
        subTitle={subTitle}
        extra={
          <Button type="primary" onClick={() => history.push("/")}>
            Go Home
          </Button>
        }
      />
    </div>
  );
};

export default ErrorPage;
