import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Input, Button } from 'antd';
import type { FormInstance } from 'antd';
import type { Club, Member } from '@/models/club';

const { Option } = Select;

interface TransferModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: { newClubId: string }) => void;
  member: Member | null; // Thành viên được chọn
  form: FormInstance;
  selectedCount: number; // Số lượng thành viên được chọn
}

const TransferModal: React.FC<TransferModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  member,
  form,
  selectedCount,
}) => {
  const [clubs, setClubs] = useState<Club[]>([]); // Danh sách câu lạc bộ

  // Tải danh sách câu lạc bộ từ localStorage
  useEffect(() => {
    const storedClubs = JSON.parse(localStorage.getItem('clubs') || '[]');
    setClubs(storedClubs);
  }, []);

  // Lấy tên câu lạc bộ cũ
  const getOldClubName = (clubId: string | undefined) => {
    if (!clubId) return 'Chưa có CLB';
    const club = clubs.find((c) => c.id === clubId);
    return club ? club.name : 'Không xác định';
  };

  return (
    <Modal
      title={`Chuyển câu lạc bộ (${selectedCount} thành viên)`}
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        onFinish={(values) => {
          onSubmit(values); // Gọi hàm onSubmit khi nhấn "Xác nhận"
          form.resetFields();
        }}
        layout="vertical"
      >
        <Form.Item label="Tên thành viên">
          <Input value={member?.name} disabled />
        </Form.Item>
        <Form.Item label="Câu lạc bộ cũ">
          <Input value={getOldClubName(member?.clubId)} disabled />
        </Form.Item>
        <Form.Item
          name="newClubId"
          label="Câu lạc bộ mới"
          rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ mới' }]}
        >
          <Select placeholder="Chọn câu lạc bộ mới">
            {clubs.map((club) => (
              <Option key={club.id} value={club.id}>
                {club.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Xác nhận
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TransferModal;