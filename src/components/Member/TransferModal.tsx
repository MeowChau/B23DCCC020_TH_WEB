import React from 'react';
import { Modal, Form, Select, Button } from 'antd';
import type { Club } from '@/models/club';

interface TransferModalProps {
  visible: boolean;
  onCancel: () => void;
  onFinish: (values: { newClubId: string }) => void;
  clubs: Club[];
  selectedCount: number;
}

const TransferModal: React.FC<TransferModalProps> = ({
  visible,
  onCancel,
  onFinish,
  clubs,
  selectedCount,
}) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title={`Chuyển ${selectedCount} thành viên`}
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="newClubId"
          label="Câu lạc bộ mới"
          rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ' }]}
        >
          <Select placeholder="Chọn câu lạc bộ">
            {clubs.map((club) => (
              <Select.Option key={club.id} value={club.id}>
                {club.name}
              </Select.Option>
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