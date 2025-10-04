import { AsteroidDashboard } from '../AsteroidDashboard';
import { CosmicBackground } from '../CosmicBackground';

export default function AsteroidDashboardExample() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <CosmicBackground />
      <div className="relative z-10 p-8">
        <AsteroidDashboard />
      </div>
    </div>
  );
}
