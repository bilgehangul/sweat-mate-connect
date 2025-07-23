import { Card } from '@/components/ui/card';
import { Heart, Dumbbell, Star, Clock } from 'lucide-react';
import { useUserStats } from '@/hooks/useUserStats';
import { useGymBuddies } from '@/hooks/useGymBuddies';
import { useWorkoutLogs } from '@/hooks/useWorkoutLogs';
import { useWorkoutReviews } from '@/hooks/useWorkoutReviews';

const UserStats = () => {
  const { stats, loading: statsLoading } = useUserStats();
  const { buddies, loading: buddiesLoading } = useGymBuddies();
  const { getWorkoutStats, loading: logsLoading } = useWorkoutLogs();
  const { getAverageRating, loading: reviewsLoading } = useWorkoutReviews();

  if (statsLoading || buddiesLoading || logsLoading || reviewsLoading) {
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

  // Placeholder stats since features are not implemented yet
  const workoutStats = { totalWorkouts: 0, totalMinutes: 0, totalCalories: 0, averageRating: 0 };
  const averageRating = 0;

  const statsData = [
    {
      label: 'Workouts Completed',
      value: workoutStats.totalWorkouts || 0,
      icon: <Dumbbell className="w-4 h-4 fill-current" />,
      color: 'text-energy-orange'
    },
    {
      label: 'User Rating',
      value: averageRating > 0 ? `${averageRating}/5` : 'No ratings',
      icon: <Star className="w-4 h-4 fill-current" />,
      color: 'text-yellow-500'
    },
    {
      label: 'Hours Exercised',
      value: `${Math.floor((workoutStats.totalMinutes || 0) / 60)}h ${(workoutStats.totalMinutes || 0) % 60}m`,
      icon: <Clock className="w-4 h-4 fill-current" />,
      color: 'text-electric-blue'
    },
    {
      label: 'Gym Buddies',
      value: buddies?.length || 0,
      icon: <Heart className="w-4 h-4 fill-current" />,
      color: 'text-red-500'
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-energy-orange to-electric-blue bg-clip-text text-transparent">
        Your Stats
      </h2>
      
      {statsData.map((stat, index) => (
        <Card key={stat.label} className="p-4 hover:shadow-lg transition-shadow border-l-4 border-l-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
            <div className={`text-2xl ${stat.color}`}>{stat.icon}</div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default UserStats;