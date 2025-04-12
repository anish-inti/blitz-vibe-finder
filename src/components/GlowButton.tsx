
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
  intensity?: 'normal' | 'high';
  color?: 'pink' | 'red' | 'blue';
}

const GlowButton: React.FC<GlowButtonProps> = ({
  variant = 'default',
  size = 'default',
  children,
  className,
  showSparkle = false,
  intensity = 'normal',
  color = 'pink',
  ...props
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        'font-medium relative overflow-hidden transition-all text-white',
        variant === 'default' && color === 'pink' && 'bg-blitz-pink hover:bg-blitz-pink/90 active:bg-blitz-pink/80',
        variant === 'default' && color === 'red' && 'bg-blitz-neonred hover:bg-blitz-neonred/90 active:bg-blitz-neonred/80',
        variant === 'default' && color === 'blue' && 'bg-blitz-blue hover:bg-blitz-blue/90 active:bg-blitz-blue/80',
        variant === 'secondary' && 'bg-blitz-gray border border-white/10 hover:bg-blitz-gray/90',
        variant === 'outline' && 'border border-white/20 hover:bg-white/5 bg-transparent',
        'shadow-sm active:scale-[0.98] transition-all duration-200',
        'rounded-full',
        className
      )}
      {...props}
    >
      <div className="relative flex items-center justify-center">
        {children}
        {showSparkle && (
          <Sparkles className="ml-2 w-4 h-4 text-white opacity-80" />
        )}
      </div>
    </Button>
  );
};

export default GlowButton;
