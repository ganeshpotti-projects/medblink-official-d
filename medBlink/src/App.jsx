import React, { useContext } from "react";

// THIRD PARTY
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// CONTEXT
import { StoreContext } from "./context/StoreContext";

// COMPONENTS
import MenuBar from "./components/Menubar/Menubar";
import Login from "./components/Login/Login";
import MyWishlists from "./components/MyWishlists/MyWishlists";
import Register from "./components/Register/Register";

// PAGES
import Browse from "./pages/Browse/Browse";
import Cart from "./pages/Cart/Cart";
import Contact from "./pages/Contact/Contact";
import Home from "./pages/Home/Home";
import MyOrders from "./pages/MyOrders/MyOrders";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import SavedAddresses from "./pages/SavedAddresses/SavedAddresses";
import AddAddress from "./pages/AddAddress/AddAddress";
import UpdateAddress from "./pages/UpdateAddress/UpdateAddress";
import Profile from "./pages/Profile/Profile";
import Wishlist from "./pages/Wishlist/Wishlist";

const App = () => {
  const { token } = useContext(StoreContext);
  return (
    <div>
      <MenuBar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/productDetails/:productID" element={<ProductDetails />} />
        <Route path="/cart" element={token ? <Cart /> : <Login />} />
        <Route path="/order" element={token ? <PlaceOrder /> : <Login />} />
        <Route path="/login" element={token ? <Home /> : <Login />} />
        <Route path="/register" element={token ? <Home /> : <Register />} />
        <Route path="/myOrders" element={token ? <MyOrders /> : <Login />} />
        <Route
          path="/addAddress"
          element={token ? <AddAddress /> : <Login />}
        />
        <Route
          path="/savedAddresses"
          element={token ? <SavedAddresses /> : <Login />}
        />
        <Route
          path="/updateAddress/:addressID"
          element={token ? <UpdateAddress /> : <Login />}
        />
        <Route path="/profile" element={token ? <Profile /> : <Login />} />
        <Route
          path="/mywishlists"
          element={token ? <MyWishlists /> : <Login />}
        />
        <Route
          path="/wishlist/:wishlistID"
          element={token ? <Wishlist /> : <Login />}
        />
      </Routes>
    </div>
  );
};

export default App;
