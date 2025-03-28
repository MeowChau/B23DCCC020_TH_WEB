import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { 
  Button, Card, Table, Space, Modal, Form, Input, 
  Select, Switch, Typography, Tooltip, Popconfirm, 
  Row, Col, Divider, message 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  ArrowUpOutlined, ArrowDownOutlined, MenuOutlined
} from '@ant-design/icons';
import { useModel } from 'umi';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { TruongThongTin, FieldType } from '@/models/vanbang/bieuMauVanBang';

const { Title, Text } = Typography;
const { Option } = Select;

const BieuMauPage: React.FC = () => {
  const { 
    loading, 
    truongThongTinList, 
    fetchTruongThongTinList, 
    createTruongThongTin, 
    updateTruongThongTin, 
    deleteTruongThongTin,
    updateThuTu
  } = useModel('vanbang.bieuMauVanBang');

  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TruongThongTin | null>(null);

  useEffect(() => {
    fetchTruongThongTinList();
  }, [fetchTruongThongTinList]);

  const showModal = (record?: TruongThongTin) => {
    setEditingRecord(record || null);
    form.resetFields();
    if (record) {
      form.setFieldsValue({
        ten: record.ten,
        ma: record.ma,
        kieuDuLieu: record.kieuDuLieu,
        required: record.required,
        active: record.active,
      });
    } else {
      form.setFieldsValue({
        required: true,
        active: true,
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
        await updateTruongThongTin(editingRecord.id, values);
      } else {
        // Generate a unique code based on name if not provided
        if (!values.ma) {
          values.ma = values.ten
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[đĐ]/g, 'd')
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9_]/g, '');
        }

        // Add order at the end of the list
        values.order = truongThongTinList.length > 0 
          ? Math.max(...truongThongTinList.map(item => item.order)) + 1 
          : 1;

        await createTruongThongTin(values);
      }
      setModalVisible(false);
      fetchTruongThongTinList();
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTruongThongTin(id);
      fetchTruongThongTinList();
      message.success('Xóa trường thông tin thành công');
    } catch (error) {
      message.error('Xóa trường thông tin thất bại');
    }
  };

  const handleToggleActive = async (record: TruongThongTin) => {
    try {
      await updateTruongThongTin(record.id, { active: !record.active });
      fetchTruongThongTinList();
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại');
    }
  };

  const handleMoveItem = async (id: string, direction: 'up' | 'down') => {
    const sortedList = [...truongThongTinList].sort((a, b) => a.order - b.order);
    const currentIndex = sortedList.findIndex(item => item.id === id);
    
    if (
      (direction === 'up' && currentIndex === 0) || 
      (direction === 'down' && currentIndex === sortedList.length - 1)
    ) {
      return;
    }
    
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const targetItem = sortedList[targetIndex];
    
    const currentOrder = sortedList[currentIndex].order;
    const targetOrder = targetItem.order;
    
    await updateThuTu([
      { id, order: targetOrder },
      { id: targetItem.id, order: currentOrder }
    ]);
    
    fetchTruongThongTinList();
  };

  const onDragEnd = async (result: any) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    if (sourceIndex === destIndex) {
      return;
    }

    const sortedList = [...truongThongTinList].sort((a, b) => a.order - b.order);
    const movedItem = sortedList[sourceIndex];

    // Remove from list
    sortedList.splice(sourceIndex, 1);
    // Insert at new position
    sortedList.splice(destIndex, 0, movedItem);

    // Update orders
    const updateItems = sortedList.map((item, index) => ({
      id: item.id,
      order: index + 1
    }));

    await updateThuTu(updateItems);
    fetchTruongThongTinList();
  };

  const dataTypeOptions = [
    { label: 'Văn bản', value: 'string' },
    { label: 'Số', value: 'number' },
    { label: 'Ngày tháng', value: 'date' },
  ];

  const dataTypeLabels: Record<FieldType, string> = {
    'string': 'Văn bản',
    'number': 'Số',
    'date': 'Ngày tháng',
  };

  const sortedList = [...truongThongTinList].sort((a, b) => a.order - b.order);

  return (
    <PageContainer>
      <Card>
        <Row justify="space-between" style={{ marginBottom: 16 }}>
          <Col>
            <Title level={4}>Cấu hình biểu mẫu văn bằng</Title>
          </Col>
          <Col>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => showModal()}
            >
              Thêm trường thông tin
            </Button>
          </Col>
        </Row>

        <Divider />

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <Table 
                  dataSource={sortedList}
                  rowKey="id"
                  loading={loading}
                  pagination={false}
                  components={{
                    body: {
                      row: (props: any) => {
                        const index = sortedList.findIndex(x => x.id === props['data-row-key']);
                        return (
                          <Draggable
                            key={props['data-row-key']}
                            draggableId={props['data-row-key']}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <tr
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                {...props}
                                style={{
                                  ...props.style,
                                  background: snapshot.isDragging ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                                }}
                              />
                            )}
                          </Draggable>
                        );
                      }
                    }
                  }}
                  columns={[
                    {
                      title: '',
                      dataIndex: 'sort',
                      width: 30,
                      className: 'drag-visible',
                      render: () => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />,
                    },
                    {
                      title: 'Tên trường',
                      dataIndex: 'ten',
                      key: 'ten',
                    },
                    {
                      title: 'Mã trường',
                      dataIndex: 'ma',
                      key: 'ma',
                    },
                    {
                      title: 'Kiểu dữ liệu',
                      dataIndex: 'kieuDuLieu',
                      key: 'kieuDuLieu',
                      render: (type: FieldType) => dataTypeLabels[type] || type,
                    },
                    {
                      title: 'Bắt buộc',
                      dataIndex: 'required',
                      key: 'required',
                      render: (required: boolean) => (
                        <Switch 
                          checked={required} 
                          size="small" 
                          disabled 
                        />
                      ),
                    },
                    {
                      title: 'Hiển thị',
                      dataIndex: 'active',
                      key: 'active',
                      render: (active: boolean, record: TruongThongTin) => (
                        <Switch 
                          checked={active} 
                          size="small"
                          onChange={() => handleToggleActive(record)}
                        />
                      ),
                    },
                    {
                      title: 'Thao tác',
                      key: 'action',
                      render: (_, record: TruongThongTin) => (
                        <Space size="middle">
                          <Button 
                            icon={<ArrowUpOutlined />} 
                            size="small"
                            onClick={() => handleMoveItem(record.id, 'up')}
                            disabled={record.order === Math.min(...truongThongTinList.map(item => item.order))}
                          />
                          <Button 
                            icon={<ArrowDownOutlined />} 
                            size="small"
                            onClick={() => handleMoveItem(record.id, 'down')}
                            disabled={record.order === Math.max(...truongThongTinList.map(item => item.order))}
                          />
                          <Tooltip title="Chỉnh sửa">
                            <Button 
                              type="primary" 
                              shape="circle" 
                              icon={<EditOutlined />} 
                              size="small" 
                              onClick={() => showModal(record)}
                            />
                          </Tooltip>
                          <Popconfirm
                            title="Bạn có chắc chắn muốn xóa trường thông tin này?"
                            onConfirm={() => handleDelete(record.id)}
                            okText="Có"
                            cancelText="Không"
                          >
                            <Tooltip title="Xóa">
                              <Button 
                                danger
                                shape="circle" 
                                icon={<DeleteOutlined />} 
                                size="small"
                              />
                            </Tooltip>
                          </Popconfirm>
                        </Space>
                      ),
                    },
                  ]}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Card>

      <Modal
        title={editingRecord ? 'Chỉnh sửa trường thông tin' : 'Thêm trường thông tin'}
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
            label="Tên trường"
            rules={[{ required: true, message: 'Vui lòng nhập tên trường!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="ma"
            label="Mã trường"
            tooltip="Mã trường được dùng làm key trong hệ thống. Nếu bạn để trống, hệ thống sẽ tự động sinh dựa trên tên."
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="kieuDuLieu"
            label="Kiểu dữ liệu"
            rules={[{ required: true, message: 'Vui lòng chọn kiểu dữ liệu!' }]}
          >
            <Select>
              {dataTypeOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="required"
            label="Bắt buộc"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="active"
            label="Hiển thị"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default BieuMauPage; 