
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const GlowButton: React.FC<GlowButtonProps> = ({
  variant = 'default',
  size = 'default',
  children,
  className,
  ...props
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        'font-medium relative overflow-hidden glow-button transition-all',
        variant === 'default' && 'bg-blitz-purple hover:bg-blitz-purple/90',
        variant === 'secondary' && 'bg-blitz-blue hover:bg-blitz-blue/90',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

export default GlowButton;
