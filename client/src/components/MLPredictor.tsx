import { useState } from 'react';
import { GlassmorphicPanel } from './GlassmorphicPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { mlPredictionInputSchema, type MLPredictionInput, type MLPredictionOutput } from '@shared/schema';
import { Loader2, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';

export function MLPredictor() {
  const { toast } = useToast();
  const [prediction, setPrediction] = useState<MLPredictionOutput | null>(null);

  const form = useForm<MLPredictionInput>({
    resolver: zodResolver(mlPredictionInputSchema),
    defaultValues: {
      diameter: 0.5,
      velocity: 20,
      distance: 100000,
      mass: 1e12,
      trajectoryAngle: 45,
    },
  });

  const predictMutation = useMutation({
    mutationFn: async (data: MLPredictionInput) => {
      const response = await apiRequest('POST', '/api/ml/predict', data);
      return response.json();
    },
    onSuccess: (data) => {
      setPrediction(data);
      toast({
        title: 'Prediction Complete',
        description: `Risk Level: ${data.riskLevel?.toUpperCase() || 'UNKNOWN'}`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Prediction Failed',
        description: error instanceof Error ? error.message : 'Failed to get prediction',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (data: MLPredictionInput) => {
    predictMutation.mutate(data);
  };

  const chartData = prediction
    ? [
        {
          name: 'Impact Probability',
          value: typeof prediction.impactProbability === 'number' ? prediction.impactProbability : 0,
          fill: 'hsl(var(--primary))',
        },
        {
          name: 'Energy (MT)',
          value: typeof prediction.estimatedEnergy === 'number' ? prediction.estimatedEnergy : 0,
          fill: 'hsl(var(--accent))',
        },
      ]
    : [];

  const riskLevelData = prediction
    ? [
        {
          name: 'Risk Level',
          value: prediction.riskLevel === 'critical' ? 100 : 
                 prediction.riskLevel === 'high' ? 75 :
                 prediction.riskLevel === 'medium' ? 50 : 25,
          fill: prediction.riskLevel === 'critical' ? '#ef4444' :
                prediction.riskLevel === 'high' ? '#f97316' :
                prediction.riskLevel === 'medium' ? '#eab308' : '#22c55e',
        },
      ]
    : [];

  const comparisonData = prediction
    ? [
        {
          metric: 'Impact Probability',
          current: typeof prediction.impactProbability === 'number' ? prediction.impactProbability : 0,
          threshold: 10,
        },
        {
          metric: 'Energy (MT)',
          current: typeof prediction.estimatedEnergy === 'number' ? prediction.estimatedEnergy : 0,
          threshold: typeof prediction.estimatedEnergy === 'number' ? prediction.estimatedEnergy * 0.5 : 0,
        },
      ]
    : [];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'high':
        return 'text-orange-500';
      case 'critical':
        return 'text-red-500';
      default:
        return 'text-primary';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <GlassmorphicPanel data-testid="panel-ml-form">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-primary/40">
          <Sparkles className="w-6 h-6 text-primary" data-testid="icon-ml" />
          <h2 className="text-2xl font-bold text-primary font-sans" style={{ textShadow: '0 0 15px rgba(139, 92, 246, 0.5)' }}>
            Impact Predictor
          </h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="diameter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Diameter (km)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.001"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      className="bg-input border-primary font-mono"
                      data-testid="input-diameter"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="velocity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Velocity (km/s)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      className="bg-input border-primary font-mono"
                      data-testid="input-velocity"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="distance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Distance from Earth (km)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="1000"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      className="bg-input border-primary font-mono"
                      data-testid="input-distance"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mass"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Mass (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="1e10"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      className="bg-input border-primary font-mono"
                      data-testid="input-mass"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trajectoryAngle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Trajectory Angle (degrees)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="1"
                      min="0"
                      max="90"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      className="bg-input border-primary font-mono"
                      data-testid="input-trajectory"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={predictMutation.isPending}
              data-testid="button-predict"
            >
              {predictMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                'Run Prediction'
              )}
            </Button>
          </form>
        </Form>
      </GlassmorphicPanel>

      <div className="space-y-6">
        {prediction && (
          <>
            <GlassmorphicPanel data-testid="panel-ml-results">
              <h3 className="text-xl font-bold text-primary mb-4">Prediction Results</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-primary/10 rounded-md border border-primary/40">
                  <span className="text-foreground font-mono">Impact Probability:</span>
                  <span className="text-primary font-bold" data-testid="text-probability">
                    {typeof prediction.impactProbability === 'number' 
                      ? prediction.impactProbability.toFixed(2) 
                      : '0.00'}%
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-primary/10 rounded-md border border-primary/40">
                  <span className="text-foreground font-mono">Risk Level:</span>
                  <span className={`font-bold ${getRiskColor(prediction.riskLevel || 'low')}`} data-testid="text-risk-level">
                    {(prediction.riskLevel || 'UNKNOWN').toUpperCase()}
                  </span>
                </div>

                <div className="p-3 bg-primary/10 rounded-md border border-primary/40">
                  <span className="text-foreground font-mono block mb-2">Potential Damage:</span>
                  <span className="text-muted-foreground text-sm" data-testid="text-damage">
                    {prediction.potentialDamage || 'Unknown'}
                  </span>
                </div>

                <div className="p-3 bg-primary/10 rounded-md border border-primary/40">
                  <span className="text-foreground font-mono block mb-2">Recommended Action:</span>
                  <span className="text-muted-foreground text-sm" data-testid="text-action">
                    {prediction.recommendedAction || 'Monitor closely'}
                  </span>
                </div>
              </div>
            </GlassmorphicPanel>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassmorphicPanel data-testid="panel-ml-chart">
                <h3 className="text-xl font-bold text-primary mb-4">Impact Metrics</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.2)" />
                    <XAxis dataKey="name" stroke="hsl(var(--foreground))" tick={{ fontSize: 12 }} />
                    <YAxis stroke="hsl(var(--foreground))" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        border: '1px solid rgba(139, 92, 246, 0.5)',
                        borderRadius: '6px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </GlassmorphicPanel>

              <GlassmorphicPanel data-testid="panel-ml-risk-gauge">
                <h3 className="text-xl font-bold text-primary mb-4">Risk Level Gauge</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="100%"
                    data={riskLevelData}
                    startAngle={180}
                    endAngle={0}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar
                      background
                      dataKey="value"
                      cornerRadius={10}
                      fill={riskLevelData[0]?.fill || 'hsl(var(--primary))'}
                    />
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-foreground text-2xl font-bold"
                    >
                      {prediction?.riskLevel?.toUpperCase() || 'N/A'}
                    </text>
                  </RadialBarChart>
                </ResponsiveContainer>
              </GlassmorphicPanel>
            </div>

            <GlassmorphicPanel data-testid="panel-ml-comparison">
              <h3 className="text-xl font-bold text-primary mb-4">Metrics vs Threshold</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.2)" />
                  <XAxis dataKey="metric" stroke="hsl(var(--foreground))" tick={{ fontSize: 12 }} />
                  <YAxis stroke="hsl(var(--foreground))" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: '1px solid rgba(139, 92, 246, 0.5)',
                      borderRadius: '6px',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="current"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.6}
                    name="Current Value"
                  />
                  <Area
                    type="monotone"
                    dataKey="threshold"
                    stroke="hsl(var(--accent))"
                    fill="hsl(var(--accent))"
                    fillOpacity={0.3}
                    name="Reference Threshold"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </GlassmorphicPanel>
          </>
        )}

        {!prediction && (
          <GlassmorphicPanel className="flex items-center justify-center min-h-[400px]" data-testid="panel-ml-empty">
            <div className="text-center">
              <Sparkles className="w-16 h-16 text-primary/40 mx-auto mb-4" />
              <p className="text-muted-foreground font-mono">
                Enter asteroid parameters to generate prediction
              </p>
            </div>
          </GlassmorphicPanel>
        )}
      </div>
    </div>
  );
}
