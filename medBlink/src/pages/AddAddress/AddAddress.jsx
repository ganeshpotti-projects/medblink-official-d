import React, { useContext, useState } from "react";

// THIRD PARTY
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// CONTEXT
import { StoreContext } from "../../context/StoreContext";

// DESIGN SYSTEM
import { Button } from "@/design-system";

// SERVICES
import { addAddress, getAllAddresses } from "../../service/userService";

const AddAddress = () => {
  const { token, setSavedAddresses } = useContext(StoreContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    isDefault: false,
  });

  const onChangeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const newAddressResponse = await addAddress(token, formData);
      if (!newAddressResponse) return;

      const response = await getAllAddresses(token);
      if (!response) return;
      const addresses = response.data;
      setSavedAddresses(addresses);
      toast.success("User Address saved successfully🎉");
      navigate("/savedAddresses");
    } catch (error) {
      console.error("Error Saving User Address in FE:", error);
      toast.error("Failed to Save User Address☹️, Try Again Later!");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Add New Address</h2>
      <form onSubmit={onSubmitHandler}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={onChangeHandler}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
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
            value={formData.email}
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
            value={formData.address}
            onChange={onChangeHandler}
            className="form-control"
            required
          />
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={onChangeHandler}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <label>State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={onChangeHandler}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <label>ZIP</label>
            <input
              type="text"
              name="zip"
              value={formData.zip}
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
            checked={formData.isDefault}
            onChange={onChangeHandler}
            className="form-check-input"
            id="isDefault"
          />
          <label className="form-check-label" htmlFor="isDefault">
            Set as default address
          </label>
        </div>

        <Button variant="success">Save Address</Button>
      </form>
    </div>
  );
};

export default AddAddress;
