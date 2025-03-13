import { useState, useEffect } from 'react';
import ReportsTable from '@/components/Spa/Reports';
import { getAppointments, saveAppointments, generateReports, Appointment } from '@/services/Spa/Reports';

const Reports = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reportByDate, setReportByDate] = useState<Record<string, number>>({});
  const [reportByService, setReportByService] = useState<Record<string, Record<string, number>>>({});

  useEffect(() => {
    const data = getAppointments();
    setAppointments(data);
    const { reportByDate, reportByService } = generateReports(data);
    setReportByDate(reportByDate);
    setReportByService(reportByService);
  }, []);

  useEffect(() => {
    saveAppointments(appointments);
    const { reportByDate, reportByService } = generateReports(appointments);
    setReportByDate(reportByDate);
    setReportByService(reportByService);
  }, [appointments]);

  return <ReportsTable reportByDate={reportByDate} reportByService={reportByService} />;
};

export default Reports;
