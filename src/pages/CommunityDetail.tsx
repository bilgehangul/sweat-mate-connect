import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import CommunityManagementModal from '@/components/CommunityManagementModal';
import CommunityPostForm from '@/components/CommunityPostForm';
import CommunityMeetupForm from '@/components/CommunityMeetupForm';
import CommunitySurveyForm from '@/components/CommunitySurveyForm';
import CommunityCustomizationForm from '@/components/CommunityCustomizationForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, MapPin, MessageSquare, BarChart3, UserPlus, Settings, Crown, Shield, Plus, Pin, Trash2, Video, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunityMembers } from '@/hooks/useCommunityMembers';
import { useCommunityPosts } from '@/hooks/useCommunityPosts';
import { useCommunityMeetups } from '@/hooks/useCommunityMeetups';
import { useCommunitySurveys } from '@/hooks/useCommunitySurveys';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const CommunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [community, setCommunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showManagement, setShowManagement] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showMeetupForm, setShowMeetupForm] = useState(false);
  const [showSurveyForm, setShowSurveyForm] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  
  const { members, userRole, loading: membersLoading } = useCommunityMembers(id || '');
  const { posts, loading: postsLoading, pinPost, deletePost } = useCommunityPosts(id || '');
  const { meetups, loading: meetupsLoading, joinMeetup, leaveMeetup } = useCommunityMeetups(id || '');
  const { surveys, loading: surveysLoading, respondToSurvey } = useCommunitySurveys(id || '');

  useEffect(() => {
    if (id) {
      fetchCommunity();
    }
  }, [id]);

  const fetchCommunity = async () => {
    try {
      setLoading(true);
      
      // First, fetch the community details with profiles
      const { data: communityData, error: communityError } = await supabase
        .from('communities')
        .select(`
          *,
          profiles (first_name, last_name, username, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (communityError) throw communityError;

      // Then, separately fetch the community settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('community_settings')
        .select('*')
        .eq('community_id', id);

      if (settingsError) throw settingsError;

      // Combine the results
      const combinedData = {
        ...communityData,
        community_settings: settingsData || []
      };

      setCommunity(combinedData);
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

  const handleSurveyResponse = async (surveyId: string, optionId: string) => {
    try {
      await respondToSurvey(surveyId, [optionId]);
      toast({
        title: "Response recorded",
        description: "Thank you for participating in the survey!",
      });
    } catch (error: any) {
      toast({
        title: "Error submitting response",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isOwner = community?.creator_id === user?.id;
  const canManage = userRole === 'admin' || userRole === 'moderator';
  const canPost = userRole !== null;

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

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLoggedIn={true} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Community Header */}
        <Card className="p-6 mb-8" style={{
          backgroundColor: community.community_settings?.[0]?.primary_color ? `${community.community_settings[0].primary_color}10` : undefined
        }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full flex items-center justify-center text-3xl">
                {community.community_settings?.[0]?.logo_url ? (
                  <img 
                    src={community.community_settings[0].logo_url} 
                    alt={community.name} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : community.avatar_url ? (
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
              {isOwner && (
                <Button
                  variant="outline"
                  onClick={() => setShowCustomization(true)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Customize
                </Button>
              )}
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
          
          {community.community_settings?.[0]?.welcome_message && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">Welcome Message</h3>
              <p className="text-sm">{community.community_settings[0].welcome_message}</p>
            </div>
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
            {/* Create Post Button */}
            {canPost && (
              <div className="text-center">
                <Button 
                  onClick={() => setShowPostForm(true)}
                  className="gym-gradient text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
              </div>
            )}

            {/* Posts */}
            {postsLoading ? (
              <div className="text-center py-8">Loading posts...</div>
            ) : posts.length === 0 ? (
              <Card className="p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                <p className="text-muted-foreground">Be the first to share something with the community!</p>
              </Card>
            ) : (
              posts.map((post) => {
                const displayName = post.profiles.first_name && post.profiles.last_name
                  ? `${post.profiles.first_name} ${post.profiles.last_name}`
                  : post.profiles.username || 'Unknown User';

                return (
                  <Card key={post.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full flex items-center justify-center">
                          {post.profiles.avatar_url ? (
                            <img 
                              src={post.profiles.avatar_url} 
                              alt="Avatar" 
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-semibold">
                              {displayName.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{displayName}</h4>
                            {post.is_pinned && <Pin className="w-4 h-4 text-yellow-500" />}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(post.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      {(canManage || post.author_id === user?.id) && (
                        <div className="flex space-x-2">
                          {canManage && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => pinPost(post.id, !post.is_pinned)}
                            >
                              <Pin className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deletePost(post.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-foreground mb-4">{post.content}</p>
                    
                    {post.media_url && (
                      <div className="mb-4">
                        {post.media_type === 'image' ? (
                          <img 
                            src={post.media_url} 
                            alt="Post media" 
                            className="rounded-lg max-w-full h-auto"
                          />
                        ) : post.media_type === 'video' ? (
                          <video 
                            src={post.media_url} 
                            className="rounded-lg max-w-full h-auto" 
                            controls
                          />
                        ) : null}
                      </div>
                    )}
                  </Card>
                );
              })
            )}
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
                <div className="text-center">
                  <Button 
                    onClick={() => setShowMeetupForm(true)}
                    className="gym-gradient text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Meetup
                  </Button>
                </div>
              )}
              
              {meetupsLoading ? (
                <div className="text-center py-8">Loading meetups...</div>
              ) : meetups.length === 0 ? (
                <Card className="p-8 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No meetups scheduled</h3>
                  <p className="text-muted-foreground">
                    {canManage ? "Create the first meetup for your community!" : "Check back later for upcoming events."}
                  </p>
                </Card>
              ) : (
                meetups.map((meetup) => {
                  const organizerName = meetup.profiles.first_name && meetup.profiles.last_name
                    ? `${meetup.profiles.first_name} ${meetup.profiles.last_name}`
                    : meetup.profiles.username || 'Unknown User';

                  return (
                    <Card key={meetup.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold mb-2">{meetup.title}</h3>
                          <p className="text-muted-foreground mb-3">{meetup.description}</p>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(meetup.event_date).toLocaleDateString()} at {meetup.start_time}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {meetup.is_virtual ? (
                                <>
                                  <Video className="w-4 h-4" />
                                  <span>Virtual Event</span>
                                  {meetup.meeting_link && (
                                    <a 
                                      href={meetup.meeting_link} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-500 hover:underline flex items-center gap-1"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                      Join
                                    </a>
                                  )}
                                </>
                              ) : (
                                <>
                                  <MapPin className="w-4 h-4" />
                                  <span>{meetup.location}</span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4" />
                              <span>
                                {meetup.current_attendees} attending
                                {meetup.max_attendees && ` (max ${meetup.max_attendees})`}
                              </span>
                            </div>
                            <p className="text-xs">Organized by {organizerName}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          {meetup.user_attendance ? (
                            <div className="space-y-2">
                              <Badge className="bg-green-100 text-green-800">
                                {meetup.user_attendance.status}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => leaveMeetup(meetup.id)}
                              >
                                Leave
                              </Button>
                            </div>
                          ) : (
                            <Button
                              onClick={() => joinMeetup(meetup.id)}
                              className="gym-gradient text-white"
                              disabled={meetup.max_attendees ? meetup.current_attendees >= meetup.max_attendees : false}
                            >
                              {meetup.max_attendees && meetup.current_attendees >= meetup.max_attendees 
                                ? 'Full' 
                                : 'Join'
                              }
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="surveys">
            <div className="space-y-4">
              {canManage && (
                <div className="text-center">
                  <Button 
                    onClick={() => setShowSurveyForm(true)}
                    className="gym-gradient text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Survey
                  </Button>
                </div>
              )}
              
              {surveysLoading ? (
                <div className="text-center py-8">Loading surveys...</div>
              ) : surveys.length === 0 ? (
                <Card className="p-8 text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No surveys yet</h3>
                  <p className="text-muted-foreground">
                    {canManage ? "Create a survey to get feedback from your community!" : "Check back later for community polls."}
                  </p>
                </Card>
              ) : (
                surveys.map((survey) => {
                  const creatorName = survey.profiles.first_name && survey.profiles.last_name
                    ? `${survey.profiles.first_name} ${survey.profiles.last_name}`
                    : survey.profiles.username || 'Unknown User';

                  const hasResponded = survey.user_responses && survey.user_responses.length > 0;

                  return (
                    <Card key={survey.id} className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold mb-2 flex items-center">
                          <BarChart3 className="w-5 h-5 mr-2" />
                          {survey.title}
                        </h3>
                        {survey.description && (
                          <p className="text-muted-foreground mb-3">{survey.description}</p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          By {creatorName} • {survey.total_responses} responses
                          {survey.expires_at && (
                            <span> • Expires {new Date(survey.expires_at).toLocaleDateString()}</span>
                          )}
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        {survey.survey_options.map((option) => {
                          const percentage = survey.total_responses > 0 
                            ? (option.vote_count / survey.total_responses) * 100 
                            : 0;

                          return (
                            <div key={option.id} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">{option.option_text}</span>
                                <span className="text-sm text-muted-foreground">
                                  {option.vote_count} ({percentage.toFixed(1)}%)
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-energy-orange to-electric-blue h-2 rounded-full transition-all duration-300" 
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              {!hasResponded && survey.is_active && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSurveyResponse(survey.id, option.id)}
                                  className="w-full mt-2"
                                >
                                  Vote for this option
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      
                      {hasResponded && (
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-700">✓ You have already responded to this survey</p>
                        </div>
                      )}
                    </Card>
                  );
                })
              )}
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

      {/* Modals */}
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

      {showPostForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <CommunityPostForm
            communityId={id!}
            onClose={() => setShowPostForm(false)}
            onSuccess={() => setShowPostForm(false)}
          />
        </div>
      )}

      {showMeetupForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <CommunityMeetupForm
            communityId={id!}
            onClose={() => setShowMeetupForm(false)}
            onSuccess={() => setShowMeetupForm(false)}
          />
        </div>
      )}

      {showSurveyForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <CommunitySurveyForm
            communityId={id!}
            onClose={() => setShowSurveyForm(false)}
            onSuccess={() => setShowSurveyForm(false)}
          />
        </div>
      )}

      {showCustomization && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <CommunityCustomizationForm
            communityId={id!}
            onClose={() => setShowCustomization(false)}
            onSuccess={() => {
              setShowCustomization(false);
              fetchCommunity();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CommunityDetail;