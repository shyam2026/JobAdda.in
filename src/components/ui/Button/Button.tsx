import React from 'react';
import Link from 'next/link';
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  href?: string;
}

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      href,
      ...props
    },
    ref
  ) => {
    const classNames = [
      styles.btn,
      styles[`btn-${variant}`],
      styles[`btn-${size}`],
      fullWidth ? styles['btn-full'] : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const content = (
      <>
        {isLoading && <span className={styles.spinner} />}
        {!isLoading && leftIcon && <span className={styles.icon}>{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className={styles.icon}>{rightIcon}</span>}
      </>
    );

    if (href) {
      return (
        <Link 
          href={href} 
          className={classNames} 
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...(props as any)}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classNames}
        disabled={disabled || isLoading}
        {...(props as any)}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

