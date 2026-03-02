export const reverseDateFormat = (dateStr) => {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

export const convertDateFormat = (dateStr) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
