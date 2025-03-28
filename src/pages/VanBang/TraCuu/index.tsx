import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { 
  Card, Form, Input, Button, Space, Row, Col, 
  Select, DatePicker, Table, Modal, Descriptions, 
  message, Divider, Tag, Tooltip, Typography
} from 'antd';
import { 
  SearchOutlined, ReloadOutlined, 
  DownloadOutlined, EyeOutlined,
  FileTextOutlined, CalendarOutlined,
  UserOutlined, IdcardOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { useModel } from 'umi';
import type { ThongTinVanBang } from '@/models/vanbang/thongTinVanBang';
import type { QuyetDinhTotNghiep } from '@/models/vanbang/quyetDinhTotNghiep';
import type { SoVanBang } from '@/models/vanbang/soVanBang';
import type { TruongThongTin } from '@/models/vanbang/bieuMauVanBang';

const { Option } = Select;
const { Text } = Typography;

const TraCuuVanBangPage: React.FC = () => {
  const [form] = Form.useForm();
  const { 
    vanBangList, 
    fetchVanBangList,
    loading: vanBangLoading
  } = useModel('vanbang.thongTinVanBang');

  const { 
    soVanBangList, 
    fetchSoVanBangList 
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

  const [selectedSoVanBangId, setSelectedSoVanBangId] = useState<string | null>(null);
  const [selectedQuyetDinhId, setSelectedQuyetDinhId] = useState<string | null>(null);
  const [filteredQuyetDinhList, setFilteredQuyetDinhList] = useState<QuyetDinhTotNghiep[]>([]);
  const [searchResults, setSearchResults] = useState<ThongTinVanBang[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedVanBang, setSelectedVanBang] = useState<ThongTinVanBang | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSoVanBangList();
    fetchTruongThongTinList();
  }, [fetchSoVanBangList, fetchTruongThongTinList]);

  useEffect(() => {
    if (selectedSoVanBangId) {
      fetchQuyetDinhList(selectedSoVanBangId);
    }
  }, [selectedSoVanBangId, fetchQuyetDinhList]);

  useEffect(() => {
    if (selectedQuyetDinhId) {
      fetchVanBangList({ quyetDinhId: selectedQuyetDinhId });
    }
  }, [selectedQuyetDinhId, fetchVanBangList]);

  useEffect(() => {
    if (selectedSoVanBangId) {
      const filteredQuyetDinh = quyetDinhList.filter(
        qd => qd.soVanBangId === selectedSoVanBangId
      );
      setFilteredQuyetDinhList(filteredQuyetDinh);
    }
  }, [selectedSoVanBangId, quyetDinhList]);

  const handleSoVanBangChange = (value: string) => {
    setSelectedSoVanBangId(value);
    setSelectedQuyetDinhId(null);
  };

  const handleQuyetDinhChange = (value: string) => {
    setSelectedQuyetDinhId(value);
  };

  const handleSearch = async (values: any) => {
    setLoading(true);
    try {
      // Fetch all records for the selected quyết định
      await fetchVanBangList({ quyetDinhId: selectedQuyetDinhId });
      
      // Filter based on search criteria
      let filteredResults = [...vanBangList];
      
      // Search by text fields
      if (values.searchText) {
        const searchLower = values.searchText.toLowerCase();
        filteredResults = filteredResults.filter(record => 
          record.hoTen.toLowerCase().includes(searchLower) ||
          record.maSinhVien.toLowerCase().includes(searchLower) ||
          record.soHieuVanBang.toLowerCase().includes(searchLower)
        );
      }

      // Search by date range
      if (values.dateRange) {
        const [startDate, endDate] = values.dateRange;
        filteredResults = filteredResults.filter(record => {
          const recordDate = moment(record.ngaySinh);
          return recordDate.isBetween(startDate, endDate, 'day', '[]');
        });
      }

      // Search by extended fields
      const activeTruongThongTin = getActiveTruongThongTin();
      activeTruongThongTin.forEach(field => {
        if (values[field.ma]) {
          const searchValue = values[field.ma].toLowerCase();
          filteredResults = filteredResults.filter(record => {
            const fieldValue = record.thongTinMoRong[field.ma];
            if (fieldValue === undefined) return false;
            return String(fieldValue).toLowerCase().includes(searchValue);
          });
        }
      });

      setSearchResults(filteredResults);
      message.success(`Tìm thấy ${filteredResults.length} kết quả`);
    } catch (error) {
      console.error('Search failed:', error);
      message.error('Có lỗi xảy ra khi tìm kiếm');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setSearchResults([]);
  };

  const showDetailModal = (record: ThongTinVanBang) => {
    setSelectedVanBang(record);
    setDetailModalVisible(true);
  };

  const handleDetailCancel = () => {
    setDetailModalVisible(false);
    setSelectedVanBang(null);
  };

  const renderVanBangDetails = () => {
    if (!selectedVanBang) return null;
    
    const quyetDinh = quyetDinhList.find(qd => qd.id === selectedVanBang.quyetDinhId);
    const activeTruongThongTin = getActiveTruongThongTin();
    
    return (
      <Card>
        <Descriptions title="Thông tin cơ bản" bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Số vào sổ">
            <Tag color="blue">{selectedVanBang.soVaoSo}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Số hiệu văn bằng">
            <Tag color="green">{selectedVanBang.soHieuVanBang}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Mã sinh viên">
            <Tag color="purple">{selectedVanBang.maSinhVien}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Họ tên">
            <Tag color="orange">{selectedVanBang.hoTen}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {moment(selectedVanBang.ngaySinh).format('DD/MM/YYYY')}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Descriptions title="Thông tin mở rộng" bordered column={{ xs: 1, sm: 2 }}>
          {activeTruongThongTin.map(field => {
            const value = selectedVanBang.thongTinMoRong[field.ma];
            
            if (value !== undefined) {
              let displayValue = value;
              
              if (field.kieuDuLieu === 'date' && value) {
                displayValue = moment(value).format('DD/MM/YYYY');
              }
              
              return (
                <Descriptions.Item key={field.id} label={field.ten}>
                  {displayValue}
                </Descriptions.Item>
              );
            }
            return null;
          })}
        </Descriptions>
        
        {quyetDinh && (
          <>
            <Divider />
            <Descriptions title="Thông tin quyết định tốt nghiệp" bordered column={{ xs: 1, sm: 2 }}>
              <Descriptions.Item label="Số quyết định">{quyetDinh.soQuyetDinh}</Descriptions.Item>
              <Descriptions.Item label="Ngày ban hành">{moment(quyetDinh.ngayBanHanh).format('DD/MM/YYYY')}</Descriptions.Item>
              <Descriptions.Item label="Trích yếu" span={2}>{quyetDinh.trichYeu}</Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Card>
    );
  };

  const columns = [
    {
      title: 'Số hiệu VB',
      dataIndex: 'soHieuVanBang',
      key: 'soHieuVanBang',
      render: (text: string) => (
        <Tag color="green">{text}</Tag>
      ),
    },
    {
      title: 'Số vào sổ',
      dataIndex: 'soVaoSo',
      key: 'soVaoSo',
      render: (text: number) => (
        <Tag color="blue">{text}</Tag>
      ),
    },
    {
      title: 'Mã SV',
      dataIndex: 'maSinhVien',
      key: 'maSinhVien',
      render: (text: string) => (
        <Tag color="purple">{text}</Tag>
      ),
    },
    {
      title: 'Họ tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
      render: (text: string) => (
        <Tag color="orange">{text}</Tag>
      ),
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'ngaySinh',
      key: 'ngaySinh',
      render: (text: string) => moment(text).format('DD/MM/YYYY'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: ThongTinVanBang) => (
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
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSearch}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="soVanBangId"
                label="Sổ văn bằng"
                rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng!' }]}
              >
                <Select 
                  placeholder="Chọn sổ văn bằng"
                  onChange={handleSoVanBangChange}
                >
                  {soVanBangList.map((so: SoVanBang) => (
                    <Option key={so.id} value={so.id}>
                      {so.ten} ({so.trangThai === 'active' ? 'Đang mở' : 'Đã đóng'})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="quyetDinhId"
                label="Quyết định tốt nghiệp"
                rules={[{ required: true, message: 'Vui lòng chọn quyết định tốt nghiệp!' }]}
              >
                <Select 
                  placeholder="Chọn quyết định tốt nghiệp"
                  onChange={handleQuyetDinhChange}
                  disabled={!selectedSoVanBangId}
                >
                  {filteredQuyetDinhList.map((qd: QuyetDinhTotNghiep) => (
                    <Option key={qd.id} value={qd.id}>
                      {qd.soQuyetDinh} - {moment(qd.ngayBanHanh).format('DD/MM/YYYY')}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="searchText"
                label="Tìm kiếm"
              >
                <Input 
                  placeholder="Nhập từ khóa tìm kiếm..."
                  prefix={<SearchOutlined />}
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="dateRange"
                label="Khoảng thời gian"
              >
                <DatePicker.RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                label=" "
                style={{ marginBottom: 0 }}
              >
                <Space>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    icon={<SearchOutlined />}
                    loading={loading}
                  >
                    Tìm kiếm
                  </Button>
                  <Button 
                    onClick={handleReset}
                    icon={<ReloadOutlined />}
                  >
                    Làm mới
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>

          {/* Extended search fields */}
          <Row gutter={16}>
            {getActiveTruongThongTin().map((field: TruongThongTin) => (
              <Col span={8} key={field.id}>
                <Form.Item
                  name={field.ma}
                  label={field.ten}
                >
                  {field.kieuDuLieu === 'date' ? (
                    <DatePicker style={{ width: '100%' }} />
                  ) : field.kieuDuLieu === 'number' ? (
                    <InputNumber style={{ width: '100%' }} />
                  ) : (
                    <Input />
                  )}
                </Form.Item>
              </Col>
            ))}
          </Row>
        </Form>

        {searchResults.length > 0 && (
          <>
            <Divider />
            <Space style={{ marginBottom: 16 }}>
              <Text strong>Tìm thấy {searchResults.length} kết quả</Text>
              <Button 
                icon={<DownloadOutlined />}
                onClick={() => {
                  // TODO: Implement export functionality
                  message.info('Tính năng xuất kết quả đang được phát triển');
                }}
              >
                Xuất kết quả
              </Button>
            </Space>
            <Table 
              columns={columns} 
              dataSource={searchResults} 
              rowKey="id"
              pagination={{ 
                defaultPageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true
              }}
            />
          </>
        )}
      </Card>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết văn bằng"
        visible={detailModalVisible}
        onCancel={handleDetailCancel}
        width={800}
        footer={[
          <Button key="back" onClick={handleDetailCancel}>
            Đóng
          </Button>,
        ]}
      >
        {renderVanBangDetails()}
      </Modal>
    </PageContainer>
  );
};

export default TraCuuVanBangPage; 