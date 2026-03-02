export const getBadgeDetails = (totalSoldQuantity) => {
  if (totalSoldQuantity >= 500) {
    return { text: "🔥 Bestseller", variant: "success" };
  } else if (totalSoldQuantity >= 100) {
    return { text: "🏆 Trending", variant: "warning" };
  } else if (totalSoldQuantity >= 50) {
    return { text: "⭐ Popular", variant: "info" };
  } else {
    return { text: "🎉 New", variant: "danger" };
  }
};
