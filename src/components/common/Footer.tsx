import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-lg md:text-xl font-bold">FashionHub</span>
            </div>
            <p className="text-sm md:text-base text-gray-300 mb-4 leading-relaxed">
              Your premier destination for the latest fashion trends. Quality clothing for every style and occasion.
            </p>
            <div className="flex space-x-3 md:space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-purple-400 transition-colors p-2 rounded-lg hover:bg-gray-800 touch-manipulation"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-purple-400 transition-colors p-2 rounded-lg hover:bg-gray-800 touch-manipulation"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-purple-400 transition-colors p-2 rounded-lg hover:bg-gray-800 touch-manipulation"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-purple-400 transition-colors p-2 rounded-lg hover:bg-gray-800 touch-manipulation"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Quick Links</h3>
            <ul className="space-y-1 md:space-y-2">
              <li>
                <Link 
                  to="/products/women" 
                  className="text-sm md:text-base text-gray-300 hover:text-purple-400 transition-colors block py-1 touch-manipulation"
                >
                  Women's Fashion
                </Link>
              </li>
              <li>
                <Link 
                  to="/products/men" 
                  className="text-sm md:text-base text-gray-300 hover:text-purple-400 transition-colors block py-1 touch-manipulation"
                >
                  Men's Fashion
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className="text-sm md:text-base text-gray-300 hover:text-purple-400 transition-colors block py-1 touch-manipulation"
                >
                  All Categories
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-sm md:text-base text-gray-300 hover:text-purple-400 transition-colors block py-1 touch-manipulation"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-sm md:text-base text-gray-300 hover:text-purple-400 transition-colors block py-1 touch-manipulation"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Customer Service</h3>
            <ul className="space-y-1 md:space-y-2">
              <li>
                <Link 
                  to="/help" 
                  className="text-sm md:text-base text-gray-300 hover:text-purple-400 transition-colors block py-1 touch-manipulation"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link 
                  to="/returns" 
                  className="text-sm md:text-base text-gray-300 hover:text-purple-400 transition-colors block py-1 touch-manipulation"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link 
                  to="/shipping" 
                  className="text-sm md:text-base text-gray-300 hover:text-purple-400 transition-colors block py-1 touch-manipulation"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link 
                  to="/size-guide" 
                  className="text-sm md:text-base text-gray-300 hover:text-purple-400 transition-colors block py-1 touch-manipulation"
                >
                  Size Guide
                </Link>
              </li>
              <li>
                <Link 
                  to="/track-order" 
                  className="text-sm md:text-base text-gray-300 hover:text-purple-400 transition-colors block py-1 touch-manipulation"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Contact Us</h3>
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-purple-400" />
                <span className="text-sm md:text-base text-gray-300">support@fashionhub.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-purple-400" />
                <span className="text-sm md:text-base text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-purple-400" />
                <span className="text-sm md:text-base text-gray-300">123 Fashion St, Style City, SC 12345</span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-6">
              <h4 className="text-sm md:text-base font-semibold mb-2">Newsletter</h4>
              <form className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 md:py-3 bg-gray-800 text-white rounded-lg sm:rounded-l-lg sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm md:text-base"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 md:py-3 rounded-lg sm:rounded-l-none sm:rounded-r-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium touch-manipulation text-sm md:text-base"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 md:mt-8 pt-6 md:pt-8 text-center">
          <p className="text-xs md:text-sm text-gray-400">
            © 2024 FashionHub. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;