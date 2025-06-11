
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users } from 'lucide-react';
import { useWorkoutSessions } from '@/hooks/useWorkoutSessions';
import { useToast } from '@/hooks/use-toast';
import GymLocationSelector from './GymLocationSelector';

interface SessionCreatorProps {
  onCreateSession: (sessionData: any) => void;
}

const SessionCreator = ({ onCreateSession }: SessionCreatorProps) => {
  const { createSession } = useWorkoutSessions();
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    gym_location: '',
    scheduled_date: '',
    start_time: '',
    end_time: '',
    workout_type: '',
    max_participants: 2
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const sessionData = {
        ...formData,
        max_participants: Number(formData.max_participants)
      };

      await createSession(sessionData);
      
      toast({
        title: "Session created successfully!",
        description: "Your workout session is now live and others can join.",
      });

      onCreateSession(sessionData);
      setIsExpanded(false);
      setFormData({
        title: '',
        description: '',
        gym_location: '',
        scheduled_date: '',
        start_time: '',
        end_time: '',
        workout_type: '',
        max_participants: 2
      });
    } catch (error: any) {
      toast({
        title: "Error creating session",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isExpanded) {
    return (
      <div className="text-center mb-8">
        <Button 
          onClick={() => setIsExpanded(true)}
          size="lg"
          className="gym-gradient text-white energy-glow hover:scale-105 transition-transform px-8 py-4 text-lg font-semibold rounded-full"
        >
          <Users className="w-5 h-5 mr-2" />
          CREATE A SESSION
        </Button>
      </div>
    );
  }

  return (
    <Card className="p-6 mb-8 border-2 border-primary/20">
      <h3 className="text-xl font-bold mb-4 text-center bg-gradient-to-r from-energy-orange to-electric-blue bg-clip-text text-transparent">
        Create Your Workout Session
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Session Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="e.g., Morning Strength Training"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Tell others what to expect from this session..."
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="gym_location">Gym Location</Label>
            <GymLocationSelector
              value={formData.gym_location}
              onValueChange={(value) => setFormData({...formData, gym_location: value})}
            />
          </div>
          
          <div>
            <Label htmlFor="workout_type">Workout Type</Label>
            <Select value={formData.workout_type} onValueChange={(value) => setFormData({...formData, workout_type: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select workout type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="strength_training">Strength Training</SelectItem>
                <SelectItem value="cardio">Cardio</SelectItem>
                <SelectItem value="hiit">HIIT</SelectItem>
                <SelectItem value="crossfit">CrossFit</SelectItem>
                <SelectItem value="yoga">Yoga</SelectItem>
                <SelectItem value="pilates">Pilates</SelectItem>
                <SelectItem value="functional">Functional Training</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="scheduled_date">Date</Label>
            <Input
              id="scheduled_date"
              type="date"
              value={formData.scheduled_date}
              onChange={(e) => setFormData({...formData, scheduled_date: e.target.value})}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="start_time">Start Time</Label>
            <Input
              id="start_time"
              type="time"
              value={formData.start_time}
              onChange={(e) => setFormData({...formData, start_time: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="end_time">End Time</Label>
            <Input
              id="end_time"
              type="time"
              value={formData.end_time}
              onChange={(e) => setFormData({...formData, end_time: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="max_participants">Max Participants</Label>
            <Select value={formData.max_participants.toString()} onValueChange={(value) => setFormData({...formData, max_participants: parseInt(value)})}>
              <SelectTrigger>
                <SelectValue placeholder="Select max participants" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 people</SelectItem>
                <SelectItem value="3">3 people</SelectItem>
                <SelectItem value="4">4 people</SelectItem>
                <SelectItem value="5">5 people</SelectItem>
                <SelectItem value="6">6 people</SelectItem>
                <SelectItem value="8">8 people</SelectItem>
                <SelectItem value="10">10 people</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex space-x-3 pt-4">
          <Button 
            type="submit" 
            disabled={loading}
            className="flex-1 gym-gradient text-white hover:scale-105 transition-transform"
          >
            {loading ? 'Creating...' : 'Create Session'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsExpanded(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default SessionCreator;
