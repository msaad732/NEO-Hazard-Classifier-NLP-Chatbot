import { useState } from 'react';
import { GlassmorphicPanel } from './GlassmorphicPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { LoadingMeteor } from './LoadingMeteor';

export function ImpactSimulator() {
  const [diameter, setDiameter] = useState([500]);
  const [velocity, setVelocity] = useState([50000]);
  const [angle, setAngle] = useState([45]);
  const [location, setLocation] = useState('New York City');
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSimulate = () => {
    console.log('Simulation triggered', { diameter: diameter[0], velocity: velocity[0], angle: angle[0], location });
    setIsSimulating(true);
    setResult(null);

    setTimeout(() => {
      const energy = (diameter[0] / 100) * (velocity[0] / 1000) * Math.sin((angle[0] * Math.PI) / 180);
      setResult(
        `Impact Energy: ${energy.toFixed(2)} Megatons\n` +
        `Crater Diameter: ${(energy * 12).toFixed(0)}m\n` +
        `Devastation Radius: ${(energy * 8).toFixed(1)}km\n` +
        `Seismic Magnitude: ${(3 + Math.log10(energy)).toFixed(1)}`
      );
      setIsSimulating(false);
    }, 2000);
  };

  return (
    <GlassmorphicPanel data-testid="panel-simulator">
      <h2 className="text-2xl font-bold text-primary mb-6 font-sans">
        Impact Simulator
      </h2>

      <div className="space-y-6">
        <div>
          <Label htmlFor="diameter" className="text-foreground font-mono">
            Asteroid Diameter: {diameter[0]}m
          </Label>
          <Slider
            id="diameter"
            data-testid="slider-diameter"
            min={10}
            max={2000}
            step={10}
            value={diameter}
            onValueChange={setDiameter}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="velocity" className="text-foreground font-mono">
            Velocity: {velocity[0].toLocaleString()} km/h
          </Label>
          <Slider
            id="velocity"
            data-testid="slider-velocity"
            min={10000}
            max={200000}
            step={1000}
            value={velocity}
            onValueChange={setVelocity}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="angle" className="text-foreground font-mono">
            Impact Angle: {angle[0]}°
          </Label>
          <Slider
            id="angle"
            data-testid="slider-angle"
            min={0}
            max={90}
            step={5}
            value={angle}
            onValueChange={setAngle}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="location" className="text-foreground font-mono">
            Target Location
          </Label>
          <Input
            id="location"
            data-testid="input-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-2 bg-input border-primary font-mono text-foreground"
            placeholder="Enter location..."
          />
        </div>

        <Button
          data-testid="button-simulate"
          onClick={handleSimulate}
          disabled={isSimulating}
          className="w-full"
          size="default"
        >
          {isSimulating ? (
            <span className="flex items-center gap-2">
              <LoadingMeteor />
              Simulating...
            </span>
          ) : (
            'Run Simulation'
          )}
        </Button>

        {result && (
          <div 
            data-testid="panel-results"
            className="mt-4 p-4 bg-primary/10 border border-primary rounded-md"
          >
            <h3 className="text-primary font-bold mb-2 font-mono">Results:</h3>
            <pre className="text-foreground font-mono text-sm whitespace-pre-wrap">
              {result}
            </pre>
          </div>
        )}
      </div>
    </GlassmorphicPanel>
  );
}
