
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  session_id: string | null;
  match_score: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  session: {
    title: string;
    gym_location: string;
    workout_type: string;
    scheduled_date: string;
    start_time: string;
  } | null;
  matched_user: {
    first_name: string | null;
    last_name: string | null;
    username: string | null;
    age: number | null;
    avatar_url: string | null;
    experience_level: string | null;
    bio: string | null;
  };
}

export const useMatches = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchMatches();
    } else {
      setMatches([]);
      setLoading(false);
    }
  }, [user]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          session:workout_sessions(title, gym_location, workout_type, scheduled_date, start_time),
          user1:profiles!matches_user1_id_fkey(first_name, last_name, username, age, avatar_url, experience_level, bio),
          user2:profiles!matches_user2_id_fkey(first_name, last_name, username, age, avatar_url, experience_level, bio)
        `)
        .or(`user1_id.eq.${user?.id},user2_id.eq.${user?.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to include the matched user (not the current user)
      const transformedMatches = data?.map(match => ({
        ...match,
        matched_user: match.user1_id === user?.id ? match.user2 : match.user1
      })) || [];

      setMatches(transformedMatches);
    } catch (err: any) {
      console.error('Error fetching matches:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateMatchStatus = async (matchId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('matches')
        .update({ status })
        .eq('id', matchId);

      if (error) throw error;
      await fetchMatches();
    } catch (err: any) {
      console.error('Error updating match status:', err);
      throw err;
    }
  };

  return {
    matches,
    loading,
    error,
    updateMatchStatus,
    refetch: fetchMatches
  };
};
