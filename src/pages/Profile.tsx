
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, MapPin, Target, Trophy, Edit, Settings } from 'lucide-react';

const Profile = () => {
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLoggedIn={true} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Profile Card */}
            <Card className="p-6 text-center">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
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
                  <span className="font-semibold text-neon-green">Level {profile.level}</span>
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
              <h3 className="text-lg font-bold mb-4 text-center bg-gradient-to-r from-energy-orange to-electric-blue bg-clip-text text-transparent">
                Fitness Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Workouts</span>
                  <span className="font-bold text-energy-orange">{profile.stats.workoutsCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hours Exercised</span>
                  <span className="font-bold text-electric-blue">{profile.stats.hoursExercised}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gym Buddies</span>
                  <span className="font-bold text-red-500">{profile.stats.favoriteBuddies}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Communities</span>
                  <span className="font-bold text-neon-green">{profile.stats.communitiesJoined}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Preferences & Goals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-energy-orange" />
                  Workout Goals
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.workoutGoals.map((goal, index) => (
                    <Badge key={index} variant="secondary" className="bg-energy-orange/10 text-energy-orange">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-electric-blue" />
                  Preferences
                </h3>
                <div className="space-y-2">
                  <p className="text-sm"><strong>Experience:</strong> {profile.experienceLevel}</p>
                  <p className="text-sm"><strong>Favorite Gym:</strong> {profile.favoriteGym}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.workoutPreferences.map((pref, index) => (
                      <Badge key={index} variant="outline" className="border-electric-blue text-electric-blue">
                        {pref}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Workouts */}
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

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button className="flex-1 gym-gradient text-white hover:scale-105 transition-transform">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" className="flex-1">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
