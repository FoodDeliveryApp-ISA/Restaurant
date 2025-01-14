export interface Order {
    orderId: string;
    restaurantLocation: [number, number];
    customerLocation: [number, number];
    customerName: string;
    customerAddress: string;
    customerPhone: string;
    status: string; // Ensure it is consistent as `string` (not optional)
    createdDate?: string;
  }
  
  