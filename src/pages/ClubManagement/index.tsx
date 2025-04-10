import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Table, Space, Modal, message, Form } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons';
import ClubForm from '@/components/Club/ClubForm';
import StatusTag from '@/components/Common/StatusTag';

interface Club {
  id: string;
  name: string;
  avatar: string;
  establishmentDate: string;
  president: string;
  isActive: boolean;
}

const ClubManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [clubs, setClubs] = useState<Club[]>([]);

  // Hàm tải dữ liệu từ localStorage
  const loadClubs = () => {
    const storedClubs = JSON.parse(localStorage.getItem('clubs') || '[]');
    setClubs(storedClubs);
  };

  // Hàm lưu dữ liệu vào localStorage
  const saveClubs = (updatedClubs: Club[]) => {
    localStorage.setItem('clubs', JSON.stringify(updatedClubs));
    setClubs(updatedClubs);
  };

  useEffect(() => {
    loadClubs(); // Tải dữ liệu khi trang được tải
  }, []);

  const handleCreate = async (values: any) => {
    try {
      const newClub = { id: Date.now().toString(), ...values }; // Tạo ID giả lập
      const updatedClubs = [...clubs, newClub];
      saveClubs(updatedClubs); // Lưu vào localStorage
      message.success('Tạo câu lạc bộ thành công');
      setModalVisible(false);
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  const handleUpdate = async (values: any) => {
    if (!editingClub) return;
    try {
      const updatedClubs = clubs.map((club) =>
        club.id === editingClub.id ? { ...club, ...values } : club
      );
      saveClubs(updatedClubs); // Lưu vào localStorage
      message.success('Cập nhật câu lạc bộ thành công');
      setModalVisible(false);
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const updatedClubs = clubs.filter((club) => club.id !== id);
      saveClubs(updatedClubs); // Lưu vào localStorage
      message.success('Xóa câu lạc bộ thành công');
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  const columns = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar: string) => (
        <img src={avatar} alt="club" style={{ width: 50, height: 50, objectFit: 'cover' }} />
      ),
    },
    {
      title: 'Tên câu lạc bộ',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: 'Ngày thành lập',
      dataIndex: 'establishmentDate',
      key: 'establishmentDate',
      sorter: true,
    },
    {
      title: 'Chủ nhiệm CLB',
      dataIndex: 'president',
      key: 'president',
    },
    {
      title: 'Hoạt động',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => <StatusTag status={isActive} type="club" />,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Club) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingClub(record);
              form.setFieldsValue(record);
              setModalVisible(true);
            }}
          >
            Chỉnh sửa
          </Button>
          <Button
            type="link"
            icon={<TeamOutlined />}
            onClick={() => console.log(`Xem thành viên của CLB ${record.id}`)}
          >
            Thành viên
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: 'Xác nhận xóa',
                content: 'Bạn có chắc chắn muốn xóa câu lạc bộ này?',
                onOk: () => handleDelete(record.id),
              });
            }}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingClub(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          Thêm câu lạc bộ
        </Button>
      </div>

      <Table
        dataSource={clubs}
        rowKey="id"
        columns={columns}
      />

      <Modal
        title={editingClub ? 'Chỉnh sửa câu lạc bộ' : 'Thêm câu lạc bộ mới'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={editingClub ? handleUpdate : handleCreate}
          layout="vertical"
        >
          <ClubForm form={form} onFinish={editingClub ? handleUpdate : handleCreate} />
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginTop: 16 }}>
              {editingClub ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default ClubManagement;