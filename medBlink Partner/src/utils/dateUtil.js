// Utility to pad single digits (e.g., 3 -> 03)
const pad = (num) => num.toString().padStart(2, "0");

/**
 * Returns current date in dd/MM/yyyy format.
 * Example: 29/10/2025
 */
export const getFormattedDate = (date = new Date()) => {
  const d = pad(date.getDate());
  const m = pad(date.getMonth() + 1);
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
};

/**
 * Returns date with time in dd/MM/yyyy hh:mm format.
 * Example: 29/10/2025 14:35
 */
export const getFormattedDateTime = (date = new Date()) => {
  const formattedDate = getFormattedDate(date);
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${formattedDate} ${hours}:${minutes}`;
};

/**
 * Returns full month name.
 * Example: January
 */
export const getMonthName = (date = new Date()) => {
  return date.toLocaleString("default", { month: "long" });
};

/**
 * Returns year as string.
 * Example: 2025
 */
export const getYear = (date = new Date()) => {
  return date.getFullYear().toString();
};
