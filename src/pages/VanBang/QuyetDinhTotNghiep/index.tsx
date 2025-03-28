import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Table, Space, Modal, Form, Input, DatePicker, Select, Tag, Typography, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useModel, history } from 'umi';
import type { QuyetDinhTotNghiep } from '@/models/vanbang/quyetDinhTotNghiep';
import type { SoVanBang } from '@/models/vanbang/soVanBang';

const { confirm } = Modal;
const { Title, Text } = Typography;
const { TextArea } = Input;

const QuyetDinhTotNghiepPage: React.FC = () => {
  const { 
    loading: quyetDinhLoading, 
    quyetDinhList, 
    fetchQuyetDinhList, 
    createQuyetDinh, 
    updateQuyetDinh, 
    deleteQuyetDinh 
  } = useModel('vanbang.quyetDinhTotNghiep');

  const { 
    soVanBangList, 
    fetchSoVanBangList,
    getActiveSoVanBang
  } = useModel('vanbang.soVanBang');

  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<QuyetDinhTotNghiep | null>(null);
  const [selectedSoVanBangId, setSelectedSoVanBangId] = useState<string | null>(null);

  useEffect(() => {
    fetchSoVanBangList();
  }, [fetchSoVanBangList]);

  useEffect(() => {
    if (soVanBangList.length > 0) {
      const activeSoVanBang = getActiveSoVanBang();
      if (activeSoVanBang) {
        setSelectedSoVanBangId(activeSoVanBang.id);
        fetchQuyetDinhList(activeSoVanBang.id);
      }
    }
  }, [soVanBangList, getActiveSoVanBang, fetchQuyetDinhList]);

  const handleSoVanBangChange = (value: string) => {
    setSelectedSoVanBangId(value);
    fetchQuyetDinhList(value);
  };

  const showModal = (record?: QuyetDinhTotNghiep) => {
    setEditingRecord(record || null);
    form.resetFields();
    if (record) {
      form.setFieldsValue({
        soQuyetDinh: record.soQuyetDinh,
        ngayBanHanh: moment(record.ngayBanHanh),
        trichYeu: record.trichYeu,
        soVanBangId: record.soVanBangId,
      });
    } else {
      form.setFieldsValue({
        soVanBangId: selectedSoVanBangId,
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
      // Convert date to string format
      const formattedValues = {
        ...values,
        ngayBanHanh: values.ngayBanHanh.format('YYYY-MM-DD'),
      };

      if (editingRecord) {
        await updateQuyetDinh(editingRecord.id, formattedValues);
      } else {
        await createQuyetDinh(formattedValues);
      }
      setModalVisible(false);
      if (selectedSoVanBangId) {
        fetchQuyetDinhList(selectedSoVanBangId);
      }
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  const handleDelete = (record: QuyetDinhTotNghiep) => {
    confirm({
      title: 'Xác nhận xóa quyết định tốt nghiệp',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn xóa quyết định tốt nghiệp này?',
      onOk: async () => {
        await deleteQuyetDinh(record.id);
        if (selectedSoVanBangId) {
          fetchQuyetDinhList(selectedSoVanBangId);
        }
      },
    });
  };

  const columns = [
    {
      title: 'Số quyết định',
      dataIndex: 'soQuyetDinh',
      key: 'soQuyetDinh',
    },
    {
      title: 'Ngày ban hành',
      dataIndex: 'ngayBanHanh',
      key: 'ngayBanHanh',
      render: (text: string) => moment(text).format('DD/MM/YYYY'),
      sorter: (a: QuyetDinhTotNghiep, b: QuyetDinhTotNghiep) => moment(a.ngayBanHanh).unix() - moment(b.ngayBanHanh).unix(),
    },
    {
      title: 'Trích yếu',
      dataIndex: 'trichYeu',
      key: 'trichYeu',
      ellipsis: {
        showTitle: false,
      },
      render: (trichYeu: string) => (
        <Tooltip placement="topLeft" title={trichYeu}>
          {trichYeu}
        </Tooltip>
      )
    },
    {
      title: 'Lượt tra cứu',
      dataIndex: 'luotTraCuu',
      key: 'luotTraCuu',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record: QuyetDinhTotNghiep) => (
        <Space size="middle">
          <Tooltip title="Xem văn bằng">
            <Button 
              type="primary" 
              shape="circle" 
              icon={<EyeOutlined />} 
              size="small" 
              onClick={() => history.push(`/van-bang/danh-sach?quyetDinhId=${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="default" 
              shape="circle" 
              icon={<EditOutlined />} 
              size="small" 
              onClick={() => showModal(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button 
              danger
              shape="circle" 
              icon={<DeleteOutlined />} 
              size="small" 
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Space>
            <Text strong>Sổ văn bằng:</Text>
            <Select 
              placeholder="Chọn sổ văn bằng" 
              style={{ width: 300 }} 
              onChange={handleSoVanBangChange}
              value={selectedSoVanBangId}
            >
              {soVanBangList.map((so: SoVanBang) => (
                <Select.Option key={so.id} value={so.id}>
                  {so.ten} ({so.trangThai === 'active' ? 'Đang mở' : 'Đã đóng'})
                </Select.Option>
              ))}
            </Select>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => showModal()} 
              disabled={!selectedSoVanBangId}
            >
              Thêm quyết định
            </Button>
          </Space>
          
          <Table 
            columns={columns} 
            dataSource={quyetDinhList} 
            rowKey="id" 
            loading={quyetDinhLoading}
            pagination={{ defaultPageSize: 10 }}
          />
        </Space>
      </Card>

      <Modal
        title={editingRecord ? 'Chỉnh sửa quyết định tốt nghiệp' : 'Thêm quyết định tốt nghiệp'}
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
            name="soVanBangId"
            label="Sổ văn bằng"
            rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng!' }]}
          >
            <Select placeholder="Chọn sổ văn bằng">
              {soVanBangList.map((so: SoVanBang) => (
                <Select.Option key={so.id} value={so.id} disabled={so.trangThai !== 'active'}>
                  {so.ten} ({so.trangThai === 'active' ? 'Đang mở' : 'Đã đóng'})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="soQuyetDinh"
            label="Số quyết định"
            rules={[{ required: true, message: 'Vui lòng nhập số quyết định!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="ngayBanHanh"
            label="Ngày ban hành"
            rules={[{ required: true, message: 'Vui lòng chọn ngày ban hành!' }]}
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item
            name="trichYeu"
            label="Trích yếu"
            rules={[{ required: true, message: 'Vui lòng nhập trích yếu!' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default QuyetDinhTotNghiepPage; 