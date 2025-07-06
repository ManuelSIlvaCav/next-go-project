import React from "react";

export const Message: React.FC<{
  error?: React.ReactNode;
  message?: React.ReactNode;
  success?: React.ReactNode;
  warning?: React.ReactNode;
}> = ({ error, message, success, warning }) => {
  const messageToRender = message || error || success || warning;

  if (messageToRender) {
    return <div>{messageToRender}</div>;
  }
  return null;
};
