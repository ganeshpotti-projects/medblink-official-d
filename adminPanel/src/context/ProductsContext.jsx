import { createContext, useEffect, useState } from "react";

// THIRD PARTY
import { toast } from "react-toastify";

// SERVICES
import { getProductsList } from "../services/productService";

// UTILS
import useKafkaSubscription from "../utils/useKafkaSubscription";
import { entityUpdater } from "../utils/entityUpdaterUtil";

export const ProductsContext = createContext(null);

export const ProductsContextProvider = ({ children }) => {
  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await getProductsList();
        if (!response) return;
        setProductsList(response.data);
      } catch (error) {
        console.error("Error Fetching Products:", error);
        toast.error("Failed to Fetch Products☹️, Try Again Later!");
      }
    }
    loadProducts();
  }, []);

  useKafkaSubscription("/topic/product-user-updates", (event) => {
    const product = event.product;
    setProductsList((prev) =>
      entityUpdater(prev, product, event.eventType, "productID")
    );
  });

  return (
    <ProductsContext.Provider value={{ productsList, setProductsList }}>
      {children}
    </ProductsContext.Provider>
  );
};
