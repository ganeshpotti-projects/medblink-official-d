import React, { useContext, useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { loginPartner } from "../../services/authService";
import StoreContext from "../../context/StoreContext";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { setPartnerToken } = useContext(StoreContext);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await loginPartner(data);
      if (!response) return;
      const token = response.data.token;
      setPartnerToken(token);
      localStorage.setItem("partnerToken", token);
      toast.success("Successfully Logged In Partner! 🎉");
      navigate("/");
    } catch (error) {
      console.error("Error Logging In Partner in FE:", error);
      toast.error("Failed to Login Partner☹️, Try Again Later!");
    }
  };

  return (
    <div className="login-container">
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card border-0 shadow rounded-3 my-5">
            <div className="card-body p-4 p-sm-5">
              <h3 className="text-center mb-2 text-warning">
                MedBlink Partner
              </h3>
              <h4 className="text-center mb-4">Sign In</h4>
              <form onSubmit={onSubmitHandler}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    name="email"
                    onChange={onChangeHandler}
                    value={data.email}
                    className="form-control"
                    id="floatingInput"
                    placeholder="name@example.com"
                    required
                  />
                  <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    name="password"
                    onChange={onChangeHandler}
                    value={data.password}
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    required
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>

                <div className="d-grid gap-2">
                  <button
                    className="btn btn-outline-primary btn-login text-uppercase"
                    type="submit"
                  >
                    Sign in
                  </button>
                  <button
                    className="btn btn-outline-danger btn-login text-uppercase"
                    type="reset"
                  >
                    Reset
                  </button>
                </div>
                <div className="mt-4 text-center">
                  Don't have an Account? <Link to="/register">Sign Up</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
