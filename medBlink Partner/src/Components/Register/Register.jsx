import React, { useState } from "react";

// CSS
import "./Register.css";

// THIRD PARTY
import { Link, useNavigate } from "react-router-dom";
import { registerPartner } from "../../services/authService";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    phoneNumber: "",
    city: "",
    email: "",
    password: "",
    address: "",
    zip: "",
    state: "",
    country: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await registerPartner(data);
      if (!response) return;
      toast.success("Successfully Registered Partner 🎉, Login Partner!");
      navigate("/login");
    } catch (error) {
      console.error("Error Registering Partner in FE:", error);
      toast.error("Failed to Register Partner☹️, Try Again Later!");
    }
  };

  return (
    <div className="register-container ">
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card border-0 shadow rounded-3 my-5">
            <div className="card-body p-4 p-sm-5">
              <h3 className="text-center mb-2 text-success">
                MedBlink Partner{" "}
              </h3>
              <h4 className="text-center mb-4">Sign Up</h4>
              <form onSubmit={onSubmitHandler}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={data.name}
                    onChange={onChangeHandler}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="phoneNumber" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={data.phoneNumber}
                    onChange={onChangeHandler}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={data.email}
                    onChange={onChangeHandler}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={data.password}
                    onChange={onChangeHandler}
                    required
                  />
                </div>
                <h5 className="text-center">Address Details</h5>
                <div className="mb-3">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={data.address}
                    onChange={onChangeHandler}
                    className="form-control"
                    required
                  />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label>City</label>
                    <select
                      name="city"
                      value={data.city}
                      onChange={onChangeHandler}
                      className="form-select"
                      required
                    >
                      <option value="">Choose...</option>
                      <option>Guntur</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Zip</label>
                    <input
                      type="text"
                      name="zip"
                      value={data.zip}
                      onChange={onChangeHandler}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label>State</label>
                    <select
                      name="state"
                      value={data.state}
                      onChange={onChangeHandler}
                      className="form-select"
                      required
                    >
                      <option value="">Choose...</option>
                      <option>Andhra Pradesh</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Country</label>
                    <select
                      name="country"
                      value={data.country}
                      onChange={onChangeHandler}
                      className="form-select"
                      required
                    >
                      <option value="">Choose...</option>
                      <option>India</option>
                    </select>
                  </div>
                </div>

                <div className="d-grid gap-2 mb-3">
                  <button type="submit" className="btn btn-primary">
                    Sign Up
                  </button>
                  <button type="reset" className="btn btn-outline-danger">
                    Reset
                  </button>
                </div>

                <div className="text-center">
                  Have an account? <Link to="/login">Sign In</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
