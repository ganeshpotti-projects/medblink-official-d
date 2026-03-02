export const decodeJwt = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    console.error("Invalid JWT:", e);
    return null;
  }
};

export const getTokenExpiry = (token) => {
  const decoded = decodeJwt(token);
  return decoded ? decoded.exp * 1000 : null;
};
