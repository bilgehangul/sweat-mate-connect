
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import GymBuddiesList from '@/components/GymBuddiesList';
import FeedPost from '@/components/FeedPost';
import UserStats from '@/components/UserStats';
import Chat from '@/components/Chat';
import CreatePostForm from '@/components/CreatePostForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Plus } from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';

const Dashboard = () => {
  const { posts, loading: postsLoading } = usePosts();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedBuddy, setSelectedBuddy] = useState<any>(null);

  const handleChatClick = (buddy: any) => {
    setSelectedBuddy(buddy);
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setSelectedBuddy(null);
  };

  const handleLogout = () => {
    // No authentication to handle
  };

  return (
    <div className="min-h-screen bg-background relative">
      <Navigation isLoggedIn={true} onLogout={handleLogout} />
      
      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <CreatePostForm onClose={() => setShowCreatePost(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - User Stats */}
          <div className="lg:col-span-1">
            <UserStats />
          </div>

          {/* Center - Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post Button */}
            <div className="text-center">
              <Button 
                onClick={() => setShowCreatePost(true)}
                size="lg"
                className="gym-gradient text-white energy-glow hover:scale-105 transition-transform px-8 py-4 text-lg font-semibold rounded-full"
              >
                <Plus className="w-5 h-5 mr-2" />
                CREATE A POST
              </Button>
            </div>

            {/* Feed Posts */}
            <div className="space-y-6">
              {postsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-energy-orange mx-auto"></div>
                  <p className="text-muted-foreground mt-2">Loading posts...</p>
                </div>
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <FeedPost 
                    key={post.id} 
                    post={{
                      id: parseInt(post.id),
                      user: `${post.profiles.first_name || ''} ${post.profiles.last_name || ''}`.trim() || post.profiles.username || 'Unknown User',
                      avatar: post.profiles.avatar_url || '👤',
                      time: new Date(post.created_at).toLocaleDateString(),
                      content: post.content,
                      likes: post.post_likes.length,
                      comments: post.post_comments.length,
                      ...(post.media_url && { media: { type: post.media_type as 'image' | 'video', url: post.media_url } })
                    }} 
                  />
                ))
              ) : (
                <Card className="p-6 text-center">
                  <h3 className="text-lg font-bold mb-2">Welcome to GymBuddy!</h3>
                  <p className="text-muted-foreground mb-4">No posts yet. Be the first to share your fitness journey!</p>
                  <Button onClick={() => setShowCreatePost(true)} className="gym-gradient text-white">
                    Create Your First Post
                  </Button>
                </Card>
              )}
            </div>
          </div>

          {/* Right Sidebar - Gym Buddies */}
          <div className="lg:col-span-1">
            <GymBuddiesList />
          </div>
        </div>
      </div>

      {/* Chat Overlay */}
      {showChat && selectedBuddy && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg w-full max-w-md h-[600px] flex flex-col">
            <Chat buddy={selectedBuddy} onClose={handleCloseChat} isOpen={showChat} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
