
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface NavigationProps {
  isLoggedIn?: boolean;
  onSignup?: () => void;
  onLogin?: () => void;
}

const Navigation = ({ isLoggedIn = false, onSignup, onLogin }: NavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  const mainTabs = isLoggedIn 
    ? [
        { name: 'Home', path: '/' },
        { name: 'Matches', path: '/matches' },
        { name: 'Communities', path: '/communities' },
        { name: 'Profile', path: '/profile' }
      ]
    : [
        { name: 'Supported Gyms', path: '#gyms' },
        { name: 'How it works', path: '#how' },
        { name: 'Why use it', path: '#why' },
        { name: 'Safety', path: '#safety' }
      ];

  const handleTabClick = (tab: any) => {
    if (isLoggedIn) {
      navigate(tab.path);
      setActiveTab(tab.path);
    } else {
      // For landing page, scroll to sections
      const element = document.querySelector(tab.path);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      setActiveTab(tab.path);
    }
  };

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-energy-orange to-electric-blue rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-energy-orange to-electric-blue bg-clip-text text-transparent">
              GymBuddy
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {mainTabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => handleTabClick(tab)}
                className={`font-medium transition-colors hover:text-primary ${
                  activeTab === tab.path 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-muted-foreground'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Auth Buttons */}
          {!isLoggedIn && (
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={onLogin}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Login
              </Button>
              <Button 
                onClick={onSignup}
                className="gym-gradient text-white energy-glow hover:scale-105 transition-transform pulse-energy"
              >
                Sign Up
              </Button>
            </div>
          )}

          {isLoggedIn && (
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full"></div>
              <span className="font-medium">John Doe</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
