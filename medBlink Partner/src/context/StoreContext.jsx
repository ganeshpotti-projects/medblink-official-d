import React, { createContext, useEffect, useState } from "react";

// THIRD PARTY
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// UTILS
import { getTokenExpiry } from "../utils/jwtUtils";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
  const navigate = useNavigate();
  const [partnerToken, setPartnerToken] = useState("");
  const handleLogout = () => {
    toast.warning("Session expired! Please log in again.");
    localStorage.removeItem("partnerToken");
    setPartnerToken("");
    navigate("/login");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("partnerToken");
    if (storedToken) {
      const expiry = getTokenExpiry(storedToken);
      const timeLeft = expiry - Date.now();

      if (timeLeft <= 0) {
        handleLogout();
      } else {
        const timer = setTimeout(() => {
          handleLogout();
        }, timeLeft);

        return () => clearTimeout(timer);
      }
    }
  }, [partnerToken]);

  useEffect(() => {
    async function loadData() {
      try {
        const savedPartnerToken = localStorage.getItem("partnerToken");
        if (savedPartnerToken) {
          setPartnerToken(savedPartnerToken);
        }
      } catch (error) {
        console.error("Error Fetching Partner Token:", error);
      }
    }
    loadData();
  }, []);

  const contextValue = {
    partnerToken,
    setPartnerToken,
    handleLogout
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContext;
