import { useState } from 'react';
import { Panel, PanelHeader, Readout } from './Panel';
import { RiskChip } from './RiskChip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Crosshair } from 'lucide-react';
import {
  computeImpact,
  consequenceFromEnergy,
  severityFromEnergy,
  type ImpactResult,
} from '@/lib/impact';
import { formatDistance, formatInterval, formatNumber, formatScientific } from '@/lib/format';

interface Scenario extends ImpactResult {
  location: string;
}

const SEVERITY_LABEL = {
  nominal: 'Nominal',
  elevated: 'Elevated',
  high: 'High',
  critical: 'Critical',
} as const;

export function ImpactSimulator() {
  const [diameter, setDiameter] = useState([500]);
  const [velocityKmh, setVelocityKmh] = useState([64000]);
  const [angle, setAngle] = useState([45]);
  const [location, setLocation] = useState('');
  const [running, setRunning] = useState(false);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRun = () => {
    const target = location.trim();
    if (!target) {
      setError('Enter a target location before running the model.');
      return;
    }

    setError(null);
    setRunning(true);
    setScenario(null);

    // The model is instantaneous. The short hold exists so the readouts do not
    // flash into place before the user has finished reading the controls.
    window.setTimeout(() => {
      const result = computeImpact({
        diameterM: diameter[0],
        velocityMs: (velocityKmh[0] * 1000) / 3600,
        angleDeg: angle[0],
      });
      setScenario({ ...result, location: target });
      setRunning(false);
    }, 450);
  };

  const controls = [
    {
      id: 'diameter',
      label: 'Impactor diameter',
      display: `${formatNumber(diameter[0])} m`,
      min: 10,
      max: 2000,
      step: 10,
      value: diameter,
      onChange: setDiameter,
    },
    {
      id: 'velocity',
      label: 'Entry speed',
      display: `${formatNumber(velocityKmh[0])} km/h`,
      min: 40_000,
      max: 260_000,
      step: 1000,
      value: velocityKmh,
      onChange: setVelocityKmh,
    },
    {
      id: 'angle',
      label: 'Impact angle from horizontal',
      display: `${angle[0]}°`,
      min: 5,
      max: 90,
      step: 5,
      value: angle,
      onChange: setAngle,
    },
  ];

  const severity = scenario ? severityFromEnergy(scenario.energyMt) : null;
  const crater = scenario ? formatDistance(scenario.craterDiameterM) : null;
  const fireball = scenario ? formatDistance(scenario.fireballRadiusM) : null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <Panel className="lg:col-span-5">
        <PanelHeader
          title="Impact simulator"
          description="Forward model of a hypothetical arrival."
        />

        <div className="mt-6 space-y-6">
          {controls.map(({ id, label, display, min, max, step, value, onChange }) => (
            <div key={id}>
              <div className="flex items-baseline justify-between gap-3">
                <Label htmlFor={id} className="text-sm font-normal text-foreground">
                  {label}
                </Label>
                <span className="font-mono text-sm text-foreground tnum">{display}</span>
              </div>
              <Slider
                id={id}
                data-testid={`slider-${id}`}
                min={min}
                max={max}
                step={step}
                value={value}
                onValueChange={onChange}
                className="mt-3"
              />
            </div>
          ))}

          <div>
            <Label htmlFor="location" className="text-sm font-normal text-foreground">
              Target location
            </Label>
            <Input
              id="location"
              data-testid="input-location"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                if (error) setError(null);
              }}
              className="mt-2"
              placeholder="Lisbon, Portugal"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'location-error' : 'location-help'}
            />
            {error ? (
              <p id="location-error" className="mt-2 text-xs text-status-critical">
                {error}
              </p>
            ) : (
              <p id="location-help" className="mt-2 text-xs text-muted-foreground">
                Labels the scenario. Terrain is modelled as sedimentary land.
              </p>
            )}
          </div>

          <Button
            data-testid="button-simulate"
            onClick={handleRun}
            disabled={running}
            className="w-full"
          >
            {running ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" />
                Running model
              </>
            ) : (
              'Run simulation'
            )}
          </Button>
        </div>
      </Panel>

      <div className="lg:col-span-7">
        {running && (
          <Panel data-testid="panel-results-loading">
            {/* Skeleton mirrors the real readout grid so nothing shifts on arrival. */}
            <Skeleton className="h-5 w-48" />
            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-border pt-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="mt-2.5 h-6 w-28" />
                </div>
              ))}
            </div>
          </Panel>
        )}

        {!running && scenario && severity && crater && fireball && (
          <Panel data-testid="panel-results">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-base font-semibold tracking-tight text-foreground">
                  Estimated effects at {scenario.location}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {consequenceFromEnergy(scenario.energyMt)}
                </p>
              </div>
              <RiskChip
                severity={severity}
                label={SEVERITY_LABEL[severity]}
                data-testid="chip-severity"
              />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-border pt-6 sm:grid-cols-3">
              <Readout
                label="Yield"
                value={formatScientific(scenario.energyMt)}
                unit="Mt TNT"
                data-testid="readout-energy"
              />
              <Readout
                label="Impactor mass"
                value={formatScientific(scenario.massKg)}
                unit="kg"
                data-testid="readout-mass"
              />
              <Readout
                label="Crater diameter"
                value={crater.value}
                unit={crater.unit}
                data-testid="readout-crater"
              />
              <Readout
                label="Fireball radius"
                value={fireball.value}
                unit={fireball.unit}
                data-testid="readout-fireball"
              />
              <Readout
                label="Seismic magnitude"
                value={scenario.seismicMagnitude.toFixed(1)}
                unit="Mw"
                data-testid="readout-seismic"
              />
              <Readout
                label="Recurrence"
                value={formatInterval(scenario.recurrenceYears)}
                note="mean interval globally"
                data-testid="readout-recurrence"
              />
            </div>

            <p className="mt-6 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
              First-order estimates for a stony impactor on a land target, after Collins,
              Melosh &amp; Marcus (2005). Atmospheric break-up, ocean impact and airblast
              overpressure are not modelled.
            </p>
          </Panel>
        )}

        {!running && !scenario && (
          <Panel
            className="flex min-h-[320px] flex-col items-center justify-center py-12 text-center"
            data-testid="panel-results-empty"
          >
            <Crosshair className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
            <p className="mt-4 text-sm font-medium text-foreground">No scenario yet</p>
            <p className="mt-1 max-w-[44ch] text-sm text-muted-foreground">
              Set the impactor parameters, name a target, then run the model to see yield,
              crater size and seismic response.
            </p>
          </Panel>
        )}
      </div>
    </div>
  );
}
