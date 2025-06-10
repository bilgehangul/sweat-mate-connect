import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import SessionCreator from '@/components/SessionCreator';
import FeedPost from '@/components/FeedPost';
import ProfileEditForm from '@/components/ProfileEditForm';
import CreatePostForm from '@/components/CreatePostForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Target, Trophy, Edit, Settings, Plus, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { usePosts } from '@/hooks/usePosts';

const Profile = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { posts, loading: postsLoading } = usePosts();
  const [showSessionCreator, setShowSessionCreator] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleCreateSession = (sessionData: any) => {
    console.log('Creating session:', sessionData);
    setShowSessionCreator(false);
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-energy-orange"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation isLoggedIn={true} onLogout={handleLogout} />
        <div className="container mx-auto px-4 py-8">
          <Card className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Profile not found</h2>
            <p className="text-muted-foreground">Unable to load your profile. Please try again.</p>
          </Card>
        </div>
      </div>
    );
  }

  const displayName = profile.first_name && profile.last_name 
    ? `${profile.first_name} ${profile.last_name}` 
    : profile.username || 'Unknown User';

  // Filter posts by current user
  const userPosts = posts.filter(post => post.author_id === profile.id);

  return (
    <div className="min-h-screen bg-background relative">
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

      {/* Profile Edit Modal */}
      {showProfileEdit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <ProfileEditForm onClose={() => setShowProfileEdit(false)} />
        </div>
      )}

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <CreatePostForm onClose={() => setShowCreatePost(false)} />
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Profile Card */}
            <Card className="p-6 text-center">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-planet-purple to-energy-yellow rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    '👤'
                  )}
                </div>
                <Button size="sm" variant="outline" className="absolute top-0 right-0" onClick={() => setShowProfileEdit(true)}>
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              
              <h1 className="text-2xl font-bold mb-2">{displayName}</h1>
              <p className="text-muted-foreground mb-4">
                {profile.age && `${profile.age} years old`} {profile.gender && `• ${profile.gender}`}
              </p>
              
              {/* Level & XP - Static for now */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-energy-yellow">Level 1</span>
                  <span className="text-sm text-muted-foreground">0/100 XP</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>

              {profile.bio && <p className="text-sm text-foreground mb-4">{profile.bio}</p>}
              
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Joined {new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </div>
                {profile.location && (
                  <div className="flex items-center justify-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {profile.location}
                  </div>
                )}
              </div>
            </Card>

            {/* Stats Card - Static for now */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 text-center bg-gradient-to-r from-planet-purple to-energy-yellow bg-clip-text text-transparent">
                Fitness Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Workouts</span>
                  <span className="font-bold text-planet-purple">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hours Exercised</span>
                  <span className="font-bold text-planet-purple">0h 0m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gym Buddies</span>
                  <span className="font-bold text-planet-purple">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Communities</span>
                  <span className="font-bold text-planet-purple">0</span>
                </div>
              </div>
            </Card>

            {/* Create Session Button */}
            <Button 
              onClick={() => setShowSessionCreator(true)}
              className="w-full planet-gradient text-white hover:scale-105 transition-transform"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Session
            </Button>
          </div>

          {/* Right Column - Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="feed">My Feed</TabsTrigger>
                <TabsTrigger value="workouts">Workouts</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Preferences & Goals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-planet-purple" />
                      Workout Goals
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.workout_goals && profile.workout_goals.length > 0 ? (
                        profile.workout_goals.map((goal, index) => (
                          <Badge key={index} variant="secondary" className="bg-planet-purple/10 text-planet-purple">
                            {goal}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">No workout goals set</p>
                      )}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-energy-yellow" />
                      Preferences
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm"><strong>Experience:</strong> {profile.experience_level || 'Not set'}</p>
                      {profile.favorite_gym && (
                        <p className="text-sm"><strong>Favorite Gym:</strong> {profile.favorite_gym}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profile.workout_preferences && profile.workout_preferences.length > 0 ? (
                          profile.workout_preferences.map((pref, index) => (
                            <Badge key={index} variant="outline" className="border-energy-yellow text-energy-yellow">
                              {pref}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-sm">No preferences set</p>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button className="flex-1 planet-gradient text-white hover:scale-105 transition-transform" onClick={() => setShowProfileEdit(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="feed" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">My Posts</h3>
                  <Button onClick={() => setShowCreatePost(true)} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Post
                  </Button>
                </div>
                
                {postsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-energy-orange mx-auto"></div>
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
                  <Card className="p-6 text-center">
                    <p className="text-muted-foreground mb-4">No posts yet. Share your fitness journey!</p>
                    <Button onClick={() => setShowCreatePost(true)}>Create Your First Post</Button>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="workouts" className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-4">Recent Workouts</h3>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No workout sessions yet. Create your first session!</p>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
