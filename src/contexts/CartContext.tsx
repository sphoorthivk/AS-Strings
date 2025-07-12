import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, CartContextType } from '../types';
import { useToast } from './ToastContext';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
  accessories?: any[];
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

const addItem = (product: Product, size: string, quantity: number, accessories: any[] = []) => {
  // Validate inputs
  if (!product || !size || quantity <= 0) {
    console.error('Invalid product data for cart');
    showToast('Invalid product data', 'error');
    return;
  }

  // Validate that the product has sizes and the selected size exists
  if (!product.sizes || product.sizes.length === 0) {
    showToast('This product has no available sizes', 'error');
    return;
  }

  if (!product.sizes.includes(size)) {
    showToast('Selected size is not available for this product', 'error');
    return;
  }
  
  // Check stock availability
  const availableStock = product.stock?.[size] || 0;
  if (availableStock < quantity) {
    showToast(`Only ${availableStock} items available in size ${size}`, 'error');
    return;
  }
  
  setItems(prevItems => {
    const existingItem = prevItems.find(item => 
      item.productId === product._id && 
      item.size === size &&
      JSON.stringify(item.accessories || []) === JSON.stringify(accessories)
    );
    
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      
      // Check if new quantity exceeds stock
      if (newQuantity > availableStock) {
        showToast(`Cannot add more items. Only ${availableStock} available in size ${size}`, 'error');
        return prevItems;
      }
      
      return prevItems.map(item =>
        item.productId === product._id && 
        item.size === size &&
        JSON.stringify(item.accessories || []) === JSON.stringify(accessories)
          ? { ...item, quantity: newQuantity }
          : item
      );
    }
    
    return [...prevItems, { productId: product._id, product, size, quantity, accessories }];
  });
};


  const removeItem = (productId: string, size: string) => {
    setItems(prevItems => prevItems.filter(item => !(item.productId === productId && item.size === size)));
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, size);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const productTotal = item.product.price * item.quantity;
    const accessoriesTotal = (item.accessories || []).reduce((accSum: number, acc: any) => accSum + (acc.price * item.quantity), 0);
    return sum + productTotal + accessoriesTotal;
  }, 0);

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};