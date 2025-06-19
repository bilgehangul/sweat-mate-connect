import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Dumbbell, MapPin, Calendar, Clock, Users, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Participant {
  id: string;
  user_id: string;
  status: string;
  joined_at: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    username: string | null;
    avatar_url: string | null;
    experience_level: string | null;
  };
}

interface WorkoutSession {
  id: string;
  creator_id: string;
  title: string;
  description: string | null;
  workout_type: string;
  gym_location: string;
  scheduled_date: string;
  start_time: string;
  end_time: string;
  max_participants: number;
  current_participants: number;
  status: string;
  created_at: string;
  updated_at: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
  participants?: Participant[];
}

interface WorkoutSessionDisplayProps {
  session: WorkoutSession;
  onSessionUpdate: () => void;
  isCreator?: boolean;
}

const WorkoutSessionDisplay = ({ 
  session, 
  onSessionUpdate,
  isCreator = false
}: WorkoutSessionDisplayProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>(session.participants || []);
  const [showParticipants, setShowParticipants] = useState(false);

  // Format date and time for display
  const formattedDate = new Date(session.scheduled_date).toLocaleDateString();
  const createdDate = new Date(session.created_at).toLocaleDateString();
  const createdTime = new Date(session.created_at).toLocaleTimeString();
  
  // Get creator name
  const creatorName = session.profiles.first_name && session.profiles.last_name
    ? `${session.profiles.first_name} ${session.profiles.last_name}`
    : session.profiles.username || 'Unknown User';

  // Check if current user is a participant
  const isParticipant = participants.some(p => p.user_id === user?.id);

  // Fetch participants if not provided
  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('session_participants')
        .select(`
          *,
          profiles (first_name, last_name, username, avatar_url, experience_level)
        `)
        .eq('session_id', session.id)
        .eq('status', 'accepted');

      if (error) throw error;
      setParticipants(data || []);
      setShowParticipants(true);
    } catch (err) {
      console.error('Error fetching participants:', err);
      toast({
        title: "Error",
        description: "Failed to load participants",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Cancel session
  const cancelSession = async () => {
    try {
      setLoading(true);
      
      // Update session status
      const { error: updateError } = await supabase
        .from('workout_sessions')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', session.id)
        .eq('creator_id', user?.id);

      if (updateError) throw updateError;
      
      // Notify participants (in a real app, you'd send notifications here)
      // For now, we'll just log it
      console.log(`Session ${session.id} cancelled. Notifying participants...`);
      
      toast({
        title: "Session Cancelled",
        description: "All participants have been notified",
      });
      
      onSessionUpdate();
    } catch (err) {
      console.error('Error cancelling session:', err);
      toast({
        title: "Error",
        description: "Failed to cancel session",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'full':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`p-6 ${session.status === 'cancelled' ? 'border-red-300 bg-red-50' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold">{session.title}</h3>
            <Badge className={getStatusBadgeColor(session.status)}>
              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Created on {createdDate} at {createdTime}
          </p>
        </div>
        
        <Badge variant="outline">
          {session.current_participants}/{session.max_participants} participants
        </Badge>
      </div>
      
      {session.description && (
        <p className="text-muted-foreground mb-4">{session.description}</p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Dumbbell className="w-4 h-4 mr-2" />
          <span className="capitalize">{session.workout_type.replace('_', ' ')}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{session.gym_location}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="w-4 h-4 mr-2" />
          <span>{session.start_time} - {session.end_time}</span>
        </div>
      </div>
      
      <div className="flex items-center text-sm text-muted-foreground mb-4">
        <Users className="w-4 h-4 mr-2" />
        <span>Created by {creatorName}</span>
      </div>
      
      {/* Session actions */}
      <div className="space-y-3">
        {isCreator ? (
          <>
            {session.status === 'open' || session.status === 'full' ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    disabled={loading}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel Session
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Workout Session</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel this session? All participants will be notified.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Session</AlertDialogCancel>
                    <AlertDialogAction onClick={cancelSession}>
                      Cancel Session
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : session.status === 'cancelled' ? (
              <div className="p-3 bg-red-100 rounded-md flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-red-600">This session has been cancelled</p>
              </div>
            ) : (
              <div className="p-3 bg-green-100 rounded-md flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <p className="text-green-600">This session has been completed</p>
              </div>
            )}
            
            {/* Participants section for creator */}
            <div>
              <Button 
                variant="outline" 
                className="w-full mb-3"
                onClick={fetchParticipants}
                disabled={loading || showParticipants}
              >
                <Users className="w-4 h-4 mr-2" />
                {showParticipants ? 'Participants' : 'Show Participants'}
              </Button>
              
              {showParticipants && (
                <div className="space-y-2 mt-2">
                  {participants.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center">No participants yet</p>
                  ) : (
                    participants.map(participant => {
                      const displayName = participant.profiles.first_name && participant.profiles.last_name
                        ? `${participant.profiles.first_name} ${participant.profiles.last_name}`
                        : participant.profiles.username || 'Unknown User';
                        
                      return (
                        <div key={participant.id} className="flex items-center justify-between p-2 border rounded-md">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full flex items-center justify-center">
                              {participant.profiles.avatar_url ? (
                                <img 
                                  src={participant.profiles.avatar_url} 
                                  alt="Avatar" 
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-white text-xs font-bold">
                                  {displayName.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{displayName}</p>
                              <p className="text-xs text-muted-foreground">
                                {participant.profiles.experience_level || 'Beginner'}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Joined {new Date(participant.joined_at).toLocaleDateString()}
                          </Badge>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* For participants */}
            {isParticipant ? (
              <div className="p-3 bg-green-100 rounded-md flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <p className="text-green-600">You're confirmed for this session</p>
              </div>
            ) : session.status === 'open' ? (
              <Button 
                className="w-full gym-gradient text-white"
                disabled={loading || session.status !== 'open'}
              >
                Request to Join
              </Button>
            ) : session.status === 'cancelled' ? (
              <div className="p-3 bg-red-100 rounded-md flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-red-600">This session has been cancelled</p>
              </div>
            ) : session.status === 'full' ? (
              <Button 
                className="w-full"
                disabled={true}
              >
                Session Full
              </Button>
            ) : (
              <Button 
                className="w-full"
                disabled={true}
              >
                Session Completed
              </Button>
            )}
            
            {/* Show other participants if user is a participant */}
            {isParticipant && (
              <Button 
                variant="outline" 
                className="w-full mt-3"
                onClick={fetchParticipants}
                disabled={loading || showParticipants}
              >
                <Users className="w-4 h-4 mr-2" />
                {showParticipants ? 'Participants' : 'Show Other Participants'}
              </Button>
            )}
            
            {isParticipant && showParticipants && (
              <div className="space-y-2 mt-2">
                {participants.filter(p => p.user_id !== user?.id).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center">No other participants yet</p>
                ) : (
                  participants
                    .filter(p => p.user_id !== user?.id)
                    .map(participant => {
                      const displayName = participant.profiles.first_name && participant.profiles.last_name
                        ? `${participant.profiles.first_name} ${participant.profiles.last_name}`
                        : participant.profiles.username || 'Unknown User';
                        
                      return (
                        <div key={participant.id} className="flex items-center space-x-2 p-2 border rounded-md">
                          <div className="w-8 h-8 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full flex items-center justify-center">
                            {participant.profiles.avatar_url ? (
                              <img 
                                src={participant.profiles.avatar_url} 
                                alt="Avatar" 
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-white text-xs font-bold">
                                {displayName.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{displayName}</p>
                            <p className="text-xs text-muted-foreground">
                              {participant.profiles.experience_level || 'Beginner'}
                            </p>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export default WorkoutSessionDisplay;