
import { Card } from '@/components/ui/card';
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
    },
    {
      label: 'Gym Rat Level',
      value: 'Level 23',
      icon: '🏆',
      color: 'text-neon-green'
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-energy-orange to-electric-blue bg-clip-text text-transparent">
        Your Stats
      </h2>
      
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
