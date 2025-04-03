import React, { useState, useEffect } from 'react';
import { Form, Select, DatePicker, Card, Input, Button } from 'antd';
const { Option } = Select;
import { DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { Order, OrderItem, OrderStatus } from '../../../models/Order';
import type { Product } from '../../../models/Order';
import type { Customer } from '../../../models/Order';
import ProductSelection from '../../Order/ProductSelection'; // Update the path to the correct location

interface OrderFormProps {
  order?: Order;
  customers: Customer[];
  products: Product[];
  onSubmit: (values: {
    customerId: string;
    orderDate: string;
    status: OrderStatus;
    items: OrderItem[];
    totalAmount: number;
  }) => void;
  onCancel: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({
  order,
  customers,
  products,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [selectedProducts, setSelectedProducts] = useState<(Product & { quantity: number })[]>([]);

  useEffect(() => {
    if (order) {
      const initialProducts = order.items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return { ...product, quantity: item.quantity } as Product & { quantity: number };
      });
      setSelectedProducts(initialProducts);
      form.setFieldsValue({
        customerId: order.customerId,
        orderDate: moment(order.orderDate),
        status: order.status,
      });
    } else {
      setSelectedProducts([]);
      form.resetFields();
    }
  }, [order, products, form]);

  const calculateTotal = () => {
    return selectedProducts.reduce(
      (total, product) => total + product.price * product.quantity,
      0,
    );
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const orderItems: OrderItem[] = selectedProducts.map((product) => ({
          productId: product.id,
          quantity: product.quantity,
          price: product.price,
        }));

        onSubmit({
          customerId: values.customerId,
          orderDate: values.orderDate.format('YYYY-MM-DD'),
          status: values.status,
          items: orderItems,
          totalAmount: calculateTotal(),
        });
      })
      .catch((errorInfo) => {
        console.log('Validation failed:', errorInfo);
      });
  };

  const handleProductSelect = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product && !selectedProducts.some((p) => p.id === productId)) {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const handleProductQuantityChange = (productId: string, quantity: number) => {
    setSelectedProducts(
      selectedProducts.map((p) => (p.id === productId ? { ...p, quantity } : p)),
    );
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
  };

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="customerId"
        label="Khách hàng"
        rules={[{ required: true, message: 'Vui lòng chọn khách hàng' }]}
      >
        <Select placeholder="Chọn khách hàng">
          {customers.map((customer) => (
            <Option key={customer.id} value={customer.id}>
              {customer.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="orderDate"
        label="Ngày đặt hàng"
        rules={[{ required: true, message: 'Vui lòng chọn ngày đặt hàng' }]}
      >
        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
      </Form.Item>

      <Form.Item
        name="status"
        label="Trạng thái"
        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
      >
        <Select placeholder="Chọn trạng thái">
          <Option value="pending">Chờ xác nhận</Option>
          <Option value="shipping">Đang giao</Option>
          <Option value="completed">Hoàn thành</Option>
          <Option value="cancelled">Hủy</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Sản phẩm">
        <ProductSelection
          products={products}
          selectedProducts={selectedProducts}
          onSelect={handleProductSelect}
        />

        <div style={{ marginBottom: 16 }}>
          {selectedProducts.map((product) => (
            <Card
              key={product.id}
              size="small"
              style={{ marginBottom: 8 }}
              actions={[
                <Input
                  key={`input-${product.id}`}
                  type="number"
                  min={1}
                  value={product.quantity}
                  onChange={(e) =>
                    handleProductQuantityChange(product.id, parseInt(e.target.value) || 1)
                  }
                  style={{ width: 60 }}
                />,
                <Button
                  key={`button-${product.id}`}
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveProduct(product.id)}
                />,
              ]}
            >
              <Card.Meta
                title={`${product.name} - ${product.price.toLocaleString()} VND`}
                description={`Số lượng: ${product.quantity}`}
              />
            </Card>
          ))}
        </div>
      </Form.Item>

      <Form.Item label="Tổng tiền">
        <div style={{ fontWeight: 'bold', fontSize: 18 }}>
          {calculateTotal().toLocaleString()} VND
        </div>
      </Form.Item>

      <Form.Item>
        <Button type="primary" onClick={handleSubmit}>
          {order ? 'Cập nhật' : 'Thêm'}
        </Button>
        <Button onClick={onCancel} style={{ marginLeft: 8 }}>
          Hủy
        </Button>
      </Form.Item>
    </Form>
  );
};

export default OrderForm;