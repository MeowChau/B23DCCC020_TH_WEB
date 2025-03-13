import { useState, useEffect } from 'react';
import { Table, Button, Form, DatePicker, TimePicker, Select, Modal, Tag, message } from 'antd';
import dayjs from 'dayjs';

interface Appointment {
  id: number;
  date: string;
  time: string;
  service: string;
  employee: string;
  status: string;
}

const services = [
  { value: 'Massage', label: 'Massage' },
  { value: 'Facial', label: 'Chăm sóc da mặt' },
  { value: 'Haircut', label: 'Cắt tóc' },
  { value: 'Nail', label: 'Làm móng' },
  { value: 'Sauna', label: 'Xông hơi' },
];

const employees = [
  { value: 'Anna', label: 'Anna' },
  { value: 'Minh', label: 'Minh' },
  { value: 'Lan', label: 'Lan' },
  { value: 'Huy', label: 'Huy' },
  { value: 'Quang', label: 'Quang' },
];

const statusColors: Record<string, string> = {
  'Chờ duyệt': 'orange',
  'Xác nhận': 'blue',
  'Hoàn thành': 'green',
  'Hủy': 'red',
};

const LOCAL_STORAGE_KEY = 'appointments_data';

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Load dữ liệu từ localStorage khi khởi động
  useEffect(() => {
    const storedAppointments = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedAppointments) {
      setAppointments(JSON.parse(storedAppointments));
    }
  }, []);

  // Lưu dữ liệu vào localStorage khi appointments thay đổi
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appointments));
  }, [appointments]);

  const bookAppointment = (values: { date: dayjs.Dayjs; time: dayjs.Dayjs; service: string; employee: string }) => {
    const formattedDate = values.date.format('YYYY-MM-DD');
    const formattedTime = values.time.format('HH:mm');

    const isDuplicate = appointments.some(
      (appt) => appt.date === formattedDate && appt.time === formattedTime && appt.employee === values.employee
    );

    if (isDuplicate) {
      message.error('Lịch hẹn đã tồn tại với nhân viên này. Vui lòng chọn thời gian khác!');
      return;
    }

    const newAppointment = {
      id: appointments.length + 1,
      date: formattedDate,
      time: formattedTime,
      service: values.service,
      employee: values.employee,
      status: 'Chờ duyệt',
    };

    setAppointments([...appointments, newAppointment]);
    setIsModalOpen(false);
    form.resetFields();
    message.success('Đặt lịch thành công!');
  };

  const updateStatus = (id: number, newStatus: string) => {
    setAppointments((prev) =>
      prev.map((appt) => (appt.id === id ? { ...appt, status: newStatus } : appt))
    );
    message.info(`Cập nhật trạng thái thành ${newStatus}`);
  };

  return (
    <div>
      <h2>Quản lý Lịch hẹn Spa</h2>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>Đặt lịch</Button>

      <Table
        dataSource={appointments}
        columns={[
          { title: 'Ngày', dataIndex: 'date', key: 'date' },
          { title: 'Giờ', dataIndex: 'time', key: 'time' },
          { title: 'Dịch vụ', dataIndex: 'service', key: 'service' },
          { title: 'Nhân viên', dataIndex: 'employee', key: 'employee' },
          {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
              <Select
                value={status}
                style={{ width: 120 }}
                onChange={(newStatus) => updateStatus(record.id, newStatus)}
              >
                {Object.keys(statusColors).map((status) => (
                  <Select.Option key={status} value={status}>
                    <Tag color={statusColors[status]}>{status}</Tag>
                  </Select.Option>
                ))}
              </Select>
            ),
          },
        ]}
        rowKey="id"
        style={{ marginTop: 20 }}
      />

      <Modal
        title="Đặt Lịch Hẹn"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Form form={form} onFinish={bookAppointment} layout="vertical" initialValues={{ date: dayjs(), time: dayjs() }}>
          <Form.Item name="date" label="Ngày" rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}>
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="time" label="Giờ" rules={[{ required: true, message: 'Vui lòng chọn giờ' }]}>
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item name="service" label="Dịch vụ" rules={[{ required: true, message: 'Vui lòng chọn dịch vụ' }]}>
            <Select options={services} />
          </Form.Item>
          <Form.Item name="employee" label="Nhân viên" rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}>
            <Select options={employees} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Appointments;
