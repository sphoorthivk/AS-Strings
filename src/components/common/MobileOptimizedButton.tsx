import React, { forwardRef } from 'react';
import { Loader } from 'lucide-react';

interface MobileOptimizedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const MobileOptimizedButton = forwardRef<HTMLButtonElement, MobileOptimizedButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    fullWidth = false, 
    className = '', 
    children, 
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-smooth focus-ring mobile-tap-highlight disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
      primary: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 active:from-purple-800 active:to-pink-800',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300',
      outline: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50 active:bg-purple-100',
      ghost: 'text-gray-600 hover:bg-gray-100 active:bg-gray-200',
      icon: 'text-gray-600 hover:bg-gray-100 active:bg-gray-200 rounded-full'
    };
    
    const sizeClasses = {
      sm: variant === 'icon' ? 'p-2 touch-target' : 'px-3 py-2 text-sm touch-target',
      md: variant === 'icon' ? 'p-3 touch-target' : 'px-4 py-3 text-base touch-target',
      lg: variant === 'icon' ? 'p-4 touch-target-large' : 'px-6 py-4 text-lg touch-target-large'
    };
    
    const roundedClasses = variant === 'icon' ? 'rounded-full' : 'rounded-lg';
    const widthClasses = fullWidth ? 'w-full' : '';
    
    const combinedClasses = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      roundedClasses,
      widthClasses,
      className
    ].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        className={combinedClasses}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <Loader size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} className="animate-spin mr-2" />
        )}
        {children}
      </button>
    );
  }
);

MobileOptimizedButton.displayName = 'MobileOptimizedButton';

export default MobileOptimizedButton;