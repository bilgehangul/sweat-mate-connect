
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Share, Play } from 'lucide-react';

interface FeedPostProps {
  post: {
    id: number;
    user: string;
    avatar: string;
    time: string;
    content: string;
    workout?: string;
    media?: {
      type: string; // Changed from 'image' | 'video' to string to be more flexible
      url: string;
      thumbnail?: string;
    };
    likes: number;
    comments: number;
    isLiked?: boolean;
  };
}

const FeedPost = ({ post }: FeedPostProps) => {
  const handleLike = () => {
    console.log('Liked post:', post.id);
  };

  const handleComment = () => {
    console.log('Comment on post:', post.id);
  };

  const handleShare = () => {
    console.log('Share post:', post.id);
  };

  return (
    <Card className="p-6 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full flex items-center justify-center text-xl">
          {post.avatar}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-semibold">{post.user}</h4>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{post.time}</span>
          </div>
          
          <p className="text-foreground mb-3">{post.content}</p>
          
          {/* Media Content */}
          {post.media && (
            <div className="mb-3 rounded-lg overflow-hidden">
              {post.media.type === 'image' ? (
                <img 
                  src={post.media.url} 
                  alt="Post media"
                  className="w-full max-h-96 object-cover hover:scale-105 transition-transform cursor-pointer"
                />
              ) : post.media.type === 'video' ? (
                <div className="relative">
                  <img 
                    src={post.media.thumbnail || '/placeholder.svg'} 
                    alt="Video thumbnail"
                    className="w-full max-h-96 object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Button 
                      size="lg" 
                      className="rounded-full gym-gradient text-white hover:scale-110 transition-transform"
                    >
                      <Play className="w-6 h-6 ml-1" />
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
          
          {post.workout && (
            <div className="bg-gradient-to-r from-energy-orange/10 to-electric-blue/10 rounded-lg p-3 mb-3">
              <p className="text-sm font-medium text-primary">🏋️ {post.workout}</p>
            </div>
          )}
          
          <div className="flex items-center space-x-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLike}
              className={`transition-colors ${
                post.isLiked 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-muted-foreground hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
              {post.likes}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleComment}
              className="text-muted-foreground hover:text-primary"
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              {post.comments}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleShare}
              className="text-muted-foreground hover:text-primary"
            >
              <Share className="w-4 h-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FeedPost;
