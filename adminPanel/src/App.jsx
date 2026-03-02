import React, { useContext, useEffect, useState } from "react";

// THIRD PARTY
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// CONTEXT
import { StoreContext } from "./context/StoreContext";

// COMPONENTS
import AddBatch from "./pages/AddBatch/AddBatch";
import AddProduct from "./pages/AddProduct/AddProduct";
import BrowseBatch from "./pages/BrowseBatch/BrowseBatch";
import BrowseProduct from "./pages/BrowseProduct/BrowseProduct";
import ContactUs from "./pages/ContactUs/ContactUs";
import Home from "./pages/Home/Home";
import Login from "./components/Login/Login";
import MenuBar from "./components/MenuBar/MenuBar";
import Orders from "./pages/Orders/Orders";
import SideBar from "./components/SideBar/SideBar";
import MyPartners from "./pages/MyPartners/MyPartners";
import UpdateProduct from "./pages/UpdateProduct/UpdateProduct";
import ViewBatches from "./pages/ViewBatches/ViewBatches";
import ViewProduct from "./pages/ViewProduct/ViewProduct";

const App = () => {
  const { loggedIn } = useContext(StoreContext);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  useEffect(() => {
    if (loggedIn) {
      setSidebarVisible(true);
    } else {
      setSidebarVisible(false);
    }
  }, [loggedIn]);

  return (
    <div className="d-flex" id="wrapper">
      <SideBar sidebarVisible={sidebarVisible} />
      <div id="page-content-wrapper">
        {loggedIn && <MenuBar toggleSidebar={toggleSidebar} />}
        <ToastContainer />
        <div className="container-fluid">
          <Routes>
            <Route
              path="/browseBatch"
              element={loggedIn ? <BrowseBatch /> : <Login />}
            />
            <Route
              path="/browseProduct"
              element={loggedIn ? <BrowseProduct /> : <Login />}
            />
            <Route
              path="/viewBatches/:productID"
              element={loggedIn ? <ViewBatches /> : <Login />}
            />
            <Route
              path="/viewProduct/:productID"
              element={loggedIn ? <ViewProduct /> : <Login />}
            />
            <Route
              path="/addProduct"
              element={loggedIn ? <AddProduct /> : <Login />}
            />
            <Route
              path="/addBatch/:productID"
              element={loggedIn ? <AddBatch /> : <Login />}
            />
            <Route
              path="/updateProduct/:productID"
              element={loggedIn ? <UpdateProduct /> : <Login />}
            />
            <Route path="/orders" element={loggedIn ? <Orders /> : <Login />} />
            <Route path="/" element={loggedIn ? <Home /> : <Login />} />
            <Route
              path="/contacts"
              element={loggedIn ? <ContactUs /> : <Login />}
            />
            <Route
              path="/myPartners"
              element={loggedIn ? <MyPartners /> : <Login />}
            />
            <Route path="/login" element={loggedIn ? <Home /> : <Login />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;