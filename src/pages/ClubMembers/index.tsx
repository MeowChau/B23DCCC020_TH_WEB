import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Space, message, Form } from 'antd';
import { SwapOutlined, ExportOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { useParams } from 'react-router-dom';
import { getClubMembers, transferMembers, exportClubMembers, getClubs } from '@/services/club';
import MemberTable from '@/components/Member/MemberTable';
import TransferModal from '@/components/Member/TransferModal';
import type { Member } from '@/models/club';

const ClubMembers: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const [form] = Form.useForm();
  const [selectedRows, setSelectedRows] = useState<Member[]>([]);
  const [transferModalVisible, setTransferModalVisible] = useState(false);

  // Fetch danh sách thành viên
  const { data: members, loading, refresh } = useRequest(() => getClubMembers(clubId), {
    refreshDeps: [clubId],
  });

  // Fetch danh sách CLB
  const { data: clubs } = useRequest(getClubs);

  // Xử lý chuyển CLB
  const handleTransfer = async (values: { newClubId: string }) => {
    if (selectedRows.length === 0) return;

    try {
      await transferMembers({
        memberIds: selectedRows.map((member) => member.id),
        newClubId: values.newClubId,
      });

      message.success(`Chuyển ${selectedRows.length} thành viên thành công`);
      setTransferModalVisible(false);
      setSelectedRows([]);
      refresh();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  // Xử lý xuất danh sách thành viên
  const handleExport = async () => {
    try {
      const blob = await exportClubMembers(clubId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `club-members-${clubId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      message.error('Có lỗi xảy ra khi xuất file');
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
          <Button
            icon={<ExportOutlined />}
            onClick={handleExport}
          >
            Xuất danh sách
          </Button>
        </Space>
      </div>

      <MemberTable
        data={members?.data?.filter((member) => member.status === 'approved') || []} // Chỉ hiển thị thành viên đã duyệt
        loading={loading}
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
        clubs={clubs?.data || []}
        form={form}
      />
    </PageContainer>
  );
};

export default ClubMembers;