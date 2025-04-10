import React from 'react';
import { Row, Col, Card } from 'antd';

interface StatisticsSummaryProps {
  totalClubs: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
}

const StatisticsSummary: React.FC<StatisticsSummaryProps> = ({
  totalClubs,
  pendingApplications,
  approvedApplications,
  rejectedApplications,
}) => {
  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card>
          <h3>Tổng số câu lạc bộ</h3>
          <p>{totalClubs}</p>
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <h3>Đơn đăng ký chờ duyệt</h3>
          <p style={{ color: '#faad14' }}>{pendingApplications}</p>
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <h3>Đơn đã duyệt</h3>
          <p style={{ color: '#52c41a' }}>{approvedApplications}</p>
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <h3>Đơn bị từ chối</h3>
          <p style={{ color: '#ff4d4f' }}>{rejectedApplications}</p>
        </Card>
      </Col>
    </Row>
  );
};

export default StatisticsSummary;