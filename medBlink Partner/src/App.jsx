import React, { useContext, useEffect, useState } from "react";

// CONTEXT
import { StoreContext } from "./context/StoreContext.jsx";

// THIRD PARTY
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// COMPONENTS
import Home from "./Pages/Home/Home.jsx";
import Login from "./Components/Login/Login.jsx";
import MenuBar from "./Components/MenuBar/MenuBar.jsx";
import Orders from "./Pages/orders/Orders.jsx";
import Profile from "./Pages/Profile/Profile.jsx";
import Register from "./Components/Register/Register.jsx";
import SideBar from "./Components/SideBar/SideBar.jsx";

const App = () => {
  const { partnerToken } = useContext(StoreContext);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  useEffect(() => {
    if (partnerToken) {
      setSidebarVisible(true);
    } else {
      setSidebarVisible(partnerToken);
    }
  }, [partnerToken]);

  return (
    <div className="d-flex" id="wrapper">
      {partnerToken && <SideBar sidebarVisible={sidebarVisible} />}
      <div id="page-content-wrapper">
        {partnerToken && <MenuBar toggleSidebar={toggleSidebar} />}
        <ToastContainer />
        <div className="container-fluid">
          <Routes>
            <Route path="/login" element={partnerToken ? <Orders /> : <Login />} />
            <Route path="/register" element={partnerToken ? <Orders /> : <Register />} />
            <Route path="/" element={partnerToken ? <Home /> : <Login />} />
            <Route path="/orders" element={partnerToken ? <Orders /> : <Login />} />
            <Route path="/profile" element={partnerToken ? <Profile /> : <Login />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
