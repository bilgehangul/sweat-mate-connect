import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import WorkoutSessionDisplay from './WorkoutSessionDisplay';

interface WorkoutSessionListProps {
  onCreateSession: () => void;
}

const WorkoutSessionList = ({ onCreateSession }: WorkoutSessionListProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      
      // Fetch all sessions created by the user
      const { data, error } = await supabase
        .from('workout_sessions')
        .select(`
          *,
          profiles (first_name, last_name, username, avatar_url),
          session_participants (
            id,
            user_id,
            status,
            joined_at,
            profiles (first_name, last_name, username, avatar_url, experience_level)
          )
        `)
        .eq('creator_id', user?.id)
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      
      // Transform data to include participants array
      const transformedData = data?.map(session => ({
        ...session,
        participants: session.session_participants || []
      })) || [];

      setSessions(transformedData);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      toast({
        title: "Error",
        description: "Failed to load workout sessions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter sessions based on active tab
  const activeSessions = sessions.filter(session => 
    session.status === 'open' || session.status === 'full'
  );
  
  const completedSessions = sessions.filter(session => 
    session.status === 'completed'
  );
  
  const cancelledSessions = sessions.filter(session => 
    session.status === 'cancelled'
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded mb-4"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Workout Sessions</h2>
        <Button 
          onClick={onCreateSession}
          className="gym-gradient text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Session
        </Button>
      </div>

      {sessions.length === 0 ? (
        <Card className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">No Sessions Yet</h3>
          <p className="text-muted-foreground mb-4">Create your first workout session to start matching with gym buddies.</p>
          <Button onClick={onCreateSession} className="gym-gradient text-white">
            Create Your First Session
          </Button>
        </Card>
      ) : (
        <Tabs defaultValue="active" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">
              Active ({activeSessions.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedSessions.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({cancelledSessions.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4 mt-4">
            {activeSessions.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">No active sessions</p>
              </Card>
            ) : (
              activeSessions.map(session => (
                <WorkoutSessionDisplay 
                  key={session.id}
                  session={session}
                  onSessionUpdate={fetchSessions}
                  isCreator={true}
                />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4 mt-4">
            {completedSessions.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">No completed sessions</p>
              </Card>
            ) : (
              completedSessions.map(session => (
                <WorkoutSessionDisplay 
                  key={session.id}
                  session={session}
                  onSessionUpdate={fetchSessions}
                  isCreator={true}
                />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="cancelled" className="space-y-4 mt-4">
            {cancelledSessions.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">No cancelled sessions</p>
              </Card>
            ) : (
              cancelledSessions.map(session => (
                <WorkoutSessionDisplay 
                  key={session.id}
                  session={session}
                  onSessionUpdate={fetchSessions}
                  isCreator={true}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default WorkoutSessionList;