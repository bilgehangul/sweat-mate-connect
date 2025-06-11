
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SessionRequest {
  id: string;
  requester_id: string;
  recipient_id: string;
  session_id: string | null;
  message: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  requester: {
    first_name: string | null;
    last_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
  session: {
    title: string;
    gym_location: string;
    workout_type: string;
    scheduled_date: string;
    start_time: string;
  } | null;
}

export const useSessionRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<SessionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchSessionRequests();
    } else {
      setRequests([]);
      setLoading(false);
    }
  }, [user]);

  const fetchSessionRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('workout_requests')
        .select(`
          *,
          requester:profiles!workout_requests_requester_id_fkey(first_name, last_name, username, avatar_url),
          session:workout_sessions(title, gym_location, workout_type, scheduled_date, start_time)
        `)
        .eq('recipient_id', user?.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err: any) {
      console.error('Error fetching session requests:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const respondToRequest = async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('workout_requests')
        .update({ status })
        .eq('id', requestId);

      if (error) throw error;
      await fetchSessionRequests();
    } catch (err: any) {
      console.error('Error responding to request:', err);
      throw err;
    }
  };

  return {
    requests,
    loading,
    error,
    respondToRequest,
    refetch: fetchSessionRequests
  };
};
