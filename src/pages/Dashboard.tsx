
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import UserStats from '@/components/UserStats';
import SessionCreator from '@/components/SessionCreator';
import GymBuddiesList from '@/components/GymBuddiesList';
import FeedPost from '@/components/FeedPost';

const Dashboard = () => {
  const [posts] = useState([
    {
      id: 1,
      user: 'Sarah Chen',
      avatar: '👩‍💼',
      time: '2 hours ago',
      content: 'Just crushed a deadlift PR! 225lbs 💪 Looking for someone to celebrate with tomorrow at Gold\'s Gym!',
      workout: 'Strength Training - 90 minutes',
      media: {
        type: 'image' as const,
        url: '/placeholder.svg'
      },
      likes: 12,
      comments: 3,
      isLiked: false
    },
    {
      id: 2,
      user: 'Mike Rodriguez',
      avatar: '👨‍💼',
      time: '4 hours ago',
      content: 'Morning cardio session complete! The sunrise run was incredible. Who\'s up for a 6am session tomorrow?',
      workout: 'Cardio - 45 minutes',
      media: {
        type: 'video' as const,
        url: '/placeholder-video.mp4',
        thumbnail: '/placeholder.svg'
      },
      likes: 8,
      comments: 5,
      isLiked: true
    },
    {
      id: 3,
      user: 'Emma Wilson',
      avatar: '👩‍🎓',
      time: '1 day ago',
      content: 'First time trying CrossFit and I\'m officially addicted! Special thanks to Alex for being an amazing workout partner 🙌',
      workout: 'CrossFit - 60 minutes',
      likes: 15,
      comments: 7,
      isLiked: false
    }
  ]);

  const handleCreateSession = (sessionData: any) => {
    console.log('Creating session:', sessionData);
    // Here you would typically send this to your backend
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLoggedIn={true} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - User Stats */}
          <div className="lg:col-span-1">
            <UserStats />
          </div>
          
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <SessionCreator onCreateSession={handleCreateSession} />
            
            {/* Feed */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-planet-purple to-energy-yellow bg-clip-text text-transparent">
                Your Feed
              </h2>
              {posts.map((post) => (
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
    </div>
  );
};

export default Dashboard;
