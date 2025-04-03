import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Input, Row, Select, Modal, message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import OrderTable from '../../components/Order/OrderTable';
import OrderForm from '../../components/Order/OrderForm';
import {
  getOrdersFromStorage,
  saveOrdersToStorage,
  filterOrders,
  sortOrders,
  sampleProducts,
  sampleCustomers,
  createNewOrder,
} from '../../services/Order'; // Update to the correct module path
import type { Order, OrderStatus, OrderItem } from '@/models/Order';

const OrderPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'ascend' | 'descend' | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | undefined>(undefined);
  const [orders, setOrders] = useState<Order[]>([]);

  // Load data from localStorage on initial render
  useEffect(() => {
    setOrders(getOrdersFromStorage());
  }, []);

  // Save to localStorage whenever orders change
  useEffect(() => {
    saveOrdersToStorage(orders);
  }, [orders]);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleStatusFilter = (value: OrderStatus | null) => {
    setStatusFilter(value);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'ascend' ? 'descend' : 'ascend');
    } else {
      setSortField(field);
      setSortDirection('ascend');
    }
  };

  const filteredOrders = filterOrders(orders, searchText, statusFilter, sampleCustomers);
  const sortedOrders = sortOrders(filteredOrders, sortField, sortDirection);

  const showModal = (order?: Order) => {
    setEditingOrder(order || undefined);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = (values: {
    customerId: string;
    orderDate: string;
    status: OrderStatus;
    items: OrderItem[];
    totalAmount: number;
  }) => {
    if (editingOrder) {
      // Update existing order
      const updatedOrders = orders.map((order) =>
        order.id === editingOrder.id
          ? {
              ...order,
              customerId: values.customerId,
              orderDate: values.orderDate,
              items: values.items,
              status: values.status,
              totalAmount: values.totalAmount,
            }
          : order,
      );
      setOrders(updatedOrders);
      message.success('Order updated successfully');
    } else {
      // Create new order
      const newOrder = createNewOrder(
        values.customerId,
        values.orderDate,
        values.status,
        values.items,
        values.totalAmount
      );
      setOrders([...orders, newOrder]);
      message.success('Order created successfully');
    }

    setIsModalVisible(false);
  };

  const handleCancelOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (order && order.status === 'pending') {
      const updatedOrders = orders.map((o) =>
        o.id === orderId ? { ...o, status: 'cancelled' as OrderStatus } : o,
      );
      setOrders(updatedOrders);
      message.success('Order cancelled successfully');
    } else {
      message.error('Only pending orders can be cancelled');
    }
  };

  return (
    <div>
      <Card title="Quản lý đơn hàng">
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Input
              placeholder="Tìm kiếm theo mã đơn hoặc khách hàng"
              prefix={<SearchOutlined />}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="Lọc theo trạng thái"
              allowClear
              onChange={handleStatusFilter}
            >
              <Select.Option value="pending">Chờ xác nhận</Select.Option>
              <Select.Option value="shipping">Đang giao</Select.Option>
              <Select.Option value="completed">Hoàn thành</Select.Option>
              <Select.Option value="cancelled">Hủy</Select.Option>
            </Select>
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
              Thêm đơn hàng
            </Button>
          </Col>
        </Row>

        <OrderTable
          orders={sortedOrders}
          customers={sampleCustomers}
          onEdit={showModal}
          onCancelOrder={handleCancelOrder}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />
      </Card>

      <Modal
        title={editingOrder ? 'Chỉnh sửa đơn hàng' : 'Thêm đơn hàng mới'}
        visible={isModalVisible}
        width={800}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <OrderForm
          order={editingOrder}
          customers={sampleCustomers}
          products={sampleProducts}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Modal>
    </div>
  );
};

export default OrderPage;