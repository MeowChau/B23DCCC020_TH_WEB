// src/pages/Travel/services/typing.d.ts

import { Destination, ItineraryItem, Budget } from '../models';

// Response cho API trả về danh sách điểm đến
export interface DestinationListResponse {
  data: Destination[];
  total: number;
}

// Response cho API trả về lịch trình
export interface ItineraryListResponse {
  data: ItineraryItem[];
  total: number;
}

// Params cho filter/sort điểm đến
export interface GetDestinationsParams {
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sort?: string;
}