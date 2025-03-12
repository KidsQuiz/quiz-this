
import React, { useState } from 'react';
import { cn } from "@/lib/utils";

interface AvatarProps {
  src: string;
  alt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Avatar = ({ src, alt, className, size = 'md' }: AvatarProps) => {
  const [isLoading, setIsLoading] = useState(true);
  
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };
  
  return (
    <div className="relative">
      {isLoading && (
        <div className={cn(
          "absolute inset-0 bg-muted rounded-full animate-pulse-soft",
          sizeClasses[size]
        )}/>
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          "object-cover rounded-full ring-2 ring-white/80 dark:ring-black/40 shadow-xl",
          "transition-opacity duration-300 ease-apple",
          isLoading ? "opacity-0" : "opacity-100",
          sizeClasses[size],
          className
        )}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default Avatar;
