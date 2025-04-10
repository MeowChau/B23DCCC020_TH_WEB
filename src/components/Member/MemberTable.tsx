import React from 'react';
import { Table, Space, Button } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Member } from '@/models/club';
import StatusTag from '../Common/StatusTag';

interface MemberTableProps {
  data: Member[];
  loading?: boolean;
  onView?: (record: Member) => void;
  onEdit?: (record: Member) => void;
  onDelete?: (record: Member) => void;
  rowSelection?: any;
  showActions?: boolean;
}

const MemberTable: React.FC<MemberTableProps> = ({
  data,
  loading = false,
  onView,
  onEdit,
  onDelete,
  rowSelection,
  showActions = true,
}) => {
  const columns: any[] = [
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender: string) => {
        const genderMap = {
          male: 'Nam',
          female: 'Nữ',
          other: 'Khác',
        };
        return genderMap[gender as keyof typeof genderMap] || gender;
      },
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Sở trường',
      dataIndex: 'skills',
      key: 'skills',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status as any} />,
    },
  ];

  if (showActions) {
    columns.push({
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Member) => (
        <Space size="middle">
          {onView && (
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
            >
              Xem
            </Button>
          )}
          {onEdit && (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            >
              Sửa
            </Button>
          )}
          {onDelete && (
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record)}
            >
              Xóa
            </Button>
          )}
        </Space>
      ),
    });
  }

  return (
    <Table
      rowSelection={rowSelection}
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
    />
  );
};

export default MemberTable; 