import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, Card, Button, Modal, Form, Input, Select, DatePicker, Space, Typography, Progress, List, Alert, InputNumber } from 'antd';
import { PlusOutlined, DollarOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import styles from './Itinerary.less';
import { getDestinations } from '../../../services';
import { Destination, ItineraryItem, Budget } from '../../../models';
import { Pie, Column } from '@ant-design/plots';

const { Title, Text } = Typography;
const { Option } = Select;

const MAX_BUDGET = 5000000; // Giả sử ngân sách tối đa
const LOCAL_KEY = 'travel_itinerary';

const Itinerary: React.FC = () => {
  const allDestinations = getDestinations().data;
  const [itinerary, setItinerary] = useState<ItineraryItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(itinerary));
  }, [itinerary]);

  // Thêm điểm đến vào lịch trình
  const handleAdd = (values: any) => {
    const dest = allDestinations.find(d => d.id === values.destinationId);
    if (!dest) return;
    setItinerary([
      ...itinerary,
      {
        id: Date.now(),
        destination: dest.name,
        date: values.date.format('YYYY-MM-DD'),
        time: values.time,
        duration: values.duration,
        cost: values.cost,
        food: values.food,
        accommodation: values.accommodation,
        transportation: values.transportation,
      }
    ]);
    setIsModalVisible(false);
    form.resetFields();
  };

  // Xóa điểm đến
  const handleDelete = (id: number) => {
    setItinerary(itinerary.filter(item => item.id !== id));
  };

  // Sắp xếp điểm đến (lên/xuống)
  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItinerary = [...itinerary];
    if (direction === 'up' && index > 0) {
      [newItinerary[index - 1], newItinerary[index]] = [newItinerary[index], newItinerary[index - 1]];
    }
    if (direction === 'down' && index < newItinerary.length - 1) {
      [newItinerary[index + 1], newItinerary[index]] = [newItinerary[index], newItinerary[index + 1]];
    }
    setItinerary(newItinerary);
  };

  // Tổng chi phí và phân bổ ngân sách
  const budget: Budget = useMemo(() => {
    return itinerary.reduce(
      (acc, cur) => ({
        food: acc.food + (cur.food || 0),
        accommodation: acc.accommodation + (cur.accommodation || 0),
        transportation: acc.transportation + (cur.transportation || 0),
        activities: acc.activities + (cur.cost || 0),
        total: acc.total + (cur.food || 0) + (cur.accommodation || 0) + (cur.transportation || 0) + (cur.cost || 0),
      }),
      { food: 0, accommodation: 0, transportation: 0, activities: 0, total: 0 }
    );
  }, [itinerary]);

  // Dữ liệu cho Pie chart
  const pieData = [
    { type: 'Ăn uống', value: budget.food },
    { type: 'Lưu trú', value: budget.accommodation },
    { type: 'Di chuyển', value: budget.transportation },
    { type: 'Hoạt động', value: budget.activities },
  ];

  console.log('pieData', pieData);

  // Tổng thời gian di chuyển (giả lập: mỗi điểm đến cách nhau 1 giờ)
  const totalTravelTime = (itinerary.length - 1) * 1;

  const dateCellRender = (date: any) => {
    const items = itinerary.filter(item => item.date === date.format('YYYY-MM-DD'));
    return (
      <ul className={styles.events}>
        {items.map(item => (
          <li key={item.id}>
            <Text>{item.destination}</Text>
            <Text type="secondary">{item.time}</Text>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={styles.container}>
      <Title level={2}>Lịch Trình Du Lịch</Title>

      <div className={styles.content}>
        <div className={styles.calendarSection}>
          <Calendar dateCellRender={dateCellRender} />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
            className={styles.addButton}
          >
            Thêm Điểm Đến
          </Button>
        </div>

        <div className={styles.budgetSection}>
          <Card title="Quản Lý Ngân Sách" className={styles.budgetCard}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text>Ăn uống</Text>
                <Progress percent={30} status="active" />
              </div>
              <div>
                <Text>Lưu trú</Text>
                <Progress percent={40} status="active" />
              </div>
              <div>
                <Text>Di chuyển</Text>
                <Progress percent={20} status="active" />
              </div>
              <div>
                <Text>Hoạt động</Text>
                <Progress percent={10} status="active" />
              </div>
              <div className={styles.totalBudget}>
                <Text strong>Tổng ngân sách: </Text>
                <Text type="danger">5,000,000 VND</Text>
              </div>
            </Space>
          </Card>
        </div>
      </div>

      <List
        style={{ marginTop: 24 }}
        bordered
        dataSource={itinerary}
        renderItem={(item, idx) => (
          <List.Item
            actions={[
              <Button icon={<ArrowUpOutlined />} disabled={idx === 0} onClick={() => moveItem(idx, 'up')} />,
              <Button icon={<ArrowDownOutlined />} disabled={idx === itinerary.length - 1} onClick={() => moveItem(idx, 'down')} />,
              <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(item.id)} />,
            ]}
          >
            <List.Item.Meta
              title={`${item.destination} (${item.date})`}
              description={
                <Space>
                  <span>Thời gian: {item.duration}h</span>
                  <span>Chi phí: {item.cost.toLocaleString()} VND</span>
                  <span>Ăn uống: {item.food?.toLocaleString()} VND</span>
                  <span>Lưu trú: {item.accommodation?.toLocaleString()} VND</span>
                  <span>Di chuyển: {item.transportation?.toLocaleString()} VND</span>
                </Space>
              }
            />
          </List.Item>
        )}
      />

      {/* Tổng chi phí, thời gian di chuyển */}
      <div style={{ margin: '24px 0' }}>
        <Title level={4}>Tổng chi phí: <span style={{ color: budget.total > MAX_BUDGET ? 'red' : '#1890ff' }}>{budget.total.toLocaleString()} VND</span></Title>
        <Title level={5}>Tổng thời gian di chuyển: {totalTravelTime} giờ</Title>
        {budget.total > MAX_BUDGET && (
          <Alert message="Cảnh báo: Vượt quá ngân sách!" type="error" showIcon />
        )}
      </div>

      {/* Biểu đồ phân bổ ngân sách */}
      <Card title="Phân bổ ngân sách">
        <Column
          data={pieData}
          xField="type"
          yField="value"
          height={300}
          label={{ position: 'middle' }}
        />
      </Card>

      <Modal
        title="Thêm Điểm Đến"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAdd} layout="vertical">
          <Form.Item name="destinationId" label="Điểm đến" rules={[{ required: true }]}>
            <Select>
              {allDestinations.map(d => (
                <Option value={d.id} key={d.id}>{d.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="date" label="Ngày" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="time" label="Giờ" rules={[{ required: true }]}>
            <InputNumber min={0} max={23} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="duration" label="Thời gian tham quan (giờ)" rules={[{ required: true }]}>
            <InputNumber min={1} max={24} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="cost" label="Chi phí hoạt động" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="food" label="Chi phí ăn uống" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="accommodation" label="Chi phí lưu trú" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="transportation" label="Chi phí di chuyển" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Thêm vào lịch trình
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Itinerary; 