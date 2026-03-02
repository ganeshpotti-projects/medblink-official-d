import React, { useState } from "react";

// CSS
import "./Register.css";

// THIRD PARTY
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// DESIGN SYSTEM
import { Button } from "@/design-system";

// SERVICE
import { registerUser } from "../../service/authService";


const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
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
      name: "",
      email: "",
      password: "",
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(data);
      if (!response) return;
      toast.success("User registered successfully🎉");
      navigate("/login");
    } catch (error) {
      console.error("Error Registering User in FE:", error);
      toast.error("Failed to Register User☹️, Try Again Later!");
    }
  };

  return (
    <div className="register-container">
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card border-0 shadow rounded-3 my-5">
            <div className="card-body p-4 p-sm-5">
              <h3 className="text-center mb-2 text-success">MedBlink</h3>
              <h4 className="text-center mb-4">Sign Up</h4>
              <form onSubmit={onSubmitHandler}>
                <div className="form-floating mb-3">
                  <input
                    type="name"
                    name="name"
                    onChange={onChangeHandler}
                    value={data.name}
                    className="form-control"
                    id="floatingName"
                    placeholder="Ganesh Potti"
                    required
                  />
                  <label htmlFor="floatingName">Full Name</label>
                </div>
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
                    Sign Up
                  </Button>
                  <Button
                    variant="danger"
                    state="outline"
                    onClick={onResetHandler}
                  >
                    Reset
                  </Button>
                </div>
                <div className="text-center mt-4">
                  Already have an Account?{" "}
                  <div>
                    <Button
                      variant="primary"
                      state="link"
                      onClick={() => navigate("/login")}
                    >
                      Sign In
                    </Button>
                  </div>
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
