import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassmorphicPanelProps {
  children: ReactNode;
  className?: string;
  neonBorder?: boolean;
  'data-testid'?: string;
}

export function GlassmorphicPanel({ 
  children, 
  className, 
  neonBorder = true,
  'data-testid': dataTestId 
}: GlassmorphicPanelProps) {
  return (
    <div
      data-testid={dataTestId}
      className={cn(
        'bg-black/70 backdrop-blur-md rounded-md p-6',
        neonBorder && 'border border-primary shadow-lg',
        className
      )}
      style={{
        boxShadow: neonBorder ? '0 0 20px rgba(0, 255, 255, 0.3)' : undefined,
      }}
    >
      {children}
    </div>
  );
}
