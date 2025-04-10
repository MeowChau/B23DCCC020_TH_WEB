import React from 'react';
import { Modal, Form, Select, Button } from 'antd';
import type { FormInstance } from 'antd';
import type { Club } from '@/models/club';

const { Option } = Select;

interface TransferModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: { newClubId: string }) => void;
  selectedCount: number;
  clubs: Club[];
  form: FormInstance;
}

const TransferModal: React.FC<TransferModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  selectedCount,
  clubs,
  form,
}) => {
  return (
    <Modal
      title={`Chuyển CLB (${selectedCount} thành viên)`}
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Form.Item
          name="newClubId"
          label="Câu lạc bộ mới"
          rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ' }]}
        >
          <Select placeholder="Chọn câu lạc bộ">
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