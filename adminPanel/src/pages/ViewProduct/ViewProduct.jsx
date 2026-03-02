import React, { useContext, useMemo } from "react";

// THIRD PARTY
import { useNavigate, useParams } from "react-router-dom";

// CONTEXT
import { ProductsContext } from "../../context/ProductsContext";

// COMPONENTS
import Badge from "../../components/Badge/Badge";
import Loading from "../../components/Loading/Loading";

const ViewProduct = () => {
  const navigate = useNavigate();
  const { productID } = useParams();
  const { productsList } = useContext(ProductsContext);
  const product = useMemo(() => {
    return productsList.find((p) => p.productID === productID) || null;
  }, [productID, productsList]);

  if (!product) return <Loading />;

  return (
    <section className="my-5">
      <div className="text-center mb-5">
        <h1>Product Details</h1>
      </div>
      <div className="mx-5">
        <div className="row gx-4 gx-lg-5 align-items-center">
          <div className="col-md-6 position-relative">
            <img
              className="card-img-top"
              src={product.productImageUrl}
              alt={product.productName}
            />
          </div>

          <div className="col-md-6">
            <span className="badge text-bg-warning">
              {product.productCategory}
            </span>

            <div className="d-flex gap-2 align-items-center">
              <h1 className="display-5 fw-bolder">{product.productName}</h1>
              <Badge productQtySold={product.totalSoldQuantity} />
            </div>

            <div className="h6 mb-2">
              {product.totalSoldQuantity > 0 && (
                <>
                  <span className="badge bg-success me-2">
                    {product.totalSoldQuantity}+
                  </span>
                  sold{" "}
                  <i className="bi bi-lightning-charge-fill text-danger"></i>
                </>
              )}
            </div>

            <h4>{product.productDescription}</h4>

            {product.batchesStatus === "AVAILABLE" && (
              <div className="d-flex justify-content-between align-items-center mb-2 gap-4">
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

            <div className="mb-3 fw-bold">
              Availability:{" "}
              <span className="fw-bold text-secondary">
                {product.totalAvailableQuantity > 0
                  ? product.totalAvailableQuantity
                  : "N/A"}
              </span>
            </div>

            <div className="d-flex gap-4">
              <button
                className="btn btn-danger"
                onClick={() => navigate(`/addBatch/${product.productID}`)}
              >
                Add Batch
              </button>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/browseProduct")}
              >
                Browse Other Products
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ViewProduct;
