import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
  className?: string;
  showSparkle?: boolean;
  color?: 'primary' | 'secondary' | 'accent';
}

const GlowButton: React.FC<GlowButtonProps> = ({
  variant = 'default',
  size = 'default',
  children,
  className,
  showSparkle = false,
  color = 'primary',
  ...props
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'btn-primary';
      case 'secondary':
        return 'btn-secondary';
      case 'accent':
        return 'bg-gradient-to-r from-blitz-accent to-blitz-secondary text-white';
      default:
        return 'btn-primary';
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        'font-bold relative overflow-hidden transition-all duration-300 interactive group',
        variant === 'default' && getColorClasses(),
        variant === 'outline' && 'btn-outline',
        'rounded-2xl shadow-lg hover:shadow-xl',
        className
      )}
      {...props}
    >
      <div className="relative flex items-center justify-center">
        {children}
        {showSparkle && (
          <Sparkles className="ml-2 w-4 h-4 opacity-80 group-hover:animate-bounce-in" />
        )}
      </div>
      
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
    </Button>
  );
};

export default GlowButton;