
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import ProfileEditForm from '@/components/ProfileEditForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useUserStats } from '@/hooks/useUserStats';

const Profile = () => {
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { stats, loading: statsLoading } = useUserStats();
  const [isEditing, setIsEditing] = useState(false);

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

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLoggedIn={true} onLogout={handleLogout} />
      
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
              <ProfileEditForm onComplete={() => setIsEditing(false)} />
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
