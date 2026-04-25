import React from 'react';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      leftIcon,
      rightIcon,
      helperText,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || Math.random().toString(36).substring(7);

    return (
      <div className={`${styles.wrapper} ${className || ''}`}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {props.required && <span className={styles.required}>*</span>}
          </label>
        )}
        
        <div className={styles.inputContainer}>
          {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
          
          <input
            id={inputId}
            ref={ref}
            className={`
              ${styles.input} 
              ${leftIcon ? styles.hasLeftIcon : ''} 
              ${rightIcon ? styles.hasRightIcon : ''} 
              ${error ? styles.errorInput : ''}
            `}
            {...props}
          />
          
          {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
        </div>

        {(error || helperText) && (
          <p className={error ? styles.errorMessage : styles.helperText}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
