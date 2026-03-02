import React, { useContext, useEffect, useRef, useState } from "react";

// ASSETS
import { assets } from "../../assets/assets";

// THIRD PARTY
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// CONTEXT
import { StoreContext } from "../../context/StoreContext";

// DESIGN SYSTEM
import { Button } from "@/design-system";

// SERVICES
import { getUser, updateUser } from "../../service/userService";

const Profile = () => {
  const navigate = useNavigate();
  const { token } = useContext(StoreContext);
  const [data, setData] = useState({
    name: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
    weight: "",
    height: "",
    imageUrl: "",
    image: null,
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser(token);
        if (!response || !response.data) return;
        const userData = response.data;

        setData({
          name: userData.name || "",
          phoneNumber: userData.phoneNumber || "",
          gender: userData.gender || "",
          dateOfBirth: userData.dateOfBirth || "",
          weight: userData.weight || null,
          height: userData.height || null,
          imageUrl: userData.userImageUrl || null,
          image: null,
        });
      } catch (error) {
        console.error("Error Fetching User in FE:", error);
        toast.error("Failed to Fetch Profile☹️, Try Again Later!");
      }
    };

    fetchUser();
  }, [token]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData((prev) => ({
        ...prev,
        image: file,
        imageUrl: URL.createObjectURL(file),
      }));
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const userData = {
      name: data.name || "",
      phoneNumber: data.phoneNumber || "",
      gender: data.gender || "",
      dateOfBirth: data.dateOfBirth || "",
      height:
        data.height === "" || data.height === null
          ? null
          : parseFloat(data.height),
      weight:
        data.weight === "" || data.weight === null
          ? null
          : parseFloat(data.weight),
    };
    try {
      const response = await updateUser(token, userData, data.image);
      if (!response) return;
      toast.success("Profile updated successfully🎉");
      setData((prev) => ({
        ...prev,
        weight: payload.weight,
        height: payload.height,
        imageUrl: response.data.userImageUrl || prev.imageUrl,
        image: null,
      }));

      navigate("/");
    } catch (error) {
      console.error("Error Updating User in FE:", error);
      toast.error("Failed to Update Profile☹️, Try Again Later!");
    }
  };

  return (
    <div className="container">
      <div className="mx-5 mt-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-md-12 col-sm-12">
            <div className="card-body mb-5">
              <Button
                variant="primary"
                state="outline"
                onClick={() => navigate("/")}
                className="position-absolute top-50 start-0 translate-middle-y"
              >
                <i className="bi bi-arrow-left"></i> Back to Home
              </Button>

              <h2 className="text-center mb-4">
                My Profile <i className="bi bi-person-fill"></i>
              </h2>

              <div className="d-flex justify-content-center position-relative mb-3">
                <img
                  src={data.imageUrl || assets.avatar}
                  alt="profile"
                  className="rounded-circle"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                  }}
                />

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={onImageChange}
                  style={{ display: "none" }}
                  id="userImageInput"
                />

                <button
                  className="btn btn-sm btn-warning d-flex align-items-center justify-content-center position-absolute"
                  style={{
                    bottom: "0%",
                    right: "45%",
                    borderRadius: "50%",
                    width: "35px",
                    height: "35px",
                    padding: "0",
                  }}
                  onClick={() =>
                    document.getElementById("userImageInput").click()
                  }
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>

              <form onSubmit={onSubmitHandler}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label fw-bold">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    placeholder="Enter your name"
                    value={data.name}
                    onChange={onChangeHandler}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="phoneNumber" className="form-label fw-bold">
                    Phone Number
                  </label>
                  <input
                    type="number"
                    id="phoneNumber"
                    name="phoneNumber"
                    className="form-control"
                    placeholder="Enter your phone number"
                    value={data.phoneNumber}
                    onChange={onChangeHandler}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="dateOfBirth" className="form-label fw-bold">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    className="form-control"
                    value={data.dateOfBirth}
                    onChange={onChangeHandler}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="height" className="form-label fw-bold">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    className="form-control"
                    placeholder="Enter your height"
                    value={data.height ?? ""}
                    onChange={onChangeHandler}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="weight" className="form-label fw-bold">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    className="form-control"
                    placeholder="Enter your weight"
                    value={data.weight ?? ""}
                    onChange={onChangeHandler}
                    required
                  />
                </div>

                <div className="d-flex mb-3 gap-2">
                  <label className="form-label fw-bold">Gender</label>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      value="male"
                      checked={data.gender === "male"}
                      onChange={onChangeHandler}
                    />
                    <label className="form-check-label">Male</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      value="female"
                      checked={data.gender === "female"}
                      onChange={onChangeHandler}
                    />
                    <label className="form-check-label">Female</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      value="others"
                      checked={data.gender === "others"}
                      onChange={onChangeHandler}
                    />
                    <label className="form-check-label">Others</label>
                  </div>
                </div>

                <div className="text-center d-flex gap-3 justify-content-center mt-4">
                  <Button variant="success">Save Details</Button>
                  <Button variant="danger" onClick={() => navigate("/")}>
                    Discard Changes
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

export default Profile;
