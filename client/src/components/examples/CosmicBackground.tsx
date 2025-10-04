import { CosmicBackground } from '../CosmicBackground';

export default function CosmicBackgroundExample() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <CosmicBackground />
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="bg-black/70 backdrop-blur-sm border border-primary p-8 rounded-md">
          <p className="text-primary text-xl font-mono">Cosmic Background Active</p>
        </div>
      </div>
    </div>
  );
}
