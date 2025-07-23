import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, Menu, X, LogOut, User, Settings, CreditCard, Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

interface NavigationProps {
  isLoggedIn?: boolean;
  onSignup?: () => void;
  onLogin?: () => void;
  onLogout?: () => void;
}

const Navigation = ({ isLoggedIn = false, onSignup, onLogin, onLogout }: NavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { profile } = useProfile();
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
        { name: 'How it works', path: '#how' },
        { name: 'Why use it', path: '#why' },
        { name: 'Supported Gyms', path: '#gyms' },
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

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    // TODO: Navigate to settings page when implemented
    console.log('Settings clicked');
  };

  const handleBillingClick = () => {
    // TODO: Navigate to billing page when implemented
    console.log('Billing clicked');
  };

  const handleNotificationsClick = () => {
    // TODO: Navigate to notifications page when implemented
    console.log('Notifications clicked');
  };

  // Get display name for the user
  const getDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile?.username) {
      return profile.username;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    if (profile?.username) {
      return profile.username.slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'U';
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
                  <div className="flex items-center space-x-3 cursor-pointer hover:bg-white/10 rounded-lg p-2 transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full flex items-center justify-center">
                      {profile?.avatar_url ? (
                        <img 
                          src={profile.avatar_url} 
                          alt="Profile" 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-sm font-bold">
                          {getUserInitials()}
                        </span>
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-pure-white text-sm">
                        {getDisplayName()}
                      </div>
                      {profile?.username && (
                        <div className="text-xs text-gray-300">
                          @{profile.username}
                        </div>
                      )}
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfileClick}>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSettingsClick}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleNotificationsClick}>
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleBillingClick}>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
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
                <div className="pt-4 border-t border-energy-orange/20 space-y-2">
                  {/* Mobile User Info */}
                  <div className="flex items-center space-x-3 p-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full flex items-center justify-center">
                      {profile?.avatar_url ? (
                        <img 
                          src={profile.avatar_url} 
                          alt="Profile" 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-sm font-bold">
                          {getUserInitials()}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-pure-white text-sm">
                        {getDisplayName()}
                      </div>
                      {profile?.username && (
                        <div className="text-xs text-gray-300">
                          @{profile.username}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Mobile Menu Items */}
                  <Button 
                    variant="ghost"
                    onClick={handleProfileClick}
                    className="w-full justify-start text-pure-white hover:bg-white/10"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={handleSettingsClick}
                    className="w-full justify-start text-pure-white hover:bg-white/10"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={handleNotificationsClick}
                    className="w-full justify-start text-pure-white hover:bg-white/10"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={handleBillingClick}
                    className="w-full justify-start text-pure-white hover:bg-white/10"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Billing
                  </Button>
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