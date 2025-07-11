import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Star } from 'lucide-react';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Wishlist: React.FC = () => {
  const { wishlistItems, removeFromWishlist, loading } = useWishlist();
  const { addItem } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const handleAddToCart = (product: any) => {
    // Find the first available size
    const availableSize = product.sizes?.find((size: string) => {
      const stock = product.stock?.[size] || 0;
      return stock > 0;
    });
    
    if (!availableSize) {
      showToast('This product is out of stock', 'error');
      return;
    }
    
    addItem(product, availableSize, 1);
    showToast(`Added ${product.name} (${availableSize}) to cart!`, 'success');
  };

  const handleAddAllToCart = () => {
    let addedCount = 0;
    
    wishlistItems.forEach(product => {
      const availableSize = product.sizes?.find((size: string) => {
        const stock = product.stock?.[size] || 0;
        return stock > 0;
      });
      
      if (availableSize) {
        addItem(product, availableSize, 1);
        addedCount++;
      }
    });
    
    if (addedCount > 0) {
      showToast(`Added ${addedCount} items to cart!`, 'success');
    } else {
      showToast('No items available to add to cart', 'warning');
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <Heart size={64} className="mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h1>
          <p className="text-gray-600 mb-8">You need to be logged in to view your wishlist.</p>
          <Link
            to="/login"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <Heart size={64} className="mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Your wishlist is empty</h1>
          <p className="text-gray-600 mb-8">Save items you love to your wishlist and shop them later.</p>
          <Link
            to="/products"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Wishlist</h1>
          <p className="text-gray-600 mt-2">{wishlistItems.length} items saved</p>
        </div>
        
        {wishlistItems.length > 0 && (
          <button
            onClick={handleAddAllToCart}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2"
          >
            <ShoppingCart size={20} />
            <span>Add All to Cart</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((product) => (
          <div key={product._id} className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="relative overflow-hidden">
              <img
                src={product.images?.[0] || '/placeholder-image.jpg'}
                alt={product.name}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Discount Badge */}
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="absolute top-3 left-3">
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                </div>
              )}

              {/* Remove from Wishlist */}
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors group"
                >
                  <Heart size={16} className="text-red-500 fill-current" />
                </button>
              </div>

              {/* Quick Add to Cart */}
              <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart size={16} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="text-sm text-gray-500 mb-1">{product.category}</div>
              <Link to={`/product/${product._id}`} className="block">
                <h3 className="font-semibold text-gray-800 hover:text-purple-600 transition-colors line-clamp-2">
                  {product.name}
                </h3>
              </Link>
              
              {/* Rating */}
              <div className="flex items-center mt-2 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={`${
                        i < Math.floor(product.rating || 0) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">({product.reviews?.length || 0})</span>
              </div>
              
              {/* Price */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-gray-800">${product.price}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                  )}
                </div>
              </div>

              {/* Available Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs text-gray-500 mb-1">Available sizes:</div>
                  <div className="flex flex-wrap gap-1">
                    {product.sizes.slice(0, 4).map((size: string) => {
                      const stock = product.stock?.[size] || 0;
                      return (
                        <span
                          key={size}
                          className={`text-xs px-2 py-1 rounded ${
                            stock > 0 
                              ? 'bg-gray-100 text-gray-700' 
                              : 'bg-gray-50 text-gray-400 line-through'
                          }`}
                        >
                          {size}
                        </span>
                      );
                    })}
                    {product.sizes.length > 4 && (
                      <span className="text-xs text-gray-500">+{product.sizes.length - 4} more</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;