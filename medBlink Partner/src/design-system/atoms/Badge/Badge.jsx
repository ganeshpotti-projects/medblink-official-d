import React from "react";

export const Badge = ({ label, variant = "primary", size = "sm" }) => {
  const variantStyles = {
    primary: "text-primary border-primary bg-primary-subtle",
    success: "text-success border-success bg-success-subtle",
    danger: "text-danger border-danger bg-danger-subtle",
    info: "text-info border-info bg-info-subtle",
    secondary: "text-secondary border-secondary bg-secondary-subtle",
  };

  const sizeStyle = size === "sm" ? "px-2 py-1" : "px-3 py-2";

  return (
    <span
      className={`badge border rounded-pill fw-medium ${variantStyles[variant]} ${sizeStyle}`}
      style={{ fontSize: "0.8rem" }}
    >
      {label}
    </span>
  );
};
