import React, { useContext, useState } from "react";

// CSS
import "./Login.css";

// THIRD PARTY
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// CONTEXT
import { StoreContext } from "../../context/StoreContext";

// DESIGN SYSTEM
import { Button } from "@/design-system";

// SERVICES
import { loginUser } from "../../service/authService";

const Login = () => {
  const navigate = useNavigate();
  const { setToken, loadCartData } = useContext(StoreContext);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onResetHandler = () => {
    setData({
      email: "",
      password: "",
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(data);
      if (!response) return;
      const responseData = response.data;
      setToken(responseData.token);
      localStorage.setItem("token", responseData.token);

      await loadCartData(responseData.token);

      toast.success("User logged in successfully🎉");
      navigate("/");
    } catch (error) {
      console.error("Error Logging In User in FE:", error);
      toast.error("Failed to Login User☹️, Try Again Later!");
    }
  };

  return (
    <div className="login-container">
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card border-0 shadow rounded-3 my-5">
            <div className="card-body p-4 p-sm-5">
              <h3 className="text-center mb-2 text-success">MedBlink</h3>
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
                  <Button variant="primary" state="outline">
                    Sign In
                  </Button>
                  <Button
                    variant="danger"
                    state="outline"
                    onClick={onResetHandler}
                  >
                    Reset
                  </Button>
                </div>
                <div className="mt-4 d-flex justify-content-center align-items-baseline gap-2">
                  <p>Don't have an Account?</p>
                  <Button
                    variant="primary"
                    state="link"
                    onClick={() => navigate("/register")}
                  >
                    Sign Up
                  </Button>
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
