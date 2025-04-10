import React, { useState, useCallback } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Space, Modal, Form, message, Tag, Table } from 'antd';
import { CheckOutlined, CloseOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, HistoryOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { getMemberApplications, updateMemberStatus, deleteMemberApplication, getActionHistory } from '@/services/club';
import MemberApplicationForm from '@/components/Member/MemberApplicationForm';
import type { Member } from '@/models/club';

const MemberRegistration: React.FC = () => {
  const [form] = Form.useForm();
  const [selectedRows, setSelectedRows] = useState<Member[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [actionHistory, setActionHistory] = useState<any[]>([]);

  const { data: applications, loading, refresh } = useRequest(async () => {
    const response = await getMemberApplications();
    return {
      ...response,
      clubs: [], // Removed reference to `response.clubs` as it does not exist in the type
    };
  });

  // Hiển thị trạng thái
  const renderStatus = useCallback((status: string) => {
    const statusMap = {
      pending: { color: 'orange', text: 'Chờ duyệt' },
      approved: { color: 'green', text: 'Đã duyệt' },
      rejected: { color: 'red', text: 'Từ chối' },
    };
    const statusInfo = statusMap[status as keyof typeof statusMap];
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  }, []);

  // Xử lý thêm mới hoặc chỉnh sửa
  const handleCreateOrUpdate = async (values: any) => {
    try {
      if (editingMember) {
        await updateMemberStatus(editingMember.id, values);
        message.success('Cập nhật đơn đăng ký thành công');
      } else {
        // Add your create API logic here
        message.success('Thêm mới đơn đăng ký thành công');
      }
      setModalVisible(false);
      refresh();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  // Xử lý xóa
  const handleDelete = async (id: string) => {
    try {
      await deleteMemberApplication(id);
      message.success('Xóa đơn đăng ký thành công');
      refresh();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  // Lấy lịch sử thao tác
  const fetchActionHistory = async (memberId: string) => {
    try {
      const history = await getActionHistory(memberId);
      setActionHistory(history as any[]);
      setHistoryVisible(true);
    } catch (error) {
      message.error('Không thể lấy lịch sử thao tác');
    }
  };

  // Xử lý xem chi tiết
  const handleView = (record: Member) => {
    Modal.info({
      title: 'Chi tiết đơn đăng ký',
      content: (
        <div>
          <p><b>Họ tên:</b> {record.name}</p>
          <p><b>Email:</b> {record.email}</p>
          <p><b>SĐT:</b> {record.phone}</p>
          <p><b>Giới tính:</b> {record.gender}</p>
          <p><b>Địa chỉ:</b> {record.address}</p>
          <p><b>Sở trường:</b> {record.skills}</p>
          <p><b>Câu lạc bộ:</b> {record.clubId}</p>
          <p><b>Lý do đăng ký:</b> {record.reason}</p>
          <p><b>Trạng thái:</b> {record.status}</p>
          <p><b>Ghi chú:</b> {record.notes}</p>
        </div>
      ),
    });
  };

  // Xử lý chỉnh sửa
  const handleEdit = (record: Member) => {
    setEditingMember(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  // Cột của bảng
  const columns = [
    { title: 'Họ tên', dataIndex: 'name', key: 'name', sorter: true },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    { title: 'Sở trường', dataIndex: 'skills', key: 'skills' },
    { title: 'Câu lạc bộ', dataIndex: 'clubId', key: 'clubId' },
    { title: 'Lý do đăng ký', dataIndex: 'reason', key: 'reason' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: renderStatus },
    { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Member) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            Xem
          </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
            Xóa
          </Button>
          <Button type="link" icon={<HistoryOutlined />} onClick={() => fetchActionHistory(record.id)}>
            Lịch sử
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingMember(null);
              form.resetFields();
              setModalVisible(true);
            }}
          >
            Thêm mới
          </Button>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            disabled={selectedRows.length === 0}
            onClick={() => message.info('Duyệt nhiều đơn đăng ký chưa được triển khai')}
          >
            Duyệt ({selectedRows.length})
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            disabled={selectedRows.length === 0}
            onClick={() => message.info('Từ chối nhiều đơn đăng ký chưa được triển khai')}
          >
            Từ chối ({selectedRows.length})
          </Button>
        </Space>
      </div>

      <Table
        rowSelection={{
          type: 'checkbox',
          onChange: (_, newSelectedRows) => setSelectedRows(newSelectedRows),
        }}
        columns={columns}
        dataSource={applications?.data || []}
        loading={loading}
        rowKey="id"
        locale={{ emptyText: 'Không có dữ liệu' }}
      />

      <Modal
        title={editingMember ? 'Chỉnh sửa đơn đăng ký' : 'Thêm mới đơn đăng ký'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <MemberApplicationForm
          form={form}
          onFinish={handleCreateOrUpdate}
          initialValues={editingMember || {}}
          clubs={applications?.clubs || []} // Đảm bảo truyền danh sách câu lạc bộ
          loading={loading}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>

      <Modal
        title="Lịch sử thao tác"
        visible={historyVisible}
        onCancel={() => setHistoryVisible(false)}
        footer={null}
      >
        <Table
          dataSource={actionHistory}
          columns={[
            { title: 'Hành động', dataIndex: 'action', key: 'action' },
            { title: 'Thời gian', dataIndex: 'timestamp', key: 'timestamp' },
            { title: 'Lý do', dataIndex: 'reason', key: 'reason' },
            { title: 'Người thực hiện', dataIndex: 'admin', key: 'admin' },
          ]}
          rowKey="id"
          pagination={false}
        />
      </Modal>
    </PageContainer>
  );
};

export default MemberRegistration;