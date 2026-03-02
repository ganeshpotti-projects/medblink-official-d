import React from "react";
import "./Button.css";
/* 
Props:
- variant: primary, secondary, success, danger, warning, info, light, dark
- size: sm, lg (default medium if not specified)
- variant: solid (default), outline, link
- onClick, disabled, style
*/

export const Button = ({
  children,
  variant = "",
  size = "",
  state = "solid",
  onClick,
  disabled,
  style = {},
}) => {
  // Size class
  let sizeClass = "";
  switch (size) {
    case "lg":
      sizeClass = "btn-lg";
      break;
    case "sm":
      sizeClass = "btn-sm";
      break;
    default:
      sizeClass = "";
  }

  // State class
  let stateClass = "";
  switch (state) {
    case "outline":
      stateClass = `btn-outline-${variant}`;
      break;
    case "link":
      stateClass = `btn-text text-${variant}`;
      break;
    default:
      stateClass = `btn-${variant}`;
  }

  return (
    <button
      className={`btn ${stateClass} ${sizeClass}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
};
