
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface GymBuddy {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: string;
  created_at: string;
  buddy: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    username: string | null;
    avatar_url: string | null;
    experience_level: string | null;
  };
}

export const useGymBuddies = () => {
  const { user } = useAuth();
  const [buddies, setBuddies] = useState<GymBuddy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchGymBuddies();
    } else {
      setBuddies([]);
      setLoading(false);
    }
  }, [user]);

  const fetchGymBuddies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gym_buddies')
        .select(`
          *,
          requester:profiles!gym_buddies_requester_id_fkey(id, first_name, last_name, username, avatar_url, experience_level),
          recipient:profiles!gym_buddies_recipient_id_fkey(id, first_name, last_name, username, avatar_url, experience_level)
        `)
        .or(`requester_id.eq.${user?.id},recipient_id.eq.${user?.id}`)
        .eq('status', 'accepted')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to include the buddy (not the current user)
      const transformedBuddies = data?.map(buddy => ({
        ...buddy,
        buddy: buddy.requester_id === user?.id ? buddy.recipient : buddy.requester
      })) || [];

      setBuddies(transformedBuddies);
    } catch (err: any) {
      console.error('Error fetching gym buddies:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendBuddyRequest = async (recipientId: string) => {
    try {
      const { error } = await supabase
        .from('gym_buddies')
        .insert({
          requester_id: user?.id,
          recipient_id: recipientId,
          status: 'pending'
        });

      if (error) throw error;
    } catch (err: any) {
      console.error('Error sending buddy request:', err);
      throw err;
    }
  };

  const respondToBuddyRequest = async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('gym_buddies')
        .update({ status })
        .eq('id', requestId);

      if (error) throw error;
      await fetchGymBuddies();
    } catch (err: any) {
      console.error('Error responding to buddy request:', err);
      throw err;
    }
  };

  return {
    buddies,
    loading,
    error,
    sendBuddyRequest,
    respondToBuddyRequest,
    refetch: fetchGymBuddies
  };
};
