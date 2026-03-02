import React from "react";

// CSS
import "./Header.css";

// THIRD PARTY
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="p-5 mb-4 bg-light rounded-3 mt-4 header">
      <div className="container-fluid py-5">
        <h1 className="display-5 fw-bold"> Order Medicine Here!</h1>
        <p className="col-md-8 fs-4">
          Browse Wide Range of Medicine @ MedBlink
        </p>
        <Link to="/browse" className="btn btn-primary btn-md">
          Browse
        </Link>
      </div>
    </div>
  );
};

export default Header;
