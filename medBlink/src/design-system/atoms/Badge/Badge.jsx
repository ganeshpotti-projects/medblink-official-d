import React from "react";

/* 
Props:
- variant: success, warning, info, danger, etc.
- state: pill (for rounded-pill)
- children: text to display
*/

export const Badge = ({ variant = "primary", children, state = "" }) => {
  let stateClass = "";
  switch (state) {
    case "pill":
      stateClass = "rounded-pill px-2";
      break;
    default:
      stateClass = "px-2";
  }

  return (
    <span className={`badge ${stateClass} text-bg-${variant}`}>{children}</span>
  );
};

export default Badge;
