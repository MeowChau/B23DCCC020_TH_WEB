import { useState, useEffect } from 'react';
import { Table } from 'antd';
import dayjs from 'dayjs';

interface Appointment {
  id: number;
  date: string;
  time: string;
  service: string;
  employee: string;
  status: string;
}

const LOCAL_STORAGE_KEY = 'appointments_data';

const Reports = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reportByDate, setReportByDate] = useState<Record<string, number>>({});
  const [reportByService, setReportByService] = useState<Record<string, Record<string, number>>>({});

  useEffect(() => {
    const storedAppointments = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedAppointments) {
      const parsedAppointments: Appointment[] = JSON.parse(storedAppointments);
      setAppointments(parsedAppointments);
      generateReports(parsedAppointments);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appointments));
    generateReports(appointments);
  }, [appointments]);

  const generateReports = (data: Appointment[]) => {
    const dateCount: Record<string, number> = {};
    const serviceRevenue: Record<string, Record<string, number>> = {};

    data.forEach(({ date, service, employee }) => {
      // Thống kê số lượng lịch hẹn theo ngày
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      dateCount[formattedDate] = (dateCount[formattedDate] || 0) + 1;
      
      // Thống kê doanh thu theo dịch vụ và nhân viên
      if (!serviceRevenue[service]) serviceRevenue[service] = {};
      serviceRevenue[service][employee] = (serviceRevenue[service][employee] || 0) + 1;
    });

    setReportByDate(dateCount);
    setReportByService(serviceRevenue);
  };

  const columnsByDate = [
    { title: 'Ngày', dataIndex: 'date', key: 'date' },
    { title: 'Số lượng lịch hẹn', dataIndex: 'count', key: 'count' },
  ];

  const columnsByService = [
    { title: 'Dịch vụ', dataIndex: 'service', key: 'service' },
    { title: 'Nhân viên', dataIndex: 'employee', key: 'employee' },
    { title: 'Số lượng lịch hẹn', dataIndex: 'count', key: 'count' },
  ];

  return (
    <div>
      <h2>Thống kê Lịch hẹn</h2>
      <Table
        dataSource={Object.entries(reportByDate).map(([date, count]) => ({ date, count }))}
        columns={columnsByDate}
        rowKey="date"
        style={{ marginBottom: 20 }}
      />
      
      <h2>Thống kê Doanh thu theo Dịch vụ & Nhân viên</h2>
      <Table
        dataSource={Object.entries(reportByService).flatMap(([service, employees]) =>
          Object.entries(employees).map(([employee, count]) => ({ service, employee, count }))
        )}
        columns={columnsByService}
        rowKey={(record) => `${record.service}-${record.employee}`}
      />
    </div>
  );
};

export default Reports;