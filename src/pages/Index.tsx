import Navigation from "@/components/Navigation";
import LandingHero from "@/components/LandingHero";
import Footer from "@/components/Footer";
import SupportedGyms from "@/components/SupportedGyms";
import { Card } from "@/components/ui/card";
import { Users, Calendar, MessageCircle, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Index = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate('/dashboard');
  };
  return <div className="min-h-screen">
      <Navigation isLoggedIn={false} onGetStarted={handleGetStarted} />
      
      <LandingHero onGetStarted={handleGetStarted} />
      
      {/* How It Works Section */}
      

      <div id="gyms">
        <SupportedGyms />
      </div>
    </div>;
};
export default Index;