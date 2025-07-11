import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { wishlistAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlistItems: any[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => void;
  loading: boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await wishlistAPI.getWishlist();
      setWishlistItems(response.data || []);
    } catch (error: any) {
      console.error('Error fetching wishlist:', error);
      if (error.response?.status !== 401) {
        showToast('Error loading wishlist', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    if (!user) {
      showToast('Please login to add items to wishlist', 'warning');
      return;
    }

    try {
      await wishlistAPI.addToWishlist(productId);
      await fetchWishlist();
      showToast('Added to wishlist!', 'success');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error adding to wishlist';
      showToast(message, 'error');
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    try {
      await wishlistAPI.removeFromWishlist(productId);
      await fetchWishlist();
      showToast('Removed from wishlist', 'info');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error removing from wishlist';
      showToast(message, 'error');
    }
  };

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      showToast('Please login to add items to wishlist', 'warning');
      return;
    }

    try {
      const response = await wishlistAPI.toggleWishlist(productId);
      await fetchWishlist();
      showToast(response.data.message, response.data.inWishlist ? 'success' : 'info');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error updating wishlist';
      showToast(message, 'error');
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some(item => item._id === productId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const refreshWishlist = async () => {
    await fetchWishlist();
  };

  const value = {
    wishlistItems,
    wishlistCount: wishlistItems.length,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    loading,
    refreshWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};