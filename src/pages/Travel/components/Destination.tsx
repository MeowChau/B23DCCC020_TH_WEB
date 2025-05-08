import React, { useState, useEffect } from 'react';
import { useParams } from 'umi';
import { Card, Row, Col, Typography, Rate, Divider, Tag, Button, Space, Image, Statistic } from 'antd';
import { EnvironmentOutlined, ClockCircleOutlined, DollarOutlined } from '@ant-design/icons';
import styles from './Destination.less';

const { Title, Paragraph } = Typography;

interface DestinationDetail {
  id: number;
  name: string;
  description: string;
  images: string[];
  location: string;
  type: string;
  visitDuration: number;
  foodCost: number;
  accommodationCost: number;
  transportationCost: number;
  rating: number;
  reviews: number;
  bestTimeToVisit: string;
  activities: string[];
}

const Destination: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [destination, setDestination] = useState<DestinationDetail | null>(null);

  // Mock data - Replace with actual API call
  useEffect(() => {
    const mockDestination: DestinationDetail = {
      id: 1,
      name: 'Hạ Long Bay',
      description: 'Vịnh Hạ Long là một kỳ quan thiên nhiên nổi tiếng của Việt Nam, được UNESCO công nhận là Di sản thiên nhiên thế giới. Với hàng nghìn hòn đảo đá vôi và hang động tuyệt đẹp, đây là điểm đến lý tưởng cho du khách yêu thích khám phá thiên nhiên và văn hóa.',
      images: [
        'https://example.com/halong1.jpg',
        'https://example.com/halong2.jpg',
        'https://example.com/halong3.jpg',
      ],
      location: 'Quảng Ninh, Việt Nam',
      type: 'beach',
      visitDuration: 24,
      foodCost: 500000,
      accommodationCost: 1000000,
      transportationCost: 300000,
      rating: 4.5,
      reviews: 1234,
      bestTimeToVisit: 'Tháng 3 - Tháng 5',
      activities: ['Khám phá hang động', 'Chèo thuyền kayak', 'Leo núi', 'Tắm biển'],
    };
    setDestination(mockDestination);
  }, [id]);

  if (!destination) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.imageGallery}>
        <Image.PreviewGroup>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Image
                src={destination.images[0]}
                alt={destination.name}
                className={styles.mainImage}
              />
            </Col>
            {destination.images.slice(1).map((image, index) => (
              <Col span={8} key={index}>
                <Image src={image} alt={`${destination.name} ${index + 2}`} />
              </Col>
            ))}
          </Row>
        </Image.PreviewGroup>
      </div>

      <div className={styles.content}>
        <Title level={2}>{destination.name}</Title>
        
        <Space className={styles.metaInfo}>
          <Space>
            <EnvironmentOutlined />
            <span>{destination.location}</span>
          </Space>
          <Space>
            <ClockCircleOutlined />
            <span>{destination.visitDuration} giờ</span>
          </Space>
          <Space>
            <Rate disabled defaultValue={destination.rating} />
            <span>({destination.reviews} đánh giá)</span>
          </Space>
        </Space>

        <Paragraph className={styles.description}>
          {destination.description}
        </Paragraph>

        <Divider />

        <Row gutter={[24, 24]} className={styles.stats}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Chi phí ăn uống"
                value={destination.foodCost}
                prefix="₫"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Chi phí lưu trú"
                value={destination.accommodationCost}
                prefix="₫"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Chi phí di chuyển"
                value={destination.transportationCost}
                prefix="₫"
              />
            </Card>
          </Col>
        </Row>

        <Divider />

        <div className={styles.section}>
          <Title level={4}>Thời điểm tốt nhất để đến</Title>
          <Paragraph>{destination.bestTimeToVisit}</Paragraph>
        </div>

        <div className={styles.section}>
          <Title level={4}>Các hoạt động phổ biến</Title>
          <Space wrap>
            {destination.activities.map((activity, index) => (
              <Tag key={index} color="blue">{activity}</Tag>
            ))}
          </Space>
        </div>

        <div className={styles.actions}>
          <Button type="primary" size="large">
            Thêm vào lịch trình
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Destination; 