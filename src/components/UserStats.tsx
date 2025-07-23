
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart } from 'lucide-react';

const UserStats = () => {
  const stats = [
    {
      label: 'Workouts Completed',
      value: '127',
      icon: '💪',
      color: 'text-energy-orange'
    },
    {
      label: 'Ranking',
      value: '4/5',
      icon: '⭐',
      color: 'text-yellow-500'
    },
    {
      label: 'Hours Exercised',
      value: '89h 32m',
      icon: '⏱️',
      color: 'text-electric-blue'
    },
    {
      label: 'Favorite Buddies',
      value: '12',
      icon: <Heart className="w-4 h-4 fill-current" />,
      color: 'text-red-500'
    }
  ];

  // XP data for level progression
  const level = 23;
  const currentXP = 2340;
  const nextLevelXP = 2500;
  const xpProgress = (currentXP / nextLevelXP) * 100;

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
              {nextLevelXP - currentXP} XP to level {level + 1}
            </p>
          </div>
        </div>
      </Card>
      
      {stats.map((stat, index) => (
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
