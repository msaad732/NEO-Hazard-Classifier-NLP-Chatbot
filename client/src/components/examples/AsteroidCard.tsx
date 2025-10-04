import { AsteroidCard } from '../AsteroidCard';
import { CosmicBackground } from '../CosmicBackground';

export default function AsteroidCardExample() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <CosmicBackground />
      <div className="relative z-10 flex items-center justify-center h-full p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
          <AsteroidCard
            name="2024 XR-42"
            diameter={450}
            velocity={87340}
            missDistance={4832000}
            hazardous={true}
            approachDate="2025-03-15"
          />
          <AsteroidCard
            name="Bennu"
            diameter={492}
            velocity={101000}
            missDistance={7500000}
            hazardous={false}
            approachDate="2025-04-22"
          />
          <AsteroidCard
            name="Apophis"
            diameter={370}
            velocity={30731}
            missDistance={31000000}
            hazardous={true}
            approachDate="2029-04-13"
          />
        </div>
      </div>
    </div>
  );
}
