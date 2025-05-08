// src/pages/Travel/services/index.ts

import { Destination, ItineraryItem } from '../models';
import { GetDestinationsParams, DestinationListResponse, ItineraryListResponse } from './typing';

// Mock data cho điểm đến
const mockDestinations: Destination[] = [
  {
    id: 1,
    name: 'Hạ Long Bay',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    location: 'Quảng Ninh, Việt Nam',
    rating: 4.5,
    type: 'beach',
    price: 2000000,
  },
  {
    id: 2,
    name: 'Đà Lạt',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80',
    location: 'Lâm Đồng, Việt Nam',
    rating: 4.7,
    type: 'mountain',
    price: 1500000,
  },
  {
    id: 3,
    name: 'Phú Quốc',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    location: 'Kiên Giang, Việt Nam',
    rating: 4.6,
    type: 'beach',
    price: 2500000,
  },
  {
    id: 4,
    name: 'Hội An',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
    location: 'Quảng Nam, Việt Nam',
    rating: 4.8,
    type: 'city',
    price: 1800000,
  },
];

// Mock data cho lịch trình
const mockItinerary: ItineraryItem[] = [
  {
    id: 1,
    destination: 'Hạ Long Bay',
    date: '2024-06-10',
    time: '08:00',
    duration: 4,
    cost: 500000,
  },
];

// Lấy danh sách điểm đến (có thể filter/sort nếu muốn)
export function getDestinations(params?: GetDestinationsParams): DestinationListResponse {
  // Có thể filter/sort ở đây nếu cần
  return {
    data: mockDestinations,
    total: mockDestinations.length,
  };
}

// Lấy danh sách lịch trình
export function getItinerary(): ItineraryListResponse {
  return {
    data: mockItinerary,
    total: mockItinerary.length,
  };
}