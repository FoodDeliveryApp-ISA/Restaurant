// src/error/ServerError.tsx
import React from "react";
import ErrorPage from "./ErrorPage";

const ServerError: React.FC = () => {
  return (
    <ErrorPage
      status={500}
      title="500 Internal Server Error"
      subTitle="Something went wrong on our end. Please try again later."
    />
  );
};

export default ServerError;
