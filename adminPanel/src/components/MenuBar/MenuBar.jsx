import React, { useContext } from "react";

// THIRD PARTY
import { useNavigate } from "react-router-dom";

// CONTEXT
import { StoreContext } from "../../context/StoreContext";

const MenuBar = ({ toggleSidebar }) => {
  const { loggedIn, setLoggedIn } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout MedBlink Admin? ")) {
      return;
    }

    setLoggedIn(false);
    localStorage.removeItem("loggedIn");
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div className="container-fluid d-flex justify-content-end mx-5 gap-2">
        {loggedIn ? (
          <button
            className="btn btn-primary"
            id="sidebarToggle"
            onClick={toggleSidebar}
          >
            <i className="bi bi-list"></i>
          </button>
        ) : (
          <></>
        )}
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default MenuBar;
