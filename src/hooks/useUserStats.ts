
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserStats {
  workouts_completed: number;
  total_exercise_hours: number;
  ranking: number;
  level: number;
  xp: number;
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
      
      // Get workout sessions created by user
      const { data: sessions, error: sessionsError } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('creator_id', user?.id);

      if (sessionsError) throw sessionsError;

      // Get matches for the user
      const { data: matches, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .or(`user1_id.eq.${user?.id},user2_id.eq.${user?.id}`);

      if (matchesError) throw matchesError;

      // Calculate stats
      const workouts_completed = sessions?.length || 0;
      const total_exercise_hours = workouts_completed * 60; // Assume 1 hour per session
      const xp = workouts_completed * 50 + (matches?.length || 0) * 25;
      const level = Math.floor(xp / 100) + 1;
      const ranking = Math.min(5, Math.floor(workouts_completed / 2) + 1);

      setStats({
        workouts_completed,
        total_exercise_hours,
        ranking,
        level,
        xp
      });
    } catch (err: any) {
      console.error('Error fetching user stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = async () => {
    // Since we're calculating from existing data, just refetch
    await fetchUserStats();
  };

  return {
    stats,
    loading,
    error,
    updateStats,
    refetch: fetchUserStats
  };
};
