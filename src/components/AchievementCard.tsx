import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirement_type: string;
  requirement_value: number;
  points: number;
  badge_color: string;
}

interface UserAchievement {
  id: string;
  progress: number;
  is_completed: boolean;
  completed_at: string | null;
  achievement: Achievement;
}

interface AchievementCardProps {
  userAchievement: UserAchievement;
  showProgress?: boolean;
}

const AchievementCard = ({ userAchievement, showProgress = true }: AchievementCardProps) => {
  const { achievement, progress, is_completed, completed_at } = userAchievement;
  const progressPercentage = Math.min((progress / achievement.requirement_value) * 100, 100);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'workout':
        return <Target className="w-4 h-4" />;
      case 'social':
        return <Star className="w-4 h-4" />;
      case 'consistency':
        return <Trophy className="w-4 h-4" />;
      default:
        return <Trophy className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'workout':
        return 'bg-energy-orange/10 text-energy-orange';
      case 'social':
        return 'bg-electric-blue/10 text-electric-blue';
      case 'consistency':
        return 'bg-neon-green/10 text-neon-green';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <Card className={`p-4 transition-all duration-300 hover:shadow-lg ${
      is_completed ? 'border-2 border-neon-green bg-neon-green/5' : 'hover:scale-105'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
            is_completed ? 'bg-neon-green/20' : 'bg-gray-100'
          }`}>
            {achievement.icon}
          </div>
          <div>
            <h3 className={`font-bold ${is_completed ? 'text-neon-green' : ''}`}>
              {achievement.name}
            </h3>
            <p className="text-sm text-muted-foreground">{achievement.description}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <Badge variant="outline" className={getCategoryColor(achievement.category)}>
            {getCategoryIcon(achievement.category)}
            <span className="ml-1 capitalize">{achievement.category}</span>
          </Badge>
          <div className="flex items-center space-x-1">
            <Trophy className="w-3 h-3 text-yellow-500" />
            <span className="text-sm font-medium">{achievement.points} pts</span>
          </div>
        </div>
      </div>

      {showProgress && !is_completed && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress}/{achievement.requirement_value}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      )}

      {is_completed && completed_at && (
        <div className="mt-3 p-2 bg-neon-green/10 rounded-lg">
          <div className="flex items-center justify-center space-x-2 text-neon-green">
            <Trophy className="w-4 h-4" />
            <span className="text-sm font-medium">
              Completed {new Date(completed_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default AchievementCard;