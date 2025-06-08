import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, X, MessageSquare, MapPin, Clock, Dumbbell } from 'lucide-react';

const Matches = () => {
  const navigate = useNavigate();
  const [matches] = useState([
    {
      id: 1,
      name: 'Sarah Chen',
      age: 28,
      avatar: '👩‍💼',
      location: 'Gold\'s Gym Downtown',
      workoutType: 'Strength Training',
      experience: 'Intermediate',
      scheduledTime: 'Tomorrow 6:00 PM',
      bio: 'Looking for a consistent workout partner for evening sessions. Love deadlifts and squats!',
      matchPercentage: 92
    },
    {
      id: 2,
      name: 'Mike Rodriguez',
      age: 32,
      avatar: '👨‍💼',
      location: 'LA Fitness',
      workoutType: 'Cardio & HIIT',
      experience: 'Advanced',
      scheduledTime: 'Monday 7:00 AM',
      bio: 'Early bird looking for motivation! CrossFit enthusiast and marathon runner.',
      matchPercentage: 87
    },
    {
      id: 3,
      name: 'Emma Wilson',
      age: 25,
      avatar: '👩‍🎓',
      location: 'Planet Fitness',
      workoutType: 'Yoga & Pilates',
      experience: 'Beginner',
      scheduledTime: 'Wednesday 5:30 PM',
      bio: 'New to fitness, looking for someone patient to help me start my journey!',
      matchPercentage: 78
    }
  ]);

  const handleAccept = (matchId: number) => {
    console.log('Accepted match:', matchId);
  };

  const handleDeny = (matchId: number) => {
    console.log('Denied match:', matchId);
  };

  const handleChat = (matchId: number) => {
    console.log('Start chat with:', matchId);
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLoggedIn={true} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-energy-orange to-electric-blue bg-clip-text text-transparent mb-4">
            Your Matches
          </h1>
          <p className="text-muted-foreground text-lg">
            Connect with your perfect workout partners
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <Card key={match.id} className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
                  {match.avatar}
                </div>
                <h3 className="text-xl font-bold">{match.name}</h3>
                <p className="text-muted-foreground">Age {match.age}</p>
                <div className="mt-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    match.matchPercentage >= 90 ? 'bg-neon-green/20 text-neon-green' :
                    match.matchPercentage >= 80 ? 'bg-energy-orange/20 text-energy-orange' :
                    'bg-electric-blue/20 text-electric-blue'
                  }`}>
                    {match.matchPercentage}% Match
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  {match.location}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Dumbbell className="w-4 h-4 mr-2" />
                  {match.workoutType} • {match.experience}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-2" />
                  {match.scheduledTime}
                </div>
              </div>

              <p className="text-sm text-foreground mb-6 line-clamp-3">
                {match.bio}
              </p>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeny(match.id)}
                  className="flex-1 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleChat(match.id)}
                  className="flex-1 hover:bg-primary hover:text-primary-foreground"
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleAccept(match.id)}
                  className="flex-1 gym-gradient text-white hover:scale-105 transition-transform"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Matches;
