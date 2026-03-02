import React from "react";
import { getBadgeDetails } from "../../utils/badgeUtil";

const Badge = ({ totalSoldQuantity }) => {
  const { type, text } = getBadgeDetails(totalSoldQuantity);

  return <span className={`badge bg-${type} p-2`}>{text}</span>;
};

export default Badge;