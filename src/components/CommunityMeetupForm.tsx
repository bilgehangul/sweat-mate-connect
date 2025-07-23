import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';
import { useCommunityMeetups } from '@/hooks/useCommunityMeetups';
import { useToast } from '@/hooks/use-toast';

interface CommunityMeetupFormProps {
  communityId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const CommunityMeetupForm = ({ communityId, onClose, onSuccess }: CommunityMeetupFormProps) => {
  const { createMeetup } = useCommunityMeetups(communityId);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    address: '',
    event_date: '',
    start_time: '',
    end_time: '',
    max_attendees: '',
    is_virtual: false,
    meeting_link: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createMeetup({
        title: formData.title,
        description: formData.description || undefined,
        location: formData.location,
        address: formData.address || undefined,
        event_date: formData.event_date,
        start_time: formData.start_time,
        end_time: formData.end_time || undefined,
        max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : undefined,
        is_virtual: formData.is_virtual,
        meeting_link: formData.meeting_link || undefined
      });
      
      toast({
        title: "Meetup created!",
        description: "Your meetup has been scheduled.",
      });
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error creating meetup",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Create Meetup</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Meetup title"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Describe your meetup..."
            rows={3}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_virtual"
            checked={formData.is_virtual}
            onCheckedChange={(checked) => setFormData({...formData, is_virtual: checked})}
          />
          <Label htmlFor="is_virtual">Virtual Meetup</Label>
        </div>

        {formData.is_virtual ? (
          <div>
            <Label htmlFor="meeting_link">Meeting Link</Label>
            <Input
              id="meeting_link"
              type="url"
              value={formData.meeting_link}
              onChange={(e) => setFormData({...formData, meeting_link: e.target.value})}
              placeholder="https://zoom.us/j/..."
            />
          </div>
        ) : (
          <>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Venue name"
                required
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Full address"
              />
            </div>
          </>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="event_date">Date</Label>
            <Input
              id="event_date"
              type="date"
              value={formData.event_date}
              onChange={(e) => setFormData({...formData, event_date: e.target.value})}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <div>
            <Label htmlFor="max_attendees">Max Attendees</Label>
            <Input
              id="max_attendees"
              type="number"
              value={formData.max_attendees}
              onChange={(e) => setFormData({...formData, max_attendees: e.target.value})}
              placeholder="Optional"
              min="1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button 
            type="submit" 
            disabled={loading} 
            className="flex-1 gym-gradient text-white"
          >
            {loading ? 'Creating...' : 'Create Meetup'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CommunityMeetupForm;