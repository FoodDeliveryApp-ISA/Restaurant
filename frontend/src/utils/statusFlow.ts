// src/utils/statusFlow.ts

export const statusFlow = [
  {
    state: 1,
    title: "Order Placed",
    icon: "check-circle",
    description: "The order has been placed successfully.",
    name: "ORDER_PLACED",
  },
  {
    state: 2,
    title: "Preparing Order",
    icon: "fire",
    description: "The kitchen staff is preparing the order.",
    name: "PREPARING"
  },
  {
    state: 3,
    title: "Assigning Delivery Partner",
    icon: "search",
    description: "Searching for an available delivery partner.",
    name: "ASSIGNING_RIDER"
  },
  {
    state: 4,
    title: "On the Way",
    icon: "car",
    description: "The delivery partner is en route to the customer.",
    name:"ON_THE_WAY",
  },
  {
    state: 5,
    title: "Delivered",
    icon: "smile",
    description: "The order has been delivered to the customer.",
    name: "ORDER_DELIVERED",
  },
];

