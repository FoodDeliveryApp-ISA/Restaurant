export const statusFlow = [
  {
    state: 1,
    title: "Order Pending",
    icon: "InboxOutlined", // Matches the idea of receiving an order
    description: "A new order has been received and is awaiting confirmation.",
    name: "PENDING",
  },
  {
    state: 2,
    title: "Preparing Order",
    icon: "FireOutlined", // Represents active cooking/preparation
    description: "The kitchen staff is actively preparing the order.",
    name: "PLACED",
  },
  {
    state: 3,
    title: "Order Ready for Delivery",
    icon: "BoxPlotOutlined", // Indicates a ready-to-deliver box
    description: "The order is prepared and ready for pickup by the delivery partner.",
    name: "PREPARED",
  },
  {
    state: 4,
    title: "Rider Assigned",
    icon: "UserOutlined", // Represents assigning a rider
    description: "A delivery partner has been assigned and is en route to the restaurant.",
    name: "RIDER_ASSIGNED",
  },
  {
    state: 5,
    title: "Order Picked Up",
    icon: "CarOutlined", // Represents the rider picking up the order
    description: "The delivery partner has picked up the order and is en route to the customer.",
    name: "RIDER_PICKED",
  },
  {
    state: 6,
    title: "Order Delivered",
    icon: "CheckCircleOutlined", // Represents successful delivery
    description: "The order has been successfully delivered to the customer.",
    name: "DELIVERED",
  },
  {
    state: 7,
    title: "Payment Received",
    icon: "DollarOutlined", // Represents successful payment
    description: "The payment for the order has been successfully processed.",
    name: "PAID",
  },
];
