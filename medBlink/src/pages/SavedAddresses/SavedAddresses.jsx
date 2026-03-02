import React, { useContext, useEffect, useState } from "react";

// CSS
import "./SavedAddresses.css";

// THIRD PARTY
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// CONTEXT
import { StoreContext } from "../../context/StoreContext";

// DESIGN SYSTEM
import { Button, Badge } from "@/design-system";

// SERVICES
import { deleteAddress, getAllAddresses } from "../../service/userService";

const SavedAddresses = () => {
  const {
    token,
    deliveryAddress,
    setDeliveryAddress,
    setEditAddress,
    setSavedAddresses,
  } = useContext(StoreContext);
  const [addresses, setAddresses] = useState([]);
  const [selectedID, setSelectedID] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedAddresses();
  }, [token]);

  const fetchSavedAddresses = async () => {
    try {
      const response = await getAllAddresses(token);
      if (!response) return;
      const allAddresses = response.data;
      const addressList = Array.isArray(allAddresses) ? allAddresses : [];
      setAddresses(addressList);
      setSavedAddresses(addressList);
      const defaultAddress = addressList.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setSelectedID(defaultAddress.addressID);
      }
    } catch (error) {
      console.error("Error Fetching User Addresses in FE:", error);
      toast.error("Failed to Fetch User Addresses☹️, Try Again Later!");
    }
  };

  const handleSubmit = () => {
    const selected = addresses.find((addr) => addr.addressID === selectedID);
    if (!selected) return toast.error("Please select an address");
    setDeliveryAddress(selected);
    navigate("/order");
  };

  const handleDelete = async (address) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user address permanently? This change can't be reverted back again!"
      )
    )
      return;
    try {
      const response = await deleteAddress(token, address.addressID);
      if (!response) return;
      if (deliveryAddress && deliveryAddress.addressID === address.addressID) {
        localStorage.removeItem("deliveryAddress");
        setDeliveryAddress(null);
      }
      toast.success("User Address deleted successfully🎉");
      await fetchSavedAddresses();
    } catch (error) {
      console.error("Error Deleting User Address in FE:", error);
      toast.error("Failed to Delete User Address☹️, Try Again Later!");
    }
  };

  const handleEdit = async (address) => {
    setEditAddress(address);
    navigate(`/updateAddress/${address.addressID}`);
  };

  const handleAddNew = () => {
    navigate("/addAddress");
  };

  return (
    <div className="container my-4">
      <div className="mb-3">
        <Button
          variant="primary"
          state="outline"
          onClick={() => navigate("/order")}
        >
          <i className="bi bi-arrow-left"></i> Back to Order
        </Button>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Choose a Delivery Address</h2>
        <Button variant="success" state="outline" onClick={handleAddNew}>
          Add New Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <p>No saved addresses found. Please add one from your profile.</p>
      ) : (
        <div className="list-group">
          {addresses.map((address) => {
            const isSelected = selectedID === address.addressID;
            return (
              <label
                key={address.addressID || Math.random()}
                className={`list-group-item address-card ${
                  isSelected ? "selected" : ""
                }`}
              >
                <div className="d-flex align-items-start justify-content-between w-100">
                  <div className="form-check me-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="address"
                      value={address.addressID}
                      checked={isSelected}
                      onChange={() => setSelectedID(address.addressID)}
                    />
                  </div>

                  <div className="flex-grow-1">
                    <strong>{address.fullName}</strong>
                    <br />
                    <span>{address.address}</span>
                    <br />
                    <span>
                      {address.city}, {address.state} - {address.zip}
                    </span>
                    <br />
                    <span>
                      {address.email} <br /> {address.phoneNumber}
                    </span>
                  </div>

                  <div className="text-end">
                    {address.isDefault && (
                      <div className="mb-2">
                        <Badge variant="success" state="pill">
                          Default
                        </Badge>
                      </div>
                    )}
                    <div className="d-flex gap-2">
                      <Button
                        variant="primary"
                        state="outline"
                        size="sm"
                        onClick={() => handleEdit(address)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        state="outline"
                        size="sm"
                        onClick={() => handleDelete(address)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      )}

      {addresses.length > 0 && (
        <div className="mt-4">
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!selectedID}
          >
            Deliver to this Address
          </Button>
        </div>
      )}
    </div>
  );
};

export default SavedAddresses;
