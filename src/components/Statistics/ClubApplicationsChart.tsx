import React from 'react';
import { Column } from '@ant-design/plots';

interface ClubApplicationsChartProps {
  data: {
    clubName: string;
    type: string;
    value: number;
  }[];
}

const ClubApplicationsChart: React.FC<ClubApplicationsChartProps> = ({ data }) => {
  const config = {
    data,
    xField: 'clubName',
    yField: 'value',
    seriesField: 'type',
    isGroup: true,
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

  return <Column {...config} />;
};

export default ClubApplicationsChart;