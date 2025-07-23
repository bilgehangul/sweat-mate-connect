
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share } from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/contexts/AuthContext';

const UserPosts = () => {
  const { user } = useAuth();
  const { posts, loading, likePost } = usePosts();

  // Filter posts by current user
  const userPosts = posts.filter(post => post.author_id === user?.id);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded mb-4"></div>
          ))}
        </div>
      </div>
    );
  }

  if (userPosts.length === 0) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">No Posts Yet</h3>
        <p className="text-muted-foreground">You haven't shared any posts yet. Start sharing your fitness journey!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Your Posts</h3>
      {userPosts.map((post) => (
        <Card key={post.id} className="p-4">
          <div className="flex items-start space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full flex items-center justify-center">
              {post.profiles.avatar_url ? (
                <img 
                  src={post.profiles.avatar_url} 
                  alt="Avatar" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold">
                  {post.profiles.first_name?.[0] || post.profiles.username?.[0] || '?'}
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-semibold">
                  {post.profiles.first_name && post.profiles.last_name
                    ? `${post.profiles.first_name} ${post.profiles.last_name}`
                    : post.profiles.username || 'Anonymous User'}
                </span>
                <span className="text-sm text-muted-foreground">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{post.content}</p>
              
              {post.media_url && (
                <div className="mt-3">
                  {post.media_type === 'image' ? (
                    <img 
                      src={post.media_url} 
                      alt="Post media" 
                      className="rounded-lg max-w-full h-auto"
                    />
                  ) : post.media_type === 'video' ? (
                    <video 
                      src={post.media_url} 
                      className="rounded-lg max-w-full h-auto" 
                      controls
                    />
                  ) : null}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => likePost(post.id)}
              className="flex items-center space-x-1"
            >
              <Heart className={`w-4 h-4 ${
                post.post_likes.some(like => like.user_id === user?.id) 
                  ? 'fill-red-500 text-red-500' 
                  : ''
              }`} />
              <span>{post.post_likes.length}</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{post.post_comments.length}</span>
            </Button>
            
            <Button variant="ghost" size="sm">
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default UserPosts;
