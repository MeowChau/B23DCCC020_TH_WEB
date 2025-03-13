import dayjs from 'dayjs';

export interface Appointment {
  id: number;
  date: string;
  time: string;
  service: string;
  employee: string;
  status: string;
}

const LOCAL_STORAGE_KEY = 'appointments_data';

export const getAppointments = (): Appointment[] => {
  const storedAppointments = localStorage.getItem(LOCAL_STORAGE_KEY);
  return storedAppointments ? JSON.parse(storedAppointments) : [];
};

export const saveAppointments = (appointments: Appointment[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appointments));
};

export const generateReports = (data: Appointment[]) => {
  const reportByDate: Record<string, number> = {};
  const reportByService: Record<string, Record<string, number>> = {};

  data.forEach(({ date, service, employee }) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    reportByDate[formattedDate] = (reportByDate[formattedDate] || 0) + 1;

    if (!reportByService[service]) reportByService[service] = {};
    reportByService[service][employee] = (reportByService[service][employee] || 0) + 1;
  });

  return { reportByDate, reportByService };
};
