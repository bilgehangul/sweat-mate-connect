
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, Menu, X } from 'lucide-react';

interface NavigationProps {
  isLoggedIn?: boolean;
  onSignup?: () => void;
  onLogin?: () => void;
}

const Navigation = ({ isLoggedIn = false, onSignup, onLogin }: NavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainTabs = isLoggedIn 
    ? [
        { name: 'Home', path: '/dashboard' },
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
    setMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSignupClick = () => {
    if (onSignup) {
      onSignup();
    } else {
      navigate('/signup');
    }
  };

  const handleLoginClick = () => {
    if (onLogin) {
      onLogin();
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="bg-jet-black/95 backdrop-blur-sm border-b border-planet-purple/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={handleLogoClick}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-planet-purple to-energy-yellow rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-planet-purple to-energy-yellow bg-clip-text text-transparent">
              GymBuddy
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {mainTabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => handleTabClick(tab)}
                className={`font-medium transition-colors hover:text-energy-yellow ${
                  activeTab === tab.path 
                    ? 'text-energy-yellow border-b-2 border-energy-yellow' 
                    : 'text-pure-white'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          {!isLoggedIn && (
            <div className="hidden md:flex space-x-3">
              <Button 
                variant="outline" 
                onClick={handleLoginClick}
                className="border-planet-purple text-planet-purple hover:bg-planet-purple hover:text-pure-white"
              >
                Login
              </Button>
              <Button 
                onClick={handleSignupClick}
                className="planet-gradient text-white energy-glow hover:scale-105 transition-transform pulse-energy"
              >
                Sign Up
              </Button>
            </div>
          )}

          {isLoggedIn && (
            <div className="hidden md:flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-planet-purple to-energy-yellow rounded-full"></div>
              <span className="font-medium text-pure-white">John Doe</span>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-pure-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              {mainTabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => handleTabClick(tab)}
                  className={`font-medium transition-colors hover:text-energy-yellow text-left ${
                    activeTab === tab.path 
                      ? 'text-energy-yellow' 
                      : 'text-pure-white'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
              
              {!isLoggedIn && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-planet-purple/20">
                  <Button 
                    variant="outline" 
                    onClick={handleLoginClick}
                    className="border-planet-purple text-planet-purple hover:bg-planet-purple hover:text-pure-white"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={handleSignupClick}
                    className="planet-gradient text-white"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
