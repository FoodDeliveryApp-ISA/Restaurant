// src/error/Forbidden.tsx
import React from "react";
import ErrorPage from "./ErrorPage";

const Forbidden: React.FC = () => {
  return (
    <ErrorPage
      status={403}
      title="403 Forbidden"
      subTitle="You are not authorized to access this page."
    />
  );
};

export default Forbidden;
