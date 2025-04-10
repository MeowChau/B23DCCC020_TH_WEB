import React from 'react';
import { Form, Input, Upload, Switch } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { Club } from '@/models/club';

interface ClubFormProps {
  form: any;
  onFinish: (values: any) => void;
  initialValues?: Partial<Club>;
}

const ClubForm: React.FC<ClubFormProps> = ({ form, onFinish, initialValues }) => {
  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      initialValues={initialValues}
    >
      <Form.Item
        name="name"
        label="Tên câu lạc bộ"
        rules={[{ required: true, message: 'Vui lòng nhập tên câu lạc bộ' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="avatar" label="Ảnh đại diện">
        <Upload
          listType="picture-card"
          maxCount={1}
          beforeUpload={() => false}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
      </Form.Item>

      <Form.Item
        name="establishmentDate"
        label="Ngày thành lập"
        rules={[{ required: true, message: 'Vui lòng chọn ngày thành lập' }]}
      >
        <Input type="date" />
      </Form.Item>

      <Form.Item
        name="president"
        label="Chủ nhiệm CLB"
        rules={[{ required: true, message: 'Vui lòng nhập tên chủ nhiệm' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="description"
        label="Mô tả"
        rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item
        name="isActive"
        label="Hoạt động"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
    </Form>
  );
};

export default ClubForm; 