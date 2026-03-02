import React, { useContext, useEffect, useState } from "react";

// ASSETS
import { assets } from "../../assets/assets";

// THIRD PARTY
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// CONTEXT
import { StoreContext } from "../../context/StoreContext";

// DESIGN SYSTEM
import { Badge, Button } from "@/design-system";

// CONFIGS
import { deliveryStates } from "../../config/states";

// SERVICES
import { clearCart } from "../../service/cartService";
import {
  createOrder,
  verifyPaymentOrder,
  deleteOrder,
} from "../../service/ordersService";

// UTILS
import { calculateCartTotals } from "../../utils/cartUtils";
import { RAZORPAY_KEY } from "../../utils/constants";

const PlaceOrder = () => {
  const {
    token,
    quantities,
    cartData,
    setQuantities,
    deliveryAddress,
    setDeliveryAddress,
    savedAddresses,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    state: "",
    city: "",
    zip: "",
    country: "",
  });

  const itemsInCart = Object.values(quantities || {}).filter(
    (qty) => qty > 0
  ).length;

  useEffect(() => {
    if (deliveryAddress?.fullName) {
      const fullName = deliveryAddress.fullName.trim();
      const lastSpaceIndex = fullName.lastIndexOf(" ");
      const firstName =
        lastSpaceIndex !== -1 ? fullName.slice(0, lastSpaceIndex) : fullName;
      const lastName =
        lastSpaceIndex !== -1 ? fullName.slice(lastSpaceIndex + 1) : "";

      setData({
        firstName,
        lastName,
        email: deliveryAddress.email || "",
        phoneNumber: deliveryAddress.phoneNumber || "",
        address: deliveryAddress.address || "",
        city: deliveryAddress.city || "",
        state: deliveryAddress.state || "",
        zip: deliveryAddress.zip || "",
        country: "India",
      });
    }
  }, [deliveryAddress]);

  const { subTotalAmount, shippingAmount, taxAmount, grandTotalAmount } =
    calculateCartTotals(cartData);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const orderData = {
      userAddress: `${data.firstName} ${data.lastName}, ${data.address}, ${data.city}, ${data.state}, ${data.country}, ${data.zip}`,
      phoneNumber: data.phoneNumber,
      email: data.email,
      orderedItems: cartData.map((item) => {
        const quantity = quantities[`${item.productID}-${item.batchID}`];
        return {
          productID: item.productID,
          batchID: item.batchID,
          productQuantity: quantity,
          productPrice: item.productPrice * quantity,
          productCategory: item.category,
          productImageUrl: item.image,
          productDescription: item.description,
          productName: item.name,
        };
      }),
      grandTotalAmount: grandTotalAmount.toFixed(2),
      orderStatus: "Received",
    };

    try {
      const response = await createOrder(orderData, token);
      if (!response) return;
      initiateRazorpayPayment(response.data);
    } catch (error) {
      console.error("Error Creating Order in FE:", error);
      toast.error("Failed to Create Order☹️, Try Again Later!");
    }
  };

  const initiateRazorpayPayment = (orderResponse) => {
    const options = {
      key: RAZORPAY_KEY,
      amount: orderResponse.grandTotalAmount,
      currency: "INR",
      name: "MedBlink",
      description: "Medical Order Payment",
      order_id: orderResponse.razorpayOrderID,
      handler: async (razorpayResponse) =>
        await verifyPayment(razorpayResponse),
      prefill: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        contact: data.phoneNumber,
      },
      theme: { color: "#3399cc" },
      modal: {
        ondismiss: async () => {
          toast.error("Payment cancelled☹️");
          await deleteOrderHandler(orderResponse.orderID, "payment_cancelled");
        },
      },
    };
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const verifyPayment = async (razorpayResponse) => {
    const paymentData = {
      razorpay_order_id: razorpayResponse.razorpay_order_id,
      razorpay_payment_id: razorpayResponse.razorpay_payment_id,
      razorpay_signature: razorpayResponse.razorpay_signature,
    };

    try {
      const response = await verifyPaymentOrder(paymentData, token);
      if (!response) return;

      await clearCartHandler();

      setDeliveryAddress(null);
      navigate("/myOrders");
    } catch (error) {
      console.error("Error Verifying Order in FE:", error);
      toast.error("Failed to Verify Order☹️, Try Again Later!");
      await deleteOrderHandler(orderResponse.orderID, "payment_failure");
    }
  };

  const deleteOrderHandler = async (orderID, deleteOrderReason) => {
    try {
      const response = await deleteOrder(orderID, deleteOrderReason, token);
      if (!response) return;
    } catch {
      console.error("Error Deleting Order in FE:", error);
      toast.error("Failed to Delete Order☹️, Try Again Later!");
    }
  };

  const clearCartHandler = async () => {
    try {
      const response = await clearCart(token);
      if (!response) return;
      setQuantities({});
    } catch {
      console.error("Error Clearing Items in Cart in FE:", error);
      toast.error("Failed to Clear Items from Cart☹️, Try Again Later!");
    }
  };

  return (
    <div className="container mt-4">
      <div className="mb-3">
        <Button
          variant="primary"
          state="outline"
          onClick={() => navigate("/cart")}
        >
          <i className="bi bi-arrow-left"></i> Back to Cart
        </Button>
      </div>
      {cartData.length > 0 ? (
        <div className="row">
          <div className="py-2 text-center">
            <img
              className="d-block mx-auto"
              src={assets.delivery}
              alt=""
              width="200"
              height="80"
            />
            <h2>Checkout</h2>
          </div>
          <div className="border rounded p-3 mb-4 d-flex justify-content-between align-items-start">
            {savedAddresses.length === 0 ? (
              <div>
                <h5 className="mb-1">
                  <strong>No Saved Delivery Addresses</strong>
                </h5>
                <p className="mb-2 text-muted">Please add a new address.</p>
              </div>
            ) : deliveryAddress && Object.keys(deliveryAddress).length > 0 ? (
              <div>
                <h5 className="mb-1">
                  Delivering to:{" "}
                  <strong>
                    {data.firstName} {data.lastName}
                  </strong>
                </h5>
                <p className="mb-2 text-muted">
                  {deliveryAddress.address}, {deliveryAddress.city},{" "}
                  {deliveryAddress.state}, {deliveryAddress.zip}, {data.country}
                </p>
              </div>
            ) : (
              <div>
                <h5 className="mb-1">
                  <strong>No Delivery Address Selected</strong>
                </h5>
                <p className="mb-2 text-muted">
                  Please select a delivery address to continue.
                </p>
              </div>
            )}

            <div className="d-flex gap-2">
              <Link
                to={"/addAddress"}
                className="btn btn-outline-success btn-sm"
              >
                Add
              </Link>
              {savedAddresses.length > 0 && (
                <Link
                  to={"/savedAddresses"}
                  className="btn btn-outline-warning btn-sm"
                >
                  Change
                </Link>
              )}
            </div>
          </div>

          <div className="col-md-4 order-md-2 mb-4">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted">Order Summary</span>
              <Badge variant="primary" state="pill">
                {itemsInCart}
              </Badge>
            </h4>

            <ul className="list-group mb-3">
              {cartData.map((product) => (
                <li
                  key={product.batchID}
                  className="list-group-item d-flex justify-content-between lh-condensed"
                >
                  <div>
                    <h6 className="my-0">{product.name}</h6>
                    <small className="text-muted">
                      Quantity: {product.quantity}
                    </small>
                  </div>
                  <span className="text-muted">
                    ₹ {(product.sellingPrice * product.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
              <li className="list-group-item">
                <div className="d-flex justify-content-between">
                  <span>Sub Total</span>
                  <strong>₹ {subTotalAmount.toFixed(2)}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Shipping Charges</span>
                  <strong>₹ {shippingAmount.toFixed(2)}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Taxes</span>
                  <strong>₹ {taxAmount.toFixed(2)}</strong>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between">
                  <span>Total (INR)</span>
                  <strong>₹ {grandTotalAmount.toFixed(2)}</strong>
                </div>
              </li>
            </ul>
          </div>

          <div className="col-md-8 order-md-1">
            <h4 className="mb-3">Billing address</h4>
            <form onSubmit={onSubmitHandler}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>First name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={data.firstName}
                    onChange={onChangeHandler}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Last name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={data.lastName}
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
                <div className="col-md-3 mb-3">
                  <label>Country</label>
                  <select
                    name="country"
                    value={data.country}
                    onChange={onChangeHandler}
                    className="form-select"
                    required
                  >
                    <option>India</option>
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label>State</label>
                  <select
                    name="state"
                    value={data.state}
                    onChange={onChangeHandler}
                    className="form-select"
                    required
                  >
                    {deliveryStates.map((state) => (
                      <option key={state.value} value={state.value}>
                        {state.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3 mb-3">
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
                <div className="col-md-3 mb-3">
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

              <div className="my-4">
                <Button variant="primary" size="lg">
                  Continue to checkout
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="mb-5">Order Summary</h1>
          <p>OOPS, Your Cart is Empty! ☹️</p>
          <Button
            onClick={() => navigate("/")}
            variant="success"
            state="outline"
          >
            <i className="bi bi-arrow-right me-2"></i>Add More Products
          </Button>
        </div>
      )}
    </div>
  );
};

export default PlaceOrder;
