import React, { useContext, useMemo } from "react";

// THIRD PARTY
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// CONTEXT
import { StoreContext } from "../../context/StoreContext";
import { WishlistContext } from "../../context/WishlistContext";

// DESIGN SYSTEM
import { Button } from "@/design-system";

// SERVICES
import { removeProductFromWishlist } from "../../service/wishlistService";

// COMPONENTS
import Loading from "../../components/Loading/Loading";

// UTILS
import { convertDateFormat } from "../../utils/DateUtil";

const Wishlist = () => {
  const { wishlistID } = useParams();
  const { token } = useContext(StoreContext);
  const { wishlists, removeProductFromWishlistHandler } =
    useContext(WishlistContext);
  const navigate = useNavigate();

  const wishlist = useMemo(() => {
    return wishlists.find((w) => w.wishlistID === wishlistID) || null;
  }, [wishlistID, wishlists]);

  const removeProduct = async (productID) => {
    try {
      const response = await removeProductFromWishlist(
        token,
        wishlistID,
        productID
      );
      if (!response) return;
      removeProductFromWishlistHandler(productID);
    } catch (error) {
      console.error("Error Removing Product from Wishlist in FE:", error);
      toast.error("Failed to Remove Product from Wishlist☹️, Try Again Later!");
    }
  };

  if (!wishlist) return <Loading />;

  return (
    <div className="container my-4 gap-2">
      <Button
        variant="primary"
        state="outline"
        className="btn btn-outline-primary"
        onClick={() => navigate("/mywishlists")}
      >
        <i className="bi bi-arrow-left"></i> Back to Wishlists
      </Button>

      <h2 className="text-center mb-4">
        {wishlist.name} Wishlist <i className="bi bi-bag-heart-fill"></i>
      </h2>

      {wishlist.items.length > 0 && (
        <div className="d-flex justify-content-end mb-4">
          <Button
            variant="success"
            state="outline"
            className="btn btn-outline-success"
            onClick={() => navigate("/browse")}
          >
            Add Product <i className="bi bi-plus-circle-fill"></i>
          </Button>
        </div>
      )}

      {wishlist.items.length > 0 ? (
        wishlist.items.map((product) => (
          <div
            key={product.productID}
            className="card-custom shadow-sm rounded-5 d-flex align-items-center p-3 mb-3 w-100"
          >
            <div className="img-box rounded-circle overflow-hidden">
              <img
                src={product.productImageUrl}
                alt="product"
                className="w-100 h-100 object-fit-cover"
              />
            </div>

            <div className="flex-grow-1 ms-3">
              <h5 className="mb-1 fw-semibold">{product.productName}</h5>
              <span className="text-muted small d-block mb-1">
                Added on {convertDateFormat(product.addedOn)}
              </span>
              <p>{product.productDescription}</p>
            </div>

            <div className="ms-2 d-flex align-items-center gap-3">
              <Button
                variant="danger"
                state="outline"
                className="btn btn-outline-danger"
                onClick={() => removeProduct(product.productID)}
              >
                <i className="bi bi-trash3-fill"></i>
              </Button>
              <Button
                variant="primary"
                state="outline"
                className="btn btn-outline-primary"
                onClick={() => navigate(`/productDetails/${product.productID}`)}
              >
                View Product <i className="bi bi-arrow-right-circle-fill"></i>
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div className="d-flex row justify-content-center card-custom shadow-sm rounded-5 d-flex align-items-center p-3 mb-3 w-100 text-center">
          <p className="fw-bold">
            No Products yet, Add Products into your Wishlists 🤗
          </p>
          <Button
            variant="success"
            state="link"
            onClick={() => navigate("/browse")}
          >
            Add Product <i className="bi bi-plus-circle"></i>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
