import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Space, message, Form } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import MemberTable from '@/components/Member/MemberTable';
import TransferModal from '@/components/Member/TransferModal';
import type { Member } from '@/models/club';

const ClubMembers: React.FC = () => {
  const [form] = Form.useForm();
  const [selectedRows, setSelectedRows] = useState<Member[]>([]);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [approvedMembers, setApprovedMembers] = useState<Member[]>([]);

  // Hàm tải danh sách thành viên đã duyệt từ localStorage
  const loadApprovedMembersFromLocalStorage = () => {
    const storedApprovedMembers = JSON.parse(localStorage.getItem('approvedMembers') || '[]');
    // Loại bỏ các thành viên trùng lặp dựa trên `id`
    const uniqueMembers = storedApprovedMembers.filter(
      (member: Member, index: number, self: Member[]) =>
        index === self.findIndex((m) => m.id === member.id)
    );
    setApprovedMembers(uniqueMembers);
  };

  useEffect(() => {
    loadApprovedMembersFromLocalStorage(); // Tải danh sách thành viên đã duyệt khi component được mount
  }, []);

  // Xử lý chuyển CLB
  const handleTransfer = async (values: { newClubId: string }) => {
    if (selectedRows.length === 0) return;

    try {
      // Cập nhật câu lạc bộ mới cho thành viên
      const updatedMembers = approvedMembers.map((member) =>
        selectedRows.some((row) => row.id === member.id)
          ? { ...member, clubId: values.newClubId }
          : member
      );

      // Lưu danh sách thành viên đã cập nhật vào localStorage
      localStorage.setItem('approvedMembers', JSON.stringify(updatedMembers));
      setApprovedMembers(updatedMembers);

      // Lưu thành viên vào câu lạc bộ mới trong localStorage
      const storedClubs = JSON.parse(localStorage.getItem('clubs') || '[]');
      const updatedClubs = storedClubs.map((club: any) => {
        if (club.id === values.newClubId) {
          const updatedClubMembers = [...(club.members || []), ...selectedRows];
          return { ...club, members: updatedClubMembers };
        }
        return club;
      });
      localStorage.setItem('clubs', JSON.stringify(updatedClubs));

      message.success(`Chuyển ${selectedRows.length} thành viên thành công`);
      setTransferModalVisible(false);
      setSelectedRows([]);
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  return (
    <PageContainer>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button
            type="primary"
            icon={<SwapOutlined />}
            disabled={selectedRows.length === 0}
            onClick={() => setTransferModalVisible(true)}
          >
            Chuyển CLB ({selectedRows.length})
          </Button>
        </Space>
      </div>

      <MemberTable
        data={approvedMembers} // Hiển thị danh sách thành viên đã duyệt
        loading={false}
        onRowSelect={setSelectedRows}
        onView={(member) => console.log('View member:', member)}
        onEdit={(member) => console.log('Edit member:', member)}
        onDelete={(member) => console.log('Delete member:', member)}
        onHistory={(member) => console.log('View history of member:', member)}
      />

      <TransferModal
        visible={transferModalVisible}
        onCancel={() => setTransferModalVisible(false)}
        onSubmit={handleTransfer}
        selectedCount={selectedRows.length}
        form={form}
        member={selectedRows.length === 1 ? selectedRows[0] : null} // Pass the first selected member or null
      />
    </PageContainer>
  );
};

export default ClubMembers;