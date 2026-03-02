import React, { useContext, useEffect, useState } from "react";

// THIRD PARTY
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

// CONTEXT
import { StoreContext } from "../../context/StoreContext";

// DESIGN SYSTEM
import { Badge, Button } from "@/design-system";

// SERVICES
import { getProduct } from "../../service/productsService";

// UTILS
import { getProductQuantity } from "../../utils/quantityUtil";
import { getBadgeDetails } from "../../utils/badgeUtil";

const ProductDetails = () => {
  const { productID } = useParams();
  const [data, setData] = useState({});
  const { token, quantities, increaseQuantity, decreaseQuantity } =
    useContext(StoreContext);
  const navigate = useNavigate();

  const quantity = getProductQuantity(productID, quantities);

  useEffect(() => {
    const loadProductDetails = async () => {
      try {
        const response = await getProduct(productID);
        if (!response) return;
        const product = response.data;

        setData(product);
      } catch (error) {
        console.error("Error Fetching Product in FE:", error);
        toast.error("Failed to Fetch Product☹️, Try Again Later!");
      }
    };
    loadProductDetails();
  }, [productID]);

  const badgeDetails = getBadgeDetails(data.totalSoldQuantity);

  return (
    <section>
      <div className="container">
        <div className="my-5">
          <Button
            variant="primary"
            state="outline"
            onClick={() => navigate("/")}
          >
            <i className="bi bi-arrow-left"></i> Back to Home
          </Button>
        </div>
        <div className="row gx-4 gx-lg-5 align-items-center">
          <div className="col-md-6">
            <img
              className="card-img-top mb-5 mb-md-0"
              src={data.productImageUrl}
              alt={data.productName}
            />
          </div>
          <div className="col-md-6 ">
            <div className="d-flex gap-2">
              <Badge variant="warning">{data.productCategory}</Badge>
              <Badge variant={badgeDetails.variant}>{badgeDetails.text}</Badge>
            </div>

            <div className="d-flex gap-2 align-items-center">
              <h1 className="display-5 fw-bolder">{data.productName}</h1>
            </div>
            <div className="h6 mb-2">
              {data.totalSoldQuantity > 0 ? (
                <div className="d-flex mb-2 gap-1">
                  <Badge variant="success" state="pill">
                    {data.totalSoldQuantity}+
                  </Badge>
                  sold{" "}
                  <i className="bi bi-lightning-charge-fill text-danger"></i>
                </div>
              ) : (
                <></>
              )}
            </div>
            <p className="lead">{data.productDescription}</p>
            {data.batchesStatus !== "NOT_AVAILABLE" && (
              <div className="mb-3">
                <div className="d-flex align-items-baseline gap-3">
                  <div>
                    <span className="h5 fw-bold">MRP:</span>{" "}
                    <span className="h5 fw-bold text-decoration-line-through text-danger">
                      ₹{data.productMarketPrice}
                    </span>
                  </div>

                  <div className="h4 fw-bold text-success mb-0">
                    ₹{data.productSellingPrice}/-
                  </div>
                </div>
              </div>
            )}
            {data.totalAvailableQuantity === 0 ? (
              <Button variant="danger" state="outline" disabled>
                {data.batchesStatus === "NOT_AVAILABLE"
                  ? "No Batches Yet"
                  : "Out of Stock"}
              </Button>
            ) : quantity > 0 ? (
              <div className="d-flex align-items-center gap-2">
                <Button
                  variant="danger"
                  onClick={() => decreaseQuantity(data.productID)}
                >
                  <i className="bi bi-dash-circle"></i>
                </Button>
                <span className="fw-bold">{quantity}</span>
                <Button
                  variant="success"
                  onClick={() => increaseQuantity(data.productID)}
                  disabled={quantity >= data.totalAvailableQuantity}
                >
                  <i className="bi bi-plus-circle"></i>
                </Button>
              </div>
            ) : (
              <div className="d-flex gap-4">
                <Button
                  variant="success"
                  onClick={() =>
                    token
                      ? increaseQuantity(data.productID)
                      : navigate("/login")
                  }
                >
                  Add to Cart
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
