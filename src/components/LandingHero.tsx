
import { Button } from '@/components/ui/button';

interface LandingHeroProps {
  onSignup: () => void;
}

const LandingHero = ({ onSignup }: LandingHeroProps) => {
  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/10">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8 slide-up">
          {/* Main Headline */}
          <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-energy-orange via-electric-blue to-neon-green bg-clip-text text-transparent leading-tight">
            WORKOUT
            <br />
            WITH A
            <br />
            PARTNER!
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Find your perfect gym buddy, match workout schedules, and achieve your fitness goals together. 
            The future of fitness is social.
          </p>

          {/* CTA Button */}
          <div className="pt-8 bounce-in">
            <Button 
              onClick={onSignup}
              size="lg"
              className="text-2xl px-12 py-6 gym-gradient text-white energy-glow hover:scale-110 transition-all duration-300 pulse-energy font-bold rounded-full"
            >
              START YOUR FITNESS JOURNEY
            </Button>
          </div>

          {/* Stats */}
          <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-energy-orange">10,000+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-electric-blue">50,000+</div>
              <div className="text-muted-foreground">Workouts Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-neon-green">500+</div>
              <div className="text-muted-foreground">Partner Gyms</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
