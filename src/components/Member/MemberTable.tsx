import React from 'react';
import { Table, Space, Button } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, HistoryOutlined } from '@ant-design/icons';
import type { Member } from '@/models/club';

interface MemberTableProps {
  data: Member[];
  loading: boolean;
  onRowSelect: (selectedRows: Member[]) => void;
  onView: (record: Member) => void;
  onEdit: (record: Member) => void;
  onDelete: (id: string) => void;
  onHistory: (id: string) => void;
}

const MemberTable: React.FC<MemberTableProps> = ({
  data,
  loading,
  onRowSelect,
  onView,
  onEdit,
  onDelete,
  onHistory,
}) => {
  const columns = [
    { title: 'Họ tên', dataIndex: 'name', key: 'name', sorter: true },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    { title: 'Sở trường', dataIndex: 'skills', key: 'skills' },
    { title: 'Câu lạc bộ', dataIndex: 'clubId', key: 'clubId' },
    { title: 'Lý do đăng ký', dataIndex: 'reason', key: 'reason' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Member) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />} onClick={() => onView(record)}>
            Xem
          </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => onEdit(record)}>
            Sửa
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => onDelete(record.id)}>
            Xóa
          </Button>
          <Button type="link" icon={<HistoryOutlined />} onClick={() => onHistory(record.id)}>
            Lịch sử
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowSelection={{
        type: 'checkbox',
        onChange: (_, selectedRows) => onRowSelect(selectedRows),
      }}
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      locale={{ emptyText: 'Không có dữ liệu' }}
    />
  );
};

export default MemberTable;