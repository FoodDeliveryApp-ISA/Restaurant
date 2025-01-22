// src/error/Conflict.tsx
import React from "react";
import ErrorPage from "./ErrorPage";

const Conflict: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <ErrorPage
      status={409}
      title="409 Conflict"
      subTitle={message || "There was a conflict with your request."}
    />
  );
};

export default Conflict;
