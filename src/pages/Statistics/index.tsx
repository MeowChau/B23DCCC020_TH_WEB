import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card } from 'antd';
import StatisticsSummary from '@/components/Statistics/StatisticsSummary';
import ClubApplicationsChart from '@/components/Statistics/ClubApplicationsChart';
import ExportApprovedMembers from '@/components/Statistics/ExportApprovedMembers';

const Statistics: React.FC = () => {
  const [clubs, setClubs] = useState<any[]>([]);
  const [statistics, setStatistics] = useState({
    totalClubs: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
  });

  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const storedClubs = JSON.parse(localStorage.getItem('clubs') || '[]');
    setClubs(storedClubs);

    // Tính toán số liệu thống kê
    const totalClubs = storedClubs.length;
    let pendingApplications = 0;
    let approvedApplications = 0;
    let rejectedApplications = 0;

    storedClubs.forEach((club: any) => {
      club.members?.forEach((member: any) => {
        if (member.status === 'pending') pendingApplications++;
        if (member.status === 'approved') approvedApplications++;
        if (member.status === 'rejected') rejectedApplications++;
      });
    });

    setStatistics({
      totalClubs,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
    });
  }, []);

  // Dữ liệu cho biểu đồ cột
  const chartData = clubs.flatMap((club) =>
    ['pending', 'approved', 'rejected'].map((status) => ({
      clubName: club.name,
      type: status === 'pending' ? 'Chờ duyệt' : status === 'approved' ? 'Đã duyệt' : 'Từ chối',
      value: club.members?.filter((member: any) => member.status === status).length || 0,
    }))
  );

  return (
    <PageContainer>
      <StatisticsSummary {...statistics} />
      <Card style={{ marginTop: 16 }} title="Thống kê đơn đăng ký theo câu lạc bộ">
        <ClubApplicationsChart data={chartData} />
      </Card>
      <Card style={{ marginTop: 16 }} title="Xuất danh sách thành viên đã duyệt">
        <ExportApprovedMembers clubs={clubs} />
      </Card>
    </PageContainer>
  );
};

export default Statistics;