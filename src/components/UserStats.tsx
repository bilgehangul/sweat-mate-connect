import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Flame, Calendar, TrendingUp, Award } from 'lucide-react';
import { useWorkoutLogs } from '@/hooks/useWorkoutLogs';

const UserStats = () => {
  const { 
    getWorkoutStats, 
    getRecentLogs, 
    loading: logsLoading 
  } = useWorkoutLogs();

  if (logsLoading) {
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
  
  // Calculate simple level based on total workouts
  const totalPoints = workoutStats.totalWorkouts * 50; // 50 points per workout
  const currentLevel = Math.floor(totalPoints / 100) + 1;

  const statsData = [
    {
      label: 'Level',
      value: currentLevel,
      icon: <Award className="w-4 h-4 fill-current" />,
      color: 'text-yellow-500'
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
    },
    {
      label: 'Total Points',
      value: totalPoints,
      icon: <Trophy className="w-4 h-4 fill-current" />,
      color: 'text-energy-orange'
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
          Level {currentLevel}
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

      {/* Recent Activity */}
      {recentLogs.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center">
            <Flame className="w-4 h-4 mr-2" />
            Recent Activity
          </h3>
          <div className="space-y-2">
            {recentLogs.slice(0, 3).map((log) => (
              <div key={log.id} className="flex justify-between items-center text-sm">
                <span className="capitalize">{log.workout_type.replace('_', ' ')}</span>
                <span className="text-muted-foreground">
                  {new Date(log.workout_date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default UserStats;