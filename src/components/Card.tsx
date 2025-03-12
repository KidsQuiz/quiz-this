
import React from 'react';
import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  title: string;
  delay?: number;
}

const Card = ({ className, children, title, delay = 0 }: CardProps) => {
  return (
    <div 
      className={cn(
        "rounded-xl bg-card glassmorphism p-6 overflow-hidden card-transition",
        "hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-default",
        "animate-scale-in",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex flex-col">
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1 font-medium">
          {title}
        </div>
        {children}
      </div>
    </div>
  );
};

export default Card;
