import type { Order, OrderItem, OrderStatus } from '../../models/Order';
import type { Product } from '../../models/Order';
import type { Customer } from '../../models/Order';

// Sample data
export const sampleProducts: Product[] = [
  { id: '1', name: 'Product 1', price: 100, quantity: 10 },
  { id: '2', name: 'Product 2', price: 200, quantity: 5 },
  { id: '3', name: 'Product 3', price: 300, quantity: 8 },
];

export const sampleCustomers: Customer[] = [
  { id: '1', name: 'Customer 1', email: 'customer1@example.com' },
  { id: '2', name: 'Customer 2', email: 'customer2@example.com' },
  { id: '3', name: 'Customer 3', email: 'customer3@example.com' },
];

export const getOrdersFromStorage = (): Order[] => {
  const savedOrders = localStorage.getItem('orders');
  return savedOrders ? JSON.parse(savedOrders) : [];
};

export const saveOrdersToStorage = (orders: Order[]) => {
  localStorage.setItem('orders', JSON.stringify(orders));
};

export const filterOrders = (
  orders: Order[],
  searchText: string,
  statusFilter: OrderStatus | null,
  customers: Customer[]
): Order[] => {
  return orders.filter((order) => {
    const matchesSearch =
      order.id.includes(searchText) ||
      customers.find((c) => c.id === order.customerId)?.name.includes(searchText);
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });
};

export const sortOrders = (
  orders: Order[],
  sortField: string | null,
  sortDirection: 'ascend' | 'descend' | null
): Order[] => {
  if (!sortField) return [...orders];

  return [...orders].sort((a, b) => {
    if (sortField === 'orderDate') {
      const dateA = new Date(a.orderDate).getTime();
      const dateB = new Date(b.orderDate).getTime();
      return sortDirection === 'ascend' ? dateA - dateB : dateB - dateA;
    } else if (sortField === 'totalAmount') {
      return sortDirection === 'ascend'
        ? a.totalAmount - b.totalAmount
        : b.totalAmount - a.totalAmount;
    }
    return 0;
  });
};

export const calculateOrderTotal = (items: OrderItem[], products: Product[]): number => {
  return items.reduce((total, item) => {
    const product = products.find((p) => p.id === item.productId);
    return total + (product?.price || 0) * item.quantity;
  }, 0);
};

export const createNewOrder = (
  customerId: string,
  orderDate: string,
  status: OrderStatus,
  items: OrderItem[],
  totalAmount: number
): Order => {
  return {
    id: `order-${Date.now()}`,
    customerId,
    orderDate,
    items,
    status,
    totalAmount,
  };
};