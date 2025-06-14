
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import ProfileEditForm from '@/components/ProfileEditForm';
import CreatePostForm from '@/components/CreatePostForm';
import SessionCreator from '@/components/SessionCreator';
import FeedPost from '@/components/FeedPost';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Edit2, Plus, Calendar, Target, Dumbbell, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { usePosts } from '@/hooks/usePosts';
import { useWorkoutSessions } from '@/hooks/useWorkoutSessions';

const Profile = () => {
  const { signOut } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { posts, loading: postsLoading } = usePosts();
  const { sessions, loading: sessionsLoading } = useWorkoutSessions();
  const [showEditForm, setShowEditForm] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateSession, setShowCreateSession] = useState(false);

  const handleLogout = async () => {
    await signOut();
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation isLoggedIn={true} onLogout={handleLogout} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-energy-orange mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  const userPosts = posts.filter(post => post.author_id === profile?.id);
  const userSessions = sessions.filter(session => session.creator_id === profile?.id);

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLoggedIn={true} onLogout={handleLogout} />
      
      {/* Edit Profile Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <ProfileEditForm onClose={() => setShowEditForm(false)} />
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

      {/* Create Session Modal */}
      {showCreateSession && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <SessionCreator onClose={() => setShowCreateSession(false)} />
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header with User Info and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Information */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover" 
                    />
                  ) : (
                    `${profile?.first_name?.[0] || ''}${profile?.last_name?.[0] || ''}`
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    {profile?.first_name && profile?.last_name 
                      ? `${profile.first_name} ${profile.last_name}`
                      : profile?.username || 'User'
                    }
                  </h1>
                  {profile?.username && (
                    <p className="text-muted-foreground">@{profile.username}</p>
                  )}
                  {profile?.location && (
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {profile.location}
                    </div>
                  )}
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowEditForm(true)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            {profile?.bio && (
              <p className="text-muted-foreground mb-4">{profile.bio}</p>
            )}

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-energy-orange">{userPosts.length}</div>
                <div className="text-sm text-muted-foreground">Posts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-electric-blue">{userSessions.length}</div>
                <div className="text-sm text-muted-foreground">Sessions</div>
              </div>
            </div>
          </Card>

          {/* Profile Details */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Profile Details</h3>
            <div className="space-y-4">
              {profile?.age && (
                <div>
                  <span className="text-sm text-muted-foreground">Age:</span>
                  <span className="ml-2">{profile.age}</span>
                </div>
              )}

              {profile?.gender && (
                <div>
                  <span className="text-sm text-muted-foreground">Gender:</span>
                  <span className="ml-2 capitalize">{profile.gender}</span>
                </div>
              )}

              {profile?.experience_level && (
                <div>
                  <span className="text-sm text-muted-foreground">Experience Level:</span>
                  <Badge variant="secondary" className="ml-2 capitalize">
                    {profile.experience_level}
                  </Badge>
                </div>
              )}

              {profile?.favorite_gym && (
                <div>
                  <span className="text-sm text-muted-foreground">Favorite Gym:</span>
                  <span className="ml-2">{profile.favorite_gym}</span>
                </div>
              )}

              {profile?.workout_goals && profile.workout_goals.length > 0 && (
                <div>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Target className="w-4 h-4 mr-1" />
                    Workout Goals:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.workout_goals.map((goal, index) => (
                      <Badge key={index} variant="outline">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile?.workout_preferences && profile.workout_preferences.length > 0 && (
                <div>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Dumbbell className="w-4 h-4 mr-1" />
                    Workout Preferences:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.workout_preferences.map((pref, index) => (
                      <Badge key={index} variant="outline">
                        {pref}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts">My Posts</TabsTrigger>
            <TabsTrigger value="history">Workout History</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">My Posts</h2>
              <Button 
                onClick={() => setShowCreatePost(true)}
                className="gym-gradient text-white hover:scale-105 transition-transform"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            </div>
            
            <div className="space-y-6">
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
                      user: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || profile?.username || 'You',
                      avatar: profile?.avatar_url || '👤',
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
                  <h3 className="text-lg font-bold mb-2">No posts yet</h3>
                  <p className="text-muted-foreground mb-4">Share your fitness journey with your first post!</p>
                  <Button onClick={() => setShowCreatePost(true)} className="gym-gradient text-white">
                    Create Your First Post
                  </Button>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Workout History</h2>
              <Button 
                onClick={() => setShowCreateSession(true)}
                className="gym-gradient text-white hover:scale-105 transition-transform"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Session
              </Button>
            </div>
            
            <div className="space-y-4">
              {sessionsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-energy-orange mx-auto"></div>
                  <p className="text-muted-foreground mt-2">Loading sessions...</p>
                </div>
              ) : userSessions.length > 0 ? (
                userSessions.map((session) => (
                  <Card key={session.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{session.title}</h4>
                        <p className="text-muted-foreground text-sm mb-2">{session.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(session.scheduled_date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {session.gym_location}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="mb-2">
                          {session.workout_type}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {session.start_time} - {session.end_time}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {session.current_participants}/{session.max_participants} participants
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-6 text-center">
                  <h3 className="text-lg font-bold mb-2">No workout sessions yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first workout session and start connecting with gym buddies!</p>
                  <Button onClick={() => setShowCreateSession(true)} className="gym-gradient text-white">
                    Create Your First Session
                  </Button>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
