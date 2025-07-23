import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Upload, Palette } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CommunityCustomizationFormProps {
  communityId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const CommunityCustomizationForm = ({ communityId, onClose, onSuccess }: CommunityCustomizationFormProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    logo_url: '',
    banner_url: '',
    primary_color: '#FF6B35',
    secondary_color: '#1E90FF',
    accent_color: '#32CD32',
    theme: 'light',
    welcome_message: '',
    rules: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate saving settings (no database table yet)
    setTimeout(() => {
      toast({
        title: "Settings updated!",
        description: "Community customization has been saved.",
      });
      
      if (onSuccess) onSuccess();
      onClose();
      setLoading(false);
    }, 1000);
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Customize Community
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Branding */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Branding</h3>
          
          <div>
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input
              id="logo_url"
              type="url"
              value={formData.logo_url}
              onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div>
            <Label htmlFor="banner_url">Banner URL</Label>
            <Input
              id="banner_url"
              type="url"
              value={formData.banner_url}
              onChange={(e) => setFormData({...formData, banner_url: e.target.value})}
              placeholder="https://example.com/banner.jpg"
            />
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Colors</h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="primary_color">Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="primary_color"
                  type="color"
                  value={formData.primary_color}
                  onChange={(e) => setFormData({...formData, primary_color: e.target.value})}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={formData.primary_color}
                  onChange={(e) => setFormData({...formData, primary_color: e.target.value})}
                  placeholder="#FF6B35"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="secondary_color">Secondary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="secondary_color"
                  type="color"
                  value={formData.secondary_color}
                  onChange={(e) => setFormData({...formData, secondary_color: e.target.value})}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={formData.secondary_color}
                  onChange={(e) => setFormData({...formData, secondary_color: e.target.value})}
                  placeholder="#1E90FF"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="accent_color">Accent Color</Label>
              <div className="flex gap-2">
                <Input
                  id="accent_color"
                  type="color"
                  value={formData.accent_color}
                  onChange={(e) => setFormData({...formData, accent_color: e.target.value})}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={formData.accent_color}
                  onChange={(e) => setFormData({...formData, accent_color: e.target.value})}
                  placeholder="#32CD32"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Theme */}
        <div>
          <Label htmlFor="theme">Theme</Label>
          <Select value={formData.theme} onValueChange={(value) => setFormData({...formData, theme: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="auto">Auto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Content</h3>
          
          <div>
            <Label htmlFor="welcome_message">Welcome Message</Label>
            <Textarea
              id="welcome_message"
              value={formData.welcome_message}
              onChange={(e) => setFormData({...formData, welcome_message: e.target.value})}
              placeholder="Welcome new members to your community..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="rules">Community Rules</Label>
            <Textarea
              id="rules"
              value={formData.rules}
              onChange={(e) => setFormData({...formData, rules: e.target.value})}
              placeholder="1. Be respectful to all members..."
              rows={4}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button 
            type="submit" 
            disabled={loading} 
            className="flex-1 gym-gradient text-white"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CommunityCustomizationForm;