import React from 'react';
import { Table, Space, Button, Tag, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Order, OrderStatus } from '../../../models/Order';
import type { Customer } from '../../../models/Order';

interface OrderTableProps {
  orders: Order[];
  customers: Customer[];
  onEdit: (order: Order) => void;
  onCancelOrder: (orderId: string) => void;
  onSort: (field: string) => void;
  sortField: string | null;
  sortDirection: 'ascend' | 'descend' | null;
}

const getStatusTag = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return <Tag color="orange">Chờ xác nhận</Tag>;
    case 'shipping':
      return <Tag color="blue">Đang giao</Tag>;
    case 'completed':
      return <Tag color="green">Hoàn thành</Tag>;
    case 'cancelled':
      return <Tag color="red">Hủy</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
};

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  customers,
  onEdit,
  onCancelOrder,
  onSort,
  sortField,
  sortDirection,
}) => {
  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      render: (record: Order) => {
        const customer = customers.find((c) => c.id === record.customerId);
        return customer?.name || 'Unknown';
      },
    },
    {
      title: 'Ngày đặt hàng',
      dataIndex: 'orderDate',
      key: 'orderDate',
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => onSort('orderDate'),
      }),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `${amount.toLocaleString()} VND`,
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => onSort('totalAmount'),
      }),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderStatus) => getStatusTag(status),
      filters: [
        { text: 'Chờ xác nhận', value: 'pending' },
        { text: 'Đang giao', value: 'shipping' },
        { text: 'Hoàn thành', value: 'completed' },
        { text: 'Hủy', value: 'cancelled' },
      ],
      onFilter: (value: string | number | boolean, record: Order) => record.status === value,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (record: Order) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => onEdit(record)} />
          {record.status === 'pending' && (
            <Popconfirm
              title="Bạn có chắc chắn muốn hủy đơn hàng này?"
              onConfirm={() => onCancelOrder(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return <Table columns={columns} dataSource={orders} rowKey="id" pagination={{ pageSize: 10 }} />;
};

export default OrderTable;