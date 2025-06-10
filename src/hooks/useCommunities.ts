
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Community {
  id: string;
  name: string;
  description: string | null;
  avatar_url: string | null;
  creator_id: string;
  member_count: number;
  is_private: boolean;
  created_at: string;
  updated_at: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    username: string | null;
  };
}

export const useCommunities = () => {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchCommunities();
    }
  }, [user]);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('communities')
        .select(`
          *,
          profiles (first_name, last_name, username)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching communities:', error);
        setError(error.message);
      } else {
        setCommunities(data || []);
      }
    } catch (err) {
      console.error('Error fetching communities:', err);
      setError('Failed to fetch communities');
    } finally {
      setLoading(false);
    }
  };

  const createCommunity = async (communityData: {
    name: string;
    description?: string;
    is_private?: boolean;
  }) => {
    try {
      const { error } = await supabase
        .from('communities')
        .insert({
          ...communityData,
          creator_id: user?.id,
        });

      if (error) {
        console.error('Error creating community:', error);
        throw error;
      }

      await fetchCommunities();
    } catch (err) {
      console.error('Error creating community:', err);
      throw err;
    }
  };

  const joinCommunity = async (communityId: string) => {
    try {
      const { error } = await supabase
        .from('community_members')
        .insert({
          community_id: communityId,
          user_id: user?.id,
        });

      if (error) {
        console.error('Error joining community:', error);
        throw error;
      }

      await fetchCommunities();
    } catch (err) {
      console.error('Error joining community:', err);
      throw err;
    }
  };

  return {
    communities,
    loading,
    error,
    createCommunity,
    joinCommunity,
    refetch: fetchCommunities
  };
};
