import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirement_type: string;
  requirement_value: number;
  points: number;
  badge_color: string;
  is_active: boolean;
}

interface UserAchievement {
  id: string;
  achievement_id: string;
  progress: number;
  is_completed: boolean;
  completed_at: string | null;
  achievement: Achievement;
}

interface UserStreak {
  id: string;
  streak_type: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
}

export const useAchievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [streaks, setStreaks] = useState<UserStreak[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchAchievements();
      fetchUserAchievements();
      fetchUserStreaks();
    }
  }, [user]);

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true)
        .order('points', { ascending: true });

      if (error) throw error;
      setAchievements(data || []);
    } catch (err: any) {
      console.error('Error fetching achievements:', err);
      setError(err.message);
    }
  };

  const fetchUserAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('user_id', user?.id)
        .order('completed_at', { ascending: false, nullsFirst: false });

      if (error) throw error;
      setUserAchievements(data || []);
    } catch (err: any) {
      console.error('Error fetching user achievements:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStreaks = async () => {
    try {
      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;
      setStreaks(data || []);
    } catch (err: any) {
      console.error('Error fetching user streaks:', err);
      setError(err.message);
    }
  };

  const updateStreak = async (streakType: string) => {
    try {
      const { error } = await supabase.rpc('update_user_streak', {
        user_id: user?.id,
        streak_type: streakType
      });

      if (error) throw error;
      await fetchUserStreaks();
    } catch (err: any) {
      console.error('Error updating streak:', err);
      throw err;
    }
  };

  const checkAchievements = async () => {
    try {
      const { error } = await supabase.rpc('check_user_achievements', {
        user_id: user?.id
      });

      if (error) throw error;
      await fetchUserAchievements();
    } catch (err: any) {
      console.error('Error checking achievements:', err);
      throw err;
    }
  };

  const getCompletedAchievements = () => {
    return userAchievements.filter(ua => ua.is_completed);
  };

  const getInProgressAchievements = () => {
    return userAchievements.filter(ua => !ua.is_completed && ua.progress > 0);
  };

  const getTotalPoints = () => {
    return getCompletedAchievements().reduce((total, ua) => total + ua.achievement.points, 0);
  };

  const getWorkoutStreak = () => {
    return streaks.find(s => s.streak_type === 'workout');
  };

  return {
    achievements,
    userAchievements,
    streaks,
    loading,
    error,
    updateStreak,
    checkAchievements,
    getCompletedAchievements,
    getInProgressAchievements,
    getTotalPoints,
    getWorkoutStreak,
    refetch: () => {
      fetchAchievements();
      fetchUserAchievements();
      fetchUserStreaks();
    }
  };
};