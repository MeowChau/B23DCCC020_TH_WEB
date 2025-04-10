import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Space, Modal, Form, message } from 'antd';
import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { updateMemberStatus, deleteMemberApplication } from '@/services/club';
import MemberApplicationForm from '@/components/Member/MemberApplicationForm';
import MemberTable from '@/components/Member/MemberTable';
import ActionHistoryModal from '@/components/Member/ActionHistoryModal';
import RejectReasonModal from '@/components/Member/RejectReasonModal';
import type { Member } from '@/models/club';

const MemberRegistration: React.FC = () => {
  const [form] = Form.useForm();
  const [applications, setApplications] = useState<{ data: Member[] }>({ data: [] });
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<Member[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [actionHistory, setActionHistory] = useState<any[]>([]);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Fetch applications data
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/applications');
      const data = await response.json();
      setApplications({ data });
    } catch (error) {
      message.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchApplications();
  }, []);

  // Danh sách câu lạc bộ cố định
  const fixedClubs = [
    { id: '1', name: 'Câu lạc bộ A' },
    { id: '2', name: 'Câu lạc bộ B' },
    { id: '3', name: 'Câu lạc bộ C' },
  ];

  // Xử lý thêm mới hoặc chỉnh sửa
  const handleCreateOrUpdate = async (values: any) => {
    try {
      if (editingMember) {
        await updateMemberStatus(editingMember.id, values);
        message.success('Cập nhật đơn đăng ký thành công');
      } else {
        const newApplication = {
          id: String(Date.now()),
          ...values,
          status: 'pending',
        };
        setApplications((prev) => ({
          data: [...prev.data, newApplication],
        }));
        message.success('Thêm mới đơn đăng ký thành công');
      }
      setModalVisible(false);
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  // Xử lý duyệt
  const handleApprove = async () => {
    try {
      for (const row of selectedRows) {
        await updateMemberStatus(row.id, { status: 'approved' });
        setActionHistory((prev) => [
          ...prev,
          {
            action: 'Approved',
            timestamp: new Date().toLocaleString(),
            reason: 'N/A',
            admin: 'Admin',
          },
        ]);
      }
      message.success('Đã duyệt các đơn đăng ký được chọn');
      fetchApplications();
      setSelectedRows([]);
    } catch (error) {
      message.error('Có lỗi xảy ra khi duyệt các đơn đăng ký');
    }
  };

  // Xử lý từ chối
  const handleReject = async () => {
    try {
      for (const row of selectedRows) {
        await updateMemberStatus(row.id, { status: 'rejected', reason: rejectReason });
        setActionHistory((prev) => [
          ...prev,
          {
            action: 'Rejected',
            timestamp: new Date().toLocaleString(),
            reason: rejectReason,
            admin: 'Admin',
          },
        ]);
      }
      message.success('Đã từ chối các đơn đăng ký được chọn');
      fetchApplications();
      setSelectedRows([]);
      setRejectModalVisible(false);
      setRejectReason('');
    } catch (error) {
      message.error('Có lỗi xảy ra khi từ chối các đơn đăng ký');
    }
  };

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
            onClick={handleApprove}
          >
            Duyệt ({selectedRows.length})
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            disabled={selectedRows.length === 0}
            onClick={() => setRejectModalVisible(true)}
          >
            Từ chối ({selectedRows.length})
          </Button>
        </Space>
      </div>

      <MemberTable
        data={applications.data}
        loading={loading}
        onRowSelect={setSelectedRows}
        onView={(record) => {
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
        }}
        onEdit={(record) => {
          setEditingMember(record);
          form.setFieldsValue(record);
          setModalVisible(true);
        }}
        onDelete={async (id) => {
          try {
            await deleteMemberApplication(id);
            message.success('Xóa đơn đăng ký thành công');
            fetchApplications();
          } catch (error) {
            message.error('Có lỗi xảy ra khi xóa đơn đăng ký');
          }
        }}
        onHistory={(id) => {
          const fetchActionHistory = async (memberId: string) => {
            try {
              const response = await fetch(`/api/action-history/${memberId}`);
              const data = await response.json();
              setActionHistory(data);
            } catch (error) {
              message.error('Không thể tải lịch sử hành động');
            }
          };

          fetchActionHistory(id);
          setHistoryVisible(true);
        }}
      />

      <MemberApplicationForm
        form={form}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onFinish={handleCreateOrUpdate}
        initialValues={editingMember || {}}
        clubs={fixedClubs}
      />

      <RejectReasonModal
        visible={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        onOk={handleReject}
        reason={rejectReason}
        setReason={setRejectReason}
      />

      <ActionHistoryModal
        visible={historyVisible}
        onCancel={() => setHistoryVisible(false)}
        data={actionHistory}
      />
    </PageContainer>
  );
};

export default MemberRegistration;