import React, { useContext, useState } from "react";

// THIRD PARTY
import { Link, useNavigate } from "react-router-dom";

// CONTEXT
import { StoreContext } from "../../context/StoreContext";
import { WishlistContext } from "../../context/WishlistContext";

// DESIGN SYSTEM
import { Badge, Button } from "@/design-system";

// COMPONENTS
import Modal from "../Modal/Modal";

// UTILS
import { getProductQuantity } from "../../utils/quantityUtil";
import { getBadgeDetails } from "../../utils/badgeUtil";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const {
    quantities = {},
    increaseQuantity,
    decreaseQuantity,
    token,
  } = useContext(StoreContext);
  const {
    isWishlisted,
    toggleWishlist,
    wishlists = [],
  } = useContext(WishlistContext);

  const quantity = getProductQuantity(product.productID, quantities);
  const wishlisted = isWishlisted(product.productID);
  const badgeDetails = getBadgeDetails(product.totalSoldQuantity);

  const [openModal, setOpenModal] = useState(false);
  const [selectedWishlist, setSelectedWishlist] = useState(null);

  const handleWishlistClick = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (wishlisted) {
      toggleWishlist(product.productID, null);
    } else {
      setOpenModal(true);
    }
  };

  const handleSelectWishlist = (wishlistId) => {
    toggleWishlist(product.productID, wishlistId);
    setOpenModal(false);
    setSelectedWishlist(null);
  };

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center">
      <div className="card position-relative" style={{ maxWidth: "320px" }}>
        <div
          className="position-absolute top-0 end-0 m-2"
          style={{ zIndex: 20 }}
        >
          {/* here */}
          <Button state="link" onClick={handleWishlistClick}>
            <i
              className={`bi fs-4 ${
                wishlisted
                  ? "bi-heart-fill text-danger"
                  : "bi-heart text-danger"
              }`}
            ></i>
          </Button>
        </div>
        <div className="position-relative">
          <Link to={`/productDetails/${product.productID}`}>
            <img
              className="card-img-top"
              src={product.productImageUrl}
              alt={product.productName}
              style={{ height: "300px", objectFit: "cover" }}
            />
          </Link>
        </div>

        <div className="card-body d-flex flex-column">
          {product.totalSoldQuantity > 0 && (
            <div className="d-flex justify-content-between mb-2">
              <Badge variant={badgeDetails.variant}>{badgeDetails.text}</Badge>
              <div className="d-flex justify-content-end gap-1">
                <Badge variant="success" state="pill">
                  {product.totalSoldQuantity}+
                </Badge>
                sold <i className="bi bi-lightning-charge-fill text-danger"></i>
              </div>
            </div>
          )}
          <h5 className="card-title">{product.productName}</h5>
          <p className="card-text">{product.productDescription}</p>
        </div>

        {product.batchesStatus === "AVAILABLE" && (
          <div className="d-flex justify-content-between align-items-center px-3 mb-2 gap-4">
            <div className="d-flex gap-2">
              <span className="h5 fw-bold">MRP </span>
              <span className="h5 fw-bold text-decoration-line-through text-danger">
                {product.productMarketPrice}
              </span>
              <span className="text-success">
                {product.productSellingPrice}/-
              </span>
            </div>
          </div>
        )}

        <div className="card-footer d-flex justify-content-between bg-light">
          <Button
            variant="primary"
            onClick={() => navigate(`/productDetails/${product.productID}`)}
          >
            View Product
          </Button>

          {product.totalAvailableQuantity === 0 ? (
            <Button variant="danger" state="outline" disabled>
              Out of Stock
            </Button>
          ) : quantity > 0 ? (
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="danger"
                onClick={() => decreaseQuantity(product.productID)}
              >
                <i className="bi bi-dash-circle"></i>
              </Button>
              <span className="fw-bold">{quantity}</span>
              <Button
                variant="success"
                onClick={() => increaseQuantity(product.productID)}
              >
                <i className="bi bi-plus-circle"></i>
              </Button>
            </div>
          ) : (
            <Button
              variant="success"
              onClick={() =>
                token ? increaseQuantity(product.productID) : navigate("/login")
              }
            >
              <i className="bi bi-plus-circle"></i>
            </Button>
          )}
        </div>
      </div>

      <Modal openModal={openModal} closeModal={() => setOpenModal(false)}>
        {wishlists.length > 0 ? (
          <>
            <div className="d-flex justify-content-between">
              <h4>Select Wishlist</h4>
              <Button
                variant="danger"
                state="link"
                onClick={() => setSelectedWishlist(null)}
              >
                Reset
              </Button>
            </div>
            <div className="card p-3 bg-light">
              <div
                className="d-flex flex-wrap gap-2 justify-content-start"
                style={{ maxHeight: "200px", overflowY: "auto" }}
              >
                {wishlists.map((wishlist) => (
                  <Button
                    key={wishlist.wishlistID}
                    variant="primary"
                    state={
                      selectedWishlist === wishlist.wishlistID
                        ? "solid"
                        : "outline"
                    }
                    onClick={() => setSelectedWishlist(wishlist.wishlistID)}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {wishlist.name}
                  </Button>
                ))}
              </div>
            </div>
            <div className="d-flex justify-content-end gap-5 mt-3">
              <Button
                variant="success"
                disabled={!selectedWishlist}
                onClick={() => handleSelectWishlist(selectedWishlist)}
              >
                Add <i className="bi bi-arrow-right"></i>
              </Button>
            </div>
          </>
        ) : (
          <div className="card p-3 card-custom">
            No wishlists found ☹️
            <div>
              <Button
                type="success"
                state="link"
                onClick={() => navigate("/mywishlists")}
              >
                Create Wishlist
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductCard;
