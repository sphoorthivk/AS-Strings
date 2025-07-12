import React from 'react';

interface ResponsiveGridProps {
  children: React.ReactNode;
  variant?: 'auto' | 'products' | 'cards' | 'custom';
  minItemWidth?: string;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  variant = 'auto',
  minItemWidth = '280px',
  gap = 'md',
  className = ''
}) => {
  const gapClasses = {
    sm: 'gap-3 sm:gap-4',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8'
  };

  const variantClasses = {
    auto: 'responsive-grid-auto',
    products: 'responsive-grid-products',
    cards: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    custom: 'grid'
  };

  const gridStyle = variant === 'custom' ? {
    gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`
  } : undefined;

  return (
    <div 
      className={`${variantClasses[variant]} ${gapClasses[gap]} ${className}`}
      style={gridStyle}
    >
      {children}
    </div>
  );
};

export default ResponsiveGrid;