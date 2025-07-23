import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CommunityPost {
  id: string;
  community_id: string;
  author_id: string;
  content: string;
  media_url: string | null;
  media_type: string | null;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}

export const useCommunityPosts = (communityId: string) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (communityId) {
      fetchPosts();
    }
  }, [communityId]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          profiles (first_name, last_name, username, avatar_url)
        `)
        .eq('community_id', communityId)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err: any) {
      console.error('Error fetching community posts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (content: string, mediaUrl?: string, mediaType?: 'image' | 'video') => {
    try {
      const { error } = await supabase
        .from('community_posts')
        .insert({
          community_id: communityId,
          author_id: user?.id,
          content,
          media_url: mediaUrl,
          media_type: mediaType
        });

      if (error) throw error;
      await fetchPosts();
    } catch (err: any) {
      console.error('Error creating post:', err);
      throw err;
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      await fetchPosts();
    } catch (err: any) {
      console.error('Error deleting post:', err);
      throw err;
    }
  };

  const pinPost = async (postId: string, isPinned: boolean) => {
    try {
      const { error } = await supabase
        .from('community_posts')
        .update({ is_pinned: isPinned })
        .eq('id', postId);

      if (error) throw error;
      await fetchPosts();
    } catch (err: any) {
      console.error('Error updating post pin status:', err);
      throw err;
    }
  };

  return {
    posts,
    loading,
    error,
    createPost,
    deletePost,
    pinPost,
    refetch: fetchPosts
  };
};