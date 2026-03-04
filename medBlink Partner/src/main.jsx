window.global = window;
// CSS
import "./index.css";

// THIRD PARTY
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";

// COMPONENTS
import App from "./App.jsx";

// CONTEXT
import { StoreContextProvider } from "./context/StoreContext.jsx";
import { PartnerContextProvider } from "./context/PartnerContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/medblink-partner">
    <StoreContextProvider>
      <PartnerContextProvider>
        <App />
      </PartnerContextProvider>
    </StoreContextProvider>
  </BrowserRouter>
);
