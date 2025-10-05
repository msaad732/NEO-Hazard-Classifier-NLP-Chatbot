import { useState } from 'react';
import { GlassmorphicPanel } from './GlassmorphicPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { type MLPredictionInput, type MLPredictionOutput } from '@shared/schema';
import { Loader2, Sparkles } from 'lucide-react';
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
} from 'recharts';

export function MLPredictor() {
  const { toast } = useToast();
  const [prediction, setPrediction] = useState<MLPredictionOutput | null>(null);
  const [formData, setFormData] = useState<MLPredictionInput>({
    diameter: 0.5,
    velocity: 20,
    distance: 100000,
    mass: 1e12,
    trajectoryAngle: 45,
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
        description: `Risk Level: ${data.riskLevel.toUpperCase()}`,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    predictMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof MLPredictionInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const chartData = prediction
    ? [
        {
          name: 'Impact Probability',
          value: prediction.impactProbability,
          fill: 'hsl(var(--primary))',
        },
        {
          name: 'Energy (MT)',
          value: prediction.estimatedEnergy || 0,
          fill: 'hsl(var(--accent))',
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="diameter" className="text-foreground">
              Diameter (km)
            </Label>
            <Input
              id="diameter"
              type="number"
              step="0.001"
              value={formData.diameter}
              onChange={(e) => handleInputChange('diameter', e.target.value)}
              className="bg-input border-primary font-mono"
              data-testid="input-diameter"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="velocity" className="text-foreground">
              Velocity (km/s)
            </Label>
            <Input
              id="velocity"
              type="number"
              step="0.1"
              value={formData.velocity}
              onChange={(e) => handleInputChange('velocity', e.target.value)}
              className="bg-input border-primary font-mono"
              data-testid="input-velocity"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="distance" className="text-foreground">
              Distance from Earth (km)
            </Label>
            <Input
              id="distance"
              type="number"
              step="1000"
              value={formData.distance}
              onChange={(e) => handleInputChange('distance', e.target.value)}
              className="bg-input border-primary font-mono"
              data-testid="input-distance"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mass" className="text-foreground">
              Mass (kg)
            </Label>
            <Input
              id="mass"
              type="number"
              step="1e10"
              value={formData.mass}
              onChange={(e) => handleInputChange('mass', e.target.value)}
              className="bg-input border-primary font-mono"
              data-testid="input-mass"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trajectoryAngle" className="text-foreground">
              Trajectory Angle (degrees)
            </Label>
            <Input
              id="trajectoryAngle"
              type="number"
              step="1"
              min="0"
              max="90"
              value={formData.trajectoryAngle}
              onChange={(e) => handleInputChange('trajectoryAngle', e.target.value)}
              className="bg-input border-primary font-mono"
              data-testid="input-trajectory"
            />
          </div>

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
                    {prediction.impactProbability.toFixed(2)}%
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-primary/10 rounded-md border border-primary/40">
                  <span className="text-foreground font-mono">Risk Level:</span>
                  <span className={`font-bold ${getRiskColor(prediction.riskLevel)}`} data-testid="text-risk-level">
                    {prediction.riskLevel.toUpperCase()}
                  </span>
                </div>

                <div className="p-3 bg-primary/10 rounded-md border border-primary/40">
                  <span className="text-foreground font-mono block mb-2">Potential Damage:</span>
                  <span className="text-muted-foreground text-sm" data-testid="text-damage">
                    {prediction.potentialDamage}
                  </span>
                </div>

                <div className="p-3 bg-primary/10 rounded-md border border-primary/40">
                  <span className="text-foreground font-mono block mb-2">Recommended Action:</span>
                  <span className="text-muted-foreground text-sm" data-testid="text-action">
                    {prediction.recommendedAction}
                  </span>
                </div>
              </div>
            </GlassmorphicPanel>

            <GlassmorphicPanel data-testid="panel-ml-chart">
              <h3 className="text-xl font-bold text-primary mb-4">Impact Analysis Chart</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.2)" />
                  <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: '1px solid rgba(139, 92, 246, 0.5)',
                      borderRadius: '6px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
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
