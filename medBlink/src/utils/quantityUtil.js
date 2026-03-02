export const getProductQuantity = (productID, quantities) => {
  return Object.entries(quantities)
    .filter(([key]) => key.startsWith(productID + "-"))
    .reduce((sum, [, qty]) => sum + qty, 0);
};
