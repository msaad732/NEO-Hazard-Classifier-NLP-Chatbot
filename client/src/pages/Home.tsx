import { lazy, Suspense, useState } from 'react';
import { Starfield } from '@/components/Starfield';
import { AsteroidDashboard } from '@/components/AsteroidDashboard';
import { Panel } from '@/components/Panel';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, BarChart3, BookOpen, MessageSquare, Waves } from 'lucide-react';

/**
 * Only the default tab is eager. Recharts and the chat view are each a large
 * dependency that most sessions never open, so they load on demand.
 */
const ImpactSimulator = lazy(() =>
  import('@/components/ImpactSimulator').then((m) => ({ default: m.ImpactSimulator })),
);
const MLPredictor = lazy(() =>
  import('@/components/MLPredictor').then((m) => ({ default: m.MLPredictor })),
);
const AIChat = lazy(() => import('@/components/AIChat').then((m) => ({ default: m.AIChat })));
const About = lazy(() => import('@/components/About').then((m) => ({ default: m.About })));

/** Placeholder shaped like the split panels it stands in for, so nothing jumps. */
function SectionFallback() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <Panel className="lg:col-span-5">
        <Skeleton className="h-5 w-40" />
        <div className="mt-6 space-y-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      </Panel>
      <Panel className="min-h-[320px] lg:col-span-7">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-6 h-[240px] w-full" />
      </Panel>
    </div>
  );
}

const SECTIONS = [
  { value: 'catalogue', label: 'Catalogue', icon: BarChart3 },
  { value: 'simulator', label: 'Simulator', icon: Waves },
  { value: 'predictor', label: 'Predictor', icon: Activity },
  { value: 'analyst', label: 'Analyst', icon: MessageSquare },
  { value: 'about', label: 'About', icon: BookOpen },
] as const;

export default function Home() {
  const [section, setSection] = useState<string>('catalogue');

  return (
    <div className="relative min-h-[100dvh] bg-background">
      <Starfield />

      <div className="relative z-10 flex min-h-[100dvh] flex-col">
        {/* Utility bar. Single line at every breakpoint, 64px tall. */}
        <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <img
                src="/icon-192.png"
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 shrink-0 rounded-md"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-tight text-foreground">
                  Neo-Sentinel
                </p>
                <p className="truncate text-2xs text-muted-foreground">
                  Planetary defence console
                </p>
              </div>
            </div>

            {/* Live semantic state: whether the console is connected to its services. */}
            <div className="flex shrink-0 items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-status-nominal" aria-hidden="true" />
              <span className="font-mono text-2xs uppercase tracking-[0.12em] text-muted-foreground">
                Systems nominal
              </span>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <Tabs value={section} onValueChange={setSection} className="space-y-6">
            {/* Segmented control: hairline chassis, accent reserved for the active leaf. */}
            <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-lg border border-border bg-card/60 p-1 backdrop-blur-sm">
              {SECTIONS.map(({ value, label, icon: Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  data-testid={`tab-${value}`}
                  className="shrink-0 gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none hover:text-foreground data-[state=active]:hover:text-primary-foreground"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="catalogue" className="mt-0 animate-panel-in">
              <AsteroidDashboard />
            </TabsContent>

            <TabsContent value="simulator" className="mt-0 animate-panel-in">
              <Suspense fallback={<SectionFallback />}>
                <ImpactSimulator />
              </Suspense>
            </TabsContent>

            <TabsContent value="predictor" className="mt-0 animate-panel-in">
              <Suspense fallback={<SectionFallback />}>
                <MLPredictor />
              </Suspense>
            </TabsContent>

            <TabsContent value="analyst" className="mt-0 animate-panel-in">
              <Suspense fallback={<SectionFallback />}>
                <AIChat />
              </Suspense>
            </TabsContent>

            <TabsContent value="about" className="mt-0 animate-panel-in">
              <Suspense fallback={<SectionFallback />}>
                <About />
              </Suspense>
            </TabsContent>
          </Tabs>
        </main>

        <footer className="border-t border-border bg-background/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p>Neo-Sentinel, 2025. Impact estimates are order-of-magnitude only.</p>
            <p>
              Data sources:{' '}
              <a
                href="https://api.nasa.gov/"
                target="_blank"
                rel="noreferrer"
                className="rounded-sm text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-primary"
              >
                NASA NeoWs
              </a>
              {', '}
              <a
                href="https://earthquake.usgs.gov/earthquakes/feed/"
                target="_blank"
                rel="noreferrer"
                className="rounded-sm text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-primary"
              >
                USGS
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
