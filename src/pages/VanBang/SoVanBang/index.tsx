import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Table, Space, Modal, Form, Input, DatePicker, Select, Tag, Tooltip, message } from 'antd';
import { PlusOutlined, EditOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useModel } from 'umi';
import type { SoVanBang } from '@/models/vanbang/soVanBang';

const { confirm } = Modal;

const SoVanBangPage: React.FC = () => {
  const { 
    loading, 
    soVanBangList, 
    fetchSoVanBangList, 
    createSoVanBang, 
    updateSoVanBang, 
    closeSoVanBang,
    openSoVanBang
  } = useModel('vanbang.soVanBang');
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SoVanBang | null>(null);

  useEffect(() => {
    fetchSoVanBangList();
  }, [fetchSoVanBangList]);

  const showModal = (record?: SoVanBang) => {
    setEditingRecord(record || null);
    form.resetFields();
    if (record) {
      form.setFieldsValue({
        ten: record.ten,
        nam: record.nam,
        moTa: record.moTa,
        trangThai: record.trangThai,
      });
    } else {
      // Default values for new record
      const currentYear = new Date().getFullYear();
      form.setFieldsValue({
        nam: currentYear,
        ten: `Sổ văn bằng ${currentYear}`,
        trangThai: 'active',
      });
    }
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord) {
        await updateSoVanBang(editingRecord.id, values);
      } else {
        await createSoVanBang(values);
      }
      setModalVisible(false);
      fetchSoVanBangList();
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  const handleCloseSo = (record: SoVanBang) => {
    confirm({
      title: 'Xác nhận đóng sổ văn bằng',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn đóng sổ văn bằng này?',
      onOk: async () => {
        await closeSoVanBang(record.id);
        fetchSoVanBangList();
        message.success('Đóng sổ văn bằng thành công');
      },
    });
  };

  const handleOpenSo = (record: SoVanBang) => {
    confirm({
      title: 'Xác nhận mở sổ văn bằng',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn mở sổ văn bằng này? Nếu đã có sổ đang mở, hệ thống sẽ thông báo.',
      onOk: async () => {
        const result = await openSoVanBang(record.id);
        if (result) {
          fetchSoVanBangList();
          message.success('Mở sổ văn bằng thành công');
        }
      },
    });
  };

  const columns = [
    {
      title: 'Tên sổ',
      dataIndex: 'ten',
      key: 'ten',
    },
    {
      title: 'Năm',
      dataIndex: 'nam',
      key: 'nam',
      sorter: (a: SoVanBang, b: SoVanBang) => a.nam - b.nam,
    },
    {
      title: 'Số vào sổ hiện tại',
      dataIndex: 'soVaoSoHienTai',
      key: 'soVaoSoHienTai',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'ngayTao',
      key: 'ngayTao',
      render: (text: string) => moment(text).format('DD/MM/YYYY'),
      sorter: (a: SoVanBang, b: SoVanBang) => moment(a.ngayTao).unix() - moment(b.ngayTao).unix(),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (trangThai: 'active' | 'closed') => (
        <Tag color={trangThai === 'active' ? 'green' : 'red'}>
          {trangThai === 'active' ? 'Đang mở' : 'Đã đóng'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record: SoVanBang) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="primary" 
              shape="circle" 
              icon={<EditOutlined />} 
              size="small" 
              onClick={() => showModal(record)}
            />
          </Tooltip>
          {record.trangThai === 'active' && (
            <Tooltip title="Đóng sổ">
              <Button 
                danger 
                shape="circle" 
                icon={<CloseOutlined />} 
                size="small" 
                onClick={() => handleCloseSo(record)}
              />
            </Tooltip>
          )}
          {record.trangThai === 'closed' && (
            <Tooltip title="Mở sổ">
              <Button 
                type="primary"
                style={{ backgroundColor: 'green', borderColor: 'green' }}
                shape="circle" 
                icon={<PlusOutlined />} 
                size="small" 
                onClick={() => handleOpenSo(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <Card>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => showModal()} 
          style={{ marginBottom: 16 }}
        >
          Thêm sổ văn bằng
        </Button>
        <Table 
          columns={columns} 
          dataSource={soVanBangList} 
          rowKey="id" 
          loading={loading}
          pagination={{ defaultPageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingRecord ? 'Chỉnh sửa sổ văn bằng' : 'Thêm sổ văn bằng'}
        visible={modalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleSave}>
            {editingRecord ? 'Cập nhật' : 'Tạo mới'}
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="ten"
            label="Tên sổ văn bằng"
            rules={[{ required: true, message: 'Vui lòng nhập tên sổ văn bằng!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="nam"
            label="Năm"
            rules={[{ required: true, message: 'Vui lòng nhập năm!' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="moTa"
            label="Mô tả"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="trangThai"
            label="Trạng thái"
            initialValue="active"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select>
              <Select.Option value="active">Đang mở</Select.Option>
              <Select.Option value="closed">Đã đóng</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default SoVanBangPage; 