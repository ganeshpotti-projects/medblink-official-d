import { createContext, useEffect, useState } from "react";

// THIRD PARTY
import { over } from "stompjs";
import { toast } from "react-toastify";
import SockJS from "sockjs-client/dist/sockjs.min.js";
import { useNavigate } from "react-router-dom";

// SERVICES
import {
  addQtyToCart,
  getCartData,
  removeQtyFromCart,
} from "../service/cartService";
import { getAllProductsList } from "../service/productsService";
import { getAllAddresses } from "../service/userService";

// UTILS
import { getTokenExpiry } from "../utils/jwtUtils";

export const StoreContext = createContext(null);

let stompClient = null;

export const StoreContextProvider = (props) => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [productsList, setProductsList] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState(() => {
    const stored = localStorage.getItem("deliveryAddress");
    return stored ? JSON.parse(stored) : null;
  });
  const [editAddress, setEditAddress] = useState(null);

  const handleLogout = () => {
    toast.warning("Session expired! Please log in again.");
    localStorage.removeItem("token");
    setToken("");
    setQuantities({});
    setDeliveryAddress(null);
    setSavedAddresses([]);
    setEditAddress(null);
    navigate("/");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
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
  }, [token]);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await getAllProductsList();
        if (!response) return;
        const products = response.data || [];
        setProductsList(products);

        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
          await loadCartData(storedToken, products);
          await getAllAddressesHandler(storedToken);
        }
      } catch (error) {
        console.error("Error Fetching All Products in FE:", error);
        toast.error("Failed to Fetch All Products☹️, Try Again Later!");
      }
    }
    loadData();
  }, []);

  const enrichCartItems = (items, productsList) =>
    items.map((item) => {
      const productDetails = productsList.find(
        (p) => p.productID === item.productID
      );
      return {
        ...item,
        productPrice: item.marketPrice,
        name: productDetails?.productName,
        description: productDetails?.productDescription,
        image: productDetails?.productImageUrl,
        category: productDetails?.productCategory,
      };
    });

  useEffect(() => {
    const socket = new SockJS("http://localhost:30082/ws");
    stompClient = over(socket);

    stompClient.connect({}, () => {
      console.log("🔗 Connected to WebSocket (Product)");
      stompClient.subscribe("/topic/product-user-updates", (message) => {
        try {
          const event = JSON.parse(message.body);
          const product = event.product;

          setProductsList((prev) => {
            switch (event.eventType) {
              case "CREATED":
                return prev.some((p) => p.productID === product.productID)
                  ? prev
                  : [...prev, product];
              case "UPDATED":
                return prev.map((p) =>
                  p.productID === product.productID ? product : p
                );
              case "DELETED":
                return prev.filter((p) => p.productID !== product.productID);
              default:
                return prev;
            }
          });
        } catch (err) {
          console.error("❌ Failed to parse product event:", err);
        }
      });
    });

    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.disconnect(() =>
          console.log("❌ WebSocket (Product) Disconnected")
        );
      }
    };
  }, []);

  useEffect(() => {
    if (deliveryAddress) {
      localStorage.setItem("deliveryAddress", JSON.stringify(deliveryAddress));
    } else {
      localStorage.removeItem("deliveryAddress");
    }
  }, [deliveryAddress]);

  const buildQuantities = (items) => {
    const map = {};
    items.forEach((item) => {
      map[`${item.productID}-${item.batchID}`] = item.quantity;
    });
    return map;
  };

  const loadCartData = async (storedToken, products = productsList) => {
    try {
      const response = await getCartData(storedToken);
      const cart = response.data || {};
      const cartItems = cart.items || [];
      setQuantities(buildQuantities(cartItems));
      setCartData(enrichCartItems(cartItems, products));
    } catch (error) {
      console.log("No Items, found in cart ☹️");
    }
  };

  const increaseQuantity = async (productID) => {
    try {
      const response = await addQtyToCart(productID, token);
      if (!response) return;
      const updatedCart = response.data;
      setCartData(enrichCartItems(updatedCart.items, productsList));
      setQuantities(buildQuantities(updatedCart.items));
    } catch (error) {
      console.error("Error Adding Item to Cart in FE:", error);
      toast.error("Failed to Add Item into Cart☹️, Try Again Later!");
    }
  };

  const decreaseQuantity = async (productID) => {
    try {
      const response = await removeQtyFromCart(productID, token, 1);
      if (!response) return;
      const updatedCart = response.data;
      setCartData(enrichCartItems(updatedCart.items, productsList));
      setQuantities(buildQuantities(updatedCart.items));
    } catch (error) {
      console.error("Error Removing Item from Cart in FE:", error);
      toast.error("Failed to Remove Item from Cart☹️, Try Again Later!");
    }
  };

  const removeProductFromCart = async (productID, quantity) => {
    try {
      const response = await removeQtyFromCart(productID, token, quantity);
      if (!response) return;
      const updatedCart = response.data;
      setCartData(enrichCartItems(updatedCart.items, productsList));
      setQuantities(buildQuantities(updatedCart.items));
    } catch (error) {
      console.error("Error Removing Items:", error);
      toast.error("Failed to Remove Items from Cart☹️, Try Again Later!");
    }
  };

  const getAllAddressesHandler = async (storedToken) => {
    try {
      const response = await getAllAddresses(storedToken);
      if (!response) return;
      setSavedAddresses(response.data || []);
    } catch (error) {
      console.error("Error Fetching User Addresses in FE:", error);
      toast.error("Failed to Fetch User Addresses☹️, Try Again Later!");
    }
  };

  const contextValue = {
    productsList,
    quantities,
    setQuantities,
    increaseQuantity,
    decreaseQuantity,
    removeProductFromCart,
    token,
    setToken,
    loadCartData,
    deliveryAddress,
    setDeliveryAddress,
    editAddress,
    setEditAddress,
    savedAddresses,
    setSavedAddresses,
    cartData,
    setCartData,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
