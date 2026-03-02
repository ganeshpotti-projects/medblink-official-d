import React, { useState } from "react";

// CONFIGS
import { categoriesList } from "../../config/categoriesConfig";

// COMPONENTS
import ProductsList from "../ProductList/ProductsList";

const SearchProduct = () => {
  const [category, setCategory] = useState("All");
  const [searchProduct, setSearchProduct] = useState("");
  return (
    <div>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="input-group mb-3">
              <select
                className="form-select mt-2"
                style={{ maxWidth: "165px" }}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categoriesList.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                className="form-control mt-2"
                placeholder="Search for any Product..."
                onChange={(e) => setSearchProduct(e.target.value)}
                value={searchProduct}
              />

              <button className="btn btn-primary mt-2" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
      <ProductsList category={category} searchProduct={searchProduct} />
    </div>
  );
};

export default SearchProduct;
