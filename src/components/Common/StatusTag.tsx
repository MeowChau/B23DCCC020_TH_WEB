import React from 'react';
import { Tag } from 'antd';

interface StatusTagProps {
  status: 'pending' | 'approved' | 'rejected' | boolean;
  type?: 'application' | 'club';
}

const StatusTag: React.FC<StatusTagProps> = ({ status, type = 'application' }) => {
  if (type === 'club') {
    return status ? (
      <Tag color="green">Hoạt động</Tag>
    ) : (
      <Tag color="red">Không hoạt động</Tag>
    );
  }

  const statusMap = {
    pending: { color: 'orange', text: 'Chờ duyệt' },
    approved: { color: 'green', text: 'Đã duyệt' },
    rejected: { color: 'red', text: 'Từ chối' },
  };

  const statusInfo = statusMap[status as keyof typeof statusMap];
  return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
};

export default StatusTag; 