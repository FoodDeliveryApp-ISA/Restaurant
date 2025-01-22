// src/error/NotFound.tsx
import React from "react";
import ErrorPage from "./ErrorPage";

const NotFound: React.FC = () => {
  return (
    <ErrorPage
      status={404}
      title="404 Not Found"
      subTitle="The resource you are looking for was not found."
    />
  );
};

export default NotFound;
