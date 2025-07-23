import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useCommunityManagement = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const transferOwnership = async (communityId: string, newOwnerId: string) => {
    try {
      setLoading(true);
      
      // Update community creator
      const { error: communityError } = await supabase
        .from('communities')
        .update({ creator_id: newOwnerId })
        .eq('id', communityId)
        .eq('creator_id', user?.id);

      if (communityError) throw communityError;

      // Update old owner to admin role
      const { error: memberError } = await supabase
        .from('community_members')
        .update({ role: 'admin' })
        .eq('community_id', communityId)
        .eq('user_id', user?.id);

      if (memberError) throw memberError;

      // Update new owner to admin role (in case they weren't already)
      await supabase
        .from('community_members')
        .upsert({
          community_id: communityId,
          user_id: newOwnerId,
          role: 'admin'
        });

    } catch (err: any) {
      console.error('Error transferring ownership:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMemberRole = async (communityId: string, userId: string, newRole: 'admin' | 'moderator' | 'member') => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('community_members')
        .update({ role: newRole })
        .eq('community_id', communityId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (err: any) {
      console.error('Error updating member role:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCommunity = async (communityId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('communities')
        .delete()
        .eq('id', communityId)
        .eq('creator_id', user?.id);

      if (error) throw error;
    } catch (err: any) {
      console.error('Error deleting community:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const leaveCommunityWithReason = async (communityId: string, reason: string) => {
    try {
      setLoading(true);
      
      // Log the leave reason (you might want to store this in a separate table)
      console.log('User leaving community:', { communityId, userId: user?.id, reason });
      
      // Remove from community
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
    transferOwnership,
    updateMemberRole,
    deleteCommunity,
    leaveCommunityWithReason,
    loading
  };
};