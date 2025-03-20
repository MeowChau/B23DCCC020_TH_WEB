import { Table, Button, Modal, Form, DatePicker, TimePicker, Select, Tag } from "antd";
import { Appointment, statusColors } from "@/services/Spa/appointments";
import dayjs from "dayjs";

interface AppointmentsProps {
  appointments: Appointment[];
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  bookAppointment: (values: { date: dayjs.Dayjs; time: dayjs.Dayjs; service: string; employee: string }) => void;
  updateStatus: (id: number, newStatus: string) => void;
}

const services = [
  { value: "Massage", label: "Massage" },
  { value: "Facial", label: "Chăm sóc da mặt" },
  { value: "Haircut", label: "Cắt tóc" },
  { value: "Nail", label: "Làm móng" },
  { value: "Sauna", label: "Xông hơi" },
];

const employees = [
  { value: "Anna", label: "Anna" },
  { value: "Minh", label: "Minh" },
  { value: "Lan", label: "Lan" },
  { value: "Huy", label: "Huy" },
  { value: "Quang", label: "Quang" },
];

const Appointments = ({ appointments, isModalOpen, setIsModalOpen, bookAppointment, updateStatus }: AppointmentsProps) => {
  const [form] = Form.useForm();

  return (
    <div>
      <h2>Quản lý Lịch hẹn Spa</h2>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>Đặt lịch</Button>

      <Table
        dataSource={appointments}
        columns={[
          { title: "Ngày", dataIndex: "date", key: "date" },
          { title: "Giờ", dataIndex: "time", key: "time" },
          { title: "Dịch vụ", dataIndex: "service", key: "service" },
          { title: "Nhân viên", dataIndex: "employee", key: "employee" },
          {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status, record) => (
              <Select value={status} style={{ width: 120 }} onChange={(newStatus) => updateStatus(record.id, newStatus)}>
                {Object.keys(statusColors).map((statusKey) => (
                  <Select.Option key={statusKey} value={statusKey}>
                    <Tag color={statusColors[statusKey]}>{statusKey}</Tag>
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
          <Form.Item name="date" label="Ngày" rules={[{ required: true, message: "Vui lòng chọn ngày" }]}>
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="time" label="Giờ" rules={[{ required: true, message: "Vui lòng chọn giờ" }]}>
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item name="service" label="Dịch vụ" rules={[{ required: true, message: "Vui lòng chọn dịch vụ" }]}>
            <Select options={services} />
          </Form.Item>
          <Form.Item name="employee" label="Nhân viên" rules={[{ required: true, message: "Vui lòng chọn nhân viên" }]}>
            <Select options={employees} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Appointments;
