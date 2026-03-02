import React, { useState } from "react";

// DESIGN SYSTEM
import { Button } from "@/design-system";

// COMPONENTS
import ProductsList from "../../components/ProductsList/ProductsList";

const Browse = () => {
  const [category, setCategory] = useState("All");
  const [searchProduct, setSearchProduct] = useState("");

  return (
    <div className="container mt-4">
      <div className="text-center">
        <h3>Browse by Category (or) Product 🤗</h3>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="input-group mt-4">
              <select
                className="form-select"
                style={{ maxWidth: "150px" }}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Devices">Devices</option>
                <option value="Capsules">Capsules</option>
                <option value="Injections">Injections</option>
                <option value="Ointments">Ointments</option>
                <option value="Drops">Drops</option>
                <option value="Ortho">Ortho</option>
                <option value="Syrups">Syrups</option>
                <option value="Tablets">Tablets</option>
              </select>

              <input
                type="text"
                className="form-control"
                placeholder="Search for any product"
                onChange={(e) => setSearchProduct(e.target.value)}
                value={searchProduct}
              />

              <div>
                <Button variant="primary">
                  <i className="bi bi-search"></i>
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <ProductsList category={category} searchProduct={searchProduct} />
    </div>
  );
};

export default Browse;
