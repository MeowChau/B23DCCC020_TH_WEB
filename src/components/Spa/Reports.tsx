import { Table } from 'antd';

interface ReportsTableProps {
  reportByDate: Record<string, number>;
  reportByService: Record<string, Record<string, number>>;
}

const ReportsTable: React.FC<ReportsTableProps> = ({ reportByDate, reportByService }) => {
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

export default ReportsTable;
