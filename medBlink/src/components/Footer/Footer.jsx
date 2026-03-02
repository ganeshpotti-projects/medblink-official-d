import React from "react";

// THIRD PARTY
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="mt-5">
      <footer
        className="text-center text-lg-start text-dark"
        style={{ backgroundColor: "#ECEFF1" }}
      >
        <section
          className="d-flex justify-content-between p-4 text-white"
          style={{ backgroundColor: "#ff5758" }}
        >
          <div className="me-5">
            <h5>Get connected with us on social networks:</h5>
          </div>

          <div>
            <Link
              to="https://x.com/MedBlink_"
              className="text-white me-4"
              target="_blank"
            >
              <i className="bi bi-twitter-x fs-4"></i>
            </Link>
            <Link
              to="https://www.instagram.com/medblink_official/"
              className="text-white me-4"
              target="_blank"
            >
              <i className="bi bi-instagram fs-4"></i>
            </Link>
          </div>
        </section>

        <section>
          <div className="container text-center text-md-start mt-5">
            <div className="row mt-3">
              <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold">MedBlink</h6>
                <hr
                  className="mb-4 mt-0 d-inline-block mx-auto"
                  style={{
                    width: "60px",
                    backgroundColor: "#ff4748",
                    height: "2px",
                  }}
                />
                <p>
                  MedBlink is your all-in-one health delivery app designed to
                  streamline your medical journey. It helps you in tracking
                  orders, MedBlink puts convenience, care, and control in the
                  palm of your hand. Stay organized, and stay healthy — with
                  just a blink.
                </p>
              </div>

              <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold">Products</h6>
                <hr
                  className="mb-4 mt-0 d-inline-block mx-auto"
                  style={{
                    width: "60px",
                    backgroundColor: "#ff4748",
                    height: "2px",
                  }}
                />
                <p>
                  <Link
                    to="/"
                    className="text-dark"
                    style={{ textDecoration: "none" }}
                  >
                    Home
                  </Link>
                </p>
                <p>
                  <Link
                    to="/browse"
                    className="text-dark"
                    style={{ textDecoration: "none" }}
                  >
                    Browse Products
                  </Link>
                </p>
                <p>
                  <Link
                    to="/contact"
                    className="text-dark"
                    style={{ textDecoration: "none" }}
                  >
                    Contact Us
                  </Link>
                </p>
                <p>
                  <Link
                    to="/profile"
                    className="text-dark"
                    style={{ textDecoration: "none" }}
                  >
                    My Profile
                  </Link>
                </p>
                <p>
                  <Link
                    to="/mywishlists"
                    className="text-dark"
                    style={{ textDecoration: "none" }}
                  >
                    My Wishlists
                  </Link>
                </p>
                <p>
                  <Link
                    to="/myorders"
                    className="text-dark"
                    style={{ textDecoration: "none" }}
                  >
                    My Orders
                  </Link>
                </p>
              </div>

              <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold">Useful links</h6>
                <hr
                  className="mb-4 mt-0 d-inline-block mx-auto"
                  style={{
                    width: "60px",
                    backgroundColor: "#ff4748",
                    height: "2px",
                  }}
                />
                <p>
                  <Link
                    to="http://localhost:5175/register"
                    className="text-dark"
                    style={{ textDecoration: "none" }}
                  >
                    Join Delivery Partner
                  </Link>
                </p>
                <p>
                  <Link
                    to="http://localhost:5175/login"
                    className="text-dark"
                    style={{ textDecoration: "none" }}
                  >
                    Login Delivery Partner
                  </Link>
                </p>
              </div>

              <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                <h6 className="text-uppercase fw-bold">Contact</h6>
                <hr
                  className="mb-4 mt-0 d-inline-block mx-auto"
                  style={{
                    width: "60px",
                    backgroundColor: "#ff4748",
                    height: "2px",
                  }}
                />
                <p>
                  <i className="fas fa-home me-2"></i> SBK Luxus, Vidya Nagar,
                  Guntur
                </p>
                <p>
                  <i className="fas fa-envelope me-2"></i>{" "}
                  medblink.official@gmail.com
                </p>
                <p>
                  <i className="fas fa-phone me-2"></i> +91 9246744448
                </p>
                <p>
                  <i className="fas fa-print me-2"></i> +91 7207604676
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="text-center p-3" style={{ backgroundColor: "#cbcbcb" }}>
          © 2024 MedBlink —
          <Link className="text-dark" to="https://medblink.com/">
            {" "}
            medblink.com
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
