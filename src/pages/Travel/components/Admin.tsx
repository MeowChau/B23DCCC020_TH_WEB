import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Upload, Space, Card, Row, Col, Statistic, Typography, Select } from 'antd';
import { PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './Admin.less';

const { Title } = Typography;
const { TextArea } = Input;

interface Destination {
  id: number;
  name: string;
  description: string;
  image: string;
  location: string;
  type: string;
  visitDuration: number;
  foodCost: number;
  accommodationCost: number;
  transportationCost: number;
  rating: number;
}

const Admin: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'Tên địa điểm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Loại hình',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Địa điểm',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Thời gian tham quan (giờ)',
      dataIndex: 'visitDuration',
      key: 'visitDuration',
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => `${rating}/5`,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Destination) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingDestination(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (destination: Destination) => {
    setEditingDestination(destination);
    form.setFieldsValue(destination);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    setDestinations(destinations.filter(d => d.id !== id));
  };

  const handleSubmit = (values: any) => {
    if (editingDestination) {
      setDestinations(destinations.map(d =>
        d.id === editingDestination.id ? { ...d, ...values } : d
      ));
    } else {
      setDestinations([...destinations, { id: Date.now(), ...values }]);
    }
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div className={styles.container}>
      <Title level={2}>Quản Trị Điểm Đến</Title>

      <div className={styles.stats}>
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic title="Tổng số điểm đến" value={destinations.length} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Lịch trình đã tạo" value={42} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Tổng chi phí dự kiến" value={15000000} prefix="₫" />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Đánh giá trung bình" value={4.5} suffix="/5" />
            </Card>
          </Col>
        </Row>
      </div>

      <div className={styles.tableSection}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          className={styles.addButton}
        >
          Thêm Điểm Đến
        </Button>

        <Table
          columns={columns}
          dataSource={destinations}
          rowKey="id"
          className={styles.table}
        />
      </div>

      <Modal
        title={editingDestination ? 'Sửa Điểm Đến' : 'Thêm Điểm Đến'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tên địa điểm"
            rules={[{ required: true, message: 'Vui lòng nhập tên địa điểm' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="location"
            label="Địa điểm"
            rules={[{ required: true, message: 'Vui lòng nhập địa điểm' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại hình du lịch"
            rules={[{ required: true, message: 'Vui lòng chọn loại hình' }]}
          >
            <Select>
              <Select.Option value="beach">Biển</Select.Option>
              <Select.Option value="mountain">Núi</Select.Option>
              <Select.Option value="city">Thành phố</Select.Option>
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="visitDuration"
                label="Thời gian tham quan (giờ)"
                rules={[{ required: true, message: 'Vui lòng nhập thời gian' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="foodCost"
                label="Chi phí ăn uống"
                rules={[{ required: true, message: 'Vui lòng nhập chi phí' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="accommodationCost"
                label="Chi phí lưu trú"
                rules={[{ required: true, message: 'Vui lòng nhập chi phí' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="image"
            label="Hình ảnh"
            rules={[{ required: true, message: 'Vui lòng tải lên hình ảnh' }]}
          >
            <Upload>
              <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingDestination ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Admin; 