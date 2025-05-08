export interface Destination {
    id: number;
    name: string;
    image: string;
    location: string;
    rating: number;
    type: string;
    price: number;
  }
  
  export interface ItineraryItem {
    id: number;
    destination: string;
    date: string;
    time: string;
    duration: number;
    cost: number;
  }
  
  export interface Budget {
    food: number;
    accommodation: number;
    transportation: number;
    activities: number;
    total: number;
  }