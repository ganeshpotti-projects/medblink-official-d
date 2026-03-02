window.global = window;
// CSS
import "./index.css";

// THIRD PARTY
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";

// CONTEXT
import { StoreContextProvider } from "./context/StoreContext.jsx";

// COMPONENTS
import App from "./App.jsx";
import { ProductsContextProvider } from "./context/ProductsContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ProductsContextProvider>
      <StoreContextProvider>
        <App />
      </StoreContextProvider>
    </ProductsContextProvider>
  </BrowserRouter>
);
