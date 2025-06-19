import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Users, Target, Shield, Calendar, Play, Star, ArrowRight, Zap, Heart, Trophy, CheckCircle } from 'lucide-react';
import Footer from './Footer';

interface LandingHeroProps {
  onSignup: () => void;
}

const LandingHero = ({ onSignup }: LandingHeroProps) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const nextTestimonial = () => {
  setCurrentTestimonial((prev) =>
    prev === testimonials.length - 1 ? 0 : prev + 1
  );
};

const prevTestimonial = () => {
  setCurrentTestimonial((prev) =>
    prev === 0 ? testimonials.length - 1 : prev - 1
  );
};
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fitness Enthusiast",
      content: "Found my perfect workout partner in just 2 days! We've been crushing our fitness goals together for 6 months now.",
      rating: 5,
      avatar: "👩‍💼"
    },
    {
      name: "Mike Chen",
      role: "Personal Trainer",
      content: "GymBuddy helped me connect with clients who share my passion for functional fitness. Game changer!",
      rating: 5,
      avatar: "👨‍🏫"
    },
    {
      name: "Jessica Williams",
      role: "Yoga Instructor",
      content: "The community features are amazing. I've built a whole network of yoga enthusiasts through this platform.",
      rating: 5,
      avatar: "🧘‍♀️"
    }
  ];

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Smart Matching",
      description: "AI-powered algorithm matches you with compatible workout partners based on goals, schedule, and location."
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Flexible Scheduling",
      description: "Coordinate workout times that work for everyone with our intelligent scheduling system."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Verified Community",
      description: "All members are verified for safety. Meet in public gym spaces with confidence."
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Track Progress",
      description: "Monitor your fitness journey and celebrate achievements with your workout community."
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Users", icon: <Users className="w-6 h-6" /> },
    { number: "200K+", label: "Workouts Completed", icon: <Zap className="w-6 h-6" /> },
    { number: "15K+", label: "Partnerships Formed", icon: <Heart className="w-6 h-6" /> },
    { number: "500+", label: "Partner Gyms", icon: <Target className="w-6 h-6" /> }
  ];

  const gymLogos = [
    {
      name: "Planet Fitness",
      logo: "https://play.google.com/store/apps/details?id=com.planetfitness",
      members: "18.7M+"
    },
    {
      name: "LA Fitness",
      logo: "https://logos-world.net/wp-content/uploads/2021/03/LA-Fitness-Logo.png",
      members: "4.9M+"
    },
    {
      name: "24 Hour Fitness",
      logo: "https://logos-world.net/wp-content/uploads/2021/03/24-Hour-Fitness-Logo.png",
      members: "1.2M+"
    },
    {
      name: "Gold's Gym",
      logo: "https://logos-world.net/wp-content/uploads/2021/03/Golds-Gym-Logo.png",
      members: "3M+"
    },
    {
      name: "Anytime Fitness",
      logo: "https://logos-world.net/wp-content/uploads/2021/03/Anytime-Fitness-Logo.png",
      members: "800K+"
    },
    {
      name: "Crunch Fitness",
      logo: "https://logos-world.net/wp-content/uploads/2021/03/Crunch-Fitness-Logo.png",
      members: "2M+"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);


  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-energy-orange via-electric-blue to-neon-green">
          <div className="absolute inset-0 bg-black/20"></div>
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                    <Star className="w-4 h-4 mr-2 fill-current" />
                    Rated #1 Fitness Matching App
                  </div>
                  
                  <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
                    Find Your
                    <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                      Perfect
                    </span>
                    <span className="block">Workout Partner</span>
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-white/90 max-w-2xl leading-relaxed">
                    Join thousands of fitness enthusiasts who've transformed their workout experience. 
                    Get matched, stay motivated, achieve more together.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button 
                    onClick={onSignup}
                    size="lg"
                    className="text-xl px-8 py-6 bg-white text-energy-orange hover:bg-gray-100 hover:scale-105 transition-all duration-300 font-bold rounded-full shadow-2xl group"
                  >
                    Start Your Journey
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  
                  <Button 
                    variant="outline"
                    size="lg"
                    className="text-xl px-8 py-6 border-3 border-white bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-energy-orange transition-all duration-300 font-bold rounded-full shadow-xl hover:scale-105"
                    onClick={() => setIsVideoPlaying(true)}
                  >
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    Watch Demo
                  </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="flex items-center justify-center mb-2 text-white">
                        {stat.icon}
                      </div>
                      <div className="text-2xl md:text-3xl font-bold text-white">{stat.number}</div>
                      <div className="text-white/80 text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Content - Interactive Demo */}
              <div className="relative">
                <div className="relative z-10">
                  {/* Mock App Interface */}
                  <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="text-sm font-medium text-gray-600">GymBuddy</div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Perfect Match Found! 🎯</h3>
                      </div>
                      
                      <div className="bg-gradient-to-r from-energy-orange to-electric-blue p-4 rounded-xl text-white">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl">
                            👨‍💼
                          </div>
                          <div>
                            <div className="font-bold">Alex Rodriguez</div>
                            <div className="text-sm opacity-90">95% Match • 0.5 miles away</div>
                          </div>
                        </div>
                        <div className="mt-3 text-sm">
                          "Looking for a morning workout partner for strength training at Gold's Gym"
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                          <Heart className="w-4 h-4 mr-2" />
                          Connect
                        </Button>
                        <Button variant="outline" className="flex-1">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Success Indicators */}
                <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg animate-pulse">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white p-3 rounded-full shadow-lg animate-bounce">
                  <Zap className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Fixed spacing and padding */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-energy-orange to-electric-blue bg-clip-text text-transparent mb-6 py-2">
              Why Choose GymBuddy?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We've revolutionized how fitness enthusiasts connect and achieve their goals together
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                <div className="w-16 h-16 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Community Says</h2>
            <p className="text-xl text-gray-600">Real stories from real people who found their perfect workout partners</p>
          </div>

          <div className="max-w-4xl mx-auto relative">
              {/* Left Arrow */}
              <button
                onClick={prevTestimonial}
                className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl text-gray-400 hover:text-energy-orange z-20 px-2"
                aria-label="Previous testimonial"
              >
                ←
              </button>
            
              {/* Right Arrow */}
              <button
                onClick={nextTestimonial}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-3xl text-gray-400 hover:text-electric-blue z-20 px-2"
                aria-label="Next testimonial"
              >
                →
              </button>

            <Card className="p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-energy-orange to-electric-blue"></div>
              
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-500 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-2xl md:text-3xl font-medium text-gray-800 mb-8 leading-relaxed">
                "{testimonials[currentTestimonial].content}"
              </blockquote>
              
              <div className="flex items-center justify-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full flex items-center justify-center text-2xl">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">{testimonials[currentTestimonial].name}</div>
                  <div className="text-gray-600">{testimonials[currentTestimonial].role}</div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentTestimonial ? 'bg-energy-orange' : 'bg-gray-300'
                    }`}
                    onClick={() => setCurrentTestimonial(index)}
                  />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Supported Gyms Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-neon-green to-energy-orange bg-clip-text text-transparent mb-6">
              Partner Gyms Nationwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with workout partners at your favorite fitness locations across the country
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {gymLogos.map((gym, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 group">
                <div className="mb-4 h-16 flex items-center justify-center">
                  <img 
                    src={gym.logo} 
                    alt={gym.name}
                    className="max-h-12 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    onError={(e) => {
                      // Fallback to text if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.className = 'w-12 h-12 bg-gradient-to-r from-energy-orange to-electric-blue rounded-lg flex items-center justify-center text-white font-bold text-sm';
                      fallback.textContent = gym.name.split(' ')[0];
                      target.parentNode?.appendChild(fallback);
                    }}
                  />
                </div>
                <h3 className="font-bold text-sm mb-2">{gym.name}</h3>
                <p className="text-xs text-gray-500">{gym.members} members</p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">And hundreds more gyms nationwide!</p>
            <Button variant="outline" className="border-2 border-energy-orange text-energy-orange hover:bg-energy-orange hover:text-white">
              View All Partner Gyms
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-energy-orange via-electric-blue to-neon-green relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Fitness Journey?
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Join over 50,000 fitness enthusiasts who've found their perfect workout partners
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              onClick={onSignup}
              size="lg"
              className="text-xl px-12 py-6 bg-white text-energy-orange hover:bg-gray-100 hover:scale-105 transition-all duration-300 font-bold rounded-full shadow-2xl"
            >
              Get Started Free Today
            </Button>
            <p className="text-white/80 text-sm">No credit card required • Join in 30 seconds</p>
          </div>
          
          <div className="flex justify-center items-center space-x-8 text-white/80">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>100% Free to Join</span>
            </div>
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              <span>Verified Members Only</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-5 h-5 mr-2" />
              <span>Safe & Secure</span>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full aspect-video relative">
            <button
              onClick={() => setIsVideoPlaying(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-2xl"
            >
              ✕
            </button>
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Demo video coming soon!</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default LandingHero;