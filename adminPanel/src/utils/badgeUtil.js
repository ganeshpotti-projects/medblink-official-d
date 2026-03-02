export const getBadgeDetails = (totalSoldQuantity) => {
  if (totalSoldQuantity >= 500) {
    return { text: "🔥 Bestseller", type: "success" };
  } else if (totalSoldQuantity >= 100) {
    return { text: "🏆 Trending", type: "warning" };
  } else if (totalSoldQuantity >= 50) {
    return { text: "⭐ Popular", type: "info" };
  } else {
    return { text: "🎉 New", type: "danger" };
  }
};
