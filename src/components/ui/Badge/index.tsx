import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'muted';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const Badge = ({ 
  children, 
  variant = 'primary', 
  className = '',
  style,
  onClick
}: BadgeProps) => {
  return (
    <span 
      className={`badge badge-${variant} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </span>
  );
};

