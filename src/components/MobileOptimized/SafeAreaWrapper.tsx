import React from 'react';
import { cn } from '@/lib/utils';
import { useNativeFeatures } from '@/hooks/use-native-features';

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  className?: string;
  top?: boolean;
  bottom?: boolean;
}

const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  className,
  top = true,
  bottom = true,
}) => {
  const { isNative, deviceInfo } = useNativeFeatures();

  const getSafeAreaClasses = () => {
    if (!isNative) return '';
    
    let classes = '';
    
    // Add safe area padding for iOS devices
    if (deviceInfo?.platform === 'ios') {
      if (top) classes += ' pt-safe-top';
      if (bottom) classes += ' pb-safe-bottom';
    }
    
    return classes;
  };

  return (
    <div className={cn(getSafeAreaClasses(), className)}>
      {children}
    </div>
  );
};

export default SafeAreaWrapper;