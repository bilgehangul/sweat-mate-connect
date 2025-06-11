
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserStats {
  id: string;
  user_id: string;
  workouts_completed: number;
  total_exercise_hours: number;
  ranking: number;
  level: number;
  xp: number;
  created_at: string;
  updated_at: string;
}

export const useUserStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    } else {
      setStats(null);
      setLoading(false);
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      
      // First try to get existing stats
      let { data: existingStats, error: fetchError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      // If no stats exist, create them
      if (!existingStats) {
        const { data: newStats, error: createError } = await supabase
          .from('user_stats')
          .insert({ user_id: user?.id })
          .select()
          .single();

        if (createError) throw createError;
        existingStats = newStats;
      }

      setStats(existingStats);
    } catch (err: any) {
      console.error('Error fetching user stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = async (updates: Partial<UserStats>) => {
    try {
      const { error } = await supabase
        .from('user_stats')
        .update(updates)
        .eq('user_id', user?.id);

      if (error) throw error;

      await fetchUserStats();
    } catch (err: any) {
      console.error('Error updating stats:', err);
      throw err;
    }
  };

  return {
    stats,
    loading,
    error,
    updateStats,
    refetch: fetchUserStats
  };
};
