
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Plus, Crown, Calendar, MapPin, Search } from 'lucide-react';

const Communities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const joinedCommunities = [
    {
      id: 1,
      name: 'Early Birds Crew',
      members: 156,
      image: '🌅',
      isOwner: false,
      nextEvent: 'Tomorrow 6:00 AM'
    },
    {
      id: 3,
      name: 'CrossFit Warriors',
      members: 97,
      image: '⚡',
      isOwner: true,
      nextEvent: 'Friday 7:00 PM'
    }
  ];

  const availableCommunities = [
    {
      id: 2,
      name: 'Women Who Lift',
      description: 'Empowering women in strength training. All levels welcome!',
      members: 284,
      image: '💪',
      category: 'Gender-specific',
      gym: 'Multiple Locations',
      nextEvent: 'Saturday 10:00 AM - Deadlift Workshop'
    },
    {
      id: 4,
      name: 'Yoga & Mindfulness',
      description: 'Balance your fitness with yoga, meditation, and wellness.',
      members: 203,
      image: '🧘',
      category: 'Wellness',
      gym: 'Zen Fitness Studio',
      nextEvent: 'Sunday 9:00 AM - Sunrise Yoga'
    },
    {
      id: 5,
      name: 'Powerlifting Club',
      description: 'Serious strength training for competitive lifters.',
      members: 145,
      image: '🏋️',
      category: 'Strength',
      gym: 'Iron Paradise Gym',
      nextEvent: 'Monday 8:00 PM - Max Out Session'
    }
  ];

  const filteredCommunities = availableCommunities.filter(community =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleJoin = (communityId: number) => {
    console.log('Joining community:', communityId);
  };

  const handleCreateCommunity = () => {
    console.log('Creating new community');
  };

  const handleCommunityClick = (communityId: number) => {
    console.log('Opening community:', communityId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLoggedIn={true} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar - Joined Communities */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-planet-purple to-energy-yellow bg-clip-text text-transparent mb-6">
              My Communities
            </h2>
            
            <div className="space-y-4">
              {joinedCommunities.map((community) => (
                <Card 
                  key={community.id} 
                  className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-planet-purple"
                  onClick={() => handleCommunityClick(community.id)}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-planet-purple to-energy-yellow rounded-full flex items-center justify-center text-lg">
                      {community.image}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-1">
                        <h3 className="font-bold text-sm">{community.name}</h3>
                        {community.isOwner && (
                          <Crown className="w-3 h-3 text-energy-yellow" />
                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Users className="w-3 h-3" />
                        <span>{community.members}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {community.nextEvent}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Middle - Search and Available Communities */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-planet-purple to-energy-yellow bg-clip-text text-transparent">
                Discover Communities
              </h1>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search communities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Available Communities */}
            <div className="space-y-4">
              {filteredCommunities.map((community) => (
                <Card key={community.id} className="p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-planet-purple to-energy-yellow rounded-full flex items-center justify-center text-2xl">
                        {community.image}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{community.name}</h3>
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

                  <Button 
                    className="w-full planet-gradient text-white hover:scale-105 transition-transform"
                    onClick={() => handleJoin(community.id)}
                  >
                    Join Community
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Sidebar - Create Community */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-gradient-to-br from-planet-purple/10 to-energy-yellow/10 border-planet-purple/20">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-planet-purple to-energy-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Create Your Own</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Start a community and bring together like-minded fitness enthusiasts
                </p>
                <Button 
                  onClick={handleCreateCommunity}
                  className="w-full planet-gradient text-white hover:scale-105 transition-transform"
                >
                  Create Community
                </Button>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-4 mt-6">
              <h4 className="font-bold mb-4 text-center">Community Stats</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Communities</span>
                  <span className="font-bold text-planet-purple">150+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Active Members</span>
                  <span className="font-bold text-planet-purple">5,000+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Weekly Meetups</span>
                  <span className="font-bold text-planet-purple">200+</span>
                </div>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Communities;
