import React, { useContext } from "react";

// CONTEXT
import { StoreContext } from "../../context/StoreContext";

// COMPONENTS
import ProductCard from "../ProductCard/ProductCard";

const ProductsList = ({ category, searchProduct }) => {
  const { productsList } = useContext(StoreContext);

  const filteredProducts = productsList.filter(
    (product) =>
      (category === "All" || product.productCategory === category) &&
      product.productName.toLowerCase().includes(searchProduct.toLowerCase()) &&
      product.batchesStatus != "NOT_AVAILABLE"
  );

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Our Products</h1>
      <div className="row g-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))
        ) : (
          <div className="text-center mt-4">
            <h4>Try Again Later, Products not found! ☹️</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsList;
