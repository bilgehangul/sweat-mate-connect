import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';

interface ProfileEditFormProps {
  onClose: () => void;
}

const ProfileEditForm = ({ onClose }: ProfileEditFormProps) => {
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    username: profile?.username || '',
    bio: profile?.bio || '',
    date_of_birth: profile?.date_of_birth || '',
    gender: profile?.gender || '',
    location: profile?.location || '',
    favorite_gym: profile?.favorite_gym || '',
    experience_level: profile?.experience_level || 'beginner',
  });
  
  const [workoutGoals, setWorkoutGoals] = useState<string[]>(profile?.workout_goals || []);
  const [workoutPreferences, setWorkoutPreferences] = useState<string[]>(profile?.workout_preferences || []);
  const [newGoal, setNewGoal] = useState('');
  const [newPreference, setNewPreference] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateProfile({
        ...formData,
        workout_goals: workoutGoals,
        workout_preferences: workoutPreferences,
      });
      
      toast({
        title: "Profile updated successfully!",
        description: "Your changes have been saved.",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addGoal = () => {
    if (newGoal.trim() && !workoutGoals.includes(newGoal.trim())) {
      setWorkoutGoals([...workoutGoals, newGoal.trim()]);
      setNewGoal('');
    }
  };

  const removeGoal = (goal: string) => {
    setWorkoutGoals(workoutGoals.filter(g => g !== goal));
  };

  const addPreference = () => {
    if (newPreference.trim() && !workoutPreferences.includes(newPreference.trim())) {
      setWorkoutPreferences([...workoutPreferences, newPreference.trim()]);
      setNewPreference('');
    }
  };

  const removePreference = (pref: string) => {
    setWorkoutPreferences(workoutPreferences.filter(p => p !== pref));
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Edit Profile</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">First Name</label>
            <Input
              value={formData.first_name}
              onChange={(e) => setFormData({...formData, first_name: e.target.value})}
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Last Name</label>
            <Input
              value={formData.last_name}
              onChange={(e) => setFormData({...formData, last_name: e.target.value})}
              placeholder="Enter your last name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Username</label>
          <Input
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            placeholder="Enter your username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Bio</label>
          <Textarea
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            placeholder="Tell us about yourself..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date of Birth</label>
            <Input
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Gender</label>
            <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Experience Level</label>
            <Select value={formData.experience_level} onValueChange={(value) => setFormData({...formData, experience_level: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="Your location"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Favorite Gym</label>
            <Input
              value={formData.favorite_gym}
              onChange={(e) => setFormData({...formData, favorite_gym: e.target.value})}
              placeholder="Your favorite gym"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Workout Goals</label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Add a workout goal"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
            />
            <Button type="button" onClick={addGoal}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {workoutGoals.map((goal, index) => (
              <Badge key={index} variant="secondary" className="cursor-pointer">
                {goal}
                <X className="w-3 h-3 ml-1" onClick={() => removeGoal(goal)} />
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Workout Preferences</label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newPreference}
              onChange={(e) => setNewPreference(e.target.value)}
              placeholder="Add a workout preference"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPreference())}
            />
            <Button type="button" onClick={addPreference}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {workoutPreferences.map((pref, index) => (
              <Badge key={index} variant="outline" className="cursor-pointer">
                {pref}
                <X className="w-3 h-3 ml-1" onClick={() => removePreference(pref)} />
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProfileEditForm;