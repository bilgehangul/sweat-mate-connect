import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Users, Trophy, Plus, Edit } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import ProfileEditForm from '@/components/ProfileEditForm';
import SessionCreator from '@/components/SessionCreator';
import GymBuddiesList from '@/components/GymBuddiesList';
import UserStats from '@/components/UserStats';

const Profile = () => {
  const { user } = useAuth();
  const { profile, loading } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [showSessionCreator, setShowSessionCreator] = useState(false);

  const handleSessionCreated = (sessionData: any) => {
    console.log('Session created:', sessionData);
    setShowSessionCreator(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile not found</h1>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Picture and Basic Info */}
              <div className="flex flex-col items-center md:items-start">
                <div className="w-32 h-32 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full flex items-center justify-center mb-4">
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-white">
                      {profile.first_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-center md:text-left">
                  {profile.first_name && profile.last_name 
                    ? `${profile.first_name} ${profile.last_name}`
                    : profile.username || user?.email?.split('@')[0] || 'Anonymous User'
                  }
                </h1>
                {profile.username && (
                  <p className="text-lg text-muted-foreground">@{profile.username}</p>
                )}
              </div>

              {/* Profile Details */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.age && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{profile.age} years old</span>
                    </div>
                  )}
                  {profile.favorite_gym && (
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-muted-foreground" />
                      <span>{profile.favorite_gym}</span>
                    </div>
                  )}
                  {profile.experience_level && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="capitalize">{profile.experience_level}</span>
                    </div>
                  )}
                </div>

                {profile.bio && (
                  <div>
                    <h3 className="font-semibold mb-2">About</h3>
                    <p className="text-muted-foreground">{profile.bio}</p>
                  </div>
                )}

                {profile.workout_goals && profile.workout_goals.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Workout Goals</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.workout_goals.map((goal, index) => (
                        <Badge key={index} variant="secondary">{goal}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {profile.workout_preferences && profile.workout_preferences.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Workout Preferences</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.workout_preferences.map((pref, index) => (
                        <Badge key={index} variant="outline">{pref}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button onClick={() => setIsEditing(true)} variant="outline" className="flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </Button>
                  <Button onClick={() => setShowSessionCreator(true)} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create Session
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stats">Stats & Activity</TabsTrigger>
            <TabsTrigger value="buddies">Gym Buddies</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stats" className="space-y-6">
            <UserStats />
          </TabsContent>
          
          <TabsContent value="buddies" className="space-y-6">
            <GymBuddiesList />
          </TabsContent>
        </Tabs>

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <ProfileEditForm onClose={() => setIsEditing(false)} />
            </div>
          </div>
        )}

        {/* Session Creator Modal */}
        {showSessionCreator && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Create Workout Session</h2>
                  <Button variant="ghost" onClick={() => setShowSessionCreator(false)}>×</Button>
                </div>
                <SessionCreator onCreateSession={handleSessionCreated} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
