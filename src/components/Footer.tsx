
import { Users, Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark-slate text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-energy-orange to-electric-blue rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-energy-orange to-electric-blue bg-clip-text text-transparent">
                GymBuddy
              </span>
            </div>
            <p className="text-gray-300 text-sm">
              Connect with your perfect workout partners and achieve your fitness goals together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-energy-orange">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">How it Works</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Supported Gyms</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Safety Guidelines</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Communities</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-electric-blue">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-neon-green">Stay Connected</h4>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-300 hover:text-energy-orange transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-electric-blue transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-neon-green transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
            <p className="text-gray-300 text-sm mb-2">Subscribe to our newsletter</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email"
                className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-energy-orange"
              />
              <button className="px-4 py-2 gym-gradient text-white rounded-r-md text-sm hover:scale-105 transition-transform">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 GymBuddy. All rights reserved. Made with 💪 for fitness enthusiasts.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
