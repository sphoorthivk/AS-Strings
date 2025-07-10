import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Filter, Grid, List } from 'lucide-react';
import { productsAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ProductList: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    size: '',
    color: '',
    sortBy: 'newest',
  });

  useEffect(() => {
    fetchProducts();
  }, [filters, currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 12,
        ...filters,
        category: filters.category === 'All' ? '' : filters.category,
        size: filters.size === 'All' ? '' : filters.size,
      };

      const response = await productsAPI.getProducts(params);
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Dresses', 'Jackets', 'T-Shirts', 'Shoes', 'Blouses', 'Jeans'];
  const priceRanges = ['All', '$0-$50', '$50-$100', '$100-$200', '$200+'];
  const sizes = ['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  const ProductCard = ({ product }: { product: any }) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
      <div className="relative overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        <div className="absolute top-3 left-3">
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
            <Heart size={16} className="text-gray-600" />
          </button>
        </div>

        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
            <ShoppingCart size={16} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="text-sm text-gray-500 mb-1">{product.category}</div>
        <Link to={`/product/${product._id}`} className="block">
          <h3 className="font-semibold text-gray-800 hover:text-purple-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center mt-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={`${
                  i < Math.floor(product.rating) 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">({product.reviews?.length || 0})</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-800">${product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const ProductListItem = ({ product }: { product: any }) => (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-6">
      <div className="flex-shrink-0">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-24 h-24 object-cover rounded-lg"
        />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">{product.category}</div>
            <Link to={`/product/${product._id}`} className="block">
              <h3 className="text-lg font-semibold text-gray-800 hover:text-purple-600 transition-colors">
                {product.name}
              </h3>
            </Link>
            <div className="flex items-center mt-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={`${
                      i < Math.floor(product.rating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">({product.reviews?.length || 0})</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-800">${product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
              )}
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <button className="p-2 text-gray-600 hover:text-purple-600 transition-colors">
                <Heart size={16} />
              </button>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
                <ShoppingCart size={16} />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {loading && (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="large" />
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  {priceRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <select
                  value={filters.size}
                  onChange={(e) => setFilters({...filters, size: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  {sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">All Products</h1>
              <p className="text-gray-600">Showing {products.length} products</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter size={16} />
                <span>Filters</span>
              </button>
              
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          {!loading && (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map(product => (
                    <ProductListItem key={product.id} product={product} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <nav className="flex items-center space-x-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        page === currentPage 
                          ? 'bg-purple-600 text-white' 
                          : 'border border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;