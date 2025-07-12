import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Eye, Package, DollarSign, Image, Video, X } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import MediaUpload from '../../components/admin/MediaUpload';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../contexts/ToastContext';
import { productsAPI, categoriesAPI } from '../../services/api';

interface Accessory {
  id: string;
  name: string;
  price: number;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  category: string;
  gender: 'men' | 'women' | 'unisex';
  sizes: string[];
  colors: string[];
  stock: { [key: string]: number };
  media: string[];
  tags: string[];
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  shippingCost: string;
  accessories: Accessory[];
  featured: boolean;
  isActive: boolean;
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showToast } = useToast();

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    gender: 'women',
    sizes: [],
    colors: [],
    stock: {},
    media: [],
    tags: [],
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: '',
    },
    shippingCost: '',
    accessories: [],
    featured: false,
    isActive: true,
  });

  const [newAccessory, setNewAccessory] = useState({ name: '', price: '' });
  const [showAccessoryForm, setShowAccessoryForm] = useState(false);

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', '42'];
  const availableColors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Pink', 'Gray', 'Brown', 'Navy', 'Beige'];

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage, searchTerm, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        category: selectedCategory || undefined,
      };
      const response = await productsAPI.getProducts(params);
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast('Failed to fetch products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      showToast('Product name is required', 'error');
      return;
    }
    
    if (!formData.description.trim()) {
      showToast('Product description is required', 'error');
      return;
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      showToast('Valid price is required', 'error');
      return;
    }
    
    if (!formData.category) {
      showToast('Category is required', 'error');
      return;
    }
    
    if (formData.sizes.length === 0) {
      showToast('At least one size must be selected', 'error');
      return;
    }
    
    if (formData.colors.length === 0) {
      showToast('At least one color must be selected', 'error');
      return;
    }
    
    if (formData.media.length === 0) {
      showToast('At least one image or video must be uploaded', 'error');
      return;
    }

    // Ensure stock is set for all sizes
    const stockData: { [key: string]: number } = {};
    formData.sizes.forEach(size => {
      stockData[size] = formData.stock[size] || 0;
    });

    try {
      setLoading(true);
      
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        category: formData.category,
        gender: formData.gender,
        sizes: formData.sizes,
        colors: formData.colors,
        stock: stockData,
        media: formData.media,
        tags: formData.tags.filter(tag => tag.trim()),
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        dimensions: {
          length: formData.dimensions.length ? parseFloat(formData.dimensions.length) : undefined,
          width: formData.dimensions.width ? parseFloat(formData.dimensions.width) : undefined,
          height: formData.dimensions.height ? parseFloat(formData.dimensions.height) : undefined,
        },
        shippingCost: formData.shippingCost ? parseFloat(formData.shippingCost) : 0,
        accessories: formData.accessories,
        featured: formData.featured,
        isActive: formData.isActive,
      };

      if (editingProduct) {
        await productsAPI.updateProduct(editingProduct._id, productData);
        showToast('Product updated successfully', 'success');
      } else {
        await productsAPI.createProduct(productData);
        showToast('Product created successfully', 'success');
      }

      resetForm();
      fetchProducts();
    } catch (error: any) {
      console.error('Error saving product:', error);
      const errorMessage = error.response?.data?.message || 'Error saving product';
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      category: product.category,
      gender: product.gender,
      sizes: product.sizes || [],
      colors: product.colors || [],
      stock: product.stock || {},
      media: product.media || [],
      tags: product.tags || [],
      weight: product.weight?.toString() || '',
      dimensions: {
        length: product.dimensions?.length?.toString() || '',
        width: product.dimensions?.width?.toString() || '',
        height: product.dimensions?.height?.toString() || '',
      },
      shippingCost: product.shippingCost?.toString() || '',
      accessories: product.accessories || [],
      featured: product.featured || false,
      isActive: product.isActive !== false,
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.deleteProduct(id);
        showToast('Product deleted successfully', 'success');
        fetchProducts();
      } catch (error) {
        showToast('Failed to delete product', 'error');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: '',
      gender: 'women',
      sizes: [],
      colors: [],
      stock: {},
      media: [],
      tags: [],
      weight: '',
      dimensions: {
        length: '',
        width: '',
        height: '',
      },
      shippingCost: '',
      accessories: [],
      featured: false,
      isActive: true,
    });
    setEditingProduct(null);
    setShowAddModal(false);
    setNewAccessory({ name: '', price: '' });
    setShowAccessoryForm(false);
  };

  const handleSizeToggle = (size: string) => {
    const newSizes = formData.sizes.includes(size)
      ? formData.sizes.filter(s => s !== size)
      : [...formData.sizes, size];
    
    setFormData({ ...formData, sizes: newSizes });
  };

  const handleColorToggle = (color: string) => {
    const newColors = formData.colors.includes(color)
      ? formData.colors.filter(c => c !== color)
      : [...formData.colors, color];
    
    setFormData({ ...formData, colors: newColors });
  };

  const handleStockChange = (size: string, stock: number) => {
    setFormData({
      ...formData,
      stock: { ...formData.stock, [size]: stock }
    });
  };

  const addAccessory = () => {
    if (!newAccessory.name.trim()) {
      showToast('Please enter a proper accessory name', 'error');
      return;
    }
    
    if (!newAccessory.price || newAccessory.price.trim() === '') {
      showToast('Please enter a proper price for the accessory', 'error');
      return;
    }
    
    const price = parseFloat(newAccessory.price);
    if (isNaN(price) || price < 0) {
      showToast('Please enter a valid price (0 or greater)', 'error');
      return;
    }

    const accessory: Accessory = {
      id: Date.now().toString(),
      name: newAccessory.name.trim(),
      price: price,
    };

    setFormData({
      ...formData,
      accessories: [...formData.accessories, accessory]
    });

    setNewAccessory({ name: '', price: '' });
    setShowAccessoryForm(false);
    showToast('Accessory added successfully', 'success');
  };

  const removeAccessory = (id: string) => {
    setFormData({
      ...formData,
      accessories: formData.accessories.filter(acc => acc.id !== id)
    });
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag.trim()]
      });
    }
  };

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index)
    });
  };

  const getProductImageUrl = (product: any) => {
    if (product.media && product.media.length > 0) {
      const media = product.media[0];
      if (typeof media === 'string') {
        if (media.startsWith('http') || media.startsWith('data:')) {
          return media;
        }
        return `http://localhost:5000/api/upload/media/${media}`;
      }
      if (media && typeof media === 'object') {
        if (media.dataUrl) return media.dataUrl;
        if (media._id) return `http://localhost:5000/api/upload/media/${media._id}`;
      }
    }
    
    if (product.images && product.images.length > 0) {
      const image = product.images[0];
      if (image.startsWith('http') || image.startsWith('data:')) {
        return image;
      }
      return `http://localhost:5000/api/upload/images/${image}`;
    }
    
    return 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=600';
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && products.length === 0) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600">Manage your product catalog with advanced features</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Product</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Package size={24} className="text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.isActive).length}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Package size={24} className="text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Featured Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.featured).length}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Package size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Price</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${products.length > 0 ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2) : '0.00'}
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <DollarSign size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category._id} value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={getProductImageUrl(product)}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover mr-4"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.src = 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=600';
                          }}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description}
                          </div>
                          {product.featured && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                              Featured
                            </span>
                          )}
                          {/* Add accessories display */}
      {product.accessories && product.accessories.length > 0 && (
        <div className="mt-1">
          <span className="text-xs text-gray-500">Accessories: </span>
          <div className="flex flex-wrap gap-1 mt-1">
            {product.accessories.slice(0, 2).map((accessory: any, index: number) => (
              <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                {accessory.name} {accessory.price === 0 ? '(Free)' : `($${accessory.price})`}
              </span>
            ))}
            {product.accessories.length > 2 && (
              <span className="text-xs text-gray-500">+{product.accessories.length - 2} more</span>
            )}
            </div>
        </div>
      )}

                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.category}</div>
                      <div className="text-sm text-gray-500 capitalize">{product.gender}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${product.price}</div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="text-sm text-gray-500 line-through">${product.originalPrice}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {Object.values(product.stock || {}).reduce((sum: number, stock: any) => sum + (stock || 0), 0)} units
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.sizes?.length || 0} sizes
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-100 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredProducts.length === 0 && !loading && (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No products found</p>
              <p className="text-gray-400 text-sm">Create your first product to get started</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
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

        {/* Add/Edit Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-8">
                {/* Basic Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter product name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={4}
                        placeholder="Detailed product description"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price * ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Original Price ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.originalPrice}
                          onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                        <p className="text-xs text-gray-500 mt-1">For discount calculation</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category *
                        </label>
                        <select
                          required
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="">Select Category</option>
                          {categories.map(category => (
                            <option key={category._id} value={category.name}>{category.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Gender *
                        </label>
                        <select
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'men' | 'women' | 'unisex' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="women">Women</option>
                          <option value="men">Men</option>
                          <option value="unisex">Unisex</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Product Details</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.weight}
                          onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Shipping Cost ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.shippingCost}
                          onChange={(e) => setFormData({ ...formData, shippingCost: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dimensions (cm)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="number"
                          step="0.01"
                          value={formData.dimensions.length}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            dimensions: { ...formData.dimensions, length: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Length"
                        />
                        <input
                          type="number"
                          step="0.01"
                          value={formData.dimensions.width}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            dimensions: { ...formData.dimensions, width: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Width"
                        />
                        <input
                          type="number"
                          step="0.01"
                          value={formData.dimensions.height}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            dimensions: { ...formData.dimensions, height: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Height"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        placeholder="fashion, trendy, summer"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault();
                            const value = e.currentTarget.value.trim();
                            if (value) {
                              addTag(value);
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm flex items-center"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(index)}
                                className="ml-1 text-purple-600 hover:text-purple-800"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900">Featured Product</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900">Active</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Media Upload */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Media *</h3>
                  <MediaUpload
                    media={formData.media}
                    onMediaChange={(media) => setFormData({ ...formData, media })}
                    maxFiles={10}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Upload images (JPG, PNG) and videos (MP4, MOV, AVI). First media will be the main product image.
                  </p>
                </div>

                {/* Sizes and Stock */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Sizes & Stock *</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Sizes
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                      {availableSizes.map(size => (
                        <label key={size} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.sizes.includes(size)}
                            onChange={() => handleSizeToggle(size)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm">{size}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {formData.sizes.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock Quantity per Size
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {formData.sizes.map(size => (
                          <div key={size}>
                            <label className="block text-xs text-gray-600 mb-1">{size}</label>
                            <input
                              type="number"
                              min="0"
                              value={formData.stock[size] || 0}
                              onChange={(e) => handleStockChange(size, parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="0"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Colors */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Colors *</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                    {availableColors.map(color => (
                      <label key={color} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.colors.includes(color)}
                          onChange={() => handleColorToggle(color)}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm">{color}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Accessories */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Custom Accessories</h3>
                    <button
                      type="button"
                      onClick={() => setShowAccessoryForm(!showAccessoryForm)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                    >
                      <Plus size={16} />
                      <span>Add Accessory</span>
                    </button>
                  </div>

                  {showAccessoryForm && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Accessory Name
                          </label>
                          <input
                            type="text"
                            value={newAccessory.name}
                            onChange={(e) => setNewAccessory({ ...newAccessory, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="e.g., Premium Gift Box, Extended Warranty"
                          />
                          <p className="text-xs text-gray-500 mt-1">Enter a descriptive name for the accessory</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price ($)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={newAccessory.price}
                            onChange={(e) => setNewAccessory({ ...newAccessory, price: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="5.99 (Enter 0 for free)"
                          />
                          <p className="text-xs text-gray-500 mt-1">Enter price (0 for free accessory)</p>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3 mt-4">
                        <button
                          type="button"
                          onClick={() => setShowAccessoryForm(false)}
                          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={addAccessory}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Add Accessory
                        </button>
                      </div>
                    </div>
                  )}

                  {formData.accessories.length > 0 && (
                    <div className="space-y-2">
                      {formData.accessories.map((accessory) => (
                        <div key={accessory.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <span className="font-medium">{accessory.name}</span>
                            <span className="text-gray-600 ml-2">
                              {accessory.price === 0 ? 'Free' : `$${accessory.price}`}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAccessory(accessory.id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2"
                  >
                    {loading && <LoadingSpinner size="small" />}
                    <span>{editingProduct ? 'Update Product' : 'Create Product'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProductManagement;