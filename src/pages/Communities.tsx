
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Plus, Crown, Calendar, MapPin } from 'lucide-react';

const Communities = () => {
  const [communities] = useState([
    {
      id: 1,
      name: 'Early Birds Crew',
      description: 'For those who love 6 AM workouts and conquering the day early!',
      members: 156,
      image: '🌅',
      category: 'Schedule-based',
      gym: 'Gold\'s Gym Downtown',
      isJoined: true,
      isOwner: false,
      nextEvent: 'Tomorrow 6:00 AM - Morning Strength'
    },
    {
      id: 2,
      name: 'Women Who Lift',
      description: 'Empowering women in strength training. All levels welcome!',
      members: 284,
      image: '💪',
      category: 'Gender-specific',
      gym: 'Multiple Locations',
      isJoined: false,
      isOwner: false,
      nextEvent: 'Saturday 10:00 AM - Deadlift Workshop'
    },
    {
      id: 3,
      name: 'CrossFit Warriors',
      description: 'High-intensity community for CrossFit enthusiasts and beginners.',
      members: 97,
      image: '⚡',
      category: 'Workout-specific',
      gym: 'CrossFit Central',
      isJoined: true,
      isOwner: true,
      nextEvent: 'Friday 7:00 PM - WOD Challenge'
    },
    {
      id: 4,
      name: 'Yoga & Mindfulness',
      description: 'Balance your fitness with yoga, meditation, and wellness.',
      members: 203,
      image: '🧘',
      category: 'Wellness',
      gym: 'Zen Fitness Studio',
      isJoined: false,
      isOwner: false,
      nextEvent: 'Sunday 9:00 AM - Sunrise Yoga'
    }
  ]);

  const handleJoin = (communityId: number) => {
    console.log('Joining community:', communityId);
  };

  const handleLeave = (communityId: number) => {
    console.log('Leaving community:', communityId);
  };

  const handleCreateCommunity = () => {
    console.log('Creating new community');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLoggedIn={true} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-energy-orange to-electric-blue bg-clip-text text-transparent mb-2">
              Communities
            </h1>
            <p className="text-muted-foreground text-lg">
              Join like-minded fitness enthusiasts
            </p>
          </div>
          <Button 
            onClick={handleCreateCommunity}
            className="gym-gradient text-white hover:scale-105 transition-transform"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Community
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {communities.map((community) => (
            <Card key={community.id} className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full flex items-center justify-center text-2xl">
                    {community.image}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-bold">{community.name}</h3>
                      {community.isOwner && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{community.members} members</span>
                      <span>•</span>
                      <span>{community.category}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-foreground mb-4">
                {community.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  {community.gym}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  {community.nextEvent}
                </div>
              </div>

              <div className="flex space-x-3">
                {community.isJoined ? (
                  <>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleLeave(community.id)}
                    >
                      Leave Community
                    </Button>
                    <Button 
                      className="flex-1 gym-gradient text-white"
                    >
                      View Community
                    </Button>
                  </>
                ) : (
                  <Button 
                    className="w-full gym-gradient text-white hover:scale-105 transition-transform"
                    onClick={() => handleJoin(community.id)}
                  >
                    Join Community
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Communities;
