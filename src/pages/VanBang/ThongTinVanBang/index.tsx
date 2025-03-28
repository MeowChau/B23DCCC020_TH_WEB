import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { 
  Button, Card, Table, Space, Modal, Form, Input, 
  DatePicker, Select, Typography, Tooltip, Row, Col,
  message, Spin, InputNumber, Tabs, Descriptions
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  ExclamationCircleOutlined, EyeOutlined, SearchOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { useModel, useLocation, history } from 'umi';
import type { ThongTinVanBang } from '@/models/vanbang/thongTinVanBang';
import type { QuyetDinhTotNghiep } from '@/models/vanbang/quyetDinhTotNghiep';
import type { SoVanBang } from '@/models/vanbang/soVanBang';
import type { TruongThongTin } from '@/models/vanbang/bieuMauVanBang';

const { confirm } = Modal;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const ThongTinVanBangPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const quyetDinhIdFromUrl = queryParams.get('quyetDinhId');

  const { 
    loading: vanBangLoading, 
    vanBangList, 
    fetchVanBangList, 
    createVanBang, 
    updateVanBang, 
    deleteVanBang 
  } = useModel('vanbang.thongTinVanBang');

  const { 
    soVanBangList, 
    fetchSoVanBangList,
    getActiveSoVanBang
  } = useModel('vanbang.soVanBang');

  const { 
    quyetDinhList, 
    fetchQuyetDinhList 
  } = useModel('vanbang.quyetDinhTotNghiep');

  const { 
    truongThongTinList, 
    fetchTruongThongTinList,
    getActiveTruongThongTin
  } = useModel('vanbang.bieuMauVanBang');

  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ThongTinVanBang | null>(null);
  const [viewingRecord, setViewingRecord] = useState<ThongTinVanBang | null>(null);
  const [selectedSoVanBangId, setSelectedSoVanBangId] = useState<string | null>(null);
  const [selectedQuyetDinhId, setSelectedQuyetDinhId] = useState<string | null>(null);
  const [filteredQuyetDinhList, setFilteredQuyetDinhList] = useState<QuyetDinhTotNghiep[]>([]);

  useEffect(() => {
    fetchSoVanBangList();
    fetchTruongThongTinList();
  }, [fetchSoVanBangList, fetchTruongThongTinList]);

  useEffect(() => {
    if (soVanBangList.length > 0) {
      const activeSoVanBang = getActiveSoVanBang();
      if (activeSoVanBang) {
        setSelectedSoVanBangId(activeSoVanBang.id);
        fetchQuyetDinhList(activeSoVanBang.id);
      }
    }
  }, [soVanBangList, getActiveSoVanBang, fetchQuyetDinhList]);

  useEffect(() => {
    if (selectedSoVanBangId) {
      const filteredQuyetDinh = quyetDinhList.filter(
        qd => qd.soVanBangId === selectedSoVanBangId
      );
      setFilteredQuyetDinhList(filteredQuyetDinh);

      // If there's a quyetDinhId in the URL or we don't have a selected one already
      if (quyetDinhIdFromUrl && filteredQuyetDinh.some(qd => qd.id === quyetDinhIdFromUrl)) {
        setSelectedQuyetDinhId(quyetDinhIdFromUrl);
      } else if (filteredQuyetDinh.length > 0 && !selectedQuyetDinhId) {
        setSelectedQuyetDinhId(filteredQuyetDinh[0].id);
      }
    }
  }, [selectedSoVanBangId, quyetDinhList, quyetDinhIdFromUrl, selectedQuyetDinhId]);

  useEffect(() => {
    if (selectedQuyetDinhId) {
      fetchVanBangList({ quyetDinhId: selectedQuyetDinhId });
    }
  }, [selectedQuyetDinhId, fetchVanBangList]);

  const handleSoVanBangChange = (value: string) => {
    setSelectedSoVanBangId(value);
    setSelectedQuyetDinhId(null); // Reset quyết định when changing sổ
    fetchQuyetDinhList(value);
  };

  const handleQuyetDinhChange = (value: string) => {
    setSelectedQuyetDinhId(value);
    // Update the URL with the new quyetDinhId
    history.replace(`/van-bang/danh-sach?quyetDinhId=${value}`);
  };

  const showModal = (record?: ThongTinVanBang) => {
    if (!selectedSoVanBangId || !selectedQuyetDinhId) {
      message.error('Vui lòng chọn sổ văn bằng và quyết định tốt nghiệp trước');
      return;
    }

    setEditingRecord(record || null);
    form.resetFields();
    
    if (record) {
      // For editing, populate form with existing values
      const formValues = {
        soHieuVanBang: record.soHieuVanBang,
        maSinhVien: record.maSinhVien,
        hoTen: record.hoTen,
        ngaySinh: moment(record.ngaySinh),
        quyetDinhId: record.quyetDinhId,
      };

      // Nạp các giá trị thongTinMoRong vào form
      if (record.thongTinMoRong) {
        const activeTruongThongTin = getActiveTruongThongTin();
        activeTruongThongTin.forEach(field => {
          const value = record.thongTinMoRong[field.ma];
          if (value !== undefined) {
            if (field.kieuDuLieu === 'date' && value) {
              formValues[field.ma] = moment(value);
            } else {
              formValues[field.ma] = value;
            }
          }
        });
      }

      form.setFieldsValue(formValues);
    } else {
      // For new record, just set quyetDinhId
      form.setFieldsValue({
        quyetDinhId: selectedQuyetDinhId,
      });
    }
    
    setModalVisible(true);
  };

  const showDetailModal = (record: ThongTinVanBang) => {
    setViewingRecord(record);
    setDetailModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleDetailCancel = () => {
    setDetailModalVisible(false);
    setViewingRecord(null);
  };

  const handleSave = async () => {
    if (!selectedSoVanBangId || !selectedQuyetDinhId) {
      message.error('Vui lòng chọn sổ văn bằng và quyết định tốt nghiệp');
      return;
    }

    try {
      const values = await form.validateFields();
      
      // Extract standard and extended fields
      const { ngaySinh, ...otherValues } = values;
      const standardFields = ['soHieuVanBang', 'maSinhVien', 'hoTen', 'quyetDinhId'];
      
      const standardData: any = {};
      const thongTinMoRong: Record<string, any> = {};
      
      // Separate standard fields from extended fields
      Object.keys(otherValues).forEach(key => {
        if (standardFields.includes(key)) {
          standardData[key] = otherValues[key];
        } else {
          thongTinMoRong[key] = otherValues[key];
        }
      });

      const formattedData = {
        ...standardData,
        ngaySinh: ngaySinh.format('YYYY-MM-DD'),
        thongTinMoRong,
      };

      const activeTruongThongTin = getActiveTruongThongTin();

      if (editingRecord) {
        await updateVanBang(editingRecord.id, formattedData, activeTruongThongTin);
      } else {
        await createVanBang(
          {
            ...formattedData,
            soVanBangId: selectedSoVanBangId,
          },
          selectedSoVanBangId,
          activeTruongThongTin
        );
      }
      
      setModalVisible(false);
      fetchVanBangList({ quyetDinhId: selectedQuyetDinhId });
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  const handleDelete = (record: ThongTinVanBang) => {
    confirm({
      title: 'Xác nhận xóa thông tin văn bằng',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn xóa thông tin văn bằng này?',
      onOk: async () => {
        await deleteVanBang(record.id);
        fetchVanBangList({ quyetDinhId: selectedQuyetDinhId });
      },
    });
  };

  // Transform truongThongTin to column definitions
  const getExtendedColumns = () => {
    const activeTruongThongTin = getActiveTruongThongTin();
    return activeTruongThongTin.map(field => ({
      title: field.ten,
      dataIndex: ['thongTinMoRong', field.ma],
      key: field.ma,
      render: (value: any) => {
        if (field.kieuDuLieu === 'date' && value) {
          return moment(value).format('DD/MM/YYYY');
        }
        return value;
      },
    }));
  };

  const columns = [
    {
      title: 'Số vào sổ',
      dataIndex: 'soVaoSo',
      key: 'soVaoSo',
      sorter: (a: ThongTinVanBang, b: ThongTinVanBang) => a.soVaoSo - b.soVaoSo,
    },
    {
      title: 'Số hiệu văn bằng',
      dataIndex: 'soHieuVanBang',
      key: 'soHieuVanBang',
    },
    {
      title: 'Mã sinh viên',
      dataIndex: 'maSinhVien',
      key: 'maSinhVien',
    },
    {
      title: 'Họ tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'ngaySinh',
      key: 'ngaySinh',
      render: (text: string) => moment(text).format('DD/MM/YYYY'),
    },
    ...getExtendedColumns().slice(0, 2), // Show only first 2 extended fields in table
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record: ThongTinVanBang) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <Button 
              type="primary" 
              shape="circle" 
              icon={<EyeOutlined />} 
              size="small" 
              onClick={() => showDetailModal(record)}
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

  // Render form items for extended fields
  const renderExtendedFormItems = () => {
    const activeTruongThongTin = getActiveTruongThongTin();
    
    // Sắp xếp để đưa nơi sinh và dân tộc lên đầu
    const sortedFields = [...activeTruongThongTin].sort((a, b) => {
      // Ưu tiên dân tộc và nơi sinh lên đầu
      if (a.ma === 'dan_toc') return -1;
      if (b.ma === 'dan_toc') return 1;
      if (a.ma === 'noi_sinh') return -1;
      if (b.ma === 'noi_sinh') return 1;
      return a.order - b.order;
    });
    
    return sortedFields.map(field => {
      let formItem;
      
      switch (field.kieuDuLieu) {
        case 'number':
          formItem = <InputNumber style={{ width: '100%' }} />;
          break;
        case 'date':
          formItem = <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />;
          break;
        default:
          formItem = <Input />;
      }
      
      return (
        <Form.Item
          key={field.id}
          name={field.ma}
          label={field.ten}
          rules={field.required ? [{ required: true, message: `Vui lòng nhập ${field.ten}!` }] : undefined}
        >
          {formItem}
        </Form.Item>
      );
    });
  };

  // Render description items for detail view
  const renderDescriptionItems = () => {
    if (!viewingRecord) return null;
    
    const activeTruongThongTin = getActiveTruongThongTin();
    const items = [];

    // Standard fields
    items.push(
      <Descriptions.Item key="soVaoSo" label="Số vào sổ">{viewingRecord.soVaoSo}</Descriptions.Item>,
      <Descriptions.Item key="soHieuVanBang" label="Số hiệu văn bằng">{viewingRecord.soHieuVanBang}</Descriptions.Item>,
      <Descriptions.Item key="maSinhVien" label="Mã sinh viên">{viewingRecord.maSinhVien}</Descriptions.Item>,
      <Descriptions.Item key="hoTen" label="Họ tên">{viewingRecord.hoTen}</Descriptions.Item>,
      <Descriptions.Item key="ngaySinh" label="Ngày sinh">{moment(viewingRecord.ngaySinh).format('DD/MM/YYYY')}</Descriptions.Item>
    );

    // Extended fields
    activeTruongThongTin.forEach(field => {
      const value = viewingRecord.thongTinMoRong[field.ma];
      
      if (value !== undefined) {
        let displayValue = value;
        
        if (field.kieuDuLieu === 'date' && value) {
          displayValue = moment(value).format('DD/MM/YYYY');
        }
        
        items.push(
          <Descriptions.Item key={field.ma} label={field.ten}>{displayValue}</Descriptions.Item>
        );
      }
    });

    return items;
  };

  const getCurrentQuyetDinh = () => {
    if (!selectedQuyetDinhId) return null;
    return quyetDinhList.find(qd => qd.id === selectedQuyetDinhId);
  };

  return (
    <PageContainer>
      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Row gutter={16}>
            <Col span={8}>
              <Text strong>Sổ văn bằng:</Text>
              <Select 
                placeholder="Chọn sổ văn bằng" 
                style={{ width: '80%', marginLeft: 8 }} 
                onChange={handleSoVanBangChange}
                value={selectedSoVanBangId}
              >
                {soVanBangList.map((so: SoVanBang) => (
                  <Option key={so.id} value={so.id}>
                    {so.ten} ({so.trangThai === 'active' ? 'Đang mở' : 'Đã đóng'})
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={12}>
              <Text strong>Quyết định tốt nghiệp:</Text>
              <Select 
                placeholder="Chọn quyết định tốt nghiệp" 
                style={{ width: '70%', marginLeft: 8 }} 
                onChange={handleQuyetDinhChange}
                value={selectedQuyetDinhId}
                disabled={!selectedSoVanBangId}
              >
                {filteredQuyetDinhList.map((qd: QuyetDinhTotNghiep) => (
                  <Option key={qd.id} value={qd.id}>
                    {qd.soQuyetDinh} - {moment(qd.ngayBanHanh).format('DD/MM/YYYY')}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={4} style={{ textAlign: 'right' }}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => showModal()} 
                disabled={!selectedQuyetDinhId}
              >
                Thêm văn bằng
              </Button>
            </Col>
          </Row>

          {getCurrentQuyetDinh() && (
            <Card type="inner" title="Thông tin quyết định">
              <Descriptions column={{ xs: 1, sm: 2, md: 3 }}>
                <Descriptions.Item label="Số quyết định">{getCurrentQuyetDinh()?.soQuyetDinh}</Descriptions.Item>
                <Descriptions.Item label="Ngày ban hành">{moment(getCurrentQuyetDinh()?.ngayBanHanh).format('DD/MM/YYYY')}</Descriptions.Item>
                <Descriptions.Item label="Lượt tra cứu">{getCurrentQuyetDinh()?.luotTraCuu}</Descriptions.Item>
                <Descriptions.Item label="Trích yếu" span={3}>{getCurrentQuyetDinh()?.trichYeu}</Descriptions.Item>
              </Descriptions>
            </Card>
          )}
          
          <Table 
            columns={columns} 
            dataSource={vanBangList} 
            rowKey="id" 
            loading={vanBangLoading}
            pagination={{ defaultPageSize: 10 }}
          />
        </Space>
      </Card>

      {/* Form Modal */}
      <Modal
        title={editingRecord ? 'Chỉnh sửa thông tin văn bằng' : 'Thêm thông tin văn bằng'}
        visible={modalVisible}
        onCancel={handleCancel}
        width={700}
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
          <Tabs defaultActiveKey="1">
            <TabPane tab="Thông tin cơ bản" key="1">
              <Form.Item
                name="quyetDinhId"
                label="Quyết định tốt nghiệp"
                rules={[{ required: true, message: 'Vui lòng chọn quyết định tốt nghiệp!' }]}
              >
                <Select placeholder="Chọn quyết định tốt nghiệp" disabled={!!editingRecord}>
                  {filteredQuyetDinhList.map((qd: QuyetDinhTotNghiep) => (
                    <Option key={qd.id} value={qd.id}>
                      {qd.soQuyetDinh} - {moment(qd.ngayBanHanh).format('DD/MM/YYYY')}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="soHieuVanBang"
                label="Số hiệu văn bằng"
                rules={[{ required: true, message: 'Vui lòng nhập số hiệu văn bằng!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="maSinhVien"
                label="Mã sinh viên"
                rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="hoTen"
                label="Họ tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="ngaySinh"
                label="Ngày sinh"
                rules={[
                  { required: true, message: 'Vui lòng chọn ngày sinh!' }
                ]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </TabPane>
            <TabPane tab="Thông tin mở rộng" key="2">
              {renderExtendedFormItems()}
            </TabPane>
          </Tabs>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết văn bằng"
        visible={detailModalVisible}
        onCancel={handleDetailCancel}
        width={700}
        footer={[
          <Button key="back" onClick={handleDetailCancel}>
            Đóng
          </Button>,
        ]}
      >
        {viewingRecord ? (
          <Descriptions title="Thông tin văn bằng" bordered column={{ xs: 1, sm: 2 }}>
            {renderDescriptionItems()}
          </Descriptions>
        ) : (
          <Spin />
        )}
      </Modal>
    </PageContainer>
  );
};

export default ThongTinVanBangPage; 