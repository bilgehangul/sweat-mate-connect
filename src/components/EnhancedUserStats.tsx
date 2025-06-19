import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Target, Flame, Calendar, TrendingUp, Award } from 'lucide-react';
import { useAchievements } from '@/hooks/useAchievements';
import { useWorkoutLogs } from '@/hooks/useWorkoutLogs';
import AchievementCard from './AchievementCard';

const EnhancedUserStats = () => {
  const { 
    userAchievements, 
    loading: achievementsLoading, 
    getTotalPoints, 
    getCompletedAchievements,
    getInProgressAchievements,
    getWorkoutStreak 
  } = useAchievements();
  
  const { 
    getWorkoutStats, 
    getRecentLogs, 
    loading: logsLoading 
  } = useWorkoutLogs();

  if (achievementsLoading || logsLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded mb-4"></div>
          ))}
        </div>
      </div>
    );
  }

  const workoutStats = getWorkoutStats();
  const recentLogs = getRecentLogs(7);
  const workoutStreak = getWorkoutStreak();
  const completedAchievements = getCompletedAchievements();
  const inProgressAchievements = getInProgressAchievements();
  const totalPoints = getTotalPoints();

  const statsData = [
    {
      label: 'Total Points',
      value: totalPoints,
      icon: <Trophy className="w-4 h-4 fill-current" />,
      color: 'text-yellow-500'
    },
    {
      label: 'Current Streak',
      value: `${workoutStreak?.current_streak || 0} days`,
      icon: <Flame className="w-4 h-4 fill-current" />,
      color: 'text-energy-orange'
    },
    {
      label: 'Total Workouts',
      value: workoutStats.totalWorkouts,
      icon: <Target className="w-4 h-4 fill-current" />,
      color: 'text-electric-blue'
    },
    {
      label: 'This Week',
      value: recentLogs.length,
      icon: <Calendar className="w-4 h-4 fill-current" />,
      color: 'text-neon-green'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-energy-orange to-electric-blue bg-clip-text text-transparent mb-2">
          Your Progress
        </h2>
        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
          <Award className="w-3 h-3 mr-1" />
          Level {Math.floor(totalPoints / 100) + 1}
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        {statsData.map((stat, index) => (
          <Card key={stat.label} className="p-3 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`${stat.color}`}>{stat.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Level Progress */}
      <Card className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Level Progress</span>
            <span>{totalPoints % 100}/100 XP</span>
          </div>
          <Progress value={(totalPoints % 100)} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            {100 - (totalPoints % 100)} XP to next level
          </p>
        </div>
      </Card>

      {/* Detailed Stats */}
      {workoutStats.totalWorkouts > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Workout Stats
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total Duration</p>
              <p className="font-medium">{Math.floor(workoutStats.totalDuration / 60)}h {workoutStats.totalDuration % 60}m</p>
            </div>
            <div>
              <p className="text-muted-foreground">Calories Burned</p>
              <p className="font-medium">{workoutStats.totalCalories.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Avg Difficulty</p>
              <p className="font-medium">{workoutStats.averageDifficulty}/5</p>
            </div>
            <div>
              <p className="text-muted-foreground">Avg Satisfaction</p>
              <p className="font-medium">{workoutStats.averageSatisfaction}/5</p>
            </div>
          </div>
        </Card>
      )}

      {/* Achievements */}
      <Tabs defaultValue="completed" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="completed">Completed ({completedAchievements.length})</TabsTrigger>
          <TabsTrigger value="progress">In Progress ({inProgressAchievements.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="completed" className="space-y-3 mt-4">
          {completedAchievements.length > 0 ? (
            completedAchievements.slice(0, 3).map((achievement) => (
              <AchievementCard 
                key={achievement.id} 
                userAchievement={achievement} 
                showProgress={false}
              />
            ))
          ) : (
            <Card className="p-4 text-center">
              <p className="text-muted-foreground">No achievements completed yet</p>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="progress" className="space-y-3 mt-4">
          {inProgressAchievements.length > 0 ? (
            inProgressAchievements.slice(0, 3).map((achievement) => (
              <AchievementCard 
                key={achievement.id} 
                userAchievement={achievement} 
                showProgress={true}
              />
            ))
          ) : (
            <Card className="p-4 text-center">
              <p className="text-muted-foreground">Start working out to unlock achievements!</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedUserStats;