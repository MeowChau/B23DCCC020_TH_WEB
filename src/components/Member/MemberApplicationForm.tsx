import React from 'react';
import { Form, Input, Select, Button } from 'antd';
import type { FormInstance } from 'antd';
import type { Member } from '@/models/club';

const { Option } = Select;
const { TextArea } = Input;

interface MemberApplicationFormProps {
  form: FormInstance;
  onFinish: (values: any) => void;
  initialValues?: Partial<Member>;
  clubs: { id: string; name: string }[];
  loading?: boolean;
  onCancel?: () => void;
  visible?: boolean; // Thêm prop visible
}

const MemberApplicationForm: React.FC<MemberApplicationFormProps> = ({
  form,
  onFinish,
  initialValues = {},
  clubs,
  loading = false,
  onCancel,
  visible = true, // Giá trị mặc định là true
}) => {
  if (!visible) {
    return null; // Không hiển thị gì nếu visible là false
  }

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      initialValues={initialValues}
    >
      <Form.Item
        name="name"
        label="Họ tên"
        rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
      >
        <Input placeholder="Nhập họ tên của bạn" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Vui lòng nhập email' },
          { type: 'email', message: 'Email không hợp lệ' },
        ]}
      >
        <Input placeholder="Nhập email của bạn" />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Số điện thoại"
        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
      >
        <Input placeholder="Nhập số điện thoại của bạn" />
      </Form.Item>

      <Form.Item
        name="gender"
        label="Giới tính"
        rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
      >
        <Select placeholder="Chọn giới tính">
          <Option value="male">Nam</Option>
          <Option value="female">Nữ</Option>
          <Option value="other">Khác</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="address"
        label="Địa chỉ"
        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
      >
        <Input placeholder="Nhập địa chỉ của bạn" />
      </Form.Item>

      <Form.Item
        name="skills"
        label="Sở trường"
        rules={[{ required: true, message: 'Vui lòng nhập sở trường' }]}
      >
        <Input placeholder="Nhập sở trường của bạn" />
      </Form.Item>

      <Form.Item
        name="clubId"
        label="Câu lạc bộ"
        rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ' }]}
      >
        <Select placeholder="Chọn câu lạc bộ" disabled={clubs.length === 0}>
          {clubs.map((club) => (
            <Option key={club.id} value={club.id}>
              {club.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="registrationReason"
        label="Lý do đăng ký"
        rules={[{ required: true, message: 'Vui lòng nhập lý do đăng ký' }]}
      >
        <TextArea rows={4} placeholder="Nhập lý do bạn muốn tham gia" />
      </Form.Item>

      <Form.Item
        name="notes"
        label="Ghi chú"
      >
        <TextArea rows={4} placeholder="Nhập ghi chú (nếu có)" />
      </Form.Item>

      <Form.Item>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>
          Hủy
        </Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          Gửi đơn đăng ký
        </Button>
      </Form.Item>
    </Form>
  );
};
export default MemberApplicationForm;