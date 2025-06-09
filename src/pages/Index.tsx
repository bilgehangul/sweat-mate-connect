
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import LandingHero from '@/components/LandingHero';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-energy-orange"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        isLoggedIn={false} 
        onSignup={handleSignup} 
        onLogin={handleLogin} 
      />
      <LandingHero onSignup={handleSignup} />
    </div>
  );
};

export default Index;
