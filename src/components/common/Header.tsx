import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const navigate = useNavigate();

  // Refs for click outside detection
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false);
      setIsSearchOpen(false);
      setIsUserMenuOpen(false);
    };

    // Listen for navigation events
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle ESC key to close menus
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 z-10" onClick={handleLinkClick}>
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-bold text-gray-800 hidden sm:block">FashionHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/products/women" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Women
            </Link>
            <Link to="/products/men" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Men
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Categories
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Contact
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              {isSearchOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border p-2 transform transition-all duration-200 ease-out">
                  <form onSubmit={handleSearch}>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      autoFocus
                    />
                  </form>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link 
              to="/wishlist" 
              className="p-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200 relative"
              aria-label={`Wishlist (${wishlistItems} items)`}
              onClick={handleLinkClick}
            >
              <Heart size={20} />
              {wishlistItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1 font-medium">
                  {wishlistItems}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link 
              to="/cart" 
              className="p-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200 relative"
              aria-label={`Cart (${totalItems} items)`}
              onClick={handleLinkClick}
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1 font-medium">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200"
                  aria-label="User menu"
                  aria-expanded={isUserMenuOpen}
                >
                  <User size={20} />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border transform transition-all duration-200 ease-out">
                    <div className="p-3 border-b">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <nav className="py-2">
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={handleLinkClick}
                      >
                        Profile
                      </Link>
                      <Link 
                        to="/orders" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={handleLinkClick}
                      >
                        Orders
                      </Link>
                      {user.role === 'admin' && (
                        <>
                          <Link 
                            to="/admin" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={handleLinkClick}
                          >
                            Admin Dashboard
                          </Link>
                          <Link 
                            to="/admin/categories" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={handleLinkClick}
                          >
                            Manage Categories
                          </Link>
                        </>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Logout
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium"
                onClick={handleLinkClick}
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Mobile Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Mobile Cart */}
            <Link 
              to="/cart" 
              className="p-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200 relative"
              aria-label={`Cart (${totalItems} items)`}
              onClick={handleLinkClick}
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-4 h-4 flex items-center justify-center px-1 font-medium">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200"
              aria-label="Menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden py-4 border-t" ref={searchRef}>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-base"
                autoFocus
              />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Mobile Menu */}
      <div 
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 h-full w-80 max-w-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold text-gray-800">FashionHub</span>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex-1 overflow-y-auto">
            <nav className="p-4 space-y-2">
              <Link 
                to="/products/women" 
                className="flex items-center py-3 px-4 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 font-medium"
                onClick={handleLinkClick}
              >
                Women
              </Link>
              <Link 
                to="/products/men" 
                className="flex items-center py-3 px-4 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 font-medium"
                onClick={handleLinkClick}
              >
                Men
              </Link>
              <Link 
                to="/products" 
                className="flex items-center py-3 px-4 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 font-medium"
                onClick={handleLinkClick}
              >
                Categories
              </Link>
              <Link 
                to="/about" 
                className="flex items-center py-3 px-4 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 font-medium"
                onClick={handleLinkClick}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="flex items-center py-3 px-4 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 font-medium"
                onClick={handleLinkClick}
              >
                Contact
              </Link>
            </nav>

            <div className="border-t p-4 space-y-2">
              <Link 
                to="/wishlist" 
                className="flex items-center justify-between py-3 px-4 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 font-medium"
                onClick={handleLinkClick}
              >
                <div className="flex items-center space-x-3">
                  <Heart size={20} />
                  <span>Wishlist</span>
                </div>
                {wishlistItems > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1 font-medium">
                    {wishlistItems}
                  </span>
                )}
              </Link>
            </div>

            {user ? (
              <div className="border-t p-4 space-y-2">
                <div className="px-4 py-2">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <Link 
                  to="/profile" 
                  className="flex items-center py-3 px-4 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 font-medium"
                  onClick={handleLinkClick}
                >
                  Profile
                </Link>
                <Link 
                  to="/orders" 
                  className="flex items-center py-3 px-4 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 font-medium"
                  onClick={handleLinkClick}
                >
                  Orders
                </Link>
                {user.role === 'admin' && (
                  <>
                    <Link 
                      to="/admin" 
                      className="flex items-center py-3 px-4 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 font-medium"
                      onClick={handleLinkClick}
                    >
                      Admin Dashboard
                    </Link>
                    <Link 
                      to="/admin/categories" 
                      className="flex items-center py-3 px-4 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 font-medium"
                      onClick={handleLinkClick}
                    >
                      Manage Categories
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full py-3 px-4 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="border-t p-4">
                <Link
                  to="/login"
                  className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 text-center font-medium"
                  onClick={handleLinkClick}
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;