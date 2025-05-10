// components/ui/Button.tsx
import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(        // Базові стилі для всіх кнопок
        'inline-block font-semibold rounded cursor-pointer transition-all lowercase',
        
        // Розміри
        {
          'px-3 py-1 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        
        // Варіанти
        {
          'bg-black text-white hover:bg-zinc-800 hover:text-zinc-200 hover:shadow-md': variant === 'default',
          'bg-transparent border border-black text-black hover:bg-zinc-100': variant === 'outline',
          'bg-zinc-200 text-black hover:bg-zinc-300': variant === 'secondary',
        },
        
        // Додаткові класи
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
