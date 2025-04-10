import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, Statistic } from 'antd';
import { Column } from '@ant-design/plots';
import { useRequest } from 'ahooks';
import { getClubStatistics } from '@/services/club';

interface ClubApplication {
  clubName: string;
  pending: number;
  approved: number;
  rejected: number;
}

const Statistics: React.FC = () => {
  const { data: statistics } = useRequest(getClubStatistics);

  // Kiểm tra dữ liệu trước khi gọi map
  const chartData = Array.isArray(statistics?.data?.applicationsByClub)
    ? statistics.data.applicationsByClub.map((club: ClubApplication) => ({
        clubName: club.clubName,
        pending: club.pending,
        approved: club.approved,
        rejected: club.rejected,
      }))
    : [];

  const config = {
    data: chartData.flatMap((item: { clubName: string; pending: number; approved: number; rejected: number }) => [
      { clubName: item.clubName, type: 'Chờ duyệt', value: item.pending },
      { clubName: item.clubName, type: 'Đã duyệt', value: item.approved },
      { clubName: item.clubName, type: 'Từ chối', value: item.rejected },
    ]),
    xField: 'clubName',
    yField: 'value',
    seriesField: 'type',
    isStack: true,
    xAxis: {
      label: {
        autoRotate: false,
      },
    },
    legend: {
      position: 'top',
    },
    tooltip: {
      shared: true,
      showMarkers: false,
    },
  };

  return (
    <PageContainer>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số câu lạc bộ"
              value={statistics?.data?.totalClubs || 0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đơn đăng ký chờ duyệt"
              value={statistics?.data?.pendingApplications || 0}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đơn đã duyệt"
              value={statistics?.data?.approvedApplications || 0}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đơn bị từ chối"
              value={statistics?.data?.rejectedApplications || 0}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 16 }} title="Thống kê đơn đăng ký theo câu lạc bộ">
        <Column {...config} />
      </Card>
    </PageContainer>
  );
};

export default Statistics;