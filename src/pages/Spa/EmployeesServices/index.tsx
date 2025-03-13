import { useState } from "react";
import EmployeeServices from "@/components/Spa/EmployeesServices";
import { initialEmployees } from "@/services/Spa/EmployeesServices";

const Employees = () => {
  const [employees, setEmployees] = useState(initialEmployees);

  return (
    <div>
      <h2>Quản lý Nhân viên & Dịch vụ Spa</h2>
      <EmployeeServices employees={employees} setEmployees={setEmployees} />
    </div>
  );
};

export default Employees;
