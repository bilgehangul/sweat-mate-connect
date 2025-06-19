import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CommunityMember {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    username: string | null;
    avatar_url: string | null;
    experience_level: string | null;
  };
}

export const useCommunityMembers = (communityId: string) => {
  const { user } = useAuth();
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (communityId) {
      fetchMembers();
    }
  }, [communityId]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('community_members')
        .select(`
          *,
          profiles (first_name, last_name, username, avatar_url, experience_level)
        `)
        .eq('community_id', communityId)
        .order('joined_at', { ascending: true });

      if (error) throw error;

      setMembers(data || []);
      
      // Find current user's role
      const currentUserMember = data?.find(member => member.user_id === user?.id);
      setUserRole(currentUserMember?.role || null);
    } catch (err: any) {
      console.error('Error fetching community members:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    members,
    userRole,
    loading,
    refetch: fetchMembers
  };
};