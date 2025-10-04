import { GlassmorphicPanel } from '../GlassmorphicPanel';
import { CosmicBackground } from '../CosmicBackground';

export default function GlassmorphicPanelExample() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <CosmicBackground />
      <div className="relative z-10 flex items-center justify-center h-full p-8">
        <GlassmorphicPanel className="max-w-md">
          <h2 className="text-2xl font-bold text-primary mb-4">Glassmorphic Panel</h2>
          <p className="text-foreground font-mono text-sm mb-4">
            This panel features a semi-transparent background with backdrop blur,
            creating the holographic effect perfect for a space command center.
          </p>
          <div className="flex gap-2">
            <span className="text-secondary">●</span>
            <span className="text-accent">●</span>
            <span className="text-primary">●</span>
          </div>
        </GlassmorphicPanel>
      </div>
    </div>
  );
}
