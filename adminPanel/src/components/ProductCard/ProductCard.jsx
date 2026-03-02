import React, { useContext } from "react";

// CSS
import "./ProductCard.css";

// THIRD PARTY
import { Link } from "react-router-dom";

// COMPONENTS
import Badge from "../Badge/Badge";

const ProductCard = ({ product }) => {
  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center">
      <div className="card" style={{ maxWidth: "320px", width: "100%" }}>
        <div className="position-absolute top-0 end-0 m-2">
          <Badge totalSoldQuantity={product.totalSoldQuantity} />
        </div>
        <Link to={`/viewProduct/${product.productID}`}>
          <img
            className="card-img-top"
            src={product.productImageUrl}
            alt={product.productName}
            style={{ height: "300px", objectFit: "cover" }}
          />
        </Link>

        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-end h6 mb-0">
            {product.totalSoldQuantity > 0 ? (
              <>
                <span className="badge bg-success me-2">
                  {product.totalSoldQuantity}+
                </span>
                sold
                <i className="bi bi-lightning-charge-fill text-danger"></i>
              </>
            ) : (
              <>
                <br />
              </>
            )}
          </div>
          <h5 className="card-title">{product.productName}</h5>
          <p className="card-text">{product.productDescription}</p>
        </div>

        {product.batchesStatus === "AVAILABLE" && (
          <div className="d-flex justify-content-between align-items-center px-3 mb-2 gap-4">
            <div className="d-flex gap-2">
              <div>
                <span className="h5 fw-bold">MRP </span>
                <span className="h5 fw-bold text-decoration-line-through text-danger">
                  {product.productMarketPrice}
                </span>
              </div>

              <span className="text-success">
                {product.productSellingPrice}/-
              </span>
            </div>
          </div>
        )}

        {(product.batchesStatus === "NOT_AVAILABLE" ||
          product.batchesStatus === "UN_AVAILABLE") && (
          <Link
            to={`/addBatch/${product.productID}`}
            className="mb-2 px-3 text-danger"
            style={{ textDecoration: "none" }}
          >
            Add Batch <i className="bi bi-plus-circle-fill"></i>
          </Link>
        )}

        <div className="card-footer d-flex flex-wrap justify-content-between bg-light gap-2">
          <Link
            to={`/viewProduct/${product.productID}`}
            className="btn btn-primary flex-fill text-center"
          >
            View
          </Link>

          <Link
            to={`/updateProduct/${product.productID}`}
            className="btn btn-warning flex-fill text-center"
          >
            Update
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;