import { createContext, useContext, useEffect, useState } from "react";

// THIRD PARTY
import { toast } from "react-toastify";

// SERVICES
import {
  addProductIntoWishlist,
  getAllWishlists,
  removeProductFromWishlist,
} from "../service/wishlistService";

// CONTEXT
import { StoreContext } from "./StoreContext";

export const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState({});
  const [wishlists, setWishlists] = useState([]);
  const token = localStorage.getItem("token");
  const { productsList } = useContext(StoreContext);

  useEffect(() => {
    const stored = localStorage.getItem("wishlistItems");
    if (stored) setWishlistItems(JSON.parse(stored));
    if (token) getAllWishlistsHandler();
  }, []);

  const getAllWishlistsHandler = async () => {
    try {
      const response = await getAllWishlists(token);
      if (!response) return;
      setWishlists(response.data);
    } catch (error) {
      console.error("Error Fetching All Wishlists in FE:", error);
      toast.error("Failed to Fetch All Wishlists☹️, Try Again Later!");
    }
  };

  const addProductIntoWishlistHandler = async (productID, wishlistID) => {
    try {
      const response = await addProductIntoWishlist(
        token,
        wishlistID,
        productID
      );
      if (!response) return;
      setWishlistItems((prev) => {
        const updated = { ...prev, [productID]: wishlistID };
        localStorage.setItem("wishlistItems", JSON.stringify(updated));
        return updated;
      });
      const product = productsList.find((p) => p.productID === productID);
      const otherProductData = {
        productName: product.productName,
        productDescription: product.productDescription,
        productImageUrl: product.productImageUrl,
      };
      const addedOn = new Date();
      setWishlists((prev) =>
        prev.map((w) =>
          w.wishlistID === wishlistID
            ? {
                ...w,
                items: [
                  ...w.items,
                  { productID, addedOn, ...otherProductData },
                ],
              }
            : w
        )
      );
      toast.success("Product Added into wishlist successfully🎉");
    } catch (error) {
      console.error("Error Adding Product from Wishlist in FE:", error);
      toast.error("Failed to Add Product from wishlist☹️, Try Again Later!");
    }
  };

  const removeProductFromWishlistHandler = async (productID) => {
    try {
      const wishlistID = wishlistItems[productID];
      if (!wishlistID) return;

      const response = await removeProductFromWishlist(
        token,
        wishlistID,
        productID
      );
      if (!response) return;
      setWishlistItems((prev) => {
        const updated = { ...prev };
        delete updated[productID];
        localStorage.setItem("wishlistItems", JSON.stringify(updated));
        return updated;
      });
      setWishlists((prev) =>
        prev.map((w) =>
          w.wishlistID === wishlistID
            ? {
                ...w,
                items: w.items.filter((item) => item.productID !== productID),
              }
            : w
        )
      );
      toast.success("Product Removed from wishlist successfully🎉");
    } catch (error) {
      console.error("Error Removing Product from Wishlist in FE: ", error);
      toast.error("Failed to Remove Product from wishlist☹️, Try Again Later!");
    }
  };

  const toggleWishlist = (productID, wishlistID = null) => {
    const existingWishlistID = wishlistItems[productID];
    if (existingWishlistID) {
      removeProductFromWishlistHandler(productID);
    } else if (wishlistID) {
      addProductIntoWishlistHandler(productID, wishlistID);
    } else {
      setWishlistModalProduct(productID);
    }
  };

  const isWishlisted = (productID) => !!wishlistItems[productID];

  const contextValue = {
    wishlistItems,
    setWishlistItems,
    wishlists,
    setWishlists,
    addProductIntoWishlistHandler,
    removeProductFromWishlistHandler,
    toggleWishlist,
    isWishlisted,
  };

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
};
