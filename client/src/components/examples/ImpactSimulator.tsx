import { ImpactSimulator } from '../ImpactSimulator';
import { CosmicBackground } from '../CosmicBackground';

export default function ImpactSimulatorExample() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <CosmicBackground />
      <div className="relative z-10 flex items-center justify-center h-full p-8">
        <div className="max-w-2xl w-full">
          <ImpactSimulator />
        </div>
      </div>
    </div>
  );
}
