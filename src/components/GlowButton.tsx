
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
}

const GlowButton: React.FC<GlowButtonProps> = ({
  variant = 'default',
  size = 'default',
  children,
  className,
  showSparkle = false,
  intensity = 'normal',
  ...props
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        'font-medium relative overflow-hidden transition-all backdrop-blur-sm',
        intensity === 'normal' ? 'glow-button' : 'glow-button-intense',
        variant === 'default' && 'bg-blitz-purple hover:bg-blitz-purple/90',
        variant === 'secondary' && 'bg-blitz-blue hover:bg-blitz-blue/90',
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
