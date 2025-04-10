import React from 'react';
import { Modal, Table } from 'antd';

interface ActionHistoryModalProps {
  visible: boolean;
  onCancel: () => void;
  data: any[];
}

const ActionHistoryModal: React.FC<ActionHistoryModalProps> = ({
  visible,
  onCancel,
  data,
}) => {
  const columns = [
    { title: 'Hành động', dataIndex: 'action', key: 'action' },
    { title: 'Thời gian', dataIndex: 'timestamp', key: 'timestamp' },
    { title: 'Lý do', dataIndex: 'reason', key: 'reason' },
    { title: 'Người thực hiện', dataIndex: 'admin', key: 'admin' },
  ];

  return (
    <Modal
      title="Lịch sử thao tác"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
    </Modal>
  );
};

export default ActionHistoryModal;