
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart } from 'lucide-react';
import { useUserStats } from '@/hooks/useUserStats';
import { useGymBuddies } from '@/hooks/useGymBuddies';
import { useCommunities } from '@/hooks/useCommunities';

const UserStats = () => {
  const { stats, loading: statsLoading } = useUserStats();
  const { buddies, loading: buddiesLoading } = useGymBuddies();
  const { communities, loading: communitiesLoading } = useCommunities();

  if (statsLoading || buddiesLoading || communitiesLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded mb-4"></div>
          ))}
        </div>
      </div>
    );
  }

  const level = stats?.level || 1;
  const currentXP = stats?.xp || 0;
  const nextLevelXP = level * 100; // Simple progression
  const xpProgress = Math.min((currentXP / nextLevelXP) * 100, 100);

  const statsData = [
    {
      label: 'Workouts Completed',
      value: stats?.workouts_completed || 0,
      icon: '💪',
      color: 'text-energy-orange'
    },
    {
      label: 'Ranking',
      value: `${stats?.ranking || 0}/5`,
      icon: '⭐',
      color: 'text-yellow-500'
    },
    {
      label: 'Hours Exercised',
      value: `${Math.floor((stats?.total_exercise_hours || 0) / 60)}h ${(stats?.total_exercise_hours || 0) % 60}m`,
      icon: '⏱️',
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
      
      {/* Gym Rat Level with XP Progress */}
      <Card className="p-4 hover:shadow-lg transition-shadow border-l-4 border-l-neon-green">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Gym Rat Level</p>
              <p className="text-2xl font-bold text-neon-green">Level {level}</p>
            </div>
            <div className="text-2xl">🏆</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{currentXP} XP</span>
              <span>{nextLevelXP} XP</span>
            </div>
            <Progress value={xpProgress} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">
              {Math.max(0, nextLevelXP - currentXP)} XP to level {level + 1}
            </p>
          </div>
        </div>
      </Card>
      
      {statsData.map((stat, index) => (
        <Card key={stat.label} className="p-4 hover:shadow-lg transition-shadow border-l-4 border-l-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
            <div className="text-2xl">{stat.icon}</div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default UserStats;
