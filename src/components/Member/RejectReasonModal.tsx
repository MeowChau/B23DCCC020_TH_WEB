import React from 'react';
import { Modal, Input } from 'antd';

const { TextArea } = Input;

interface RejectReasonModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  reason: string;
  setReason: (value: string) => void;
}

const RejectReasonModal: React.FC<RejectReasonModalProps> = ({
  visible,
  onCancel,
  onOk,
  reason,
  setReason,
}) => {
  return (
    <Modal
      title="Lý do từ chối"
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
      okText="Xác nhận"
      cancelText="Hủy"
    >
      <TextArea
        rows={4}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Nhập lý do từ chối"
      />
    </Modal>
  );
};

export default RejectReasonModal;