
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import SessionCreator from '@/components/SessionCreator';
import GymBuddiesList from '@/components/GymBuddiesList';
import FeedPost from '@/components/FeedPost';
import UserStats from '@/components/UserStats';
import Chat from '@/components/Chat';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { signOut } = useAuth();
  const [showSessionCreator, setShowSessionCreator] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedBuddy, setSelectedBuddy] = useState<any>(null);

  const feedPosts = [
    {
      id: 1,
      user: 'Sarah Johnson',
      avatar: '👩‍🦰',
      time: '2 hours ago',
      content: 'Just finished an amazing leg day! 💪 Who\'s ready to join me for some deadlifts tomorrow?',
      media: { type: 'image' as const, url: '/placeholder.svg' },
      likes: 24,
      comments: 8
    },
    {
      id: 2,
      user: 'Mike Chen',
      avatar: '👨‍💼',
      time: '4 hours ago',
      content: 'New PR on bench press today! 225lbs x 5 reps. The grind never stops! 🔥',
      likes: 31,
      comments: 12
    },
    {
      id: 3,
      user: 'Jessica Williams',
      avatar: '👩‍🦱',
      time: '6 hours ago',
      content: 'Morning yoga session complete! Starting the day with mindfulness and movement. 🧘‍♀️',
      media: { type: 'video' as const, url: '/placeholder.svg' },
      likes: 19,
      comments: 5
    }
  ];

  const handleCreateSession = (sessionData: any) => {
    console.log('Creating session:', sessionData);
    setShowSessionCreator(false);
  };

  const handleChatClick = (buddy: any) => {
    setSelectedBuddy(buddy);
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setSelectedBuddy(null);
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background relative">
      <Navigation isLoggedIn={true} onLogout={handleLogout} />
      
      {/* Session Creator Modal */}
      {showSessionCreator && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-planet-purple to-energy-yellow bg-clip-text text-transparent">
                  Create Your Workout Session
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSessionCreator(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <SessionCreator onCreateSession={handleCreateSession} />
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
            {/* Create Session Button */}
            <div className="text-center">
              <Button 
                onClick={() => setShowSessionCreator(true)}
                size="lg"
                className="gym-gradient text-white energy-glow hover:scale-105 transition-transform px-8 py-4 text-lg font-semibold rounded-full"
              >
                CREATE A SESSION
              </Button>
            </div>

            {/* Feed Posts */}
            <div className="space-y-6">
              {feedPosts.map((post) => (
                <FeedPost key={post.id} post={post} />
              ))}
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
