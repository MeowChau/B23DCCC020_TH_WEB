import { useState } from "react";
import { Card, List, Input, InputNumber, Button, Form, Select, Space } from "antd";
import { BookOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const Subjects = () => {
  const [subjects, setSubjects] = useState([
    { id: 1, name: "Lập trình C++", code: "CSE101", credits: 3, categoryId: 1 },
    { id: 2, name: "Trí tuệ nhân tạo", code: "AI202", credits: 4, categoryId: 2 },
    { id: 3, name: "Giải tích", code: "MATH101", credits: 4, categoryId: 1 },
    { id: 4, name: "Xác suất thống kê", code: "STAT201", credits: 3, categoryId: 1 },
    { id: 5, name: "Pháp luật đại cương", code: "LAW101", credits: 2, categoryId: 2 },
    { id: 6, name: "Kinh tế chính trị", code: "ECO202", credits: 3, categoryId: 2 },
  ]);

  const [form] = Form.useForm();

  const addSubject = (values: any) => {
    setSubjects([...subjects, { id: subjects.length + 1, ...values }]);
    form.resetFields();
  };

  return (
    <Card title="📘 Danh mục môn học" bordered={false} className="max-w-xl mx-auto shadow-md">
      <List
        dataSource={subjects}
        renderItem={(subject) => (
          <List.Item className="bg-green-50 px-4 py-2 rounded-md shadow-sm mb-2">
            <BookOutlined className="text-green-500 mr-2" />
            <strong>{subject.code}</strong> - {subject.name} ({subject.credits} tín chỉ)
          </List.Item>
        )}
      />

      <Form form={form} layout="vertical" onFinish={addSubject} className="mt-4">
        <Form.Item name="name" label="Tên môn học" rules={[{ required: true, message: "Vui lòng nhập tên môn học!" }]}>
          <Input placeholder="Nhập tên môn học..." />
        </Form.Item>

        <Form.Item name="code" label="Mã môn học" rules={[{ required: true, message: "Vui lòng nhập mã môn học!" }]}>
          <Input placeholder="Nhập mã môn học..." />
        </Form.Item>

        <Form.Item name="credits" label="Số tín chỉ" rules={[{ required: true, message: "Vui lòng nhập số tín chỉ!" }]}>
          <InputNumber min={1} placeholder="Nhập số tín chỉ..." className="w-full" />
        </Form.Item>

        <Form.Item name="categoryId" label="Danh mục" initialValue={1}>
          <Select>
            <Option value={1}>Toán - Tin học</Option>
            <Option value={2}>Khoa học xã hội</Option>
          </Select>
        </Form.Item>

        <Button type="primary" htmlType="submit" icon={<PlusOutlined />} className="w-full">
          Thêm môn học
        </Button>
      </Form>
    </Card>
  );
};

export default Subjects;
