import React, { useContext, useRef, useState } from "react";

// THIRD PARTY
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// ASSETS
import { assets } from "../../assets/assets";

// CSS
import "./MyWishlists.css";

// CONTEXT
import { StoreContext } from "../../context/StoreContext";
import { WishlistContext } from "../../context/WishlistContext.jsx";

// DESIGN SYSTEM
import { Button } from "@/design-system";

// SERVICES
import {
  createWishlist,
  updateWishlist,
  deleteWishlist,
} from "../../service/wishlistService";

// COMPONENTS
import Modal from "../Modal/Modal.jsx";

// UTILS
import { entityUpdater } from "../../utils/entityUpdaterUtil.js";
import { reverseDateFormat } from "../../utils/DateUtil.js";

const MyWishlists = () => {
  const navigate = useNavigate();
  const { token } = useContext(StoreContext);
  const { wishlists, setWishlists, setWishlistItems } =
    useContext(WishlistContext);

  const [wishlist, setWishlist] = useState({});
  const [data, setData] = useState({ name: "", description: "", image: "" });
  const [modal, setModal] = useState(false);

  const fileInputRef = useRef(null);

  const openMessageModal = (action, wishlist = {}) => {
    setWishlist({ ...wishlist, action });
    setData({
      name: wishlist.name || "",
      description: wishlist.description || "",
      image: wishlist.image || "",
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
    setModal(true);
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onImageChange = (e) => {
    setData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const onSubmitHandlerForCreation = async (e) => {
    e.preventDefault();
    try {
      const wishlistData = { name: data.name, description: data.description };
      const response = await createWishlist(token, wishlistData, data.image);
      if (!response) return;
      setWishlists((prev) =>
        entityUpdater(prev, response.data, "CREATED", "wishlistID")
      );
      toast.success("Wishlist Created successfully🎉");
      setModal(false);
    } catch (error) {
      console.error("Error Creating Wishlist in FE:", error);
      toast.error("Failed to Create Wishlist☹️, Try Again Later!");
    }
  };

  const onSubmitHandlerForUpdation = async (e) => {
    e.preventDefault();
    try {
      const wishlistData = {
        wishlistID: wishlist.wishlistID,
        name: data.name,
        description: data.description,
      };
      const response = await updateWishlist(token, wishlistData, data.image);
      if (!response) return;
      setWishlists((prev) =>
        entityUpdater(prev, response.data, "UPDATED", "wishlistID")
      );
      toast.success("Wishlist Updated successfully🎉");
      setModal(false);
    } catch (error) {
      console.error("Error Updating Wishlist in FE:", error);
      toast.error("Failed to Update Wishlist☹️, Try Again Later!");
    }
  };

  const deleteUserWishlist = async (wishlistID) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this wishlist, This will delete all Products in wishlist?"
      )
    )
      return;

    try {
      const response = await deleteWishlist(token, wishlistID);
      if (!response) return;
      setWishlistItems((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((productID) => {
          if (updated[productID] === wishlistID) {
            delete updated[productID];
          }
        });
        localStorage.setItem("wishlistItems", JSON.stringify(updated));
        return updated;
      });
      setWishlists((prev) =>
        entityUpdater(prev, { wishlistID }, "DELETED", "wishlistID")
      );
      toast.success("Wishlist Deleted successfully🎉");
    } catch (error) {
      console.error("Error Deleting Wishlist in FE:", error);
      toast.error("Failed to Delete Wishlist☹️, Try Again Later!");
    }
  };

  const handleDiscard = () => {
    if (wishlist.action === "Create") {
      setData({ name: "", description: "", image: "" });
    } else {
      setData({
        name: wishlist.name || "",
        description: wishlist.description || "",
        image: wishlist.image || "",
      });
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="container my-4 gap-2">
      <Button variant="primary" state="outline" onClick={() => navigate("/")}>
        <i className="bi bi-arrow-left"></i> Back to Home
      </Button>
      <h2 className="text-center mb-4">
        My Wishlists <i className="bi bi-bag-heart-fill"></i>
      </h2>

      {wishlists.length > 0 && (
        <div className="d-flex justify-content-end mb-4">
          <Button
            variant="success"
            state="outline"
            onClick={() => openMessageModal("Create")}
          >
            Create New <i className="bi bi-patch-plus-fill"></i>
          </Button>
        </div>
      )}

      {wishlists && wishlists.length > 0 ? (
        wishlists.map((wishlist) => (
          <div
            key={wishlist.wishlistID}
            className="card-custom shadow-sm rounded-5 d-flex align-items-center p-3 mb-3 w-100"
          >
            <div className="img-box rounded-circle overflow-hidden">
              <img
                src={wishlist.image || assets.favourite}
                alt="wishlist"
                className="w-100 h-100 object-fit-cover"
              />
            </div>

            <div className="flex-grow-1 ms-3">
              <h5 className="mb-1 fw-semibold">{wishlist.name}</h5>
              <span className="text-muted small d-block mb-1">
                Created on {reverseDateFormat(wishlist.createdOn)}
              </span>
              {wishlist.description ? (
                <p>{wishlist.description}</p>
              ) : (
                <Button
                  variant="danger"
                  state="link"
                  onClick={() => openMessageModal("Update", wishlist)}
                >
                  <i className="bi bi-plus"></i>Add description
                </Button>
              )}
            </div>

            <div className="ms-2 d-flex align-items-center gap-3">
              <Button
                variant="warning"
                state="outline"
                onClick={() => openMessageModal("Update", wishlist)}
              >
                <i className="bi bi-pencil-square"></i>
              </Button>
              <Button
                variant="danger"
                state="outline"
                onClick={() => deleteUserWishlist(wishlist.wishlistID)}
              >
                <i className="bi bi-trash3-fill"></i>
              </Button>
              <Button
                variant="primary"
                state="outline"
                onClick={() => navigate(`/wishlist/${wishlist.wishlistID}`)}
              >
                View Products <i className="bi bi-arrow-right-circle-fill"></i>
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div className="d-flex row justify-content-center card-custom shadow-sm rounded-5 d-flex align-items-center p-3 mb-3 w-100 text-center">
          <p className="fw-bold">No Wishlists, Create a new Wishlist 🤗</p>
          <div>
            <Button
              variant="success"
              state="link"
              onClick={() => openMessageModal("Create")}
            >
              Create Wishlist <i className="bi bi-plus-circle"></i>
            </Button>
          </div>
        </div>
      )}

      <Modal openModal={modal} closeModal={() => setModal(false)}>
        <div className="d-flex justify-content-center mb-3">
          <h4 className="fw-bold mb-3">{wishlist.action} Wishlist</h4>
        </div>

        <div className="d-flex justify-content-center position-relative mb-3">
          <img
            src={
              data.image instanceof File
                ? URL.createObjectURL(data.image)
                : data.image || assets.favourite
            }
            alt="wishlist"
            className="rounded-circle"
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
          />

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={onImageChange}
            style={{ display: "none" }}
            id="wishlistImageInput"
          />

          <button
            className="btn btn-sm btn-warning d-flex align-items-center justify-content-center position-absolute"
            style={{
              bottom: "0%",
              right: "40%",
              borderRadius: "50%",
              width: "35px",
              height: "35px",
              padding: "0",
            }}
            onClick={() =>
              document.getElementById("wishlistImageInput").click()
            }
          >
            <i className="bi bi-pencil-square"></i>
          </button>
        </div>

        <div className="mb-3 mx-5">
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={onChangeHandler}
            className="form-control"
            placeholder="Wishlist Name"
            required
          />
        </div>

        <div className="mb-3 mx-5">
          <textarea
            className="form-control"
            name="description"
            value={data.description}
            onChange={onChangeHandler}
            rows="3"
            placeholder="Write a brief Description"
          ></textarea>
        </div>

        <div className="d-flex justify-content-center gap-5 mb-3 mx-3">
          <Button variant="danger" state="outline" onClick={handleDiscard}>
            Discard
          </Button>
          <Button
            variant="success"
            state="outline"
            onClick={
              wishlist.action === "Create"
                ? onSubmitHandlerForCreation
                : onSubmitHandlerForUpdation
            }
          >
            Submit
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default MyWishlists;
