export interface CustomerOrderDto {
    orderId?: string;
    restaurantId: string;
    customerLocation: number[];
    customerName: string;
    customerAddress: string;
    customerPhone: string;
  }
  
  export interface Order {
    orderId: string;
    restaurantId: string; 
    restaurantLocation: [number, number];
    customerLocation: [number, number];
    customerName: string;
    customerAddress: string;
    customerPhone: string;
    status?: string;
    createdDate?: string;
  }