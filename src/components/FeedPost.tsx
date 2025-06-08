
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare } from 'lucide-react';

interface FeedPostProps {
  post: {
    id: number;
    user: string;
    avatar: string;
    time: string;
    content: string;
    workout: string;
    likes: number;
    comments: number;
  };
}

const FeedPost = ({ post }: FeedPostProps) => {
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
          
          {post.workout && (
            <div className="bg-gradient-to-r from-energy-orange/10 to-electric-blue/10 rounded-lg p-3 mb-3">
              <p className="text-sm font-medium text-primary">🏋️ {post.workout}</p>
            </div>
          )}
          
          <div className="flex items-center space-x-6">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
              <Heart className="w-4 h-4 mr-1" />
              {post.likes}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <MessageSquare className="w-4 h-4 mr-1" />
              {post.comments}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FeedPost;
