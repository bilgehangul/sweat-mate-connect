
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import LandingHero from '@/components/LandingHero';
import Dashboard from './Dashboard';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSignup = () => {
    console.log('Signup clicked');
    // For demo purposes, let's simulate login
    setIsLoggedIn(true);
  };

  const handleLogin = () => {
    console.log('Login clicked');
    // For demo purposes, let's simulate login
    setIsLoggedIn(true);
  };

  if (isLoggedIn) {
    return <Dashboard />;
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
