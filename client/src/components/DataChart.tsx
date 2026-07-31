import { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Panel } from './Panel';
import { cn } from '@/lib/utils';

Chart.register(...registerables);

interface DataChartProps {
  title: string;
  description?: string;
  type: 'line' | 'bar' | 'doughnut';
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
  className?: string;
}

/** Reads a design token off the document so charts can never drift from the theme. */
function token(name: string, alpha = 1): string {
  if (typeof window === 'undefined') return `hsl(0 0% 50% / ${alpha})`;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return raw ? `hsl(${raw} / ${alpha})` : `hsl(0 0% 50% / ${alpha})`;
}

export function DataChart({
  title,
  description,
  type,
  labels,
  datasets,
  className,
}: DataChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const grid = token('--border', 0.55);
    const tick = token('--muted-foreground');
    const surface = token('--popover');
    const text = token('--foreground');
    // Categorical order matches --chart-1..5, the one series ramp for the app.
    const series = [1, 2, 3, 4, 5].map((i) => token(`--chart-${i}`));

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fontFamily = getComputedStyle(document.documentElement)
      .getPropertyValue('--font-mono')
      .trim();

    const config: ChartConfiguration = {
      type,
      data: {
        labels,
        datasets: datasets.map((dataset, index) => ({
          ...dataset,
          borderColor: type === 'doughnut' ? token('--card') : series[index % series.length],
          backgroundColor:
            type === 'doughnut'
              ? labels.map((_, i) => series[i % series.length])
              : series[index % series.length],
          borderWidth: type === 'doughnut' ? 2 : 0,
          borderRadius: type === 'bar' ? 3 : undefined,
          tension: type === 'line' ? 0.35 : undefined,
          hoverOffset: type === 'doughnut' ? 4 : undefined,
          // Ring thickness lives on the dataset; `cutout` is not a valid key on
          // the generic (non-doughnut-narrowed) options type.
          ...(type === 'doughnut' ? { cutout: '62%' } : {}),
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: reduceMotion ? false : { duration: 320 },
        plugins: {
          legend: {
            display: type === 'doughnut',
            position: 'bottom',
            labels: {
              color: tick,
              boxWidth: 8,
              boxHeight: 8,
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 16,
              font: { family: fontFamily, size: 11 },
            },
          },
          tooltip: {
            backgroundColor: surface,
            borderColor: token('--border'),
            borderWidth: 1,
            titleColor: text,
            bodyColor: tick,
            padding: 10,
            cornerRadius: 4,
            displayColors: false,
            titleFont: { family: fontFamily, size: 11 },
            bodyFont: { family: fontFamily, size: 12 },
          },
        },
        scales:
          type === 'doughnut'
            ? undefined
            : {
                x: {
                  border: { display: false },
                  grid: { display: false },
                  ticks: { color: tick, font: { family: fontFamily, size: 11 } },
                },
                y: {
                  beginAtZero: true,
                  border: { display: false },
                  grid: { color: grid, tickLength: 0 },
                  ticks: {
                    color: tick,
                    precision: 0,
                    padding: 8,
                    font: { family: fontFamily, size: 11 },
                  },
                },
              },
      },
    };

    chartRef.current = new Chart(ctx, config);

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [type, labels, datasets]);

  return (
    <Panel
      className={className}
      data-testid={`chart-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div>
        <h3 className="text-base font-semibold tracking-tight text-foreground">{title}</h3>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className={cn('mt-5 h-[260px]')}>
        <canvas ref={canvasRef} role="img" aria-label={description ?? title} />
      </div>
    </Panel>
  );
}
