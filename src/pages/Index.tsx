import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import LandingHero from "@/components/LandingHero";
import SupportedGyms from "@/components/SupportedGyms";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-energy-orange"></div>
      </div>
    );
  }

  // Only show landing page for non-authenticated users
  if (user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen">
      <Navigation isLoggedIn={false} onSignup={handleSignup} onLogin={handleLogin} />
      <LandingHero onSignup={handleSignup} />
      <div id="gyms">
        <SupportedGyms />
      </div>
    </div>
  );
};

export default Index;