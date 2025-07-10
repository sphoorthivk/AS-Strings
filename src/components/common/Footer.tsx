import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold">FashionHub</span>
            </div>
            <p className="text-gray-300 mb-4">
              Your premier destination for the latest fashion trends. Quality clothing for every style and occasion.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/women" className="text-gray-300 hover:text-purple-400 transition-colors">
                  Women's Fashion
                </Link>
              </li>
              <li>
                <Link to="/men" className="text-gray-300 hover:text-purple-400 transition-colors">
                  Men's Fashion
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-300 hover:text-purple-400 transition-colors">
                  All Categories
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-purple-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-purple-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-300 hover:text-purple-400 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-300 hover:text-purple-400 transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-300 hover:text-purple-400 transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="text-gray-300 hover:text-purple-400 transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="text-gray-300 hover:text-purple-400 transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-purple-400" />
                <span className="text-gray-300">support@fashionhub.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-purple-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-purple-400" />
                <span className="text-gray-300">123 Fashion St, Style City, SC 12345</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Newsletter</h4>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-gray-800 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-r-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 FashionHub. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;