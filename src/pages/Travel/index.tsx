import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Input, Select, Rate, Space, Typography, Button, InputNumber } from 'antd';
import { SearchOutlined, EnvironmentOutlined } from '@ant-design/icons';
import styles from './index.less';
import { getDestinations } from '../../services';
import { Destination } from '../../models';

const destinations = getDestinations().data;
const { Title } = Typography;
const { Option } = Select;

interface Destination {
  id: number;
  name: string;
  image: string;
  location: string;
  rating: number;
  type: string;
  price: number;
}

const TravelHome: React.FC = () => {
  const allDestinations = getDestinations().data;
  const [type, setType] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [minRating, setMinRating] = useState<number>(0);
  const [sort, setSort] = useState<string>('popular');

  // Filter & Sort logic
  const filteredDestinations = useMemo(() => {
    let result = [...allDestinations];
    if (type !== 'all') result = result.filter(d => d.type === type);
    if (minPrice !== undefined) result = result.filter(d => d.price >= minPrice);
    if (maxPrice !== undefined) result = result.filter(d => d.price <= maxPrice);
    if (minRating > 0) result = result.filter(d => d.rating >= minRating);

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      // 'popular' có thể sort theo rating hoặc giữ nguyên nếu chưa có trường 'popularity'
      default:
        result.sort((a, b) => b.rating - a.rating);
    }
    return result;
  }, [allDestinations, type, minPrice, maxPrice, minRating, sort]);

  return (
    <div className={styles.container}>
      <Title level={2}>Khám Phá Điểm Đến</Title>
      
      {/* Filters Section */}
      <div className={styles.filters}>
        <Space wrap>
          <Select value={type} style={{ width: 140 }} onChange={setType}>
            <Option value="all">Tất cả loại hình</Option>
            <Option value="beach">Biển</Option>
            <Option value="mountain">Núi</Option>
            <Option value="city">Thành phố</Option>
          </Select>
          <InputNumber
            placeholder="Giá từ"
            min={0}
            value={minPrice}
            onChange={setMinPrice}
            style={{ width: 100 }}
          />
          <InputNumber
            placeholder="Đến"
            min={0}
            value={maxPrice}
            onChange={setMaxPrice}
            style={{ width: 100 }}
          />
          <Select value={minRating} style={{ width: 120 }} onChange={setMinRating}>
            <Option value={0}>Mọi đánh giá</Option>
            <Option value={3}>Từ 3 sao</Option>
            <Option value={4}>Từ 4 sao</Option>
            <Option value={4.5}>Từ 4.5 sao</Option>
          </Select>
          <Select value={sort} style={{ width: 150 }} onChange={setSort}>
            <Option value="popular">Phổ biến nhất</Option>
            <Option value="rating">Đánh giá cao</Option>
            <Option value="price-asc">Giá tăng dần</Option>
            <Option value="price-desc">Giá giảm dần</Option>
          </Select>
        </Space>
      </div>

      {/* Destinations Grid */}
      <Row gutter={[16, 16]} className={styles.destinationsGrid}>
        {filteredDestinations.map(destination => (
          <Col xs={24} sm={12} md={8} lg={6} key={destination.id}>
            <Card
              hoverable
              cover={<img alt={destination.name} src={destination.image} />}
              className={styles.destinationCard}
            >
              <Card.Meta
                title={destination.name}
                description={
                  <>
                    <Space>
                      <EnvironmentOutlined />
                      {destination.location}
                    </Space>
                    <div>
                      <Rate disabled allowHalf defaultValue={destination.rating} />
                      <span style={{ marginLeft: 8 }}>{destination.rating}</span>
                    </div>
                    <div style={{ marginTop: 8, color: '#1890ff', fontWeight: 500 }}>
                      {destination.price.toLocaleString()} VND
                    </div>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TravelHome; 