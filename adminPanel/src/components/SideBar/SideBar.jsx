import React from "react";

// ASSETS
import { assets } from "../../assets/assets";

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
          alt="Medblink Admin"
        />
        <p className="mb-0">MedBlink</p>
        <p className="text-danger mb-0">Admin</p>
      </div>

      <div className="list-group list-group-flush">
        <Link
          className="list-group-item list-group-item-action list-group-item-light p-3"
          to="/browseProduct"
        >
          <i className="bi bi-search me-2"></i>Browse Product
        </Link>
        <Link
          className="list-group-item list-group-item-action list-group-item-light p-3"
          to="/browseBatch"
        >
          <i className="bi bi-box-seam me-2"></i>Browse Batch
        </Link>
        <Link
          className="list-group-item list-group-item-action list-group-item-light p-3"
          to="/addProduct"
        >
          <i className="bi bi-plus-circle me-2"></i>Add Product
        </Link>
        <Link
          className="list-group-item list-group-item-action list-group-item-light p-3"
          to="/orders"
        >
          <i className="bi bi-cart me-2"></i>Orders
        </Link>
        <Link
          className="list-group-item list-group-item-action list-group-item-light p-3"
          to="/contacts"
        >
          <i className="bi bi-people me-2"></i>Contact Us
        </Link>
        <Link
          className="list-group-item list-group-item-action list-group-item-light p-3"
          to="/myPartners"
        >
          <i className="bi bi-truck me-2"></i>My Partners
        </Link>
      </div>
    </div>
  );
};

export default SideBar;
