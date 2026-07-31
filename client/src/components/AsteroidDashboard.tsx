import { useMemo, useState } from 'react';
import { AsteroidCard } from './AsteroidCard';
import { DataChart } from './DataChart';
import { Panel, PanelHeader, Readout } from './Panel';
import { Input } from '@/components/ui/input';
import { Search, SearchX } from 'lucide-react';
import { formatNumber } from '@/lib/format';

export interface Asteroid {
  name: string;
  designation: string;
  /** Mean diameter, metres. */
  diameter: number;
  /** Close-approach relative speed, km/h. */
  velocity: number;
  /** Nominal miss distance, km. */
  missDistance: number;
  hazardous: boolean;
  approachDate: string;
}

/**
 * Reference catalogue of characterised near-Earth objects. Diameters and
 * designations are the published values; encounter speed, miss distance and
 * approach date are illustrative and labelled as such in the UI, because this
 * build is not yet wired to the live NeoWs feed.
 */
const CATALOGUE: Asteroid[] = [
  {
    name: 'Apophis',
    designation: '99942',
    diameter: 340,
    velocity: 30731,
    missDistance: 31600,
    hazardous: true,
    approachDate: '2029-04-13',
  },
  {
    name: 'Bennu',
    designation: '101955',
    diameter: 492,
    velocity: 101000,
    missDistance: 7500000,
    hazardous: true,
    approachDate: '2060-09-23',
  },
  {
    name: 'Didymos',
    designation: '65803',
    diameter: 780,
    velocity: 82400,
    missDistance: 5900000,
    hazardous: false,
    approachDate: '2062-11-04',
  },
  {
    name: 'Ryugu',
    designation: '162173',
    diameter: 900,
    velocity: 45800,
    missDistance: 18000000,
    hazardous: false,
    approachDate: '2076-01-30',
  },
  {
    name: 'Itokawa',
    designation: '25143',
    diameter: 330,
    velocity: 51200,
    missDistance: 12400000,
    hazardous: false,
    approachDate: '2071-06-08',
  },
  {
    name: '1950 DA',
    designation: '29075',
    diameter: 1300,
    velocity: 63900,
    missDistance: 2900000,
    hazardous: true,
    approachDate: '2032-03-02',
  },
];

const VELOCITY_BANDS = [
  { label: '<40k', test: (v: number) => v < 40_000 },
  { label: '40-60k', test: (v: number) => v >= 40_000 && v < 60_000 },
  { label: '60-80k', test: (v: number) => v >= 60_000 && v < 80_000 },
  { label: '80k+', test: (v: number) => v >= 80_000 },
];

export function AsteroidDashboard() {
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATALOGUE;
    return CATALOGUE.filter(
      (a) => a.name.toLowerCase().includes(q) || a.designation.includes(q),
    );
  }, [query]);

  /**
   * Every figure below is derived from CATALOGUE, so the charts and the summary
   * can never drift away from the rows the user is actually looking at.
   */
  const summary = useMemo(() => {
    const hazardous = CATALOGUE.filter((a) => a.hazardous);
    const nearest = CATALOGUE.reduce((a, b) => (a.missDistance <= b.missDistance ? a : b));
    const largest = CATALOGUE.reduce((a, b) => (a.diameter >= b.diameter ? a : b));
    return {
      tracked: CATALOGUE.length,
      hazardous: hazardous.length,
      nearest,
      largest,
    };
  }, []);

  const velocityDistribution = useMemo(
    () => VELOCITY_BANDS.map((band) => CATALOGUE.filter((a) => band.test(a.velocity)).length),
    [],
  );

  const hazardSplit = useMemo(
    () => [summary.hazardous, summary.tracked - summary.hazardous],
    [summary],
  );

  return (
    <div className="space-y-6">
      {/* Telemetry strip. Hairline dividers, no nested card boxes. */}
      <Panel>
        <PanelHeader
          title="Near-Earth object catalogue"
          description="Characterised objects with a close approach on the books."
          actions={
            <div className="relative w-full sm:w-64">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                data-testid="input-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name or designation"
                aria-label="Search the catalogue"
                className="pl-9"
              />
            </div>
          }
        />

        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-border pt-6 lg:grid-cols-4 lg:divide-x lg:divide-border">
          <Readout label="Objects tracked" value={summary.tracked} data-testid="stat-tracked" />
          <Readout
            label="Flagged hazardous"
            value={summary.hazardous}
            note={`of ${summary.tracked} tracked`}
            className="lg:pl-6"
            data-testid="stat-hazardous"
          />
          <Readout
            label="Closest approach"
            value={formatNumber(summary.nearest.missDistance / 1000)}
            unit="thousand km"
            note={summary.nearest.name}
            className="lg:pl-6"
            data-testid="stat-nearest"
          />
          <Readout
            label="Largest object"
            value={formatNumber(summary.largest.diameter)}
            unit="m"
            note={summary.largest.name}
            className="lg:pl-6"
            data-testid="stat-largest"
          />
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <DataChart
          className="lg:col-span-2"
          title="Encounter speed distribution"
          description="Objects per relative-speed band, km/h"
          type="bar"
          labels={VELOCITY_BANDS.map((b) => b.label)}
          datasets={[{ label: 'Objects', data: velocityDistribution }]}
        />
        <DataChart
          title="Hazard classification"
          description="Potentially hazardous versus the rest"
          type="doughnut"
          labels={['Hazardous', 'Not hazardous']}
          datasets={[{ label: 'Objects', data: hazardSplit }]}
        />
      </div>

      {visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((asteroid) => (
            <AsteroidCard key={asteroid.designation} {...asteroid} />
          ))}
        </div>
      ) : (
        <Panel className="flex flex-col items-center justify-center py-16 text-center">
          <SearchX className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
          <p className="mt-4 text-sm font-medium text-foreground">No objects match that search</p>
          <p className="mt-1 max-w-[42ch] text-sm text-muted-foreground">
            Try a designation such as 99942, or clear the field to see all{' '}
            {CATALOGUE.length} tracked objects.
          </p>
        </Panel>
      )}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Diameters and designations are published values. Encounter speed, miss distance and
        approach date in this build are illustrative pending the live NeoWs connection.
      </p>
    </div>
  );
}
