// src/error/Unauthorized.tsx
import React from "react";
import ErrorPage from "./ErrorPage";

const Unauthorized: React.FC = () => {
  return (
    <ErrorPage
      status={401}
      title="401 Unauthorized"
      subTitle="You need to log in to access this page."
    />
  );
};

export default Unauthorized;
