import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

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
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-bold text-gray-800">FashionHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/products/women" className="text-gray-700 hover:text-purple-600 transition-colors">
              Women
            </Link>
            <Link to="/products/men" className="text-gray-700 hover:text-purple-600 transition-colors">
              Men
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-purple-600 transition-colors">
              Categories
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-purple-600 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-purple-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-700 hover:text-purple-600 transition-colors"
              >
                <Search size={20} />
              </button>
              {isSearchOpen && (
                <form onSubmit={handleSearch} className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border p-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    autoFocus
                  />
                </form>
              )}
            </div>

            {/* Wishlist */}
            <Link to="/wishlist" className="p-2 text-gray-700 hover:text-purple-600 transition-colors">
              <Heart size={20} />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="p-2 text-gray-700 hover:text-purple-600 transition-colors relative">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button className="p-2 text-gray-700 hover:text-purple-600 transition-colors">
                  <User size={20} />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-3 border-b">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <nav className="py-2">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Orders
                    </Link>
                    {user.role === 'admin' && (
                      <>
                        <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Admin Dashboard
                        </Link>
                        <Link to="/admin/categories" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Manage Categories
                        </Link>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </nav>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-purple-600 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="space-y-2">
              <Link to="/products/women" className="block py-2 text-gray-700 hover:text-purple-600 transition-colors">
                Women
              </Link>
              <Link to="/products/men" className="block py-2 text-gray-700 hover:text-purple-600 transition-colors">
                Men
              </Link>
              <Link to="/products" className="block py-2 text-gray-700 hover:text-purple-600 transition-colors">
                Categories
              </Link>
              <Link to="/about" className="block py-2 text-gray-700 hover:text-purple-600 transition-colors">
                About
              </Link>
              <Link to="/contact" className="block py-2 text-gray-700 hover:text-purple-600 transition-colors">
                Contact
              </Link>
            </nav>

            <div className="mt-4 pt-4 border-t space-y-2">
              <form onSubmit={handleSearch} className="mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </form>

              <Link to="/wishlist" className="flex items-center space-x-2 py-2 text-gray-700 hover:text-purple-600 transition-colors">
                <Heart size={20} />
                <span>Wishlist</span>
              </Link>

              <Link to="/cart" className="flex items-center space-x-2 py-2 text-gray-700 hover:text-purple-600 transition-colors">
                <ShoppingCart size={20} />
                <span>Cart ({totalItems})</span>
              </Link>

              {user ? (
                <div className="space-y-2">
                  <Link to="/profile" className="block py-2 text-gray-700 hover:text-purple-600 transition-colors">
                    Profile
                  </Link>
                  <Link to="/orders" className="block py-2 text-gray-700 hover:text-purple-600 transition-colors">
                    Orders
                  </Link>
                  {user.role === 'admin' && (
                    <>
                      <Link to="/admin" className="block py-2 text-gray-700 hover:text-purple-600 transition-colors">
                        Admin Dashboard
                      </Link>
                      <Link to="/admin/categories" className="block py-2 text-gray-700 hover:text-purple-600 transition-colors">
                        Manage Categories
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 text-gray-700 hover:text-purple-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 text-center"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;