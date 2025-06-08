import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Users, Target, Shield, Calendar } from 'lucide-react';
import Footer from './Footer';

interface LandingHeroProps {
  onSignup: () => void;
}

const LandingHero = ({ onSignup }: LandingHeroProps) => {
  return (
    <>
      {/* Hero Section */}
      <section className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-jet-black via-planet-purple/20 to-jet-black">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8 slide-up">
            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-black bg-gradient-to-r from-planet-purple via-energy-yellow to-planet-purple bg-clip-text text-transparent leading-tight">
              WORKOUT
              <br />
              WITH A
              <br />
              PARTNER!
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl lg:text-2xl text-pure-white/90 max-w-2xl mx-auto leading-relaxed">
              Find your perfect gym buddy, match workout schedules, and achieve your fitness goals together. 
              The future of fitness is social.
            </p>

            {/* CTA Button */}
            <div className="pt-8 bounce-in">
              <Button 
                onClick={onSignup}
                size="lg"
                className="text-xl md:text-2xl px-8 md:px-12 py-4 md:py-6 planet-gradient text-white energy-glow hover:scale-110 transition-all duration-300 pulse-energy font-bold rounded-full"
              >
                START YOUR FITNESS JOURNEY
              </Button>
            </div>

            {/* Stats */}
            <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-energy-yellow">10,000+</div>
                <div className="text-pure-white/80">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-energy-yellow">50,000+</div>
                <div className="text-pure-white/80">Workouts Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-energy-yellow">500+</div>
                <div className="text-pure-white/80">Partner Gyms</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how" className="py-16 md:py-20 bg-pure-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-energy-orange to-electric-blue bg-clip-text text-transparent mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Getting started with GymBuddy is simple and takes just minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Sign Up</h3>
              <p className="text-muted-foreground">Create your profile and set your fitness preferences</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-electric-blue to-neon-green rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Find Matches</h3>
              <p className="text-muted-foreground">Get matched with compatible workout partners nearby</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-neon-green to-energy-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Schedule</h3>
              <p className="text-muted-foreground">Plan your workout sessions together at your preferred gym</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Workout Safely</h3>
              <p className="text-muted-foreground">Meet verified users in safe, public gym environments</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Use It Section */}
      <section id="why" className="py-16 md:py-20 bg-planet-purple/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-electric-blue to-neon-green bg-clip-text text-transparent mb-4">
              Why Choose GymBuddy?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform your fitness journey with the power of partnership
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Stay Motivated</h3>
              <p className="text-muted-foreground">Having a workout partner increases your chances of sticking to your fitness goals by 95%</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🏋️</div>
              <h3 className="text-xl font-bold mb-2">Better Workouts</h3>
              <p className="text-muted-foreground">Push each other to new limits and achieve better results together</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-2">Make Friends</h3>
              <p className="text-muted-foreground">Build lasting friendships with like-minded fitness enthusiasts</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">Safe & Secure</h3>
              <p className="text-muted-foreground">All users are verified and meetings happen in public gym spaces</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold mb-2">Easy to Use</h3>
              <p className="text-muted-foreground">Simple, intuitive interface designed for busy fitness enthusiasts</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-bold mb-2">Track Progress</h3>
              <p className="text-muted-foreground">Monitor your fitness journey and celebrate achievements together</p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Gyms Section */}
      <section id="gyms" className="py-16 md:py-20 bg-pure-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-neon-green to-energy-orange bg-clip-text text-transparent mb-4">
              Supported Gyms
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Partner with members at your favorite fitness locations
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            {['Gold\'s Gym', 'Planet Fitness', 'LA Fitness', '24 Hour Fitness', 'Anytime Fitness', 'Crunch Fitness'].map((gym, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-energy-orange to-electric-blue rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-sm">{gym.split(' ')[0]}</span>
                </div>
                <p className="text-sm font-medium">{gym}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section id="safety" className="py-16 md:py-20 bg-planet-purple/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-energy-orange to-electric-blue bg-clip-text text-transparent mb-4">
              Your Safety is Our Priority
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We've built comprehensive safety features to ensure secure connections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-neon-green rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Verified Profiles</h3>
                  <p className="text-muted-foreground">All users go through identity verification before joining</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-neon-green rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Public Meetings</h3>
                  <p className="text-muted-foreground">All workouts happen in safe, public gym environments</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-neon-green rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Community Reporting</h3>
                  <p className="text-muted-foreground">Easy reporting system and active community moderation</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="w-64 h-64 bg-gradient-to-r from-energy-orange/20 to-electric-blue/20 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-32 h-32 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-planet-purple to-energy-yellow">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your Perfect Workout Partner?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of fitness enthusiasts who have transformed their workout experience
          </p>
          <Button 
            onClick={onSignup}
            size="lg"
            className="text-lg md:text-xl px-8 md:px-10 py-3 md:py-4 bg-white text-planet-purple hover:bg-gray-100 hover:scale-105 transition-all duration-300 font-bold rounded-full"
          >
            Get Started Today - It's Free!
          </Button>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default LandingHero;
