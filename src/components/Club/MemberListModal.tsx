import React from 'react';
import { Modal, Table } from 'antd';
import type { Member } from '@/models/club';

interface MemberListModalProps {
  visible: boolean;
  onCancel: () => void;
  members: Member[]; // Danh sách thành viên
}

const MemberListModal: React.FC<MemberListModalProps> = ({ visible, onCancel, members }) => {
  const columns = [
    { title: 'Họ tên', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
  ];

  return (
    <Modal
      title="Danh sách thành viên"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Table
        dataSource={members}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
    </Modal>
  );
};

export default MemberListModal;