import { useState } from 'react';  
import { Table, Button, Form, Input, Modal, Select } from 'antd';

const { Option } = Select;

const employeeOptions = [
  { value: 'Anna', label: 'Anna' },
  { value: 'Minh', label: 'Minh' },
  { value: 'Lan', label: 'Lan' },
  { value: 'Huy', label: 'Huy' },
  { value: 'Quang', label: 'Quang' },
];

const serviceOptions = [
  { value: 'Massage', label: 'Massage' },
  { value: 'Facial', label: 'Chăm sóc da mặt' },
  { value: 'Haircut', label: 'Cắt tóc' },
  { value: 'Nail', label: 'Làm móng' },
  { value: 'Sauna', label: 'Xông hơi' },
];

const Employees = () => {
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Anna', maxCustomersPerDay: 5, workingHours: '9h-17h', workingDays: ['Thứ 6'], services: ['Massage', 'Facial'] },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const addEmployee = (values: { name: string; maxCustomersPerDay: number; workingHours: string; workingDays: string[]; services: string[] }) => {
    setEmployees([...employees, { 
      id: employees.length + 1, 
      ...values, 
      services: values.services,
      workingDays: values.workingDays,
    }]);
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <div>
      <h2>Quản lý Nhân viên & Dịch vụ Spa</h2>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>Thêm Nhân viên</Button>
      <Table 
        dataSource={employees} 
        columns={[
          { title: 'Tên', dataIndex: 'name', key: 'name' },
          { title: 'Khách tối đa/ngày', dataIndex: 'maxCustomersPerDay', key: 'maxCustomersPerDay' },
          { title: 'Ca làm việc', dataIndex: 'workingHours', key: 'workingHours' },
          { title: 'Ngày làm việc', dataIndex: 'workingDays', key: 'workingDays', render: (days) => days.join(', ') },
          { title: 'Dịch vụ', dataIndex: 'services', key: 'services', render: (services) => services.join(', ') },
        ]} 
        rowKey="id" 
      />

      <Modal title="Thêm Nhân viên" visible={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => form.submit()}>
        <Form form={form} onFinish={addEmployee} layout="vertical">
          <Form.Item name="name" label="Tên" rules={[{ required: true, message: 'Please select a name' }]}>  
            <Select placeholder="Chọn nhân viên">
              {employeeOptions.map(emp => (
                <Option key={emp.value} value={emp.value}>{emp.label}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="maxCustomersPerDay" label="Khách tối đa/ngày" rules={[{ required: true, message: 'Please enter Khách tối đa/ngày' }]}>  
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item name="workingHours" label="Ca làm việc" rules={[{ required: true, message: 'Please enter Ca làm việc' }]}>  
            <Input placeholder="Ví dụ: 9h-17h" />
          </Form.Item>
          <Form.Item name="workingDays" label="Ngày làm việc" rules={[{ required: true, message: 'Please enter Ngày làm việc' }]}>  
            <Select mode="multiple" placeholder="Chọn ngày làm việc">
              {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'].map(day => (
                <Option key={day} value={day}>{day}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="services" label="Dịch vụ" rules={[{ required: true, message: 'Please select at least one service' }]}>  
            <Select mode="multiple" placeholder="Chọn dịch vụ">
              {serviceOptions.map(service => (
                <Option key={service.value} value={service.value}>{service.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Employees;
