import { useState, useEffect } from "react";
import Appointments from '@/components/Spa/Appointments';
import { getAppointments, bookAppointment, updateStatus } from "@/services/Spa/appointments";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState(getAppointments());
  const form = {}; // Define the form variable
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setAppointments(getAppointments());
  }, []);

  return (
    <Appointments
      appointments={appointments}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      bookAppointment={(values) => bookAppointment(values, appointments, setAppointments, setIsModalOpen, form)}
      updateStatus={(id, newStatus) => updateStatus(id, newStatus, appointments, setAppointments)}
    />
  );
};

export default AppointmentsPage;
