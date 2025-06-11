
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useCommunityActions = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const createCommunity = async (communityData: {
    name: string;
    description?: string;
    is_private?: boolean;
  }) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('communities')
        .insert({
          ...communityData,
          creator_id: user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Add creator as member
      await supabase
        .from('community_members')
        .insert({
          community_id: data.id,
          user_id: user?.id,
          role: 'admin'
        });

      return data;
    } catch (err: any) {
      console.error('Error creating community:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const joinCommunity = async (communityId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('community_members')
        .insert({
          community_id: communityId,
          user_id: user?.id,
          role: 'member'
        });

      if (error) throw error;
    } catch (err: any) {
      console.error('Error joining community:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const leaveCommunity = async (communityId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('community_members')
        .delete()
        .eq('community_id', communityId)
        .eq('user_id', user?.id);

      if (error) throw error;
    } catch (err: any) {
      console.error('Error leaving community:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCommunity,
    joinCommunity,
    leaveCommunity,
    loading
  };
};
