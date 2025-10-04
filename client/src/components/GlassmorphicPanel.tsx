import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassmorphicPanelProps {
  children: ReactNode;
  className?: string;
  neonBorder?: boolean;
  funky?: boolean;
  'data-testid'?: string;
}

export function GlassmorphicPanel({ 
  children, 
  className, 
  neonBorder = true,
  funky = false,
  'data-testid': dataTestId 
}: GlassmorphicPanelProps) {
  return (
    <div
      data-testid={dataTestId}
      className={cn(
        'bg-black/60 backdrop-blur-md rounded-lg p-6 transition-all',
        neonBorder && 'border-2 border-primary shadow-lg',
        funky && 'animate-float',
        className
      )}
      style={{
        boxShadow: neonBorder ? '0 0 25px rgba(139, 92, 246, 0.4), 0 0 50px rgba(139, 92, 246, 0.2)' : undefined,
      }}
    >
      {children}
    </div>
  );
}
