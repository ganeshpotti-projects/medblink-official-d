import React, { useContext, useEffect, useState } from "react";

// ASSETS
import { assets } from "../../assets/assets";

// CSS
import "./MyOrders.css";

// THIRD PARTY
import { over } from "stompjs";
import SockJS from "sockjs-client/dist/sockjs.min.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// CONTEXT
import { StoreContext } from "../../context/StoreContext";

// DESIGN SYSTEM
import { Badge, Button } from "@/design-system";

// SERVICES
import {
  deleteOrder,
  getOrders,
  submitFeedback,
  downloadInvoice,
} from "../../service/ordersService";

// COMPONENTS
import Modal from "../../components/Modal/Modal";
import DateFilterBar from "../../components/DateFilterTab/DateFilterTab";

let stompClient = null;

const MyOrders = () => {
  const { token } = useContext(StoreContext);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [orderModal, setOrderModal] = useState();
  const [ratingModal, setRatingModal] = useState(false);
  const [selectedOrderID, setSelectedOrderID] = useState(null);
  const [feedback, setFeedback] = useState({
    orderRating: 0,
    orderReview: "",
    partnerRating: 0,
    partnerReview: "",
  });

  const fetchOrders = async () => {
    try {
      const response = await getOrders(token);
      if (!response) return;
      const orders = response.data;
      setData(orders);
    } catch (error) {
      console.error("Error Fetching Orders in FE:", error);
      toast.error("Failed to Fetch Orders☹️, Try Again Later!");
    }
  };

  const handleDownload = async (orderID) => {
    try {
      const response = await downloadInvoice(orderID, token);
      if (!response) return;
      toast.success("Invoice Downloaded successfully 🎉");
    } catch (error) {
      console.error("Error Downloading Invoice in FE:", error);
      toast.error("Failed to Download Invoice ☹️, Try Again Later!");
    }
  };

  const connectWebSocket = () => {
    const socket = new SockJS("http://localhost:30082/ws");
    stompClient = over(socket);
    stompClient.connect({}, () => {
      console.log("🔗 Connected to WebSocket");
      stompClient.subscribe("/topic/order-updates", (message) => {
        const event = JSON.parse(message.body);
        const updatedOrder = event.order;
        setData((prevData) =>
          prevData.map((order) =>
            order.orderID === updatedOrder.orderID ? updatedOrder : order
          )
        );
      });
    });
  };

  const handleOpenFeedbackModal = (orderID) => {
    setSelectedOrderID(orderID);
    setFeedback({
      orderRating: 0,
      orderReview: "",
      partnerRating: 0,
      partnerReview: "",
    });
    setRatingModal(true);
  };

  const handleRatingClick = (field, value) => {
    setFeedback((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitFeedback = async () => {
    try {
      const response = await submitFeedback(selectedOrderID, feedback, token);
      if (!response) return;
      setRatingModal(false);
      toast.success("Feedback submitted successfully🎉");
      await fetchOrders();
    } catch (error) {
      console.error("Error Submitting Feedback in FE:", error);
      toast.error("Failed to Submit Feedback☹️, Try Again Later!");
    }
  };

  const handleDeleteOrder = async (orderID) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this order permanently? You can't revert this back again!"
      )
    )
      return;

    try {
      const response = await deleteOrder(
        orderID,
        "user_permanently_deleted",
        token
      );
      if (!response) return;
      toast.success("Order deleted successfully🎉");
      await fetchOrders();
    } catch (error) {
      console.error("Error Deleting Order in FE:", error);
      toast.error("Failed to Delete Order☹️, Try Again Later!");
    }
  };

  const handleDateFilter = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);

    const filtered = data.filter((order) => {
      if (!order.orderedDate) return false;
      const [datePart, timePart] = order.orderedDate.split(" ");
      const [day, month, year] = datePart.split("/");
      const [hours, minutes, seconds] = timePart.split(":");
      const orderDate = new Date(year, month - 1, day, hours, minutes, seconds);
      return orderDate >= startDate && orderDate <= endDate;
    });

    setActiveFilter({ startDate: start, endDate: end });
    setFilteredData(filtered);
  };

  const handleClearFilter = () => {
    setActiveFilter(null);
    setFilteredData([]);
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
      connectWebSocket();
    }
    return () => {
      if (stompClient) {
        stompClient.disconnect(() => {
          console.log("❌ WebSocket Disconnected");
        });
      }
    };
  }, [token]);

  const ordersToDisplay = (activeFilter ? filteredData : data)
    .slice()
    .reverse();

  return (
    <div className="container">
      <div className="mt-5">
        <Button
          variant="primary"
          state="outline"
          onClick={() => navigate("/browse")}
        >
          <i className="bi bi-arrow-left"></i> Back to Home
        </Button>
      </div>
      <h2 className="text-center mb-4">
        My Orders <i className="bi bi-box-seam-fill"></i>
      </h2>
      <div className="d-flex justify-content-start">
        <DateFilterBar
          onFilter={handleDateFilter}
          onClear={handleClearFilter}
          activeFilter={activeFilter}
        />
      </div>
      <div className="py-4 row justify-content-center">
        {ordersToDisplay.length > 0 ? (
          ordersToDisplay.map((order) => (
            <div
              key={order.orderID}
              className="card-custom shadow-sm rounded-5 d-flex align-items-center justify-content-between p-3 mb-3 w-100"
            >
              <div className="d-flex align-items-center gap-5">
                <div
                  className="img-box rounded-circle overflow-hidden"
                  style={{ width: "60px", height: "60px" }}
                >
                  <img
                    src={assets.register}
                    alt="delivery order"
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>

                <div className="ms-3">
                  <div>
                    <strong>OrderID: </strong>
                    {order.orderID}
                  </div>
                  <span className="small d-block mb-1">
                    Ordered on <strong>{order.orderedDate}</strong>
                  </span>
                </div>
                <div className="d-flex gap-5">
                  <div>
                    <div className="fw-semibold text-center">
                      ₹ {order.grandTotalAmount}
                    </div>
                    <div className="text-center">
                      <span
                        className={`badge ${
                          order.orderStatus.toLowerCase() === "delivered"
                            ? "bg-success"
                            : "bg-warning"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  {order.partnerDetails && (
                    <div>
                      <div className="text-center fw-semibold text-primary">
                        Partner Info <i className="bi bi-info-circle"></i>
                      </div>
                      <div className="small text-muted">
                        <strong>Name:</strong> {order.partnerDetails.name}
                      </div>
                      <div className="small text-muted">
                        <strong>Ph no:</strong>{" "}
                        {order.partnerDetails.phoneNumber}
                      </div>
                      <div className="small text-muted">
                        <strong>Orders Delivered:</strong>{" "}
                        <span className="text-success">
                          {order.partnerDetails.ordersDelivered}
                          <i className="bi bi-lightning-fill"></i>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="d-flex align-items-center gap-4">
                {order.orderStatus.toLowerCase() === "delivered" && (
                  <>
                    {order.isOrderFeedbackReceived ? (
                      <Button
                        variant="warning"
                        state="outline"
                        onClick={() => handleOpenFeedbackModal(order.orderID)}
                      >
                        <i className="bi bi-hand-thumbs-up-fill"></i>
                      </Button>
                    ) : (
                      <Button
                        variant="warning"
                        state="outline"
                        onClick={() => handleOpenFeedbackModal(order.orderID)}
                      >
                        <i className="bi bi-hand-thumbs-up"></i>
                      </Button>
                    )}
                    <Button
                      variant="danger"
                      state="outline"
                      onClick={() => handleDeleteOrder(order.orderID)}
                    >
                      <i className="bi bi-trash3-fill"></i>
                    </Button>
                  </>
                )}
                <Button
                  variant="success"
                  state="outline"
                  onClick={() => handleDownload(order.orderID)}
                >
                  <i className="bi bi-download"></i>
                </Button>
                <Button
                  variant="primary"
                  state="outline"
                  onClick={() => {
                    setSelectedOrder(order);
                    setOrderModal(true);
                  }}
                >
                  <i className="bi bi-info-circle-fill"></i> Order Info
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="d-flex row justify-content-center card-custom shadow-sm rounded-5 p-3 mb-3 w-100 text-center">
            {activeFilter ? (
              <>
                <p className="">Sorry, No Orders Found ☹️</p>
                <p className="fw-bold">Search on Different Dates</p>
              </>
            ) : (
              <>
                <p className="fw-bold">No Orders Found, Place your Order 🤗</p>
                <Button
                  variant="success"
                  state="link"
                  onClick={() => navigate("/browse")}
                >
                  Place Order <i className="bi bi-plus-circle"></i>
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      <Modal openModal={ratingModal} closeModal={() => setRatingModal(false)}>
        {(() => {
          const order = data.find((o) => o.orderID === selectedOrderID);
          if (!order) return null;

          return order.isOrderFeedbackReceived ? (
            <div className="d-flex row align-items-center justify-content-center p-4">
              <p className="fw-bold text-success">
                Feedback Already Submitted !!
              </p>
              <h2>Thank you ❤️</h2>
            </div>
          ) : (
            <>
              <h5 className="fw-bold text-center">Give Your Feedback</h5>

              <div className="mt-3 text-start">
                <label className="fw-semibold">Order Rating:</label>
                <div>
                  {[...Array(5)].map((_, index) => (
                    <i
                      key={index}
                      className={`bi ${
                        feedback.orderRating > index
                          ? "bi-star-fill"
                          : "bi-star"
                      } text-warning fs-4 me-1`}
                      onClick={() =>
                        handleRatingClick("orderRating", index + 1)
                      }
                      style={{ cursor: "pointer" }}
                    ></i>
                  ))}
                </div>
              </div>

              <div className="mt-2 text-start">
                <label className="fw-semibold">Order Review:</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={feedback.orderReview}
                  onChange={(e) =>
                    setFeedback((prev) => ({
                      ...prev,
                      orderReview: e.target.value,
                    }))
                  }
                ></textarea>
              </div>

              <div className="mt-3 text-start">
                <label className="fw-semibold">Delivery Partner Rating:</label>
                <div>
                  {[...Array(5)].map((_, index) => (
                    <i
                      key={index}
                      className={`bi ${
                        feedback.partnerRating > index
                          ? "bi-star-fill"
                          : "bi-star"
                      } text-warning fs-4 me-1`}
                      onClick={() =>
                        handleRatingClick("partnerRating", index + 1)
                      }
                      style={{ cursor: "pointer" }}
                    ></i>
                  ))}
                </div>
              </div>

              <div className="mt-2 text-start">
                <label className="fw-semibold">Delivery Partner Review:</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={feedback.partnerReview}
                  onChange={(e) =>
                    setFeedback((prev) => ({
                      ...prev,
                      partnerReview: e.target.value,
                    }))
                  }
                ></textarea>
              </div>

              <div className="d-flex justify-content-between mt-4">
                <Button
                  variant="secondary"
                  onClick={() =>
                    setFeedback({
                      orderRating: 0,
                      orderReview: "",
                      partnerRating: 0,
                      partnerReview: "",
                    })
                  }
                >
                  Clear Changes
                </Button>
                <Button
                  variant="success"
                  onClick={handleSubmitFeedback}
                  disabled={
                    feedback.orderRating === 0 || feedback.partnerRating === 0
                  }
                >
                  Submit Feedback
                </Button>
              </div>
            </>
          );
        })()}
      </Modal>

      <Modal openModal={orderModal} closeModal={() => setOrderModal(false)}>
        {selectedOrder && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold m-0">Order Details</h4>
              {selectedOrder.orderStatus && (
                <Badge
                  variant={
                    selectedOrder.orderStatus === "Delivered"
                      ? "success"
                      : "warning"
                  }
                >
                  {selectedOrder.orderStatus}
                </Badge>
              )}
            </div>
            <h5>
              <strong>User Details</strong>
            </h5>
            <p>
              <strong>User ID:</strong> {selectedOrder.userID}
            </p>
            <p>
              <strong>Phone Number:</strong> (+91) {selectedOrder.phoneNumber}
            </p>
            <p>
              <strong>Email:</strong> {selectedOrder.email}
            </p>
            <p>
              <strong>Address:</strong> {selectedOrder.userAddress}
            </p>
            <hr />
            {selectedOrder.partnerDetails && (
              <>
                <h5>
                  <strong>Partner Details</strong>
                </h5>
                <p>
                  <strong>Partner ID:</strong> {selectedOrder.partnerID}
                </p>
                <p>
                  <strong>Phone Number:</strong> (+91){" "}
                  {selectedOrder.partnerDetails.phoneNumber}
                </p>
                <p>
                  <strong>Email:</strong> {selectedOrder.partnerDetails.email}
                </p>
                <p>
                  <strong>Orders Delivered:</strong>{" "}
                  {selectedOrder.partnerDetails.ordersDelivered}
                </p>
              </>
            )}
            <hr />
            <h5>
              <strong>Ordered Items</strong>
            </h5>
            <ol>
              {selectedOrder.orderedItems?.map((item, idx) => (
                <li key={idx}>
                  <div className="d-flex ">
                    {item.productName} x {item.productQuantity}
                  </div>
                </li>
              ))}
            </ol>
            <hr />
            <h5>
              <strong>Grand Total Amount </strong>{" "}
              <div className="d-flex fw-bold text-danger fs-4 justify-content-center">
                Rs {selectedOrder.grandTotalAmount} /-
              </div>
            </h5>
            <hr />
            <p>
              <strong>Order ID:</strong> {selectedOrder.orderID}
            </p>
            <p>
              <strong>Ordered Date(Time):</strong> {selectedOrder.orderedDate}
            </p>
            <p>
              <strong>Payment Status:</strong>{" "}
              <Badge
                variant={
                  selectedOrder.paymentStatus === "Paid" ? "success" : "warning"
                }
                state="pill"
              >
                {selectedOrder.paymentStatus}
              </Badge>
            </p>
            <hr />

            {selectedOrder.orderStatus === "Delivered" && (
              <p>
                <strong>Delivered Date(Time):</strong>{" "}
                {selectedOrder.deliveredDate}
              </p>
            )}
            <Button
              variant="success"
              state="outline"
              onClick={() => handleDownload(selectedOrder.orderID)}
            >
              Download Invoice <i className="bi bi-download"></i>
            </Button>
          </>
        )}
      </Modal>
    </div>
  );
};

export default MyOrders;
