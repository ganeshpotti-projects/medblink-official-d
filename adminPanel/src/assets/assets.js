import contact from "./contact.png";
import delivery from "./delivery.png";
import logo from "./logo.png";
import parcel from "./parcel.jpeg";
import upload from "./upload.jpg";

import billing from "./orderStatus/billing.jpeg";
import delivered from "./orderStatus/delivered.jpg";
import dispatched from "./orderStatus/dispatched.png";
import outForDelivery from "./orderStatus/outForDelivery.png";
import received from "./orderStatus/received.png";

import pending from "./partnerStatus/pending.jpg";
import approved from "./partnerStatus/approved.jpg";
import rejected from "./partnerStatus/rejected.png";

export const orderStatusIcons = [
  { icon: received, category: "Received" },
  { icon: billing, category: "Billing" },
  { icon: dispatched, category: "Dispatched" },
  { icon: outForDelivery, category: "Out for Delivery" },
  { icon: delivered, category: "Delivered" },
];

export const partnerStatusIcons = [
  { icon: pending, status: "Pending" },
  { icon: approved, status: "Approved" },
  { icon: rejected, status: "Rejected" },
];

export const assets = { contact, delivery, logo, parcel, upload };
