
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import SessionCreator from '@/components/SessionCreator';
import FeedPost from '@/components/FeedPost';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Target, Trophy, Edit, Settings, Plus, X } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [showSessionCreator, setShowSessionCreator] = useState(false);
  
  const handleLogout = () => {
    navigate('/');
  };

  const [profile] = useState({
    name: 'John Doe',
    age: 29,
    gender: 'Male',
    avatar: '👨‍💼',
    level: 23,
    xp: 2340,
    xpToNext: 2500,
    joinDate: 'January 2024',
    location: 'Los Angeles, CA',
    favoriteGym: 'Gold\'s Gym Downtown',
    workoutGoals: ['Build Muscle', 'Increase Strength', 'Improve Endurance'],
    workoutPreferences: ['Strength Training', 'Cardio', 'HIIT'],
    experienceLevel: 'Intermediate',
    bio: 'Fitness enthusiast who loves pushing limits and helping others achieve their goals. Always looking for new challenges and workout partners!',
    stats: {
      workoutsCompleted: 127,
      hoursExercised: '89h 32m',
      favoriteBuddies: 12,
      communitiesJoined: 3
    },
    recentWorkouts: [
      { date: '2024-01-15', type: 'Chest & Triceps', duration: '75 min', gym: 'Gold\'s Gym' },
      { date: '2024-01-13', type: 'Back & Biceps', duration: '80 min', gym: 'Gold\'s Gym' },
      { date: '2024-01-11', type: 'Legs', duration: '90 min', gym: 'Gold\'s Gym' }
    ]
  });

  const myFeedPosts = [
    {
      id: 1,
      user: { name: 'John Doe', avatar: '👨‍💼', level: 23 },
      content: 'Just hit a new PR on deadlifts! 405lbs for 3 reps. Feeling stronger every day 💪',
      timestamp: '1 day ago',
      likes: 32,
      comments: 8
    },
    {
      id: 2,
      user: { name: 'John Doe', avatar: '👨‍💼', level: 23 },
      content: 'Morning cardio session complete! 5 miles in 35 minutes. Ready to tackle the day 🏃‍♂️',
      media: { type: 'image', url: '/placeholder.svg' },
      timestamp: '3 days ago',
      likes: 24,
      comments: 5
    }
  ];

  const handleCreateSession = (sessionData: any) => {
    console.log('Creating session:', sessionData);
    setShowSessionCreator(false);
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
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Profile Card */}
            <Card className="p-6 text-center">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-planet-purple to-energy-yellow rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                  {profile.avatar}
                </div>
                <Button size="sm" variant="outline" className="absolute top-0 right-0">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              
              <h1 className="text-2xl font-bold mb-2">{profile.name}</h1>
              <p className="text-muted-foreground mb-4">
                {profile.age} years old • {profile.gender}
              </p>
              
              {/* Level & XP */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-energy-yellow">Level {profile.level}</span>
                  <span className="text-sm text-muted-foreground">{profile.xp}/{profile.xpToNext} XP</span>
                </div>
                <Progress value={(profile.xp / profile.xpToNext) * 100} className="h-2" />
              </div>

              <p className="text-sm text-foreground mb-4">{profile.bio}</p>
              
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Joined {profile.joinDate}
                </div>
                <div className="flex items-center justify-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {profile.location}
                </div>
              </div>
            </Card>

            {/* Stats Card */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 text-center bg-gradient-to-r from-planet-purple to-energy-yellow bg-clip-text text-transparent">
                Fitness Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Workouts</span>
                  <span className="font-bold text-planet-purple">{profile.stats.workoutsCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hours Exercised</span>
                  <span className="font-bold text-planet-purple">{profile.stats.hoursExercised}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gym Buddies</span>
                  <span className="font-bold text-planet-purple">{profile.stats.favoriteBuddies}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Communities</span>
                  <span className="font-bold text-planet-purple">{profile.stats.communitiesJoined}</span>
                </div>
              </div>
            </Card>

            {/* Create Session Button */}
            <Button 
              onClick={() => setShowSessionCreator(true)}
              className="w-full planet-gradient text-white hover:scale-105 transition-transform"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Session
            </Button>
          </div>

          {/* Right Column - Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="feed">My Feed</TabsTrigger>
                <TabsTrigger value="workouts">Workouts</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Preferences & Goals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-planet-purple" />
                      Workout Goals
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.workoutGoals.map((goal, index) => (
                        <Badge key={index} variant="secondary" className="bg-planet-purple/10 text-planet-purple">
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-energy-yellow" />
                      Preferences
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm"><strong>Experience:</strong> {profile.experienceLevel}</p>
                      <p className="text-sm"><strong>Favorite Gym:</strong> {profile.favoriteGym}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profile.workoutPreferences.map((pref, index) => (
                          <Badge key={index} variant="outline" className="border-energy-yellow text-energy-yellow">
                            {pref}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button className="flex-1 planet-gradient text-white hover:scale-105 transition-transform">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="feed" className="space-y-6">
                {myFeedPosts.map((post) => (
                  <FeedPost key={post.id} post={post} />
                ))}
              </TabsContent>

              <TabsContent value="workouts" className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-4">Recent Workouts</h3>
                  <div className="space-y-3">
                    {profile.recentWorkouts.map((workout, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                        <div>
                          <p className="font-medium">{workout.type}</p>
                          <p className="text-sm text-muted-foreground">{workout.date} • {workout.gym}</p>
                        </div>
                        <Badge variant="outline">{workout.duration}</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
