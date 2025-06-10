
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface WorkoutSession {
  id: string;
  creator_id: string;
  title: string;
  description: string | null;
  workout_type: string;
  gym_location: string;
  scheduled_date: string;
  start_time: string;
  end_time: string;
  max_participants: number;
  current_participants: number;
  status: string;
  created_at: string;
  updated_at: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    username: string | null;
  };
}

export const useWorkoutSessions = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('workout_sessions')
        .select(`
          *,
          profiles (first_name, last_name, username)
        `)
        .order('scheduled_date', { ascending: true });

      if (error) {
        console.error('Error fetching sessions:', error);
        setError(error.message);
      } else {
        setSessions(data || []);
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (sessionData: {
    title: string;
    description?: string;
    workout_type: string;
    gym_location: string;
    scheduled_date: string;
    start_time: string;
    end_time: string;
    max_participants: number;
  }) => {
    try {
      const { error } = await supabase
        .from('workout_sessions')
        .insert({
          ...sessionData,
          creator_id: user?.id,
        });

      if (error) {
        console.error('Error creating session:', error);
        throw error;
      }

      await fetchSessions();
    } catch (err) {
      console.error('Error creating session:', err);
      throw err;
    }
  };

  return {
    sessions,
    loading,
    error,
    createSession,
    refetch: fetchSessions
  };
};
