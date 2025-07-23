
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Heart } from 'lucide-react';
import Chat from './Chat';

const GymBuddiesList = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedBuddy, setSelectedBuddy] = useState<any>(null);

  const buddies = [
    {
      id: 1,
      name: 'Sarah Chen',
      level: 'Level 28',
      avatar: '👩‍💼',
      status: 'online',
      lastWorkout: '2 hours ago'
    },
    {
      id: 2,
      name: 'Mike Rodriguez',
      level: 'Level 31',
      avatar: '👨‍💼',
      status: 'offline',
      lastWorkout: '1 day ago'
    },
    {
      id: 3,
      name: 'Emma Wilson',
      level: 'Level 25',
      avatar: '👩‍🎓',
      status: 'online',
      lastWorkout: '30 mins ago'
    },
    {
      id: 4,
      name: 'Alex Thompson',
      level: 'Level 33',
      avatar: '👨‍🎨',
      status: 'working out',
      lastWorkout: 'right now'
    }
  ];

  const handleChat = (buddy: any) => {
    setSelectedBuddy(buddy);
    setChatOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Heart className="w-5 h-5 text-red-500 fill-current" />
          <h2 className="text-xl font-bold bg-gradient-to-r from-energy-orange to-electric-blue bg-clip-text text-transparent">
            Favorite Gym Buddies
          </h2>
        </div>
        
        {buddies.map((buddy) => (
          <Card key={buddy.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full flex items-center justify-center text-lg">
                    {buddy.avatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                    buddy.status === 'online' ? 'bg-green-500' : 
                    buddy.status === 'working out' ? 'bg-energy-orange pulse-energy' : 'bg-gray-400'
                  }`}></div>
                </div>
                
                <div>
                  <p className="font-semibold text-sm">{buddy.name}</p>
                  <p className="text-xs text-muted-foreground">{buddy.level}</p>
                  <p className="text-xs text-electric-blue">{buddy.lastWorkout}</p>
                </div>
              </div>
              
              <Button 
                size="sm" 
                variant="outline"
                className="p-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => handleChat(buddy)}
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
        
        <Button 
          variant="outline" 
          className="w-full mt-4 border-dashed border-2 hover:bg-primary/5"
        >
          + Find More Buddies
        </Button>
      </div>

      {selectedBuddy && (
        <Chat 
          buddy={selectedBuddy} 
          isOpen={chatOpen} 
          onClose={() => setChatOpen(false)} 
        />
      )}
    </>
  );
};

export default GymBuddiesList;
