// pages/Spa/Reviews/index.tsx
import { useState, useEffect } from "react";
import ReviewsComponent from "../../../components/Spa/Reviews";
import { Review, getStoredReviews } from "@/services/Spa/Reviews";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => { setReviews(getStoredReviews()); }, []);

  return <ReviewsComponent reviews={reviews} setReviews={setReviews} />;
};

export default ReviewsPage;
