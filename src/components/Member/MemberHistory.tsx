import React from 'react';
import { Timeline, Tag, Space } from 'antd';
import type { MemberHistory } from '@/models/club';

interface MemberHistoryProps {
  history: MemberHistory[];
}

const MemberHistoryComponent: React.FC<MemberHistoryProps> = ({ history }) => {
  const getActionColor = (action: string) => {
    switch (action) {
      case 'approve':
        return 'green';
      case 'reject':
        return 'red';
      case 'transfer':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'approve':
        return 'Duyệt';
      case 'reject':
        return 'Từ chối';
      case 'transfer':
        return 'Chuyển CLB';
      default:
        return action;
    }
  };

  return (
    <Timeline>
      {history.map((item) => (
        <Timeline.Item
          key={item.id}
          color={getActionColor(item.action)}
        >
          <Space direction="vertical" size="small">
            <div>
              <Tag color={getActionColor(item.action)}>
                {getActionText(item.action)}
              </Tag>
              <span>
                {new Date(item.performedAt).toLocaleString()}
              </span>
            </div>
            {item.action === 'transfer' && (
              <div>
                Chuyển từ: {item.previousClubName} → {item.newClubName}
              </div>
            )}
            {item.reason && (
              <div>
                Lý do: {item.reason}
              </div>
            )}
            <div>
              Thực hiện bởi: {item.performedBy}
            </div>
          </Space>
        </Timeline.Item>
      ))}
    </Timeline>
  );
};

export default MemberHistoryComponent;