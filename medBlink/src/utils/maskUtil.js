export const renderMaskId = (id) => {
  const lastFour = id.slice(-4);
  return "XXXX-XXXX-" + lastFour;
};
