// services/Reviews.ts
export interface Review {
    id: number;
    customer: string;
    service: string;
    employee: string;
    rating: number;
    comment?: string;
    response?: string;
  }
  
  export const getStoredReviews = (): Review[] => {
    const storedReviews = localStorage.getItem("reviews");
    return storedReviews ? JSON.parse(storedReviews) : [];
  };
  
  export const saveReviews = (reviews: Review[]) => {
    localStorage.setItem("reviews", JSON.stringify(reviews));
  };
  
  export const calculateAverageRating = (reviews: Review[], employee: string): string => {
    const employeeReviews = reviews.filter((review) => review.employee === employee);
    if (employeeReviews.length === 0) return "Chưa có đánh giá";
    const average = employeeReviews.reduce((sum, review) => sum + review.rating, 0) / employeeReviews.length;
    return average.toFixed(1);
  };
  