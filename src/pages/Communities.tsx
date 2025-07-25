
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import CommunityCreator from '@/components/CommunityCreator';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Lock, Unlock, UserPlus, UserMinus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunities } from '@/hooks/useCommunities';
import { useCommunityActions } from '@/hooks/useCommunityActions';
import { useToast } from '@/hooks/use-toast';

const Communities = () => {
  const { signOut } = useAuth();
  const { communities, loading, refetch } = useCommunities();
  const { joinCommunity, leaveCommunity, loading: actionLoading } = useCommunityActions();
  const { toast } = useToast();

  const handleCreateCommunity = () => {
    refetch();
  };

  const handleJoinCommunity = async (communityId: string) => {
    try {
      await joinCommunity(communityId);
      toast({
        title: "Joined community!",
        description: "Welcome to your new community.",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error joining community",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLeaveCommunity = async (communityId: string) => {
    try {
      await leaveCommunity(communityId);
      toast({
        title: "Left community",
        description: "You have successfully left the community.",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error leaving community",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation isLoggedIn={true} onLogout={handleLogout} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-energy-orange mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading communities...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLoggedIn={true} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-energy-orange to-electric-blue bg-clip-text text-transparent mb-4">
            Communities
          </h1>
          <p className="text-muted-foreground text-lg">
            Join fitness communities and connect with like-minded people
          </p>
        </div>

        <CommunityCreator onCreateCommunity={handleCreateCommunity} />

        {communities.length === 0 ? (
          <Card className="p-8 text-center">
            <h3 className="text-xl font-bold mb-4">No communities found</h3>
            <p className="text-muted-foreground mb-6">
              Be the first to create a community and start building your fitness network!
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <Card key={community.id} className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full flex items-center justify-center">
                      {community.avatar_url ? (
                        <img 
                          src={community.avatar_url} 
                          alt={community.name} 
                          className="w-full h-full rounded-full object-cover" 
                        />
                      ) : (
                        <Users className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{community.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="w-3 h-3 mr-1" />
                        {community.member_count} members
                      </div>
                    </div>
                  </div>
                  {community.is_private ? (
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Unlock className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>

                {community.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {community.description}
                  </p>
                )}

                <div className="text-xs text-muted-foreground mb-4">
                  Created {new Date(community.created_at).toLocaleDateString()}
                </div>

                {community.is_member ? (
                  <Button
                    variant="outline"
                    onClick={() => handleLeaveCommunity(community.id)}
                    disabled={actionLoading}
                    className="w-full hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <UserMinus className="w-4 h-4 mr-2" />
                    Leave Community
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleJoinCommunity(community.id)}
                    disabled={actionLoading}
                    className="w-full gym-gradient text-white hover:scale-105 transition-transform"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Join Community
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Communities;
