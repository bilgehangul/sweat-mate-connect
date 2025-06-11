
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import ProfileEditForm from '@/components/ProfileEditForm';
import SessionCreator from '@/components/SessionCreator';
import CreatePostForm from '@/components/CreatePostForm';
import FeedPost from '@/components/FeedPost';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, LogOut, Plus, X, Calendar, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useUserStats } from '@/hooks/useUserStats';
import { usePosts } from '@/hooks/usePosts';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { stats, loading: statsLoading } = useUserStats();
  const { posts, loading: postsLoading } = usePosts();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showSessionCreator, setShowSessionCreator] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handleCreateSession = (sessionData: any) => {
    console.log('Creating session:', sessionData);
    setShowSessionCreator(false);
    toast({
      title: "Session created successfully!",
      description: "Your workout session has been created."
    });
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (profileLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation isLoggedIn={true} onLogout={handleLogout} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  const displayName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}`
    : profile?.username || 'User';

  const userPosts = posts.filter(post => post.author_id === user?.id);

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLoggedIn={true} onLogout={handleLogout} />

      {/* Session Creator Modal */}
      {showSessionCreator && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-planet-purple to-energy-yellow bg-clip-text text-transparent">
                  Create Your Workout Session
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSessionCreator(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <SessionCreator onCreateSession={handleCreateSession} />
            </div>
          </div>
        </div>
      )}

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <CreatePostForm onClose={() => setShowCreatePost(false)} />
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-energy-orange to-electric-blue flex items-center justify-center text-white text-2xl font-bold">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    displayName.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{displayName}</h1>
                  <p className="text-muted-foreground">@{profile?.username || 'username'}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                      Level {stats?.level || 1}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {stats?.xp || 0} XP
                    </span>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
              </Button>
            </div>

            {profile?.bio && (
              <div className="mt-4">
                <p className="text-muted-foreground">{profile.bio}</p>
              </div>
            )}
          </Card>

          {/* Edit Form */}
          {isEditing && (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
              <ProfileEditForm onClose={() => setIsEditing(false)} />
            </Card>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-energy-orange">
                {stats?.workouts_completed || 0}
              </div>
              <div className="text-muted-foreground">Workouts Completed</div>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-electric-blue">
                {Math.floor((stats?.total_exercise_hours || 0) / 60)}h {(stats?.total_exercise_hours || 0) % 60}m
              </div>
              <div className="text-muted-foreground">Total Exercise Time</div>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-neon-green">
                {stats?.ranking || 0}/5
              </div>
              <div className="text-muted-foreground">Fitness Ranking</div>
            </Card>
          </div>

          {/* Tabs Section */}
          <Card className="p-6">
            <Tabs defaultValue="workouts" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="workouts">Workout History</TabsTrigger>
                <TabsTrigger value="posts">My Posts</TabsTrigger>
              </TabsList>
              
              <TabsContent value="workouts" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Your Workout Sessions</h3>
                  <Button onClick={() => setShowSessionCreator(true)} className="gym-gradient text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Session
                  </Button>
                </div>
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No workout sessions yet. Create your first session to get started!</p>
                </div>
              </TabsContent>
              
              <TabsContent value="posts" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Your Posts</h3>
                  <Button onClick={() => setShowCreatePost(true)} className="gym-gradient text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Post
                  </Button>
                </div>
                <div className="space-y-4">
                  {postsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-energy-orange mx-auto"></div>
                      <p className="text-muted-foreground mt-2">Loading posts...</p>
                    </div>
                  ) : userPosts.length > 0 ? (
                    userPosts.map((post) => (
                      <FeedPost 
                        key={post.id} 
                        post={{
                          id: parseInt(post.id),
                          user: `${post.profiles.first_name || ''} ${post.profiles.last_name || ''}`.trim() || post.profiles.username || 'Unknown User',
                          avatar: post.profiles.avatar_url || '👤',
                          time: new Date(post.created_at).toLocaleDateString(),
                          content: post.content,
                          likes: post.post_likes.length,
                          comments: post.post_comments.length,
                          ...(post.media_url && { media: { type: post.media_type as 'image' | 'video', url: post.media_url } })
                        }} 
                      />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No posts yet. Share your fitness journey with your first post!</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Profile Details */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Profile Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Personal Info</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="text-muted-foreground">Age:</span> {profile?.age || 'Not specified'}</div>
                  <div><span className="text-muted-foreground">Gender:</span> {profile?.gender || 'Not specified'}</div>
                  <div><span className="text-muted-foreground">Location:</span> {profile?.location || 'Not specified'}</div>
                  <div><span className="text-muted-foreground">Experience:</span> {profile?.experience_level || 'Beginner'}</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Fitness Info</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="text-muted-foreground">Favorite Gym:</span> {profile?.favorite_gym || 'Not specified'}</div>
                  <div>
                    <span className="text-muted-foreground">Workout Goals:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profile?.workout_goals?.map((goal, index) => (
                        <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                          {goal}
                        </span>
                      )) || 'Not specified'}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Workout Preferences:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profile?.workout_preferences?.map((pref, index) => (
                        <span key={index} className="bg-secondary/50 text-secondary-foreground px-2 py-1 rounded text-xs">
                          {pref}
                        </span>
                      )) || 'Not specified'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Logout Button */}
          <div className="text-center">
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              className="flex items-center space-x-2 mx-auto"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
