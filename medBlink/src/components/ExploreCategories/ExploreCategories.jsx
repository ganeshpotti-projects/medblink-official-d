import React, { useRef } from "react";

// ASSETS
import { categories } from "../../assets/assets";

// CSS
import "./ExploreCategories.css";

const ExploreCategories = ({ category, setCategory }) => {
  const categoryRef = useRef(null);

  const scrollLeft = () => {
    if (categoryRef.current) {
      categoryRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (categoryRef.current) {
      categoryRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="explore-product-categories position relative">
      <h1 className="d-flex align-items-center justify-content-between">
        Explore Our Categories
        <div className="d-flex">
          <i
            className="bi bi-arrow-left-circle scroll-icon"
            onClick={scrollLeft}
          ></i>
          <i
            className="bi bi-arrow-right-circle scroll-icon"
            onClick={scrollRight}
          ></i>
        </div>
      </h1>
      <p>Wide Range of Products only @ MedBlink</p>

      <div
        className="d-flex justify-content-between gap-4 overflow-auto explore-product-category-list"
        ref={categoryRef}
      >
        {categories.map((item, index) => (
          <div
            key={index}
            className="text-center explore-product-category-list-item"
            onClick={() =>
              setCategory((prev) =>
                prev == item.category ? "All" : item.category
              )
            }
          >
            <img
              src={item.icon}
              alt={item.category}
              height={128}
              width={128}
              className={
                item.category === category
                  ? "rounded-circle active"
                  : "rounded-circle"
              }
            />
            <p className="mt-2 fw-bold">{item.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreCategories;
