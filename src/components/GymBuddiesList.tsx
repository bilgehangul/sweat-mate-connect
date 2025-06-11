
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Heart } from 'lucide-react';
import { useGymBuddies } from '@/hooks/useGymBuddies';
import Chat from './Chat';

const GymBuddiesList = () => {
  const { buddies, loading } = useGymBuddies();
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedBuddy, setSelectedBuddy] = useState<any>(null);

  const handleChat = (buddy: any) => {
    setSelectedBuddy({
      id: buddy.buddy.id,
      name: buddy.buddy.first_name && buddy.buddy.last_name 
        ? `${buddy.buddy.first_name} ${buddy.buddy.last_name}`
        : buddy.buddy.username || 'Unknown User',
      avatar: buddy.buddy.avatar_url || '👤'
    });
    setChatOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded mb-4"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Heart className="w-5 h-5 text-red-500 fill-current" />
          <h2 className="text-xl font-bold bg-gradient-to-r from-energy-orange to-electric-blue bg-clip-text text-transparent">
            Gym Buddies
          </h2>
        </div>
        
        {buddies.length === 0 ? (
          <Card className="p-4 text-center">
            <p className="text-muted-foreground">No gym buddies yet. Start connecting with people!</p>
          </Card>
        ) : (
          buddies.map((buddy) => {
            const displayName = buddy.buddy.first_name && buddy.buddy.last_name
              ? `${buddy.buddy.first_name} ${buddy.buddy.last_name}`
              : buddy.buddy.username || 'Unknown User';

            return (
              <Card key={buddy.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full flex items-center justify-center text-lg">
                        {buddy.buddy.avatar_url ? (
                          <img 
                            src={buddy.buddy.avatar_url} 
                            alt="Avatar" 
                            className="w-full h-full rounded-full object-cover" 
                          />
                        ) : (
                          '👤'
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white bg-green-500"></div>
                    </div>
                    
                    <div>
                      <p className="font-semibold text-sm">{displayName}</p>
                      <p className="text-xs text-muted-foreground">
                        {buddy.buddy.experience_level || 'Beginner'}
                      </p>
                      <p className="text-xs text-electric-blue">Connected</p>
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
            );
          })
        )}
        
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
