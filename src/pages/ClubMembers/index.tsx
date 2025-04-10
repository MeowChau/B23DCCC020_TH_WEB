import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Table, Space, Modal, Form, Select, message } from 'antd';
import { SwapOutlined, ExportOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { useParams } from 'react-router-dom'; // You'll need to install this
import { getClubMembers, transferMembers, exportClubMembers } from '@/services/club';
import type { Member } from '@/models/club';

const { Option } = Select;

const ClubMembers: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const [form] = Form.useForm();
  const [selectedRows, setSelectedRows] = useState<Member[]>([]);
  const [transferModalVisible, setTransferModalVisible] = useState(false);

  const { data: members, loading, refresh } = useRequest(() => getClubMembers(clubId), {
    refreshDeps: [clubId],
  });

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

  const columns = [
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
  ];

  const rowSelection = {
    onChange: (_: React.Key[], selected: Member[]) => {
      setSelectedRows(selected);
    },
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

      <Table
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        columns={columns}
        dataSource={members?.data}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title="Chuyển câu lạc bộ"
        visible={transferModalVisible}
        onCancel={() => setTransferModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleTransfer} layout="vertical">
          <Form.Item
            name="newClubId"
            label="Câu lạc bộ mới"
            rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ' }]}
          >
            <Select placeholder="Chọn câu lạc bộ">
              {/* TODO: Load clubs from API */}
              <Option value="club1">Câu lạc bộ 1</Option>
              <Option value="club2">Câu lạc bộ 2</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default ClubMembers; 