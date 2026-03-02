import React, { useState, useEffect } from "react";

// ASSETS
import { assets, orderStatusIcons } from "../../assets/assets";

// CSS
import "./Orders.css";

// THIRD PARTY
import { over } from "stompjs";
import { toast } from "react-toastify";
import SockJS from "sockjs-client/dist/sockjs.min.js";

// SERVICES
import {
  deleteOrder,
  getAllOrders,
  updateOrderStatus,
  downloadInvoice,
} from "../../services/ordersService";
import { getAllPartners } from "../../services/partnersService";

let stompClient = null;

// COMPONENTS
import Modal from "../../components/Modal/Modal";
import StarRating from "../../components/StarRating/StarRating";

const Orders = () => {
  const [data, setData] = useState([]);
  const [partners, setPartners] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Received");
  const [selectedPartner, setSelectedPartner] = useState({});
  const [orderModal, setOrderModal] = useState(false);
  const [ratingModal, setRatingModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const openMessageModal = (order) => {
    setSelectedOrder(order);
    setOrderModal(true);
  };

  const fetchAllOrders = async () => {
    try {
      const response = await getAllOrders();
      if (!response) return;
      const allOrders = response.data;

      setData(allOrders);
    } catch (error) {
      console.error("Error Fetching All Orders in FE:", error);
      toast.error("Failed to Fetch All Orders☹️, Try Again Later!");
    }
  };

  const fetchAllPartners = async () => {
    try {
      const response = await getAllPartners();
      if (!response) return;
      const allPartners = response.data;

      const approvedPartners = allPartners.filter(
        (p) => p.status === "Approved"
      );
      setPartners(approvedPartners);
    } catch (error) {
      console.error("Error Fetching All Partners in FE:", error);
      toast.error("Failed to Fetch All Partners☹️, Try Again Later!");
    }
  };

  useEffect(() => {
    fetchAllOrders();
    fetchAllPartners();
  }, []);

  useEffect(() => {
    const socket = new SockJS("http://localhost:30082/ws");
    stompClient = over(socket);

    stompClient.connect({}, () => {
      console.log("🔗 Connected to WebSocket (Order)");
      stompClient.subscribe("/topic/order-updates", (message) => {
        try {
          const event = JSON.parse(message.body);
          const order = event.order;

          setData((prev) => {
            if (event.eventType === "VERIFIED") {
              if (prev.some((o) => o.orderID === order.orderID)) return prev;
              return [...prev, order];
            } else if (
              event.eventType === "UPDATED_STATUS" ||
              event.eventType === "FB_SUBMITTED"
            ) {
              return prev.map((o) => (o.orderID === order.orderID ? order : o));
            }
            return prev;
          });
        } catch (err) {
          console.error("❌ Failed to parse order event:", err);
        }
      });
    });

    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.disconnect(() => {
          console.log("❌ WebSocket (Order) Disconnected");
        });
      }
    };
  }, []);

  const handleStatusUpdate = async (orderID, newStatus, partnerID = null) => {
    const payload = { orderID, orderStatus: newStatus };
    if (partnerID) payload.partnerID = partnerID;

    try {
      const response = await updateOrderStatus(payload);
      if (!response) {
        return;
      }

      await fetchAllOrders();

      setSelectedPartner((prev) => ({ ...prev, [orderID]: "" }));
    } catch (error) {
      console.error("Error Updating Order status in FE:", error);
      toast.error("Failed to Update Order status☹️, Try Again Later!");
    }
  };

  const deleteOrderHandler = async (orderID) => {
    if (
      !window.confirm(
        "Are you sure you want delete this Order? You can't revert this change back again!"
      )
    ) {
      return;
    }
    try {
      const response = await deleteOrder(orderID, "delivery_failure");
      if (!response) return;
      toast.success("Order deleted successfully🎉");

      await fetchAllOrders();
    } catch (error) {
      console.error("Error Deleting Order in FE:", error);
      toast.error("Failed to Delete Order☹️, Try Again Later!");
    }
  };

  const getNextStatus = (status) => {
    switch (status) {
      case "Received":
        return "Billing";
      case "Billing":
        return "Dispatched";
      case "Dispatched":
        return "Out for Delivery";
      case "Out for Delivery":
        return "Delivered";
      case "Delivered":
        return "Completed";
      default:
        return "";
    }
  };

  const filteredOrders = data.filter(
    (order) =>
      order.orderStatus === selectedCategory && order.paymentStatus === "Paid"
  );

  const handleDownload = async () => {
    try {
      const response = await downloadInvoice(selectedOrder.orderID);
      if (!response) return;
      toast.success("Invoice Downloaded successfully 🎉");
    } catch (error) {
      console.error("Error Downloading Invoice in FE:", error);
      toast.error("Failed to Download Invoice ☹️, Try Again Later!");
    }
  };

  return (
    <div className="container">
      <div className="text-center mt-4">
        <h3>Orders Dashboard</h3>
      </div>

      <div className="rounded p-3 my-4">
        <div className="d-flex justify-content-around align-items-center">
          {orderStatusIcons.map((item, index) => (
            <div
              key={index}
              className="text-center explore-order-status-list-item"
              onClick={() => setSelectedCategory(item.category)}
            >
              <img
                src={item.icon}
                alt={item.category}
                height={80}
                width={80}
                className={
                  item.category === selectedCategory
                    ? "rounded-circle active"
                    : "rounded-circle"
                }
              />
              <p className="mt-2 fw-bold">{item.category}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-2 row justify-content-center">
        <div className="col-11 card">
          <table className="table table-responsive">
            <tbody>
              {filteredOrders.map((order, index) => {
                const nextStatus = getNextStatus(order.orderStatus);
                const isDispatched = order.orderStatus === "Dispatched";
                const isDelivered = order.orderStatus === "Delivered";

                return (
                  <tr key={index}>
                    <td>
                      <img src={assets.delivery} height={75} width={75} />
                    </td>
                    <td>
                      <div>
                        <span className="fw-bold">PhoneNumber: </span>
                        {order.phoneNumber}
                      </div>
                      <div className="address-cell">
                        <span className="fw-bold">Address: </span>
                        {order.userAddress}
                      </div>
                      {order.partnerDetails && (
                        <>
                          <div>
                            <span className="fw-bold">Partner Name: </span>
                            {order.partnerDetails.name}
                          </div>
                          <div>
                            <span className="fw-bold">
                              Partner PhoneNumber:{" "}
                            </span>
                            {order.partnerDetails.phoneNumber}
                          </div>
                        </>
                      )}
                    </td>
                    <td>₹ {order.grandTotalAmount.toFixed(2)}</td>
                    <td>Items: {order.orderedItems.length}</td>
                    <td>
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => openMessageModal(order)}
                      >
                        Order Info
                      </button>
                    </td>
                    <td>
                      {isDispatched && (
                        <>
                          <select
                            className="form-control mb-2"
                            value={selectedPartner[order.orderID] || ""}
                            onChange={(e) =>
                              setSelectedPartner((prev) => ({
                                ...prev,
                                [order.orderID]: e.target.value,
                              }))
                            }
                          >
                            <option value="">Select Partner</option>
                            {partners.map((partner) => (
                              <option
                                key={partner.partnerID}
                                value={partner.partnerID}
                              >
                                {partner.name}
                              </option>
                            ))}
                          </select>
                          <button
                            className="btn btn-primary btn-sm"
                            disabled={!selectedPartner[order.orderID]}
                            onClick={() =>
                              handleStatusUpdate(
                                order.orderID,
                                nextStatus,
                                selectedPartner[order.orderID]
                              )
                            }
                          >
                            {nextStatus} <i className="bi bi-arrow-right"></i>
                          </button>
                        </>
                      )}

                      {isDelivered && (
                        <button className="btn btn-success btn-sm" disabled>
                          Completed
                        </button>
                      )}

                      {!isDispatched && !isDelivered && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() =>
                            handleStatusUpdate(order.orderID, nextStatus)
                          }
                        >
                          {nextStatus} <i className="bi bi-arrow-right"></i>
                        </button>
                      )}
                    </td>
                    <td>
                      {order.orderStatus === "Delivered" &&
                        order.isOrderFeedbackReceived && (
                          <button
                            className="btn btn-outline-success btn-sm"
                            onClick={() => {
                              setSelectedFeedback(order.orderFeedback || {});
                              setRatingModal(true);
                            }}
                          >
                            View Rating
                          </button>
                        )}
                    </td>
                    <td>
                      {order.orderStatus !== "Delivered" && (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => deleteOrderHandler(order.orderID)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    No orders with status "{selectedCategory}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal openModal={ratingModal} closeModal={() => setRatingModal(false)}>
        {selectedFeedback && (
          <>
            <h5 className="fw-bold text-center mb-4">
              Order Rating Information
            </h5>

            <div className="mb-3">
              <label className="fw-bold">Order Rating:</label>
              <StarRating rating={selectedFeedback.orderRating || 0} />
            </div>

            <div className="mb-3">
              <label className="fw-bold">Order Review:</label>
              <div className="border rounded p-2 bg-light">
                {selectedFeedback.orderReview ? (
                  selectedFeedback.orderReview
                ) : (
                  <span className="text-muted">No review provided.</span>
                )}
              </div>
            </div>

            <div className="mb-3">
              <label className="fw-bold">Partner Rating:</label>
              <StarRating rating={selectedFeedback.partnerRating || 0} />
            </div>

            <div className="mb-3">
              <label className="fw-bold">Partner Review:</label>
              <div className="border rounded p-2 bg-light">
                {selectedFeedback.partnerReview ? (
                  selectedFeedback.partnerReview
                ) : (
                  <span className="text-muted">
                    No Partner review provided.
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </Modal>

      <Modal openModal={orderModal} closeModal={() => setOrderModal(false)}>
        {selectedOrder && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold m-0">Order Details</h4>
              {selectedOrder.orderStatus && (
                <span
                  className={`badge bg-${
                    selectedOrder.orderStatus === "Delivered"
                      ? "success"
                      : "warning"
                  } fs-6`}
                >
                  {selectedOrder.orderStatus}
                </span>
              )}
            </div>
            <p>
              <strong>Order ID:</strong> {selectedOrder.orderID}
            </p>
            <p>
              <strong>Payment Status:</strong>{" "}
              <span
                className={`badge bg-${
                  selectedOrder.paymentStatus === "Paid" ? "success" : "warning"
                }`}
              >
                {selectedOrder.paymentStatus}
              </span>
            </p>
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
            </h5>
            <div className="d-flex fw-bold text-primary fs-4 justify-content-center">
              Rs {selectedOrder.grandTotalAmount} /-
            </div>
            <hr />
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
            {selectedOrder.partnerDetails && (
              <>
                <hr />
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
            <button
              className="btn btn-outline-success"
              onClick={handleDownload}
            >
              Download Invoice <i className="bi bi-download"></i>
            </button>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
