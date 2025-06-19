import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();
  const [reviews, setReviews] = useState<WorkoutReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchReviews();
    }
  }, [user]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('workout_reviews')
        .select('*')
        .eq('reviewee_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err: any) {
      console.error('Error fetching workout reviews:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((totalRating / reviews.length) * 10) / 10; // Round to 1 decimal place
  };

  const getAverageRatings = () => {
    if (reviews.length === 0) {
      return {
        overall: 0,
        punctuality: 0,
        motivation: 0,
        knowledge: 0
      };
    }

    const overallSum = reviews.reduce((sum, review) => sum + review.rating, 0);
    const punctualitySum = reviews.reduce((sum, review) => sum + (review.punctuality_rating || 0), 0);
    const motivationSum = reviews.reduce((sum, review) => sum + (review.motivation_rating || 0), 0);
    const knowledgeSum = reviews.reduce((sum, review) => sum + (review.knowledge_rating || 0), 0);

    const punctualityCount = reviews.filter(r => r.punctuality_rating !== null).length;
    const motivationCount = reviews.filter(r => r.motivation_rating !== null).length;
    const knowledgeCount = reviews.filter(r => r.knowledge_rating !== null).length;

    return {
      overall: Math.round((overallSum / reviews.length) * 10) / 10,
      punctuality: punctualityCount > 0 ? Math.round((punctualitySum / punctualityCount) * 10) / 10 : 0,
      motivation: motivationCount > 0 ? Math.round((motivationSum / motivationCount) * 10) / 10 : 0,
      knowledge: knowledgeCount > 0 ? Math.round((knowledgeSum / knowledgeCount) * 10) / 10 : 0
    };
  };

  return {
    reviews,
    loading,
    error,
    getAverageRating,
    getAverageRatings,
    refetch: fetchReviews
  };
};