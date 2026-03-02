import React, { useState, useEffect } from "react";

// ASSETS
import { assets, partnerStatusIcons } from "../../assets/assets";

// CSS
import "./MyPartners.css";

// THIRD PARTY
import { over } from "stompjs";
import { toast } from "react-toastify";
import SockJS from "sockjs-client/dist/sockjs.min.js";

// SERVICES
import {
  getAllPartners,
  updatePartnerStatus,
} from "../../services/partnersService";

// COMPONENTS
import Loading from "../../components/Loading/Loading.jsx";
import Modal from "../../components/Modal/Modal.jsx";

let stompClient = null;

const MyPartners = () => {
  const [data, setData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const [modal, setModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [loading, setLoading] = useState(false);

  const openMessageModal = (partner) => {
    setSelectedPartner(partner);
    setModal(true);
  };

  const fetchAllPartners = async () => {
    try {
      const response = await getAllPartners();
      if (!response) return;
      setData(response.data);
    } catch (error) {
      console.error("Error Fetching All Partners in FE:", error);
      toast.error("Failed to Fetch All Partners☹️, Try Again Later!");
    }
  };

  const updateStatus = async (event, partnerID) => {
    try {
      setLoading(true);
      const response = await updatePartnerStatus(partnerID, event.target.value);
      if (!response) return null;
      toast.success("Partner status updated successfully🎉");

      await fetchAllPartners();

      setLoading(false);
    } catch (error) {
      console.error("Error Updating Partner status in FE:", error);
      toast.error("Failed to Update Partner status☹️, Try Again Later!");
      setLoading(false);
    }
  };

  const connectWS = () => {
    const socket = new SockJS("http://localhost:30082/ws");
    stompClient = over(socket);

    stompClient.connect({}, () => {
      console.log("🔗 Connected to WebSocket (Partner)");
      stompClient.subscribe("/topic/partner-updates", (message) => {
        if (message.body) {
          const payload = JSON.parse(message.body);
          const updatedPartner = payload.response;

          setData((prev) => {
            const exists = prev.find(
              (p) => p.partnerID === updatedPartner.partnerID
            );
            if (exists) {
              return prev.map((p) =>
                p.partnerID === updatedPartner.partnerID
                  ? { ...updatedPartner }
                  : p
              );
            }
            return [...prev, { ...updatedPartner }];
          });
        }
      });
    });
  };

  useEffect(() => {
    fetchAllPartners();
    connectWS();

    return () => {
      if (stompClient) {
        stompClient.disconnect(() => {
          console.log("❌ WebSocket (Partner) Disconnected");
        });
      }
    };
  }, []);

  const filteredPartners = data.filter((p) => p.status === selectedStatus);

  return (
    <div className="container">
      <div className="text-center mt-4">
        <h3>My Partners Dashboard</h3>
      </div>

      <div className="rounded p-3 my-4">
        <div className="d-flex justify-content-around align-items-center">
          {partnerStatusIcons.map((item, idx) => (
            <div
              key={idx}
              className="text-center explore-order-status-list-item"
              onClick={() => setSelectedStatus(item.status)}
            >
              <img
                src={item.icon}
                alt={item.status}
                height={80}
                width={80}
                className={
                  item.status === selectedStatus
                    ? "rounded-circle active"
                    : "rounded-circle"
                }
              />
              <p className="mt-2 fw-bold">{item.status}</p>
            </div>
          ))}
        </div>
      </div>

      {!loading ? (
        <div className="p-2 row justify-content-center">
          <div className="col-11 card">
            <table className="table table-responsive">
              <tbody>
                {filteredPartners.length > 0 ? (
                  filteredPartners.map((partner, index) => (
                    <tr key={index}>
                      <td>
                        <img src={assets.delivery} height={75} width={75} />
                      </td>
                      <td>
                        <div>
                          <div>
                            <strong>Name:</strong> {partner.name}
                          </div>
                          <div>
                            <strong>Phone:</strong> {partner.phoneNumber}
                          </div>
                          <div>
                            <strong>City:</strong> {partner.city}
                          </div>
                          <div>
                            <strong>Address:</strong> {partner.address}
                          </div>
                        </div>
                      </td>
                      <td>{partner.email}</td>
                      <td>
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() => openMessageModal(partner)}
                        >
                          More Info
                        </button>
                      </td>
                      <td>
                        <select
                          className="form-control"
                          value={partner.status}
                          onChange={(e) => updateStatus(e, partner.partnerID)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center text-muted">
                      No partners with status "{selectedStatus}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <Loading />
      )}

      <Modal openModal={modal} closeModal={() => setModal(false)}>
        {selectedPartner && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold m-0">Partner Details</h5>
              {selectedPartner.status && (
                <span
                  className={`badge bg-${
                    selectedPartner.status === "Approved"
                      ? "success"
                      : selectedPartner.status === "Rejected"
                      ? "danger"
                      : "warning"
                  }`}
                >
                  {selectedPartner.status}
                </span>
              )}
            </div>
            <p>
              <strong>Partner ID:</strong> {selectedPartner.partnerID}
            </p>
            <p>
              <strong>Name:</strong> {selectedPartner.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedPartner.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedPartner.phoneNumber}
            </p>
            <p>
              <strong>Status:</strong> {selectedPartner.status}
            </p>
            <p>
              <strong>Registered Date:</strong> {selectedPartner.registeredDate}
            </p>
            <p>
              <strong>Approved Date:</strong> {selectedPartner.approvedDate}
            </p>
            <p>
              <strong>Gender:</strong> {selectedPartner.gender || "N/A"}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {selectedPartner.dateOfBirth || "N/A"}
            </p>
            <p>
              <strong>Orders Delivered:</strong>{" "}
              {selectedPartner.ordersDelivered}
            </p>
            <hr />
            <h5 className="fw-bold mb-3">Partner Address Details</h5>
            <p>
              <strong>Address:</strong> {selectedPartner.address}
            </p>
            <p>
              <strong>City:</strong> {selectedPartner.city}
            </p>
            <p>
              <strong>Zip:</strong> {selectedPartner.zip}
            </p>
            <p>
              <strong>State:</strong> {selectedPartner.state}
            </p>
            <p>
              <strong>Country:</strong> {selectedPartner.country}
            </p>
          </>
        )}
      </Modal>
    </div>
  );
};

export default MyPartners;
