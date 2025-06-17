import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNativeFeatures } from '@/hooks/use-native-features';
import { ImpactStyle } from '@capacitor/haptics';

interface TouchOptimizedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
  className?: string;
  hapticFeedback?: boolean;
  hapticStyle?: ImpactStyle;
}

const TouchOptimizedButton: React.FC<TouchOptimizedButtonProps> = ({
  variant = 'default',
  size = 'default',
  children,
  className,
  hapticFeedback = true,
  hapticStyle = ImpactStyle.Light,
  onClick,
  ...props
}) => {
  const { triggerHaptic } = useNativeFeatures();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (hapticFeedback) {
      await triggerHaptic(hapticStyle);
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        // Enhanced touch targets for mobile
        'min-h-[44px] min-w-[44px] touch-manipulation',
        // Better active states for mobile
        'active:scale-95 transition-transform duration-150',
        // Prevent text selection on mobile
        'select-none',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
};

export default TouchOptimizedButton;