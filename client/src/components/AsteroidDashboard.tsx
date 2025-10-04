import { useState } from 'react';
import { AsteroidCard } from './AsteroidCard';
import { DataChart } from './DataChart';
import { GlassmorphicPanel } from './GlassmorphicPanel';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AsteroidDashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  const asteroids = [
    {
      name: '2024 XR-42',
      diameter: 450,
      velocity: 87340,
      missDistance: 4832000,
      hazardous: true,
      approachDate: '2025-03-15',
    },
    {
      name: 'Bennu',
      diameter: 492,
      velocity: 101000,
      missDistance: 7500000,
      hazardous: false,
      approachDate: '2025-04-22',
    },
    {
      name: 'Apophis',
      diameter: 370,
      velocity: 30731,
      missDistance: 31000000,
      hazardous: true,
      approachDate: '2029-04-13',
    },
    {
      name: '1999 RQ36',
      diameter: 510,
      velocity: 63000,
      missDistance: 12000000,
      hazardous: false,
      approachDate: '2025-06-08',
    },
    {
      name: '2023 YZ-11',
      diameter: 280,
      velocity: 94200,
      missDistance: 8900000,
      hazardous: true,
      approachDate: '2025-05-19',
    },
    {
      name: 'Ryugu',
      diameter: 900,
      velocity: 45800,
      missDistance: 18000000,
      hazardous: false,
      approachDate: '2026-01-30',
    },
  ];

  const filteredAsteroids = asteroids.filter((asteroid) =>
    asteroid.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <GlassmorphicPanel>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-primary font-sans mb-1" style={{ textShadow: '0 0 20px rgba(139, 92, 246, 0.6)' }}>
              🌠 Near-Earth Objects
            </h2>
            <p className="text-muted-foreground font-mono text-sm">
              Real-time asteroid tracking & analysis
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <Input
                data-testid="input-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search asteroids..."
                className="pl-10 bg-input border-primary font-mono"
              />
            </div>
            <Button variant="outline" size="icon" data-testid="button-filter">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </GlassmorphicPanel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataChart
          title="Velocity Distribution"
          type="bar"
          labels={['<50k', '50-75k', '75-100k', '>100k']}
          datasets={[
            {
              label: 'km/h Range',
              data: [2, 2, 1, 1],
            },
          ]}
        />
        <DataChart
          title="Hazard Assessment"
          type="doughnut"
          labels={['Hazardous', 'Safe']}
          datasets={[
            {
              label: 'Objects',
              data: [3, 3],
            },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAsteroids.map((asteroid) => (
          <AsteroidCard key={asteroid.name} {...asteroid} />
        ))}
      </div>

      {filteredAsteroids.length === 0 && (
        <GlassmorphicPanel>
          <p className="text-center text-muted-foreground font-mono py-8">
            No asteroids found matching "{searchTerm}"
          </p>
        </GlassmorphicPanel>
      )}
    </div>
  );
}
