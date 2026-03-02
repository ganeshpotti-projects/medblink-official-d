import React from "react";

// COMPONENTS
import SearchProduct from "../../components/SearchProduct/SearchProduct";

const BrowseProduct = () => {
  return (
    <div className="container mt-4">
      <div className="text-center">
        <h4>Browse by Category (or) Product</h4>
      </div>
      <SearchProduct />
    </div>
  );
};

export default BrowseProduct;
