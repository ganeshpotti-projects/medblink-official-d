import React, { useState, useEffect, useContext } from "react";

// ASSETS
import { assets, orderStatusIcons } from "../../assets/assets";

// CSS
import "./Orders.css";

// THIRD PARTY
import { over } from "stompjs";
import { toast } from "react-toastify";
import SockJS from "sockjs-client/dist/sockjs.min.js";

// CONTEXT
import StoreContext from "../../context/StoreContext";

// SERVICES
import {
  getAllPartnerOrders,
  updateOrderStatus,
} from "../../services/ordersService";

// COMPONENTS
import Modal from "../../Components/Modal/Modal";

let stompClient = null;

const Orders = () => {
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Out for Delivery");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modal, setModal] = useState(false);

  const { partnerToken } = useContext(StoreContext);

  const openMessageModal = (order) => {
    setSelectedOrder(order);
    setModal(true);
  };

  const fetchAllPartnerOrders = async () => {
    try {
      const response = await getAllPartnerOrders(partnerToken);
      if (!response) return;
      const allPartnerOrders = response.data;
      setData(Array.isArray(allPartnerOrders) ? allPartnerOrders : []);
    } catch (error) {
      console.error("Error Fetching All Partner Orders in FE:", error);
      toast.error("Failed to Fetch All Partner Orders☹️, Try Again Later!");
    }
  };

  useEffect(() => {
    fetchAllPartnerOrders();
  }, []);

  useEffect(() => {
    const socket = new SockJS("http://localhost:30082/ws");
    stompClient = over(socket);

    stompClient.connect(
      {},
      () => {
        console.log("🔗 Connected to WebSocket (Order)");

        stompClient.subscribe("/topic/partner-order-updates", (message) => {
          try {
            const event = JSON.parse(message.body);
            const order = event.partnerOrder;

            setData((prev) => {
              if (event.eventType === "UPDATED_STATUS") {
                const exists = prev.some((o) => o.orderID === order.orderID);
                return exists
                  ? prev.map((o) => (o.orderID === order.orderID ? order : o))
                  : [...prev, order];
              }
              return prev;
            });
          } catch (err) {
            console.error("❌ Failed to parse order event:", err);
          }
        });
      },
      (error) => {
        console.error("STOMP error:", error);
      }
    );

    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.disconnect(() =>
          console.log("❌ WebSocket (Order) Disconnected")
        );
      } else {
        console.log("⚠️ Disconnect skipped (not connected)");
      }
    };
  }, []);

  const handleStatusUpdate = async (orderID, newStatus, partnerID = null) => {
    const payload = { orderID, orderStatus: newStatus };
    if (partnerID) payload.partnerID = partnerID;

    try {
      const response = await updateOrderStatus(payload);
      if (!response) return;
      await fetchAllPartnerOrders();
    } catch (error) {
      console.error("Error Updating Order status in FE:", error);
      toast.error("Failed to Update Order status☹️, Try Again Later!");
    }
  };

  const getNextStatus = (status) => {
    switch (status) {
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

  return (
    <div className="container">
      <div className="text-center mt-4">
        <h3>Orders Dashboard</h3>
      </div>

      <div className="rounded p-3 my-4">
        <div className="d-flex justify-content-around align-items-center">
          {orderStatusIcons?.map((item, index) => (
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
                const isDelivered = order.orderStatus === "Delivered";

                return (
                  <tr key={index}>
                    <td>
                      <img src={assets.delivery} height={75} width={75} />
                    </td>
                    <td>
                      <div>
                        <div>
                          <span className="fw-bold">PhoneNumber: </span>
                          {order.phoneNumber}
                        </div>

                        <div className="address-cell">
                          <span className="fw-bold">Address: </span>
                          {order.userAddress}
                        </div>
                      </div>
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
                      {isDelivered && (
                        <button className="btn btn-secondary btn-sm" disabled>
                          Completed
                        </button>
                      )}

                      {!isDelivered && nextStatus && (
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
                  </tr>
                );
              })}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted">
                    No orders with status "{selectedCategory}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal openModal={modal} closeModal={() => setModal(false)}>
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
            <p>
              <strong>Phone Number:</strong> {selectedOrder.phoneNumber}
            </p>
            <p>
              <strong>Address:</strong> {selectedOrder.userAddress}
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
          </>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
