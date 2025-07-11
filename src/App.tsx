import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ToastProvider } from './contexts/ToastContext';
import { WishlistProvider } from './contexts/WishlistContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProductList from './pages/products/ProductList';
import ProductDetail from './pages/products/ProductDetail';
import Cart from './pages/cart/Cart';
import Checkout from './pages/checkout/Checkout';
import OrderConfirmation from './pages/orders/OrderConfirmation';
import MyOrders from './pages/orders/MyOrders';
import OrderDetail from './pages/orders/OrderDetail';
import CategoryManagement from './pages/admin/CategoryManagement';
import DeliveryZoneManagement from './pages/admin/DeliveryZoneManagement';
import Dashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';
import UserManagement from './pages/admin/UserManagement';
import Analytics from './pages/admin/Analytics';
import Wishlist from './pages/wishlist/Wishlist';
import SearchResults from './pages/search/SearchResults';
import Profile from './pages/profile/Profile';
import Reports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/products" element={<ProductList />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                  <Route path="/orders" element={<MyOrders />} />
                  <Route path="/order/:orderId" element={<OrderDetail />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/products/:gender?" element={<ProductList />} />
                  <Route path="/products/:gender/:category" element={<ProductList />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/about" element={<div className="container mx-auto px-4 py-16"><h1 className="text-3xl font-bold text-center">About Us</h1></div>} />
                  <Route path="/contact" element={<div className="container mx-auto px-4 py-16"><h1 className="text-3xl font-bold text-center">Contact Us</h1></div>} />
                  <Route path="/admin" element={<Dashboard />} />
                  <Route path="/admin/products" element={<ProductManagement />} />
                  <Route path="/admin/orders" element={<OrderManagement />} />
                  <Route path="/admin/users" element={<UserManagement />} />
                  <Route path="/admin/analytics" element={<Analytics />} />
                  <Route path="/admin/categories" element={<CategoryManagement />} />
                  <Route path="/admin/delivery-zones" element={<DeliveryZoneManagement />} />
                  <Route path="/admin/reports" element={<Reports />} />
                  <Route path="/admin/settings" element={<Settings />} />
                </Routes>
              </Layout>
            </Router>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;