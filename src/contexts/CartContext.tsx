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
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { showToast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
        console.log('Cart loaded from localStorage:', parsedCart);
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cart', JSON.stringify(items));
      console.log('Cart saved to localStorage:', items);
    }
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
    // Create a unique key for cart items including accessories
    const accessoriesKey = JSON.stringify(accessories?.sort((a, b) => a.id.localeCompare(b.id)) || []);
    const existingItem = prevItems.find(item => 
      item.productId === product._id && 
      item.size === size &&
      JSON.stringify((item.accessories || []).sort((a, b) => a.id.localeCompare(b.id))) === accessoriesKey
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
        JSON.stringify((item.accessories || []).sort((a, b) => a.id.localeCompare(b.id))) === accessoriesKey
          ? { ...item, quantity: newQuantity }
          : item
      );
    }
    
    const newItem = { 
      productId: product._id, 
      product, 
      size, 
      quantity, 
      accessories: accessories || [] 
    };
    
    console.log('Adding new item to cart:', newItem);
    return [...prevItems, newItem];
  });
};


  const removeItem = (productId: string, size: string) => {
    setItems(prevItems => {
      const filtered = prevItems.filter(item => !(item.productId === productId && item.size === size));
      console.log('Removing item from cart. New cart:', filtered);
      return filtered;
    });
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
    console.log('Clearing cart');
    setItems([]);
    localStorage.removeItem('cart');
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