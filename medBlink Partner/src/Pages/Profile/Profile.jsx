import React, { useContext, useEffect, useState } from "react";

// THIRD PARTY
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// CONTEXT
import { StoreContext } from "../../context/StoreContext";

// SERVICE
import { getPartner, updatePartner } from "../../services/partnerService";

const Profile = () => {
  const navigate = useNavigate();
  const { partnerToken } = useContext(StoreContext);

  const [data, setData] = useState({
    partnerID: "",
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    zip: "",
    state: "",
    country: "",
    status: "",
    registeredDate: "",
    approvedDate: "",
    isApprovedPartner: false,
    gender: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const response = await getPartner(partnerToken);
        if (!response) return;
        const partner = response.data;
        setData({
          partnerID: partner.partnerID || "",
          name: partner.name || "",
          email: partner.email || "",
          phoneNumber: partner.phoneNumber || "",
          address: partner.address || "",
          city: partner.city || "",
          zip: partner.zip || "",
          state: partner.state || "",
          country: partner.country || "",
          registeredDate: partner.registeredDate || "",
          approvedDate: partner.approvedDate || "",
          isApprovedPartner: partner.isApprovedPartner,
          gender: partner.gender || "",
          dateOfBirth: partner.dateOfBirth || "",
        });
      } catch (error) {
        console.error("Error Fetching Partner in FE:", error);
        toast.error("Failed to Fetch Partner☹️, Try Again Later!");
      }
    };

    fetchPartner();
  }, [partnerToken]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const updatedData = {
        name: data.name,
        phoneNumber: data.phoneNumber,
        address: data.address,
        city: data.city,
        zip: data.zip,
        state: data.state,
        country: data.country,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
      };

      const response = await updatePartner(updatedData, partnerToken);
      if (!response) return;
      toast.success("Profile Updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error Updating Partner in FE:", error);
      toast.error("Failed to Update Partner☹️, Try Again Later!");
    }
  };

  return (
    <div className="container">
      <div className="mx-5 my-5">
        <div className="row justify-content-left">
          <div className="col-lg-10 col-md-12 col-sm-12">
            <div className="card-body">
              <h3 className="d-flex mb-4 gap-4 align-items-center">
                <div>
                  Partner Profile <i className="bi bi-person-fill"></i>
                </div>

                {data.isApprovedPartner && (
                  <span className="badge bg-success">Approved</span>
                )}
              </h3>
              {data.registeredDate && data.approvedDate && (
                <div className="mb-4">
                  <div className="card p-3 bg-light">
                    <p className="mb-1">
                      <strong>PartnerID:</strong> {data.partnerID}
                    </p>
                    <p className="mb-1">
                      <strong>Partner Email:</strong> {data.email}
                    </p>
                    <p className="mb-1">
                      <strong>Registered Date:</strong> {data.registeredDate}
                    </p>
                    <p className="mb-0">
                      <strong>Approved Date:</strong> {data.approvedDate}
                    </p>
                  </div>
                </div>
              )}
              <form onSubmit={onSubmitHandler}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
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
                  <label htmlFor="phoneNumber" className="form-label">
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
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <textarea
                    type="text"
                    id="address"
                    name="address"
                    className="form-control"
                    placeholder="Enter your address"
                    value={data.address}
                    onChange={onChangeHandler}
                    rows="2"
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="dateOfBirth" className="form-label">
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

                <div className="row">
                  <div className="col-md-4 mb-3">
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
                  <div className="col-md-4 mb-3">
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
                  <div className="col-md-4 mb-3">
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
                  <div className="col-md-4 mb-3">
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

                <div className="d-flex mb-3 gap-2">
                  <label className="form-label">Gender</label>
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
                  <button className="btn btn-success" type="submit">
                    Save Details
                  </button>
                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => navigate("/")}
                  >
                    Discard Changes
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

export default Profile;
