import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import FeedPost from '@/components/FeedPost';
import CommunityManagementModal from '@/components/CommunityManagementModal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, MapPin, MessageSquare, BarChart3, UserPlus, Settings, Crown, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunityMembers } from '@/hooks/useCommunityMembers';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const CommunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [community, setCommunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [showManagement, setShowManagement] = useState(false);
  const { members, userRole, loading: membersLoading } = useCommunityMembers(id || '');

  useEffect(() => {
    if (id) {
      fetchCommunity();
    }
  }, [id]);

  const fetchCommunity = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('communities')
        .select(`
          *,
          profiles (first_name, last_name, username, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setCommunity(data);
    } catch (err: any) {
      console.error('Error fetching community:', err);
      toast({
        title: "Error loading community",
        description: "Could not load community details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    try {
      // TODO: Implement community posts functionality
      console.log('Creating post:', newPost);
      setNewPost('');
      toast({
        title: "Post created!",
        description: "Your post has been shared with the community.",
      });
    } catch (error: any) {
      toast({
        title: "Error creating post",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isOwner = community?.creator_id === user?.id;
  const canManage = userRole === 'admin' || userRole === 'moderator';

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation isLoggedIn={true} onLogout={handleLogout} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-energy-orange mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading community...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation isLoggedIn={true} onLogout={handleLogout} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Community not found</h1>
            <Button onClick={() => navigate('/communities')}>
              Back to Communities
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'moderator':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-yellow-100 text-yellow-800';
      case 'moderator':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Mock data for demonstration
  const meetups = [
    {
      id: 1,
      title: 'Friday Night WOD',
      date: 'Dec 15, 2024',
      time: '7:00 PM',
      location: 'CrossFit Downtown',
      attendees: 12,
      description: 'High-intensity workout focusing on Olympic lifts and conditioning.'
    }
  ];

  const surveys = [
    {
      id: 1,
      title: 'What time works best for weekend workouts?',
      options: ['8:00 AM', '10:00 AM', '2:00 PM', '6:00 PM'],
      votes: [15, 23, 8, 12],
      totalVotes: 58
    }
  ];

  const feedPosts = [
    {
      id: 1,
      user: community.profiles?.first_name && community.profiles?.last_name 
        ? `${community.profiles.first_name} ${community.profiles.last_name}`
        : community.profiles?.username || 'Community Owner',
      avatar: community.profiles?.avatar_url || '👨‍💼',
      time: '2 hours ago',
      content: 'Welcome to our community! Looking forward to connecting with everyone.',
      likes: 15,
      comments: 6
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLoggedIn={true} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Community Header */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full flex items-center justify-center text-3xl">
                {community.avatar_url ? (
                  <img 
                    src={community.avatar_url} 
                    alt={community.name} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <Users className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{community.name}</h1>
                  {isOwner && <Crown className="w-6 h-6 text-yellow-500" />}
                </div>
                <div className="flex items-center space-x-4 text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{community.member_count} members</span>
                  </div>
                  <Badge variant={community.is_private ? "secondary" : "outline"}>
                    {community.is_private ? "Private" : "Public"}
                  </Badge>
                  {userRole && (
                    <Badge className={`${getRoleBadgeColor(userRole)} flex items-center gap-1`}>
                      {getRoleIcon(userRole)}
                      {userRole}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {canManage && (
                <Button
                  variant="outline"
                  onClick={() => setShowManagement(true)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Manage
                </Button>
              )}
              {!userRole && (
                <Button className="gym-gradient text-white">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join Community
                </Button>
              )}
            </div>
          </div>
          
          {community.description && (
            <p className="text-foreground">{community.description}</p>
          )}
        </Card>

        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="meetups">Meetups</TabsTrigger>
            <TabsTrigger value="surveys">Surveys</TabsTrigger>
            <TabsTrigger value="forum">Forum</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            {/* Create Post */}
            {userRole && (
              <Card className="p-4">
                <div className="flex space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full"></div>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Share something with the community..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="mb-3"
                      rows={3}
                    />
                    <Button 
                      onClick={handleCreatePost}
                      disabled={!newPost.trim()}
                      className="gym-gradient text-white"
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Feed Posts */}
            {feedPosts.map((post) => (
              <FeedPost key={post.id} post={post} />
            ))}
          </TabsContent>

          <TabsContent value="members">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {membersLoading ? (
                <div className="col-span-full text-center py-8">Loading members...</div>
              ) : (
                members.map((member) => {
                  const displayName = member.profiles.first_name && member.profiles.last_name
                    ? `${member.profiles.first_name} ${member.profiles.last_name}`
                    : member.profiles.username || 'Unknown User';

                  return (
                    <Card key={member.id} className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full flex items-center justify-center text-xl">
                          {member.profiles.avatar_url ? (
                            <img 
                              src={member.profiles.avatar_url} 
                              alt="Avatar" 
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            displayName.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold">{displayName}</h3>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>{member.profiles.experience_level || 'Beginner'}</span>
                            <span>•</span>
                            <Badge className={`${getRoleBadgeColor(member.role)} text-xs flex items-center gap-1`}>
                              {getRoleIcon(member.role)}
                              {member.role}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="meetups">
            <div className="space-y-4">
              {canManage && (
                <Card className="p-4 border-dashed border-2">
                  <div className="text-center">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <h3 className="font-semibold mb-2">Create a Meetup</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Organize in-person events for your community members
                    </p>
                    <Button className="gym-gradient text-white">
                      Create Meetup
                    </Button>
                  </div>
                </Card>
              )}
              
              {meetups.map((meetup) => (
                <Card key={meetup.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{meetup.title}</h3>
                      <div className="space-y-1 text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{meetup.date} at {meetup.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{meetup.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{meetup.attendees} attending</span>
                        </div>
                      </div>
                    </div>
                    <Button className="gym-gradient text-white">Join Meetup</Button>
                  </div>
                  <p className="text-foreground">{meetup.description}</p>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="surveys">
            <div className="space-y-4">
              {canManage && (
                <Card className="p-4 border-dashed border-2">
                  <div className="text-center">
                    <BarChart3 className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <h3 className="font-semibold mb-2">Create a Survey</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Get feedback and opinions from your community
                    </p>
                    <Button className="gym-gradient text-white">
                      Create Survey
                    </Button>
                  </div>
                </Card>
              )}
              
              {surveys.map((survey) => (
                <Card key={survey.id} className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    {survey.title}
                  </h3>
                  <div className="space-y-3">
                    {survey.options.map((option, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span>{option}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full" 
                              style={{ width: `${(survey.votes[index] / survey.totalVotes) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{survey.votes[index]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">{survey.totalVotes} total votes</p>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="forum">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <MessageSquare className="w-6 h-6 text-energy-orange" />
                <h3 className="text-xl font-bold">Community Forum</h3>
              </div>
              <p className="text-muted-foreground">
                Forum discussions coming soon! This will be a place for community members to have longer conversations and share knowledge.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Community Management Modal */}
      {community && (
        <CommunityManagementModal
          community={community}
          isOpen={showManagement}
          onClose={() => setShowManagement(false)}
          onUpdate={() => {
            fetchCommunity();
            setShowManagement(false);
          }}
        />
      )}
    </div>
  );
};

export default CommunityDetail;