import React, { useContext } from "react";

// ASSETS
import { assets } from "../../assets/assets";

// THIRD PARTY
import { Link, useNavigate } from "react-router-dom";

// CONTEXT
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import { deletePartnerAccount } from "../../services/partnerService";

const MenuBar = ({ toggleSidebar }) => {
  const { partnerToken, setPartnerToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const logoutHandler = () => {
    if (!window.confirm("Are you sure you want to logout MedBlink Partner? ")) {
      return;
    }

    setPartnerToken(false);
    localStorage.removeItem("partnerToken");
    toast.success("Successfully Logged out Partner🎉");
    navigate("/login");
  };

  const deleteAccountHandler = async () => {
    try {
      if (
        !window.confirm(
          "Are you sure you want to delete your MedBlink Partner Account? "
        )
      ) {
        return;
      }
      const response = await deletePartnerAccount(partnerToken);
      if (!response) return;

      setPartnerToken(false);
      localStorage.removeItem("partnerToken");
      toast.success("Successfully Deleted Partner🎉");
      navigate("/login");
    } catch (error) {
      console.error("Error Deleting Partner in FE:", error);
      toast.error("Failed to Delete Partner☹️, Try Again Later!");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div className="container-fluid d-flex justify-content-between align-items-center px-3">
        <div className="d-flex align-items-center gap-2 ms-auto">
          <button
            className="btn btn-primary"
            id="sidebarToggle"
            onClick={toggleSidebar}
          >
            <i className="bi bi-list"></i>
          </button>

          <div className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              id="navbarDropdown"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <img
                src={assets.profile}
                alt="Profile Icon"
                width={50}
                height={50}
                className="rounded-circle"
              />
            </a>
            <div
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="navbarDropdown"
            >
              <Link to="/profile" className="dropdown-item">
                Profile
              </Link>

              <div className="dropdown-divider"></div>
              <button onClick={logoutHandler} className="dropdown-item">
                Logout
              </button>
              <button onClick={deleteAccountHandler} className="dropdown-item">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MenuBar;
