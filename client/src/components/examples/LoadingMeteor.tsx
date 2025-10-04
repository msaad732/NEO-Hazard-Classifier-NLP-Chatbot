import { LoadingMeteor } from '../LoadingMeteor';
import { GlassmorphicPanel } from '../GlassmorphicPanel';
import { CosmicBackground } from '../CosmicBackground';

export default function LoadingMeteorExample() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <CosmicBackground />
      <div className="relative z-10 flex items-center justify-center h-full">
        <GlassmorphicPanel>
          <div className="text-center">
            <p className="text-primary font-mono mb-6">Processing simulation...</p>
            <LoadingMeteor />
          </div>
        </GlassmorphicPanel>
      </div>
    </div>
  );
}
