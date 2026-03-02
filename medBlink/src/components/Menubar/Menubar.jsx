import React, { useContext } from "react";

// ASSETS
import { assets } from "../../assets/assets";

// If the file is menubar.css (all lowercase)
import "./Menubar.css";

// THIRD PARTY
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// CONTEXT
import { StoreContext } from "../../context/StoreContext";
import { WishlistContext } from "../../context/WishlistContext";

// DESIGN SYSTEM
import { Button } from "@/design-system";

// UTILS
import { deleteAccount } from "../../service/userService";

const MenuBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    quantities,
    token,
    setToken,
    setQuantities,
    setDeliveryAddress,
    setSavedAddresses,
    setEditAddress,
  } = useContext(StoreContext);
  const { setWishlistItems } = useContext(WishlistContext);

  const itemsInCart = Object.values(quantities || {}).filter(
    (qty) => qty > 0
  ).length;

  const logout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    localStorage.removeItem("token");
    setToken("");
    setQuantities({});
    setDeliveryAddress(null);
    setSavedAddresses([]);
    setEditAddress(null);
    toast.success("User logged out successfully🎉");
    navigate("/");
  };

  const deleteAccountHandler = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account permanently? This change can't be reverted back again!"
      )
    )
      return;
    try {
      const response = await deleteAccount(token);
      if (!response) return;
      localStorage.removeItem("token");
      setToken("");
      setQuantities({});
      setDeliveryAddress(null);
      setSavedAddresses([]);
      setEditAddress(null);
      setWishlistItems({});
      localStorage.removeItem("wishlistItems");
      toast.success("User Account deleted successfully🎉");
      navigate("/");
    } catch (error) {
      console.error("Error Deleting User in FE:", error);
      toast.error("Failed to Delete Profile☹️, Try Again Later!");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container">
        <Link to={"/"}>
          <img
            className="mx-2"
            src={assets.logo}
            height={60}
            width={180}
            alt="MedBlink"
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className={
                  location.pathname === "/"
                    ? "nav-link fw-bold active"
                    : "nav-link"
                }
                to={"/"}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={
                  location.pathname === "/browse"
                    ? "nav-link fw-bold active"
                    : "nav-link"
                }
                to="/browse"
              >
                Browse
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={
                  location.pathname === "/contact"
                    ? "nav-link fw-bold active"
                    : "nav-link"
                }
                to="/contact"
              >
                Contact Us
              </Link>
            </li>
          </ul>
          <div className="d-flex align-items-center gap-4">
            <Link to={"/mywishlists"}>
              <i className="fs-3 bi bi-heart-fill text-danger"></i>
            </Link>

            <Link to={"/cart"}>
              <div className="position-relative">
                <img src={assets.cart} height={28} width={28} alt="cartIcon" />
                {itemsInCart > 0 ? (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning">
                    {itemsInCart}
                  </span>
                ) : (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning">
                    <i className="bi bi-plus-circle"></i>
                  </span>
                )}
              </div>
            </Link>
            {!token ? (
              <div className="d-flex align-items-center gap-2">
                <Button
                  variant="primary"
                  state="outline"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button
                  variant="success"
                  state="outline"
                  onClick={() => navigate("/register")}
                >
                  Register
                </Button>
              </div>
            ) : (
              <div className="dropdown text-end">
                <a
                  href="#"
                  className="d-block link-body-emphasis text-decoration-none dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fs-2 bi bi-list "></i>
                </a>
                <ul className="dropdown-menu text-small">
                  <li
                    className="dropdown-item"
                    onClick={() => navigate("/profile")}
                  >
                    My Profile
                  </li>
                  <li
                    className="dropdown-item"
                    onClick={() => navigate("/myorders")}
                  >
                    My Orders
                  </li>
                  <li
                    className="dropdown-item"
                    onClick={() => navigate("/mywishlists")}
                  >
                    My Wishlists
                  </li>
                  <div className="dropdown-divider"></div>
                  <li className="dropdown-item" onClick={logout}>
                    Logout
                  </li>
                  <li className="dropdown-item" onClick={deleteAccountHandler}>
                    Delete Account
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MenuBar;
