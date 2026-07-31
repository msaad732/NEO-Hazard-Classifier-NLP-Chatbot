import { Panel } from './Panel';
import { RiskChip } from './RiskChip';
import { formatNumber } from '@/lib/format';

interface AsteroidCardProps {
  name: string;
  designation: string;
  diameter: number;
  velocity: number;
  missDistance: number;
  hazardous: boolean;
  approachDate: string;
}

const APPROACH_FORMAT = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

function formatApproach(iso: string): string {
  const parsed = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? iso : APPROACH_FORMAT.format(parsed);
}

export function AsteroidCard({
  name,
  designation,
  diameter,
  velocity,
  missDistance,
  hazardous,
  approachDate,
}: AsteroidCardProps) {
  const fields = [
    { label: 'Diameter', value: formatNumber(diameter), unit: 'm', testid: 'diameter' },
    { label: 'Rel. speed', value: formatNumber(velocity), unit: 'km/h', testid: 'velocity' },
    {
      label: 'Miss distance',
      value: formatNumber(missDistance / 1000),
      unit: 'k km',
      testid: 'distance',
    },
    { label: 'Approach', value: formatApproach(approachDate), unit: '', testid: 'date' },
  ];

  return (
    <Panel
      className="transition-colors hover:border-foreground/20"
      data-testid={`card-asteroid-${designation}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3
            className="truncate text-base font-semibold tracking-tight text-foreground"
            data-testid={`text-name-${designation}`}
          >
            {name}
          </h3>
          <p className="mt-0.5 font-mono text-2xs text-muted-foreground tnum">({designation})</p>
        </div>
        <RiskChip
          severity={hazardous ? 'high' : 'nominal'}
          label={hazardous ? 'Hazardous' : 'Nominal'}
          data-testid={`badge-hazard-${designation}`}
        />
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-border pt-4">
        {fields.map(({ label, value, unit, testid }) => (
          <div key={label}>
            <dt className="field-label">{label}</dt>
            <dd
              className="mt-1 font-mono text-sm text-foreground tnum"
              data-testid={`text-${testid}-${designation}`}
            >
              {value}
              {unit && <span className="ml-1 text-muted-foreground">{unit}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}
