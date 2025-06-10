
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { X, Image, Video } from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';
import { useToast } from '@/hooks/use-toast';

interface CreatePostFormProps {
  onClose: () => void;
}

const CreatePostForm = ({ onClose }: CreatePostFormProps) => {
  const { createPost } = usePosts();
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
        title: "Post created successfully!",
        description: "Your post has been shared with the community.",
      });
      
      onClose();
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
    <Card className="p-6 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Create Post</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind? Share your fitness journey..."
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
          <Button type="submit" disabled={loading || !content.trim()} className="flex-1">
            {loading ? 'Posting...' : 'Post'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreatePostForm;
