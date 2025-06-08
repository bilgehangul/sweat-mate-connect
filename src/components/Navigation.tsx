
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, Menu, X, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavigationProps {
  isLoggedIn?: boolean;
  onSignup?: () => void;
  onLogin?: () => void;
  onLogout?: () => void;
}

const Navigation = ({ isLoggedIn = false, onSignup, onLogin, onLogout }: NavigationProps) => {
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
    setMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
    if (onLogin) {
      onLogin();
    } else {
      navigate('/login');
    }
    setMobileMenuOpen(false);
  };

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <nav className="bg-jet-black/95 backdrop-blur-sm border-b border-energy-orange/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={handleLogoClick}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-energy-orange to-electric-blue rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-energy-orange to-electric-blue bg-clip-text text-transparent">
              GymBuddy
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {mainTabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => handleTabClick(tab)}
                className={`font-medium transition-colors hover:text-neon-green ${
                  activeTab === tab.path 
                    ? 'text-neon-green border-b-2 border-neon-green' 
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
                className="border-energy-orange text-energy-orange hover:bg-energy-orange hover:text-pure-white"
              >
                Login
              </Button>
              <Button 
                onClick={handleSignupClick}
                className="gym-gradient text-white energy-glow hover:scale-105 transition-transform pulse-energy"
              >
                Sign Up
              </Button>
            </div>
          )}

          {isLoggedIn && (
            <div className="hidden md:flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <div className="w-8 h-8 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full"></div>
                    <span className="font-medium text-pure-white">John Doe</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleLogoutClick}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                  className={`font-medium transition-colors hover:text-neon-green text-left ${
                    activeTab === tab.path 
                      ? 'text-neon-green' 
                      : 'text-pure-white'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
              
              {!isLoggedIn ? (
                <div className="flex flex-col space-y-2 pt-4 border-t border-energy-orange/20">
                  <Button 
                    variant="outline" 
                    onClick={handleLoginClick}
                    className="border-energy-orange text-energy-orange hover:bg-energy-orange hover:text-pure-white"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={handleSignupClick}
                    className="gym-gradient text-white"
                  >
                    Sign Up
                  </Button>
                </div>
              ) : (
                <div className="pt-4 border-t border-energy-orange/20">
                  <Button 
                    onClick={handleLogoutClick}
                    variant="outline"
                    className="w-full border-energy-orange text-energy-orange hover:bg-energy-orange hover:text-pure-white"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
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
