import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'outline';
  style?: React.CSSProperties;
}

export const Card = ({ 
  children, 
  className = '', 
  padding = 'md', 
  variant = 'default',
  style 
}: CardProps) => {
  const paddingMap = {
    none: '0',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem'
  };

  const variantClass = variant === 'glass' ? 'glass-card' : 'card';

  return (
    <div 
      className={`${variantClass} ${className}`}
      style={{ 
        padding: paddingMap[padding],
        ...style 
      }}
    >
      {children}
    </div>
  );
};
