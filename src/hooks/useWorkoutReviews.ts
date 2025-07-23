import { useState } from 'react';

interface WorkoutReview {
  id: string;
  reviewer_id: string;
  reviewee_id: string;
  session_id: string;
  rating: number;
  comment: string | null;
  punctuality_rating: number | null;
  motivation_rating: number | null;
  knowledge_rating: number | null;
  created_at: string;
}

export const useWorkoutReviews = () => {
  const [reviews] = useState<WorkoutReview[]>([]);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const getAverageRating = () => {
    return 0; // Placeholder since feature is not implemented
  };

  const getAverageRatings = () => {
    return {
      overall: 0,
      punctuality: 0,
      motivation: 0,
      knowledge: 0
    };
  };

  const refetch = async () => {
    // No-op
  };

  return {
    reviews,
    loading,
    error,
    getAverageRating,
    getAverageRatings,
    refetch
  };
};
