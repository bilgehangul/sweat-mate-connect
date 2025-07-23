
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users } from 'lucide-react';

interface SessionCreatorProps {
  onCreateSession: (sessionData: any) => void;
}

const SessionCreator = ({ onCreateSession }: SessionCreatorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    gym: '',
    date: '',
    time: '',
    ageRange: '',
    gender: '',
    workouts: '',
    intensity: '',
    community: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateSession(formData);
    setIsExpanded(false);
    setFormData({
      gym: '',
      date: '',
      time: '',
      ageRange: '',
      gender: '',
      workouts: '',
      intensity: '',
      community: ''
    });
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="gym">Gym</Label>
            <Input
              id="gym"
              value={formData.gym}
              onChange={(e) => setFormData({...formData, gym: e.target.value})}
              placeholder="Select your gym..."
              required
            />
          </div>
          
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="ageRange">Age Range</Label>
            <Input
              id="ageRange"
              value={formData.ageRange}
              onChange={(e) => setFormData({...formData, ageRange: e.target.value})}
              placeholder="e.g., 25-35"
            />
          </div>
          
          <div>
            <Label htmlFor="gender">Gender Preference</Label>
            <Input
              id="gender"
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
              placeholder="Any/Male/Female"
            />
          </div>
          
          <div>
            <Label htmlFor="intensity">Intensity Level</Label>
            <Input
              id="intensity"
              value={formData.intensity}
              onChange={(e) => setFormData({...formData, intensity: e.target.value})}
              placeholder="Beginner/Intermediate/Advanced"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="workouts">Workout Type</Label>
          <Input
            id="workouts"
            value={formData.workouts}
            onChange={(e) => setFormData({...formData, workouts: e.target.value})}
            placeholder="Strength training, Cardio, CrossFit..."
          />
        </div>
        
        <div>
          <Label htmlFor="community">Community (Optional)</Label>
          <Input
            id="community"
            value={formData.community}
            onChange={(e) => setFormData({...formData, community: e.target.value})}
            placeholder="Select a community..."
          />
        </div>
        
        <div className="flex space-x-3 pt-4">
          <Button 
            type="submit" 
            className="flex-1 gym-gradient text-white hover:scale-105 transition-transform"
          >
            Find My Workout Partner
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
