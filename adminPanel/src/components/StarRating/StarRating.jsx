import React from "react";

const StarRating = ({ rating }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <i
        key={i}
        className={`bi ${
          i <= rating ? "bi-star-fill text-warning" : "bi-star text-secondary"
        }`}
        style={{ fontSize: "1.2rem", marginRight: "4px" }}
      ></i>
    );
  }

  return <div>{stars}</div>;
};

export default StarRating;
