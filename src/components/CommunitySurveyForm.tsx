import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { X, Plus, Trash2 } from 'lucide-react';
import { useCommunitySurveys } from '@/hooks/useCommunitySurveys';
import { useToast } from '@/hooks/use-toast';

interface CommunitySurveyFormProps {
  communityId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const CommunitySurveyForm = ({ communityId, onClose, onSuccess }: CommunitySurveyFormProps) => {
  const { createSurvey } = useCommunitySurveys(communityId);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    is_multiple_choice: true,
    allows_multiple_answers: false,
    is_anonymous: false,
    expires_at: ''
  });
  const [options, setOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      toast({
        title: "Invalid options",
        description: "Please provide at least 2 options.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      await createSurvey({
        title: formData.title,
        description: formData.description || undefined,
        options: validOptions,
        is_multiple_choice: formData.is_multiple_choice,
        allows_multiple_answers: formData.allows_multiple_answers,
        is_anonymous: formData.is_anonymous,
        expires_at: formData.expires_at || undefined
      });
      
      toast({
        title: "Survey created!",
        description: "Your survey is now live.",
      });
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error creating survey",
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
        <h2 className="text-xl font-bold">Create Survey</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Survey Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="What's your question?"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Provide more context..."
            rows={2}
          />
        </div>

        <div>
          <Label>Options</Label>
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  required
                />
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeOption(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addOption}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Option
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Switch
              id="allows_multiple_answers"
              checked={formData.allows_multiple_answers}
              onCheckedChange={(checked) => setFormData({...formData, allows_multiple_answers: checked})}
            />
            <Label htmlFor="allows_multiple_answers">Allow multiple answers</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_anonymous"
              checked={formData.is_anonymous}
              onCheckedChange={(checked) => setFormData({...formData, is_anonymous: checked})}
            />
            <Label htmlFor="is_anonymous">Anonymous responses</Label>
          </div>
        </div>

        <div>
          <Label htmlFor="expires_at">Expiration Date (optional)</Label>
          <Input
            id="expires_at"
            type="datetime-local"
            value={formData.expires_at}
            onChange={(e) => setFormData({...formData, expires_at: e.target.value})}
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button 
            type="submit" 
            disabled={loading} 
            className="flex-1 gym-gradient text-white"
          >
            {loading ? 'Creating...' : 'Create Survey'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CommunitySurveyForm;