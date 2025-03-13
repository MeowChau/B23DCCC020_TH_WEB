import dayjs from "dayjs";
import { message } from "antd";

export interface Appointment {
  id: number;
  date: string;
  time: string;
  service: string;
  employee: string;
  status: string;
}

export const statusColors: Record<string, string> = {
  "Chờ duyệt": "orange",
  "Xác nhận": "blue",
  "Hoàn thành": "green",
  "Hủy": "red",
};

const LOCAL_STORAGE_KEY = "appointments_data";

export const getAppointments = (): Appointment[] => {
  const storedAppointments = localStorage.getItem(LOCAL_STORAGE_KEY);
  return storedAppointments ? JSON.parse(storedAppointments) : [];
};

export const saveAppointments = (appointments: Appointment[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appointments));
};

export const bookAppointment = (
  values: { date: dayjs.Dayjs; time: dayjs.Dayjs; service: string; employee: string },
  appointments: Appointment[],
  setAppointments: (appointments: Appointment[]) => void,
  setIsModalOpen: (open: boolean) => void,
  form: any
) => {
  const formattedDate = values.date.format("YYYY-MM-DD");
  const formattedTime = values.time.format("HH:mm");

  const isDuplicate = appointments.some(
    (appt) => appt.date === formattedDate && appt.time === formattedTime && appt.employee === values.employee
  );

  if (isDuplicate) {
    message.error("Lịch hẹn đã tồn tại với nhân viên này. Vui lòng chọn thời gian khác!");
    return;
  }

  const newAppointment: Appointment = {
    id: appointments.length + 1,
    date: formattedDate,
    time: formattedTime,
    service: values.service,
    employee: values.employee,
    status: "Chờ duyệt",
  };

  const updatedAppointments = [...appointments, newAppointment];
  setAppointments(updatedAppointments);
  saveAppointments(updatedAppointments);
  setIsModalOpen(false);
  form.resetFields();
  message.success("Đặt lịch thành công!");
};

export const updateStatus = (id: number, newStatus: string, appointments: Appointment[], setAppointments: (appointments: Appointment[]) => void) => {
  const updatedAppointments = appointments.map((appt) => (appt.id === id ? { ...appt, status: newStatus } : appt));
  setAppointments(updatedAppointments);
  saveAppointments(updatedAppointments);
  message.info(`Cập nhật trạng thái thành ${newStatus}`);
};
