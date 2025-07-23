
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Clock, MapPin, Dumbbell } from 'lucide-react';

interface SessionRequest {
  id: string;
  requester_id: string;
  message: string | null;
  created_at: string;
  requester: {
    first_name: string | null;
    last_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
  session: {
    title: string;
    gym_location: string;
    workout_type: string;
    scheduled_date: string;
    start_time: string;
  } | null;
}

interface SessionRequestCardProps {
  request: SessionRequest;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

const SessionRequestCard = ({ request, onAccept, onReject }: SessionRequestCardProps) => {
  const displayName = request.requester.first_name && request.requester.last_name
    ? `${request.requester.first_name} ${request.requester.last_name}`
    : request.requester.username || 'Unknown User';

  return (
    <Card className="p-4 border-l-4 border-l-energy-orange">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full flex items-center justify-center text-white font-bold">
            {request.requester.avatar_url ? (
              <img 
                src={request.requester.avatar_url} 
                alt="Avatar" 
                className="w-full h-full rounded-full object-cover" 
              />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h3 className="font-semibold">{displayName}</h3>
            <p className="text-sm text-muted-foreground">wants to join your session</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onReject(request.id)}
            className="hover:bg-destructive hover:text-destructive-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            onClick={() => onAccept(request.id)}
            className="gym-gradient text-white"
          >
            <Check className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {request.session && (
        <div className="mt-3 space-y-2">
          <h4 className="font-medium">{request.session.title}</h4>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {request.session.gym_location}
            </div>
            <div className="flex items-center">
              <Dumbbell className="w-3 h-3 mr-1" />
              {request.session.workout_type}
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {new Date(request.session.scheduled_date).toLocaleDateString()} at {request.session.start_time}
            </div>
          </div>
        </div>
      )}

      {request.message && (
        <div className="mt-3 p-2 bg-muted rounded text-sm">
          <strong>Message:</strong> {request.message}
        </div>
      )}
    </Card>
  );
};

export default SessionRequestCard;
