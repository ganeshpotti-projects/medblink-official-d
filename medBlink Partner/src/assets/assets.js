import delivery from "./delivery.png";
import homePageBanner from "./homePageBanner.png";
import profile from "./profile.jpg";

import delivered from "./orderStatusIcons/delivered.jpg";
import outForDelivery from "./orderStatusIcons/outForDelivery.png";

export const assets = { delivery, profile, homePageBanner };

export const orderStatusIcons = [
  { icon: outForDelivery, category: "Out for Delivery" },
  { icon: delivered, category: "Delivered" },
];
