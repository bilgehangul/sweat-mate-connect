
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

  return (
    <div className="min-h-screen">
      <Navigation 
        isLoggedIn={false} 
        onSignup={handleSignup} 
        onLogin={handleLogin} 
      />
      
      <LandingHero onSignup={handleSignup} />
      
      {/* How It Works Section */}
      <section id="how" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-planet-purple to-energy-yellow bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Getting started with GymBuddy is simple. Follow these easy steps to find your perfect workout partner.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Create Profile</h3>
              <p className="text-muted-foreground">Set up your profile with fitness goals, preferences, and experience level.</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-planet-purple to-energy-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. Schedule Workouts</h3>
              <p className="text-muted-foreground">Create workout sessions or browse existing ones that match your schedule.</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-electric-blue to-energy-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Connect & Chat</h3>
              <p className="text-muted-foreground">Get matched with compatible gym buddies and start chatting to plan your workout.</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-energy-yellow to-planet-purple rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">4. Achieve Goals</h3>
              <p className="text-muted-foreground">Work out together, motivate each other, and achieve your fitness goals faster.</p>
            </Card>
          </div>
        </div>
      </section>

      <div id="gyms">
        <SupportedGyms />
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
