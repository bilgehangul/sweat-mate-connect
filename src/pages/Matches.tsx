
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, X, MessageSquare, MapPin, Clock, Dumbbell } from 'lucide-react';
import { useMatches } from '@/hooks/useMatches';
import { useAuth } from '@/contexts/AuthContext';

const Matches = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { matches, loading, updateMatchStatus } = useMatches();

  const handleAccept = async (matchId: string) => {
    try {
      await updateMatchStatus(matchId, 'accepted');
      console.log('Accepted match:', matchId);
    } catch (error) {
      console.error('Error accepting match:', error);
    }
  };

  const handleDeny = async (matchId: string) => {
    try {
      await updateMatchStatus(matchId, 'rejected');
      console.log('Denied match:', matchId);
    } catch (error) {
      console.error('Error denying match:', error);
    }
  };

  const handleChat = (matchId: string) => {
    console.log('Start chat with:', matchId);
    // TODO: Implement real chat functionality
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation isLoggedIn={true} onLogout={handleLogout} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-energy-orange mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading your matches...</p>
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
            Your Matches
          </h1>
          <p className="text-muted-foreground text-lg">
            Connect with your perfect workout partners
          </p>
        </div>

        {matches.length === 0 ? (
          <Card className="p-8 text-center">
            <h3 className="text-xl font-bold mb-4">No matches yet</h3>
            <p className="text-muted-foreground mb-6">
              Create a workout session to start finding matches with other gym enthusiasts!
            </p>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="gym-gradient text-white"
            >
              Create Your First Session
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => {
              const displayName = match.matched_user.first_name && match.matched_user.last_name
                ? `${match.matched_user.first_name} ${match.matched_user.last_name}`
                : match.matched_user.username || 'Unknown User';

              const matchPercentage = Math.round((match.match_score || 0.8) * 100);

              return (
                <Card key={match.id} className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
                      {match.matched_user.avatar_url ? (
                        <img 
                          src={match.matched_user.avatar_url} 
                          alt="Avatar" 
                          className="w-full h-full rounded-full object-cover" 
                        />
                      ) : (
                        '👤'
                      )}
                    </div>
                    <h3 className="text-xl font-bold">{displayName}</h3>
                    {match.matched_user.age && (
                      <p className="text-muted-foreground">Age {match.matched_user.age}</p>
                    )}
                    <div className="mt-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        matchPercentage >= 90 ? 'bg-neon-green/20 text-neon-green' :
                        matchPercentage >= 80 ? 'bg-energy-orange/20 text-energy-orange' :
                        'bg-electric-blue/20 text-electric-blue'
                      }`}>
                        {matchPercentage}% Match
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    {match.session && (
                      <>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-2" />
                          {match.session.gym_location}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Dumbbell className="w-4 h-4 mr-2" />
                          {match.session.workout_type} • {match.matched_user.experience_level || 'Beginner'}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2" />
                          {new Date(match.session.scheduled_date).toLocaleDateString()} at {match.session.start_time}
                        </div>
                      </>
                    )}
                  </div>

                  {match.matched_user.bio && (
                    <p className="text-sm text-foreground mb-6 line-clamp-3">
                      {match.matched_user.bio}
                    </p>
                  )}

                  {match.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeny(match.id)}
                        className="flex-1 hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleChat(match.id)}
                        className="flex-1 hover:bg-primary hover:text-primary-foreground"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAccept(match.id)}
                        className="flex-1 gym-gradient text-white hover:scale-105 transition-transform"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {match.status === 'accepted' && (
                    <div className="text-center">
                      <p className="text-green-600 font-semibold mb-2">✓ Matched!</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleChat(match.id)}
                        className="w-full hover:bg-primary hover:text-primary-foreground"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Chat
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
