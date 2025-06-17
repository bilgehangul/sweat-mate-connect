
import { Card } from '@/components/ui/card';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useWorkoutSessions } from '@/hooks/useWorkoutSessions';
import { useAuth } from '@/contexts/AuthContext';

const WorkoutHistory = () => {
  const { user } = useAuth();
  const { sessions, loading } = useWorkoutSessions();

  // Filter sessions created by the current user
  const userSessions = sessions.filter(session => session.creator_id === user?.id);

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

  if (userSessions.length === 0) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">No Workout History</h3>
        <p className="text-muted-foreground">You haven't created any workout sessions yet.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Your Workout Sessions</h3>
      {userSessions.map((session) => (
        <Card key={session.id} className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-lg">{session.title}</h4>
            <span className={`px-2 py-1 text-xs rounded-full ${
              session.status === 'completed' 
                ? 'bg-green-100 text-green-800' 
                : session.status === 'cancelled'
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {session.status}
            </span>
          </div>
          
          <p className="text-muted-foreground mb-3">{session.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>{new Date(session.scheduled_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{session.start_time} - {session.end_time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{session.gym_location}</span>
            </div>
          </div>
          
          <div className="mt-3 flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Type: <span className="capitalize">{session.workout_type}</span>
            </span>
            <span className="text-sm text-muted-foreground">
              Participants: {session.current_participants}/{session.max_participants}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default WorkoutHistory;
