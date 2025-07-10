import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProductList from './pages/products/ProductList';
import CategoryManagement from './pages/admin/CategoryManagement';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/women" element={<ProductList />} />
              <Route path="/men" element={<ProductList />} />
              <Route path="/categories" element={<ProductList />} />
              <Route path="/women/dresses" element={<ProductList />} />
              <Route path="/men/shirts" element={<ProductList />} />
              <Route path="/accessories" element={<ProductList />} />
              <Route path="/shoes" element={<ProductList />} />
              <Route path="/jackets" element={<ProductList />} />
              <Route path="/activewear" element={<ProductList />} />
              <Route path="/about" element={<div className="container mx-auto px-4 py-16"><h1 className="text-3xl font-bold text-center">About Us</h1></div>} />
              <Route path="/contact" element={<div className="container mx-auto px-4 py-16"><h1 className="text-3xl font-bold text-center">Contact Us</h1></div>} />
              <Route path="/admin/categories" element={<CategoryManagement />} />
            </Routes>
          </Layout>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;