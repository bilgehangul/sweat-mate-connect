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
    avatar_url: string | null;
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
          profiles (first_name, last_name, username, avatar_url)
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
    matching_groups?: string;
  }) => {
    try {
      // Extract matching_groups from sessionData
      const { matching_groups, ...sessionDataWithoutGroups } = sessionData;
      
      // Create the session with status 'open'
      const { data, error } = await supabase
        .from('workout_sessions')
        .insert({
          ...sessionDataWithoutGroups,
          creator_id: user?.id,
          status: 'open'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating session:', error);
        throw error;
      }

      // Add creator as a participant
      await supabase
        .from('session_participants')
        .insert({
          session_id: data.id,
          user_id: user?.id,
          status: 'accepted'
        });

      await fetchSessions();
      return data;
    } catch (err) {
      console.error('Error creating session:', err);
      throw err;
    }
  };

  const updateSessionStatus = async (sessionId: string, status: 'open' | 'full' | 'completed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('workout_sessions')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) {
        console.error('Error updating session status:', error);
        throw error;
      }

      await fetchSessions();
    } catch (err) {
      console.error('Error updating session status:', err);
      throw err;
    }
  };

  const getSessionById = (sessionId: string) => {
    return sessions.find(session => session.id === sessionId);
  };

  return {
    sessions,
    loading,
    error,
    createSession,
    updateSessionStatus,
    getSessionById,
    refetch: fetchSessions
  };
};