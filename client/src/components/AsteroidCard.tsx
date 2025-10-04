import { GlassmorphicPanel } from './GlassmorphicPanel';
import { Badge } from '@/components/ui/badge';

interface AsteroidCardProps {
  name: string;
  diameter: number;
  velocity: number;
  missDistance: number;
  hazardous: boolean;
  approachDate: string;
}

export function AsteroidCard({
  name,
  diameter,
  velocity,
  missDistance,
  hazardous,
  approachDate,
}: AsteroidCardProps) {
  return (
    <GlassmorphicPanel 
      className="hover-elevate active-elevate-2 transition-all cursor-pointer"
      data-testid={`card-asteroid-${name}`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-primary font-bold text-lg font-mono" data-testid={`text-name-${name}`}>
          {name}
        </h3>
        {hazardous && (
          <Badge variant="destructive" className="text-xs" data-testid={`badge-hazard-${name}`}>
            HAZARD
          </Badge>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm font-mono">
        <div>
          <p className="text-muted-foreground">Diameter</p>
          <p className="text-foreground" data-testid={`text-diameter-${name}`}>{diameter.toFixed(0)}m</p>
        </div>
        <div>
          <p className="text-muted-foreground">Velocity</p>
          <p className="text-foreground" data-testid={`text-velocity-${name}`}>{velocity.toFixed(0)} km/h</p>
        </div>
        <div>
          <p className="text-muted-foreground">Miss Distance</p>
          <p className="text-foreground" data-testid={`text-distance-${name}`}>{(missDistance / 1000).toFixed(0)}k km</p>
        </div>
        <div>
          <p className="text-muted-foreground">Approach</p>
          <p className="text-foreground" data-testid={`text-date-${name}`}>{approachDate}</p>
        </div>
      </div>
    </GlassmorphicPanel>
  );
}
