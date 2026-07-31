import { Panel, PanelHeader, Readout } from './Panel';
import { RiskChip, toSeverity } from './RiskChip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { mlPredictionInputSchema, type MLPredictionInput, type MLPredictionOutput } from '@shared/schema';
import { Loader2, Activity, TriangleAlert } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { formatScientific } from '@/lib/format';

const FIELDS = [
  { name: 'diameter', label: 'Diameter', unit: 'km', step: '0.001', help: 'Mean physical diameter.' },
  { name: 'velocity', label: 'Relative speed', unit: 'km/s', step: '0.1', help: 'Speed at closest approach.' },
  { name: 'distance', label: 'Miss distance', unit: 'km', step: '1000', help: 'Nominal closest approach.' },
  { name: 'mass', label: 'Mass', unit: 'kg', step: '1e10', help: 'Estimated bulk mass.' },
  { name: 'trajectoryAngle', label: 'Trajectory angle', unit: 'deg', step: '1', help: '0 grazing, 90 head-on.' },
] as const;

const SEVERITY_LABEL = {
  nominal: 'Low',
  elevated: 'Medium',
  high: 'High',
  critical: 'Critical',
} as const;

export function MLPredictor() {
  const { toast } = useToast();

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

  const predict = useMutation<MLPredictionOutput, Error, MLPredictionInput>({
    mutationFn: async (data) => {
      const response = await apiRequest('POST', '/api/ml/predict', data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Prediction complete',
        description: `Assessed risk: ${(data.riskLevel ?? 'unknown').toUpperCase()}`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Prediction failed',
        description: error.message || 'Could not reach the model service.',
        variant: 'destructive',
      });
    },
  });

  const prediction = predict.data;
  const severity = prediction ? toSeverity(prediction.riskLevel) : null;

  const metrics = prediction
    ? [
        {
          name: 'Impact probability',
          value: typeof prediction.impactProbability === 'number' ? prediction.impactProbability : 0,
          fill: 'hsl(var(--chart-1))',
        },
        {
          name: 'Energy (Mt)',
          value: typeof prediction.estimatedEnergy === 'number' ? prediction.estimatedEnergy : 0,
          fill: 'hsl(var(--chart-2))',
        },
      ]
    : [];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <Panel className="lg:col-span-5">
        <PanelHeader
          title="Risk predictor"
          description="Classifies threat level from physical and orbital parameters."
        />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => predict.mutate(data))}
            className="mt-6 space-y-5"
          >
            {FIELDS.map(({ name, label, unit, step, help }) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-baseline justify-between gap-3 text-sm font-normal text-foreground">
                      <span>{label}</span>
                      <span className="font-mono text-2xs text-muted-foreground">{unit}</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="decimal"
                        step={step}
                        {...field}
                        value={Number.isFinite(field.value) ? field.value : ''}
                        onChange={(e) => {
                          const next = parseFloat(e.target.value);
                          field.onChange(Number.isNaN(next) ? undefined : next);
                        }}
                        className="font-mono tnum"
                        data-testid={`input-${name}`}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      {help}
                    </FormDescription>
                    <FormMessage className="text-xs text-status-critical" />
                  </FormItem>
                )}
              />
            ))}

            <Button
              type="submit"
              className="w-full"
              disabled={predict.isPending}
              data-testid="button-predict"
            >
              {predict.isPending ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden="true" />
                  Evaluating
                </>
              ) : (
                'Run prediction'
              )}
            </Button>
          </form>
        </Form>
      </Panel>

      <div className="space-y-6 lg:col-span-7">
        {predict.isPending && (
          <Panel data-testid="panel-ml-loading">
            <Skeleton className="h-5 w-44" />
            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-border pt-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="mt-2.5 h-6 w-20" />
                </div>
              ))}
            </div>
            <Skeleton className="mt-6 h-[220px] w-full" />
          </Panel>
        )}

        {!predict.isPending && predict.isError && (
          <Panel
            className="flex min-h-[320px] flex-col items-center justify-center py-12 text-center"
            data-testid="panel-ml-error"
          >
            <TriangleAlert className="h-6 w-6 text-status-critical" aria-hidden="true" />
            <p className="mt-4 text-sm font-medium text-foreground">Prediction failed</p>
            <p className="mt-1 max-w-[44ch] text-sm text-muted-foreground">
              {predict.error?.message || 'The model service did not respond.'}
            </p>
            <Button
              variant="outline"
              className="mt-5"
              onClick={() => predict.mutate(form.getValues())}
              data-testid="button-retry-predict"
            >
              Try again
            </Button>
          </Panel>
        )}

        {!predict.isPending && prediction && severity && (
          <>
            <Panel data-testid="panel-ml-results">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h2 className="text-base font-semibold tracking-tight text-foreground">
                  Assessment
                </h2>
                <RiskChip
                  severity={severity}
                  label={SEVERITY_LABEL[severity]}
                  data-testid="text-risk-level"
                />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-border pt-6">
                <Readout
                  label="Impact probability"
                  value={
                    typeof prediction.impactProbability === 'number'
                      ? prediction.impactProbability.toFixed(2)
                      : '--'
                  }
                  unit="%"
                  data-testid="text-probability"
                />
                <Readout
                  label="Estimated energy"
                  value={
                    typeof prediction.estimatedEnergy === 'number'
                      ? formatScientific(prediction.estimatedEnergy)
                      : '--'
                  }
                  unit="Mt"
                  data-testid="text-energy"
                />
              </div>

              <dl className="mt-6 divide-y divide-border border-t border-border">
                <div className="grid grid-cols-3 gap-4 py-3">
                  <dt className="field-label pt-0.5">Damage</dt>
                  <dd
                    className="col-span-2 text-sm leading-snug text-foreground"
                    data-testid="text-damage"
                  >
                    {prediction.potentialDamage || 'Not characterised.'}
                  </dd>
                </div>
                <div className="grid grid-cols-3 gap-4 py-3">
                  <dt className="field-label pt-0.5">Action</dt>
                  <dd
                    className="col-span-2 text-sm leading-snug text-foreground"
                    data-testid="text-action"
                  >
                    {prediction.recommendedAction || 'Continue monitoring.'}
                  </dd>
                </div>
              </dl>

              {prediction.source === 'fallback' && (
                <p
                  className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground"
                  data-testid="text-fallback-notice"
                >
                  The trained model was unreachable. These figures come from a local
                  heuristic derived from the parameters above, not from the model.
                </p>
              )}
            </Panel>

            <Panel data-testid="panel-ml-chart">
              <h3 className="text-base font-semibold tracking-tight text-foreground">
                Model outputs
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Probability in percent, energy in megatons TNT equivalent.
              </p>
              <div className="mt-5 h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics} margin={{ top: 4, right: 4, bottom: 0, left: -8 }}>
                    <CartesianGrid
                      vertical={false}
                      stroke="hsl(var(--border) / 0.55)"
                      strokeDasharray="0"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}
                    />
                    <Tooltip
                      cursor={{ fill: 'hsl(var(--foreground) / 0.04)' }}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontFamily: 'var(--font-mono)',
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      itemStyle={{ color: 'hsl(var(--muted-foreground))' }}
                    />
                    <Bar dataKey="value" radius={[3, 3, 0, 0]} maxBarSize={72}>
                      {metrics.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </>
        )}

        {!predict.isPending && !predict.isError && !prediction && (
          <Panel
            className="flex min-h-[320px] flex-col items-center justify-center py-12 text-center"
            data-testid="panel-ml-empty"
          >
            <Activity className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
            <p className="mt-4 text-sm font-medium text-foreground">No assessment yet</p>
            <p className="mt-1 max-w-[44ch] text-sm text-muted-foreground">
              Enter the object's parameters and run the prediction to see probability, energy
              and a recommended response.
            </p>
          </Panel>
        )}
      </div>
    </div>
  );
}
