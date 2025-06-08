
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import FeedPost from '@/components/FeedPost';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, MapPin, MessageSquare, Poll, UserPlus } from 'lucide-react';

const CommunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newPost, setNewPost] = useState('');

  const handleLogout = () => {
    navigate('/');
  };

  // Mock community data
  const community = {
    id: Number(id),
    name: 'CrossFit Warriors',
    description: 'A community for CrossFit enthusiasts of all levels. We focus on functional fitness, proper form, and supporting each other through challenging workouts.',
    image: '⚡',
    members: 97,
    category: 'CrossFit',
    isJoined: true,
    isOwner: false
  };

  const members = [
    { id: 1, name: 'Alex Rodriguez', avatar: '👨‍💼', level: 22, role: 'Owner' },
    { id: 2, name: 'Sarah Kim', avatar: '👩‍🦰', level: 18, role: 'Admin' },
    { id: 3, name: 'Mike Johnson', avatar: '👨‍🦱', level: 15, role: 'Member' },
    { id: 4, name: 'Lisa Chen', avatar: '👩‍💼', level: 20, role: 'Member' }
  ];

  const meetups = [
    {
      id: 1,
      title: 'Friday Night WOD',
      date: 'Dec 15, 2024',
      time: '7:00 PM',
      location: 'CrossFit Downtown',
      attendees: 12,
      description: 'High-intensity workout focusing on Olympic lifts and conditioning.'
    },
    {
      id: 2,
      title: 'Saturday Morning Bootcamp',
      date: 'Dec 16, 2024',
      time: '9:00 AM',
      location: 'CrossFit Downtown',
      attendees: 8,
      description: 'Beginner-friendly session with focus on fundamental movements.'
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
      user: { name: 'Alex Rodriguez', avatar: '👨‍💼', level: 22 },
      content: 'Great turnout at yesterday\'s WOD! Everyone crushed those burpees 💪',
      timestamp: '2 hours ago',
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
              <div className="w-16 h-16 bg-gradient-to-r from-planet-purple to-energy-yellow rounded-full flex items-center justify-center text-3xl">
                {community.image}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{community.name}</h1>
                <div className="flex items-center space-x-4 text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{community.members} members</span>
                  </div>
                  <Badge variant="secondary">{community.category}</Badge>
                </div>
              </div>
            </div>
            {!community.isJoined && (
              <Button className="planet-gradient text-white">
                <UserPlus className="w-4 h-4 mr-2" />
                Join Community
              </Button>
            )}
          </div>
          <p className="text-foreground">{community.description}</p>
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
            <Card className="p-4">
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-planet-purple to-energy-yellow rounded-full"></div>
                <div className="flex-1">
                  <Input
                    placeholder="Share something with the community..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="mb-3"
                  />
                  <Button className="planet-gradient text-white">Post</Button>
                </div>
              </div>
            </Card>

            {/* Feed Posts */}
            {feedPosts.map((post) => (
              <FeedPost key={post.id} post={post} />
            ))}
          </TabsContent>

          <TabsContent value="members">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member) => (
                <Card key={member.id} className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-planet-purple to-energy-yellow rounded-full flex items-center justify-center text-xl">
                      {member.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold">{member.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>Level {member.level}</span>
                        <span>•</span>
                        <Badge variant={member.role === 'Owner' ? 'default' : 'secondary'} className="text-xs">
                          {member.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="meetups">
            <div className="space-y-4">
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
                    <Button className="planet-gradient text-white">Join Meetup</Button>
                  </div>
                  <p className="text-foreground">{meetup.description}</p>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="surveys">
            <div className="space-y-4">
              {surveys.map((survey) => (
                <Card key={survey.id} className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Poll className="w-5 h-5 mr-2" />
                    {survey.title}
                  </h3>
                  <div className="space-y-3">
                    {survey.options.map((option, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span>{option}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-planet-purple rounded-full" 
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
                <MessageSquare className="w-6 h-6 text-planet-purple" />
                <h3 className="text-xl font-bold">Community Forum</h3>
              </div>
              <p className="text-muted-foreground">Forum discussions coming soon! This will be a place for community members to have longer conversations and share knowledge.</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CommunityDetail;
