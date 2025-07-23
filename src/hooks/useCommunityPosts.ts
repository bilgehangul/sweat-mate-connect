import { useState } from 'react';

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
  const [posts] = useState<CommunityPost[]>([]);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const createPost = async (content: string, mediaUrl?: string, mediaType?: 'image' | 'video') => {
    throw new Error('Community posts feature not available yet');
  };

  const deletePost = async (postId: string) => {
    throw new Error('Community posts feature not available yet');
  };

  const pinPost = async (postId: string, isPinned: boolean) => {
    throw new Error('Community posts feature not available yet');
  };

  const refetch = async () => {
    // No-op
  };

  return {
    posts,
    loading,
    error,
    createPost,
    deletePost,
    pinPost,
    refetch
  };
};