
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Users } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    console.log('Login:', { email, password });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-planet-purple to-jet-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-pure-white shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-planet-purple to-energy-yellow rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-planet-purple mb-2">Welcome Back!</h1>
          <p className="text-muted-foreground">Sign in to continue your fitness journey</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full planet-gradient text-white hover:scale-105 transition-transform pulse-energy"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="text-planet-purple hover:text-energy-yellow font-medium">
              Sign up here
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link 
            to="/" 
            className="text-sm text-muted-foreground hover:text-planet-purple"
          >
            ← Back to home
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
