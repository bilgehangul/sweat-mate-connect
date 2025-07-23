import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { X, Star } from 'lucide-react';
import { useWorkoutLogs } from '@/hooks/useWorkoutLogs';
import { useToast } from '@/hooks/use-toast';

interface WorkoutLogFormProps {
  onClose: () => void;
  sessionId?: string;
  initialData?: {
    workout_type?: string;
    workout_date?: string;
  };
}

const WorkoutLogForm = ({ onClose, sessionId, initialData }: WorkoutLogFormProps) => {
  const { createWorkoutLog } = useWorkoutLogs();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    workout_type: initialData?.workout_type || '',
    duration_minutes: '',
    calories_burned: '',
    notes: '',
    difficulty_rating: '',
    satisfaction_rating: '',
    workout_date: initialData?.workout_date || new Date().toISOString().split('T')[0]
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createWorkoutLog({
        session_id: sessionId,
        workout_type: formData.workout_type,
        duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : undefined,
        calories_burned: formData.calories_burned ? parseInt(formData.calories_burned) : undefined,
        notes: formData.notes || undefined,
        difficulty_rating: formData.difficulty_rating ? parseInt(formData.difficulty_rating) : undefined,
        satisfaction_rating: formData.satisfaction_rating ? parseInt(formData.satisfaction_rating) : undefined,
        workout_date: formData.workout_date
      });
      
      toast({
        title: "Workout logged successfully!",
        description: "Your workout has been added to your history.",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error logging workout",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStarRating = (value: string, onChange: (value: string) => void, label: string) => (
    <div>
      <Label>{label}</Label>
      <div className="flex space-x-1 mt-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star.toString())}
            className={`p-1 rounded ${
              parseInt(value) >= star 
                ? 'text-yellow-500' 
                : 'text-gray-300 hover:text-yellow-400'
            }`}
          >
            <Star className={`w-5 h-5 ${parseInt(value) >= star ? 'fill-current' : ''}`} />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="p-6 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Log Workout</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="workout_date">Workout Date</Label>
          <Input
            id="workout_date"
            type="date"
            value={formData.workout_date}
            onChange={(e) => setFormData({...formData, workout_date: e.target.value})}
            max={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="duration_minutes">Duration (minutes)</Label>
            <Input
              id="duration_minutes"
              type="number"
              value={formData.duration_minutes}
              onChange={(e) => setFormData({...formData, duration_minutes: e.target.value})}
              placeholder="60"
              min="1"
              max="600"
            />
          </div>
          <div>
            <Label htmlFor="calories_burned">Calories Burned</Label>
            <Input
              id="calories_burned"
              type="number"
              value={formData.calories_burned}
              onChange={(e) => setFormData({...formData, calories_burned: e.target.value})}
              placeholder="300"
              min="1"
              max="2000"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {renderStarRating(
            formData.difficulty_rating,
            (value) => setFormData({...formData, difficulty_rating: value}),
            "Difficulty"
          )}
          {renderStarRating(
            formData.satisfaction_rating,
            (value) => setFormData({...formData, satisfaction_rating: value}),
            "Satisfaction"
          )}
        </div>

        <div>
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            placeholder="How did the workout go? Any observations..."
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={loading || !formData.workout_type} className="flex-1">
            {loading ? 'Logging...' : 'Log Workout'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default WorkoutLogForm;