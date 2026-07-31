import { ReactNode } from 'react';
import { Starfield } from '../Starfield';

/** Shared chassis for the component previews so each one matches the real app. */
export function PreviewShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-[100dvh] bg-background">
      <Starfield />
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6">
        {children}
      </div>
    </div>
  );
}
