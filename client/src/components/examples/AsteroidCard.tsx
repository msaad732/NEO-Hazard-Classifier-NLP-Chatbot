import { AsteroidCard } from '../AsteroidCard';
import { PreviewShell } from './PreviewShell';

export default function AsteroidCardExample() {
  return (
    <PreviewShell>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AsteroidCard
          name="Apophis"
          designation="99942"
          diameter={340}
          velocity={30731}
          missDistance={31600}
          hazardous
          approachDate="2029-04-13"
        />
        <AsteroidCard
          name="Bennu"
          designation="101955"
          diameter={492}
          velocity={101000}
          missDistance={7500000}
          hazardous
          approachDate="2060-09-23"
        />
        <AsteroidCard
          name="Ryugu"
          designation="162173"
          diameter={900}
          velocity={45800}
          missDistance={18000000}
          hazardous={false}
          approachDate="2076-01-30"
        />
      </div>
    </PreviewShell>
  );
}
