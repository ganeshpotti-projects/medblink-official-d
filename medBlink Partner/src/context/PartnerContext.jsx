import React, { createContext, useContext, useEffect, useState } from "react";

// THIRD PARTY
import { over } from "stompjs";
import SockJS from "sockjs-client/dist/sockjs.min.js";
import { toast } from "react-toastify";

// CONTEXT
import StoreContext from "./StoreContext";

// SERVICES
import { getPartner } from "../services/partnerService";

export const PartnerContext = createContext(null);

let stompClient = null;

export const PartnerContextProvider = ({ children }) => {
  const { partnerToken } = useContext(StoreContext);
  const [personalDetails, setPersonalDetails] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!partnerToken) {
      setLoading(false);
      return;
    }

    const fetchPartner = async () => {
      setLoading(true);
      try {
        const response = await getPartner(partnerToken);
        if (!response?.data) return;

        const data = response.data;

        setPersonalDetails({
          partnerID: data.partnerID,
          name: data.name,
          phoneNumber: data.phoneNumber,
          email: data.email,
          address: data.address,
          city: data.city,
          zip: data.zip,
          state: data.state,
          country: data.country,
          status: data.status,
          registeredDate: data.registeredDate,
          approvedDate: data.approvedDate,
          isApprovedPartner: data.isApprovedPartner,
          gender: data.gender,
          dateOfBirth: data.dateOfBirth,
        });

        setStats({
          ordersDelivered: data.ordersDelivered || 0,
          blinkPoints: data.blinkPoints || {},
          partnerIncome: data.partnerIncome || {},
        });
      } catch (err) {
        console.error("Error fetching partner:", err);
        toast.error("Failed to fetch partner data ☹️");
      } finally {
        setLoading(false);
      }
    };

    fetchPartner();
  }, [partnerToken]);

  useEffect(() => {
    if (!partnerToken) return;

    const socket = new SockJS("http://localhost:30082/ws");
    stompClient = over(socket);

    stompClient.connect({}, () => {
      console.log("✅ Connected to WebSocket (Partner)");

      stompClient.subscribe("/topic/partner-updates", (message) => {
        try {
          const event = JSON.parse(message.body);
          const updatedPartner = event.response;
          if (!updatedPartner) return;

          setPersonalDetails((prev) => ({
            ...prev,
            name: updatedPartner.name,
            phoneNumber: updatedPartner.phoneNumber,
            email: updatedPartner.email,
            address: updatedPartner.address,
            city: updatedPartner.city,
            zip: updatedPartner.zip,
            state: updatedPartner.state,
            country: updatedPartner.country,
            status: updatedPartner.status,
            approvedDate: updatedPartner.approvedDate,
            gender: updatedPartner.gender,
            dateOfBirth: updatedPartner.dateOfBirth,
          }));

          setStats((prev) => ({
            ...prev,
            ordersDelivered: updatedPartner.ordersDelivered,
            blinkPoints: updatedPartner.blinkPoints,
            partnerIncome: updatedPartner.partnerIncome,
          }));
        } catch (err) {
          console.error("❌ Failed to parse partner update:", err);
        }
      });
    });

    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.disconnect(() =>
          console.log("❌ WebSocket (Partner) disconnected")
        );
      }
    };
  }, [partnerToken]);

  return (
    <PartnerContext.Provider value={{ personalDetails, stats, loading }}>
      {children}
    </PartnerContext.Provider>
  );
};
