import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface MobileDropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

const MobileDropdown: React.FC<MobileDropdownProps> = ({
  trigger,
  children,
  align = 'right',
  className = '',
  onOpenChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isOpen]);

  // Handle route changes (close dropdown)
  useEffect(() => {
    const handleRouteChange = () => setIsOpen(false);
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  // Notify parent of state changes
  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleDropdown();
    }
  };

  const alignmentClasses = align === 'left' ? 'left-0' : 'right-0';

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        ref={triggerRef}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        className="mobile-btn-icon focus-ring"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {trigger}
      </button>

      {/* Dropdown Content */}
      <div
        className={`mobile-dropdown ${alignmentClasses} ${isOpen ? 'open' : 'closed'}`}
        role="menu"
        aria-hidden={!isOpen}
      >
        {children}
      </div>
    </div>
  );
};

export default MobileDropdown;