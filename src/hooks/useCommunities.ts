
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
  is_member: boolean;
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
          profiles (first_name, last_name, username),
          community_members!inner (user_id)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching communities:', error);
        setError(error.message);
      } else {
        // Get user's memberships
        const { data: memberships } = await supabase
          .from('community_members')
          .select('community_id')
          .eq('user_id', user?.id);

        const membershipIds = memberships?.map(m => m.community_id) || [];

        // Add is_member property to each community
        const communitiesWithMembership = (data || []).map(community => ({
          ...community,
          is_member: membershipIds.includes(community.id)
        }));

        setCommunities(communitiesWithMembership);
      }
    } catch (err) {
      console.error('Error fetching communities:', err);
      setError('Failed to fetch communities');
    } finally {
      setLoading(false);
    }
  };

  return {
    communities,
    loading,
    error,
    refetch: fetchCommunities
  };
};
