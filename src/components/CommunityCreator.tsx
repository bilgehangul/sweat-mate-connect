
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus } from 'lucide-react';
import { useCommunityActions } from '@/hooks/useCommunityActions';
import { useToast } from '@/hooks/use-toast';

interface CommunityCreatorProps {
  onCreateCommunity: () => void;
}

const CommunityCreator = ({ onCreateCommunity }: CommunityCreatorProps) => {
  const { createCommunity, loading } = useCommunityActions();
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_private: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createCommunity(formData);
      
      toast({
        title: "Community created successfully!",
        description: "Your community is now live and others can join.",
      });

      onCreateCommunity();
      setIsExpanded(false);
      setFormData({
        name: '',
        description: '',
        is_private: false
      });
    } catch (error: any) {
      toast({
        title: "Error creating community",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
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
          <Plus className="w-5 h-5 mr-2" />
          CREATE COMMUNITY
        </Button>
      </div>
    );
  }

  return (
    <Card className="p-6 mb-8 border-2 border-primary/20">
      <h3 className="text-xl font-bold mb-4 text-center bg-gradient-to-r from-energy-orange to-electric-blue bg-clip-text text-transparent">
        Create Your Community
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Community Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="e.g., Morning Runners Club"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Tell others what this community is about..."
            rows={3}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="is_private"
            checked={formData.is_private}
            onCheckedChange={(checked) => setFormData({...formData, is_private: checked})}
          />
          <Label htmlFor="is_private">Private Community</Label>
        </div>
        
        <div className="flex space-x-3 pt-4">
          <Button 
            type="submit" 
            disabled={loading}
            className="flex-1 gym-gradient text-white hover:scale-105 transition-transform"
          >
            {loading ? 'Creating...' : 'Create Community'}
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

export default CommunityCreator;
