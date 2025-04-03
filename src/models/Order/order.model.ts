export type OrderStatus = 'pending' | 'shipping' | 'completed' | 'cancelled';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  orderDate: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
}