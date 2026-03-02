import React, { useContext } from "react";

// THIRD PARTY
import { useLocation } from "react-router-dom";

// CONTEXT
import { ProductsContext } from "../../context/ProductsContext";

// COMPONENTS
import BatchCard from "../BatchCard/BatchCard";
import ProductCard from "../ProductCard/ProductCard";

const ProductsList = ({ category, searchProduct }) => {
  const { productsList } = useContext(ProductsContext);
  const location = useLocation();

  const filteredProducts = productsList.filter(
    (product) =>
      (category === "All" || product.productCategory === category) &&
      product.productName.toLowerCase().includes(searchProduct.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Our Products</h2>
      <div className="row g-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) =>
            location.pathname === "/browseProduct" ? (
              <ProductCard key={index} product={product} />
            ) : (
              <BatchCard key={index} product={product} />
            )
          )
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
