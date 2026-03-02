export const calculateCartTotals = (cartData) => {
  const subTotalAmount = cartData.reduce(
    (acc, product) => acc + product.sellingPrice * (product.quantity || 0),
    0
  );

  const taxAmount = cartData.reduce((acc, product) => {
    const price = Number(product.sellingPrice);
    const gst = Number(product.gst);
    const qty = Number(product.quantity);

    return acc + (price * qty * gst) / 100;
  }, 0);

  const shippingAmount = subTotalAmount === 0 ? 0 : 15;

  const grandTotalAmount = Math.round(
    subTotalAmount + shippingAmount + taxAmount
  );

  return { subTotalAmount, shippingAmount, taxAmount, grandTotalAmount };
};
