import React, { useContext, useEffect, useState } from "react";

// THIRD PARTY
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// CONTEXT
import { StoreContext } from "../../context/StoreContext";

// DESIGN SYSTEM
import { Button } from "@/design-system";

// SERVICE
import { updateAddress } from "../../service/userService";

const UpdateAdress = () => {
  const { token, editAddress, setEditAddress } = useContext(StoreContext);
  const [data, setData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    isDefault: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!editAddress) return;

    setData({
      fullName: editAddress.fullName || "",
      phoneNumber: editAddress.phoneNumber || "",
      email: editAddress.email || "",
      address: editAddress.address || "",
      city: editAddress.city || "",
      state: editAddress.state || "",
      country: editAddress.country || "",
      zip: editAddress.zip || "",
      isDefault: editAddress.isDefault || false,
    });
  }, [editAddress]);

  const onChangeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await updateAddress(token, editAddress.addressID, data);
      if (!response) return;
      setEditAddress(data);
      toast.success("User Address updated successfully🎉");
      navigate("/savedAddresses");
    } catch (error) {
      console.error("Error Updating User Address in FE:", error);
      toast.error("Failed to Update User Address☹️, Try Again Later!");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Update Address</h2>
      <form onSubmit={onSubmitHandler}>
        <div className="row">
          <div className="mb-3 col-md-6">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={data.fullName}
              onChange={onChangeHandler}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3 col-md-6">
            <label>Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={data.phoneNumber}
              onChange={onChangeHandler}
              className="form-control"
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={onChangeHandler}
            className="form-control"
            required
          />
        </div>

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
          <div className="mb-3 col-md-4">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={data.city}
              onChange={onChangeHandler}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3 col-md-4">
            <label>State</label>
            <input
              type="text"
              name="state"
              value={data.state}
              onChange={onChangeHandler}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3 col-md-4">
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

        <div className="form-check mb-3">
          <input
            type="checkbox"
            name="isDefault"
            checked={data.isDefault}
            onChange={onChangeHandler}
            className="form-check-input"
            id="defaultAddress"
          />
          <label className="form-check-label" htmlFor="defaultAddress">
            Set as Default Address
          </label>
        </div>

        <Button variant="primary">Update Address</Button>
      </form>
    </div>
  );
};

export default UpdateAdress;
