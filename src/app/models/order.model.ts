export interface OrderItem {
  orderItemId: number;
  orderId: number;
  itemName: string;
  productId: number | null;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  orderId: number;
  userId: number;
  orderDate: Date;
  status: string;
  totalPrice: number;
  orderItems: OrderItem[];
}

export interface CreateOrderRequest {
  orderId: number;
  userId: number;
  orderDate: Date;
  status: string;
  totalPrice: number;
  orderItems: OrderItem[];
}
