import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, MapPin, Phone, User } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { ordersAPI } from '../../services/api';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    paymentMethod: 'cod' as 'cod' | 'qr'
  });

  // Delivery zones with different rates
  const deliveryZones = [
    { name: 'Local (Same City)', rate: 5, keywords: ['mumbai', 'delhi', 'bangalore', 'chennai', 'kolkata', 'hyderabad'] },
    { name: 'Metro Cities', rate: 15, keywords: ['pune', 'ahmedabad', 'surat', 'jaipur', 'lucknow', 'kanpur'] },
    { name: 'Tier 2 Cities', rate: 25, keywords: ['nagpur', 'indore', 'thane', 'bhopal', 'visakhapatnam', 'pimpri'] },
    { name: 'Remote Areas', rate: 50, keywords: [] } // Default for unmatched cities
  ];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
  }, [user, items, navigate]);

  useEffect(() => {
    calculateShippingCost();
  }, [formData.city, formData.state, totalPrice]);

  const calculateShippingCost = () => {
    const city = formData.city.toLowerCase();
    const state = formData.state.toLowerCase();
    
    // Free shipping for orders over $100
    if (totalPrice >= 100) {
      setShippingCost(0);
      return;
    }

    // Find matching delivery zone
    for (const zone of deliveryZones) {
      if (zone.keywords.some(keyword => city.includes(keyword) || state.includes(keyword))) {
        setShippingCost(zone.rate);
        return;
      }
    }
    
    // Default to remote area rate
    setShippingCost(deliveryZones[deliveryZones.length - 1].rate);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.fullName || !formData.phone || !formData.street || !formData.city || !formData.state || !formData.zipCode) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    
    // Validate phone number
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      showToast('Please enter a valid phone number', 'error');
      return;
    }
    
    setLoading(true);

    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          size: item.size,
          quantity: item.quantity,
          accessories: item.accessories || []
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod,
        shippingCost: shippingCost
      };

      const response = await ordersAPI.createOrder(orderData);
      clearCart();
      showToast('Order placed successfully!', 'success');
      navigate(`/order-confirmation/${response.data._id}`);
    } catch (error: any) {
      console.error('Order creation error:', error);
      const errorMessage = error.response?.data?.message || 'Error placing order. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const getProductImageUrl = (product: any) => {
    // Check for media array first (new format)
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
    
    // Check for images array (legacy format)
    if (product.images && product.images.length > 0) {
      const image = product.images[0];
      if (image.startsWith('http') || image.startsWith('data:')) {
        return image;
      }
      return `http://localhost:5000/api/upload/images/${image}`;
    }
    
    // Fallback to placeholder
    return 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=600';
  };

  const finalTotal = totalPrice + shippingCost;

  // Show loading state while checking auth/cart
  if (!user || items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Truck className="text-purple-600" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Shipping Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User size={16} className="inline mr-1" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone size={16} className="inline mr-1" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin size={16} className="inline mr-1" />
                  Street Address *
                </label>
                <input
                  type="text"
                  name="street"
                  required
                  value={formData.street}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="House number, street name, area"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="India">India</option>
                  <option value="USA">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="text-purple-600" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Payment Method</h2>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">Cash on Delivery</div>
                    <div className="text-sm text-gray-600">Pay when your order arrives</div>
                  </div>
                </label>
                
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="qr"
                    checked={formData.paymentMethod === 'qr'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">UPI/QR Code</div>
                    <div className="text-sm text-gray-600">Pay using UPI apps or scan QR code</div>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Items Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="flex items-center space-x-3">
                  <img
                    src={getProductImageUrl(item.product)}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.src = 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=600';
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="text-sm text-gray-600">Size: {item.size}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    {item.accessories && item.accessories.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        <span className="font-medium">Accessories:</span>
                        {item.accessories.map((accessory, index) => (
                          <div key={index} className="ml-2">
                            • {accessory.name} {accessory.price === 0 ? '(Free)' : `(+$${accessory.price})`}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="font-medium">
                    ${((item.product.price + (item.accessories || []).reduce((sum: number, acc: any) => sum + acc.price, 0)) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shippingCost === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `$${shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>
              {totalPrice >= 100 && shippingCost === 0 && (
                <div className="text-sm text-green-600">
                  🎉 Free shipping on orders over $100!
                </div>
              )}
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Delivery Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Truck className="text-purple-600" size={16} />
                <span>Estimated delivery: 3-7 business days</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium mb-2">Delivery Zones & Rates:</h4>
                <ul className="space-y-1 text-xs">
                  {deliveryZones.slice(0, -1).map((zone, index) => (
                    <li key={index}>
                      <span className="font-medium">{zone.name}:</span> ${zone.rate}
                    </li>
                  ))}
                  <li className="text-green-600 font-medium">
                    Free shipping on orders over $100
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;