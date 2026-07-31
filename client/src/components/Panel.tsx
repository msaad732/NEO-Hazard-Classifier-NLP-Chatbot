import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PanelProps {
  children: ReactNode;
  className?: string;
  /** Removes internal padding so the panel can host a flush table or chart. */
  flush?: boolean;
  'data-testid'?: string;
}

/**
 * The single surface primitive. A flat graphite plate with a hairline rule.
 * Depth comes from the tinted shadow token, never from a glow.
 */
export function Panel({ children, className, flush = false, 'data-testid': dataTestId }: PanelProps) {
  return (
    <div
      data-testid={dataTestId}
      className={cn(
        'rounded-lg border border-border bg-card/80 shadow-[var(--shadow-sm)] backdrop-blur-sm',
        !flush && 'p-5 sm:p-6',
        className,
      )}
    >
      {children}
    </div>
  );
}

interface PanelHeaderProps {
  title: string;
  /** One short line of context. Keep under 15 words. */
  description?: string;
  /** Right-aligned controls: search, filters, actions. */
  actions?: ReactNode;
  className?: string;
}

export function PanelHeader({ title, description, actions, className }: PanelHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="text-base font-semibold tracking-tight text-foreground">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

interface ReadoutProps {
  label: string;
  value: ReactNode;
  unit?: string;
  /** Optional one-line gloss under the value. */
  note?: string;
  className?: string;
  'data-testid'?: string;
}

/**
 * A single labelled measurement. Grouped by a parent grid with hairline dividers
 * rather than wrapped in its own card, per the density target.
 */
export function Readout({ label, value, unit, note, className, 'data-testid': dataTestId }: ReadoutProps) {
  return (
    <div className={cn('min-w-0', className)} data-testid={dataTestId}>
      <p className="field-label">{label}</p>
      <p className="mt-1.5 font-mono text-xl font-medium leading-none text-foreground tnum">
        {value}
        {unit && <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>}
      </p>
      {note && <p className="mt-1.5 text-xs leading-snug text-muted-foreground">{note}</p>}
    </div>
  );
}
