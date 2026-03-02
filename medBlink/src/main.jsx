window.global = window;
// CSS
import "./index.css";

// THIRD PARTY
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";

// APP
import App from "./App.jsx";

// CONTEXT
import { StoreContextProvider } from "./context/StoreContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/medblink-customer/">
    <StoreContextProvider>
      <WishlistProvider>
        <App />
      </WishlistProvider>
    </StoreContextProvider>
  </BrowserRouter>
);
