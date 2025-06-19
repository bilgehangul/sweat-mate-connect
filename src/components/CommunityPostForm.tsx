import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { X, Image, Video } from 'lucide-react';
import { useCommunityPosts } from '@/hooks/useCommunityPosts';
import { useToast } from '@/hooks/use-toast';

interface CommunityPostFormProps {
  communityId: string;
  onClose?: () => void;
  onSuccess?: () => void;
}

const CommunityPostForm = ({ communityId, onClose, onSuccess }: CommunityPostFormProps) => {
  const { createPost } = useCommunityPosts(communityId);
  const { toast } = useToast();
  
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | ''>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setLoading(true);
    
    try {
      await createPost(
        content.trim(),
        mediaUrl || undefined,
        mediaType || undefined
      );
      
      toast({
        title: "Post created!",
        description: "Your post has been shared with the community.",
      });
      
      setContent('');
      setMediaUrl('');
      setMediaType('');
      
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      toast({
        title: "Error creating post",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Create Post</h3>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share something with the community..."
            rows={4}
            className="resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Media URL (optional)</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-3 py-2 border rounded-md"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setMediaType(mediaType === 'image' ? '' : 'image')}
              className={mediaType === 'image' ? 'bg-blue-100' : ''}
            >
              <Image className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setMediaType(mediaType === 'video' ? '' : 'video')}
              className={mediaType === 'video' ? 'bg-blue-100' : ''}
            >
              <Video className="w-4 h-4" />
            </Button>
          </div>
          {mediaType && (
            <p className="text-sm text-muted-foreground">
              Selected: {mediaType}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            type="submit" 
            disabled={loading || !content.trim()} 
            className="flex-1 gym-gradient text-white"
          >
            {loading ? 'Posting...' : 'Post'}
          </Button>
          {onClose && (
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default CommunityPostForm;