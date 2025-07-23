
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Post {
  id: string;
  author_id: string;
  content: string;
  media_url: string | null;
  media_type: string | null;
  workout_session_id: string | null;
  created_at: string;
  updated_at: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
  post_likes: { id: string; user_id: string }[];
  post_comments: { id: string; content: string; author_id: string }[];
}

export const usePosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (first_name, last_name, username, avatar_url),
          post_likes (id, user_id),
          post_comments (id, content, author_id)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        setError(error.message);
      } else {
        setPosts(data || []);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (content: string, mediaUrl?: string, mediaType?: 'image' | 'video') => {
    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          author_id: user?.id,
          content,
          media_url: mediaUrl,
          media_type: mediaType
        });

      if (error) {
        console.error('Error creating post:', error);
        throw error;
      }

      // Refresh posts
      await fetchPosts();
    } catch (err) {
      console.error('Error creating post:', err);
      throw err;
    }
  };

  const likePost = async (postId: string) => {
    try {
      // Check if user already liked this post
      const existingLike = posts
        .find(post => post.id === postId)
        ?.post_likes.find(like => like.user_id === user?.id);

      if (existingLike) {
        // Unlike the post
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user?.id);

        if (error) {
          console.error('Error unliking post:', error);
          throw error;
        }
      } else {
        // Like the post
        const { error } = await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: user?.id
          });

        if (error) {
          console.error('Error liking post:', error);
          throw error;
        }
      }

      await fetchPosts();
    } catch (err) {
      console.error('Error toggling like:', err);
      throw err;
    }
  };

  const unlikePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error unliking post:', error);
        throw error;
      }

      await fetchPosts();
    } catch (err) {
      console.error('Error unliking post:', err);
      throw err;
    }
  };

  return {
    posts,
    loading,
    error,
    createPost,
    likePost,
    unlikePost,
    refetch: fetchPosts
  };
};
