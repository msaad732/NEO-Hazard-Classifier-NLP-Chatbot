import { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { GlassmorphicPanel } from './GlassmorphicPanel';

Chart.register(...registerables);

interface DataChartProps {
  title: string;
  type: 'line' | 'bar' | 'doughnut';
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
  }[];
}

export function DataChart({ title, type, labels, datasets }: DataChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type,
      data: {
        labels,
        datasets: datasets.map((dataset, index) => ({
          ...dataset,
          borderColor: dataset.borderColor || ['#00FFFF', '#FF00FF', '#FFD700', '#8B5CF6', '#F97316'][index % 5],
          backgroundColor: type === 'doughnut' 
            ? ['rgba(0, 255, 255, 0.5)', 'rgba(255, 0, 255, 0.5)', 'rgba(255, 215, 0, 0.5)'] 
            : (dataset.backgroundColor || `rgba(0, 255, 255, ${type === 'line' ? '0.1' : '0.5'})`),
          borderWidth: 2,
          tension: type === 'line' ? 0.4 : undefined,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#FFFFFF',
              font: {
                family: 'Space Mono, monospace',
                size: 12,
              },
            },
          },
          title: {
            display: false,
          },
        },
        scales: type !== 'doughnut' ? {
          x: {
            grid: {
              color: 'rgba(0, 255, 255, 0.1)',
            },
            ticks: {
              color: '#FFFFFF',
              font: {
                family: 'Space Mono, monospace',
                size: 10,
              },
            },
          },
          y: {
            grid: {
              color: 'rgba(0, 255, 255, 0.1)',
            },
            ticks: {
              color: '#FFFFFF',
              font: {
                family: 'Space Mono, monospace',
                size: 10,
              },
            },
          },
        } : undefined,
      },
    };

    chartRef.current = new Chart(ctx, config);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [type, labels, datasets]);

  return (
    <GlassmorphicPanel data-testid={`chart-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <h3 className="text-primary font-bold text-lg mb-4 font-sans">{title}</h3>
      <div className="h-[300px]">
        <canvas ref={canvasRef}></canvas>
      </div>
    </GlassmorphicPanel>
  );
}
