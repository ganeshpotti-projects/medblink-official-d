import React from "react";

// ASSETS
import { assets } from "../../assets/assets.js";

// THIRD PARTY
import { Link } from "react-router-dom";

const SideBar = ({ sidebarVisible }) => {
  return (
    <div
      className={`border-end bg-white ${sidebarVisible ? "" : "d-none"}`}
      id="sidebar-wrapper"
    >
      <div className="d-flex align-items-center gap-2">
        <img
          src={assets.delivery}
          height={48}
          width={48}
          alt="Medblink Partner"
        />
        <p className="mb-0">MedBlink </p>
        <p className="mb-0 text-warning">Partner</p>
      </div>

      <div className="list-group list-group-flush">
        <Link
          className="list-group-item list-group-item-action list-group-item-light p-3"
          to="/"
        >
          <i className="bi bi-house me-2"></i>Home
        </Link>
        <Link
          className="list-group-item list-group-item-action list-group-item-light p-3"
          to="/orders"
        >
          <i className="bi bi-cart me-2"></i>Orders
        </Link>
      </div>
    </div>
  );
};

export default SideBar;
