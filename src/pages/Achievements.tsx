import { useState } from 'react';
import Navigation from '@/components/Navigation';
import AchievementCard from '@/components/AchievementCard';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Award, Target, Users, Flame, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAchievements } from '@/hooks/useAchievements';

const Achievements = () => {
  const { signOut } = useAuth();
  const { 
    achievements,
    userAchievements, 
    loading, 
    getTotalPoints, 
    getCompletedAchievements,
    getInProgressAchievements,
    getWorkoutStreak 
  } = useAchievements();

  const handleLogout = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation isLoggedIn={true} onLogout={handleLogout} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-energy-orange mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading achievements...</p>
          </div>
        </div>
      </div>
    );
  }

  const totalPoints = getTotalPoints();
  const completedAchievements = getCompletedAchievements();
  const inProgressAchievements = getInProgressAchievements();
  const workoutStreak = getWorkoutStreak();
  const currentLevel = Math.floor(totalPoints / 100) + 1;
  const levelProgress = totalPoints % 100;

  const getCategoryAchievements = (category: string) => {
    return userAchievements.filter(ua => ua.achievement.category === category);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'workout':
        return <Target className="w-5 h-5" />;
      case 'social':
        return <Users className="w-5 h-5" />;
      case 'consistency':
        return <Flame className="w-5 h-5" />;
      case 'milestone':
        return <Star className="w-5 h-5" />;
      default:
        return <Trophy className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLoggedIn={true} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-energy-orange to-electric-blue bg-clip-text text-transparent mb-4">
            Achievements
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your fitness journey and unlock rewards
          </p>
        </div>

        {/* User Level and Progress */}
        <Card className="p-6 mb-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Level {currentLevel}</h2>
                <p className="text-muted-foreground">{totalPoints} Total Points</p>
              </div>
            </div>
            
            <div className="max-w-md mx-auto space-y-2">
              <div className="flex justify-between text-sm">
                <span>Level Progress</span>
                <span>{levelProgress}/100 XP</span>
              </div>
              <Progress value={levelProgress} className="h-3" />
              <p className="text-xs text-muted-foreground">
                {100 - levelProgress} XP to Level {currentLevel + 1}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="text-center">
                <p className="text-2xl font-bold text-neon-green">{completedAchievements.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-energy-orange">{inProgressAchievements.length}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-electric-blue">{workoutStreak?.current_streak || 0}</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Achievement Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="workout">Workout</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="consistency">Consistency</TabsTrigger>
            <TabsTrigger value="milestone">Milestone</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {userAchievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userAchievements.map((achievement) => (
                  <AchievementCard key={achievement.id} userAchievement={achievement} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Start Your Journey</h3>
                <p className="text-muted-foreground">
                  Complete workouts and connect with others to unlock achievements!
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-6">
            {completedAchievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedAchievements.map((achievement) => (
                  <AchievementCard key={achievement.id} userAchievement={achievement} showProgress={false} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No Achievements Yet</h3>
                <p className="text-muted-foreground">
                  Keep working out to earn your first achievement!
                </p>
              </Card>
            )}
          </TabsContent>

          {['workout', 'social', 'consistency', 'milestone'].map((category) => (
            <TabsContent key={category} value={category} className="space-y-4 mt-6">
              <div className="flex items-center space-x-2 mb-4">
                {getCategoryIcon(category)}
                <h3 className="text-lg font-semibold capitalize">{category} Achievements</h3>
              </div>
              
              {getCategoryAchievements(category).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getCategoryAchievements(category).map((achievement) => (
                    <AchievementCard key={achievement.id} userAchievement={achievement} />
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  {getCategoryIcon(category)}
                  <h3 className="text-xl font-bold mb-2 mt-4">No {category} achievements yet</h3>
                  <p className="text-muted-foreground">
                    Start your fitness journey to unlock {category} achievements!
                  </p>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Achievements;