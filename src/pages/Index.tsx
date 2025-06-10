import Navigation from "@/components/Navigation";
import LandingHero from "@/components/LandingHero";
import Footer from "@/components/Footer";
import SupportedGyms from "@/components/SupportedGyms";
import { Card } from "@/components/ui/card";
import { Users, Calendar, MessageCircle, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Index = () => {
  const navigate = useNavigate();
  const handleSignup = () => {
    navigate('/signup');
  };
  const handleLogin = () => {
    navigate('/login');
  };
  return <div className="min-h-screen">
      <Navigation isLoggedIn={false} onSignup={handleSignup} onLogin={handleLogin} />
      
      <LandingHero onSignup={handleSignup} />
      
      {/* How It Works Section */}
      

      <div id="gyms">
        <SupportedGyms />
      </div>
      
      <Footer />
    </div>;
};
export default Index;