
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
        'font-medium relative overflow-hidden transition-all backdrop-blur-sm text-white',
        intensity === 'normal' ? 'glow-button' : 'glow-button-intense',
        variant === 'default' && color === 'pink' && 'bg-blitz-pink hover:bg-blitz-pink/90',
        variant === 'default' && color === 'red' && 'bg-blitz-neonred hover:bg-blitz-neonred/90',
        variant === 'default' && color === 'blue' && 'bg-blitz-blue hover:bg-blitz-blue/90',
        variant === 'secondary' && 'bg-blitz-darkgray border border-blitz-pink/50 hover:bg-blitz-darkgray/90',
        variant === 'outline' && 'border border-blitz-pink hover:bg-blitz-pink/10 bg-transparent',
        color === 'pink' && 'neon-glow',
        color === 'red' && 'neon-red-glow',
        'shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300',
        'rounded-xl',
        className
      )}
      {...props}
    >
      <div className="relative flex items-center justify-center">
        {children}
        {showSparkle && (
          <Sparkles className="ml-2 w-4 h-4 text-white animate-pulse-glow" />
        )}
      </div>
    </Button>
  );
};

export default GlowButton;
