import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Space, Modal, Form, message } from 'antd';
import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { updateMemberStatus } from '@/services/club';
import MemberApplicationForm from '@/components/Member/MemberApplicationForm';
import MemberTable from '@/components/Member/MemberTable';
import ActionHistoryModal from '@/components/Member/ActionHistoryModal';
import RejectReasonModal from '@/components/Member/RejectReasonModal';
import type { Member } from '@/models/club';

const MemberRegistration: React.FC = () => {
  const [form] = Form.useForm();
  const [applications, setApplications] = useState<{ data: Member[] }>({ data: [] });
  const [loading] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<Member[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [actionHistory, setActionHistory] = useState<any[]>([]);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [activeClubs, setActiveClubs] = useState<{ id: string; name: string }[]>([]);

  // Hàm tải dữ liệu từ localStorage
  const loadApplicationsFromLocalStorage = () => {
    const storedApplications = JSON.parse(localStorage.getItem('applications') || '[]');
    setApplications({ data: storedApplications });
  };

  // Hàm lưu dữ liệu vào localStorage
  const saveApplicationsToLocalStorage = (newApplication: Member) => {
    const storedApplications = JSON.parse(localStorage.getItem('applications') || '[]');
    const updatedApplications = [...storedApplications, newApplication];
    localStorage.setItem('applications', JSON.stringify(updatedApplications));
    setApplications({ data: updatedApplications });
  };

  // Lưu lịch sử thao tác vào localStorage
  const saveActionHistoryToLocalStorage = (newAction: any) => {
    const storedHistory = JSON.parse(localStorage.getItem('actionHistory') || '[]');
    const updatedHistory = [...storedHistory, newAction];
    localStorage.setItem('actionHistory', JSON.stringify(updatedHistory));
    setActionHistory(updatedHistory);
  };

  // Lấy danh sách câu lạc bộ đang hoạt động từ localStorage
  const fetchActiveClubs = () => {
    const storedClubs = JSON.parse(localStorage.getItem('clubs') || '[]');
    const filteredClubs = storedClubs.filter((club: { isActive: boolean }) => club.isActive); // Lọc các câu lạc bộ đang hoạt động
    setActiveClubs(filteredClubs.map((club: { id: string; name: string }) => ({ id: club.id, name: club.name })));
  };

  React.useEffect(() => {
    loadApplicationsFromLocalStorage(); // Tải dữ liệu từ localStorage
    fetchActiveClubs(); // Lấy danh sách câu lạc bộ khi component được mount
  }, []);

  // Lưu ứng viên đã được duyệt vào localStorage
  const saveApprovedMembersToLocalStorage = (approvedMembers: Member[]) => {
    const storedMembers = JSON.parse(localStorage.getItem('approvedMembers') || '[]');
    const updatedMembers = [...storedMembers, ...approvedMembers];
    localStorage.setItem('approvedMembers', JSON.stringify(updatedMembers));
  };

  // Xử lý thêm mới hoặc chỉnh sửa
  const handleCreateOrUpdate = async (values: any) => {
    try {
      if (editingMember) {
        // Cập nhật ứng viên
        const updatedApplications = applications.data.map((app) =>
          app.id === editingMember.id ? { ...app, ...values } : app
        );
        localStorage.setItem('applications', JSON.stringify(updatedApplications));
        setApplications({ data: updatedApplications });
        message.success('Cập nhật đơn đăng ký thành công');
      } else {
        // Thêm ứng viên mới
        const newApplication = {
          id: String(Date.now()),
          ...values,
          status: 'pending',
        };
        saveApplicationsToLocalStorage(newApplication); // Lưu vào localStorage
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
      const approvedMembers: Member[] = [];
      for (const row of selectedRows) {
        await updateMemberStatus(row.id, { status: 'approved' });
        approvedMembers.push({ ...row, status: 'approved' });

        // Lưu lịch sử thao tác
        saveActionHistoryToLocalStorage({
          memberId: row.id,
          action: 'Approved',
          timestamp: new Date().toLocaleString(),
          reason: 'N/A',
          admin: 'Admin',
        });
      }
      saveApprovedMembersToLocalStorage(approvedMembers); // Lưu vào localStorage
      message.success('Đã duyệt các đơn đăng ký được chọn');
      loadApplicationsFromLocalStorage(); // Tải lại dữ liệu từ localStorage
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

        // Lưu lịch sử thao tác
        saveActionHistoryToLocalStorage({
          memberId: row.id,
          action: 'Rejected',
          timestamp: new Date().toLocaleString(),
          reason: rejectReason,
          admin: 'Admin',
        });
      }
      message.success('Đã từ chối các đơn đăng ký được chọn');
      loadApplicationsFromLocalStorage(); // Tải lại dữ liệu từ localStorage
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
        onHistory={(id) => {
          const memberHistory = actionHistory.filter((action) => action.memberId === id);
          setActionHistory(memberHistory);
          setHistoryVisible(true);
        }}
        onEdit={(record) => {
          setEditingMember(record);
          form.setFieldsValue(record);
          setModalVisible(true);
        }}
        onDelete={(id) => {
          const updatedApplications = applications.data.filter((app) => app.id !== id);
          localStorage.setItem('applications', JSON.stringify(updatedApplications));
          setApplications({ data: updatedApplications });
          message.success('Xóa đơn đăng ký thành công');
        }}
      />

      <MemberApplicationForm
        form={form}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onFinish={handleCreateOrUpdate}
        initialValues={editingMember || {}}
        clubs={activeClubs}
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