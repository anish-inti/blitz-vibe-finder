import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
  className?: string;
  showSparkle?: boolean;
  color?: 'pink' | 'red' | 'blue';
}

const GlowButton: React.FC<GlowButtonProps> = ({
  variant = 'default',
  size = 'default',
  children,
  className,
  showSparkle = false,
  color = 'pink',
  ...props
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        'font-semibold relative overflow-hidden transition-all',
        variant === 'default' && 'btn-primary',
        variant === 'secondary' && 'btn-secondary',
        variant === 'outline' && 'border-2 hover:bg-accent',
        'rounded-xl',
        className
      )}
      {...props}
    >
      <div className="relative flex items-center justify-center">
        {children}
      </div>
    </Button>
  );
};

export default GlowButton;