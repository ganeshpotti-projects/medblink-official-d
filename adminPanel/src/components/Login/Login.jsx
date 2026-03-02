import React, { useContext, useState } from "react";

// CSS
import "./Login.css";

// THIRD PARTY
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// CONTEXT
import { StoreContext } from "../../context/StoreContext";

// SERVICES
import { adminCredential } from "../../constants/credentials";

const Login = () => {
  const navigate = useNavigate();
  const { setLoggedIn } = useContext(StoreContext);
  const [data, setData] = useState({
    userName: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (
      data.userName === adminCredential.userName &&
      data.password === adminCredential.password
    ) {
      setLoggedIn(true);
      localStorage.setItem("loggedIn", true);
      toast.success("Successfully Logged In 🎉");
      navigate("/");
    } else {
      toast.error("Try Again Later, Unable to Login! ☹️");
      navigate("/login");
    }
  };

  return (
    <div className="login-container">
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card border-0 shadow rounded-3 my-5">
            <div className="card-body p-4 p-sm-5">
              <h3 className="text-center mb-2 text-danger">MedBlink Admin</h3>
              <h4 className="text-center mb-4">Sign In</h4>
              <form onSubmit={onSubmitHandler}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    name="userName"
                    onChange={onChangeHandler}
                    value={data.userName}
                    className="form-control"
                    id="floatingInput"
                    placeholder="UserAdmin"
                    required
                  />
                  <label htmlFor="floatingInput">User Name</label>
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
