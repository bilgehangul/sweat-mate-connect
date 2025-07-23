import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface WorkoutLog {
  id: string;
  user_id: string;
  session_id: string | null;
  workout_type: string;
  duration_minutes: number | null;
  calories_burned: number | null;
  notes: string | null;
  difficulty_rating: number | null;
  satisfaction_rating: number | null;
  workout_date: string;
  created_at: string;
  session?: {
    title: string;
    gym_location: string;
  };
}

export const useWorkoutLogs = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchWorkoutLogs();
    }
  }, [user]);

  const fetchWorkoutLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('workout_logs')
        .select(`
          *,
          session:workout_sessions(title, gym_location)
        `)
        .eq('user_id', user?.id)
        .order('workout_date', { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (err: any) {
      console.error('Error fetching workout logs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createWorkoutLog = async (logData: {
    session_id?: string;
    workout_type: string;
    duration_minutes?: number;
    calories_burned?: number;
    notes?: string;
    difficulty_rating?: number;
    satisfaction_rating?: number;
    workout_date: string;
  }) => {
    try {
      const { error } = await supabase
        .from('workout_logs')
        .insert({
          ...logData,
          user_id: user?.id
        });

      if (error) throw error;
      await fetchWorkoutLogs();
    } catch (err: any) {
      console.error('Error creating workout log:', err);
      throw err;
    }
  };

  const updateWorkoutLog = async (logId: string, updates: Partial<WorkoutLog>) => {
    try {
      const { error } = await supabase
        .from('workout_logs')
        .update(updates)
        .eq('id', logId)
        .eq('user_id', user?.id);

      if (error) throw error;
      await fetchWorkoutLogs();
    } catch (err: any) {
      console.error('Error updating workout log:', err);
      throw err;
    }
  };

  const deleteWorkoutLog = async (logId: string) => {
    try {
      const { error } = await supabase
        .from('workout_logs')
        .delete()
        .eq('id', logId)
        .eq('user_id', user?.id);

      if (error) throw error;
      await fetchWorkoutLogs();
    } catch (err: any) {
      console.error('Error deleting workout log:', err);
      throw err;
    }
  };

  const getWorkoutStats = () => {
    const totalWorkouts = logs.length;
    const totalDuration = logs.reduce((sum, log) => sum + (log.duration_minutes || 0), 0);
    const totalCalories = logs.reduce((sum, log) => sum + (log.calories_burned || 0), 0);
    const averageDifficulty = logs.length > 0 
      ? logs.reduce((sum, log) => sum + (log.difficulty_rating || 0), 0) / logs.length 
      : 0;
    const averageSatisfaction = logs.length > 0 
      ? logs.reduce((sum, log) => sum + (log.satisfaction_rating || 0), 0) / logs.length 
      : 0;

    return {
      totalWorkouts,
      totalDuration,
      totalCalories,
      averageDifficulty: Math.round(averageDifficulty * 10) / 10,
      averageSatisfaction: Math.round(averageSatisfaction * 10) / 10
    };
  };

  const getRecentLogs = (days: number = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return logs.filter(log => new Date(log.workout_date) >= cutoffDate);
  };

  return {
    logs,
    loading,
    error,
    createWorkoutLog,
    updateWorkoutLog,
    deleteWorkoutLog,
    getWorkoutStats,
    getRecentLogs,
    refetch: fetchWorkoutLogs
  };
};