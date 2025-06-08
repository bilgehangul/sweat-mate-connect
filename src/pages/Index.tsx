
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import LandingHero from '@/components/LandingHero';
import Dashboard from './Dashboard';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSignup = () => {
    console.log('Signup clicked');
    setIsLoggedIn(true);
  };

  const handleLogin = () => {
    console.log('Login clicked');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return <Dashboard onLogout={handleLogout} />;
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
