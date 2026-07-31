import { cn } from '@/lib/utils';
import type { Severity } from '@/lib/impact';

/**
 * The only place the semantic status ramp is allowed to surface as a label.
 * A chip always encodes an assessed risk level; it is never decorative.
 */
const TONE: Record<Severity, { dot: string; text: string; ring: string }> = {
  nominal: { dot: 'bg-status-nominal', text: 'text-status-nominal', ring: 'ring-status-nominal/30' },
  elevated: { dot: 'bg-status-elevated', text: 'text-status-elevated', ring: 'ring-status-elevated/30' },
  high: { dot: 'bg-status-high', text: 'text-status-high', ring: 'ring-status-high/30' },
  critical: { dot: 'bg-status-critical', text: 'text-status-critical', ring: 'ring-status-critical/30' },
};

/** Maps the ML service's vocabulary onto the app's four-step ramp. */
export function toSeverity(level: string | undefined): Severity {
  switch ((level ?? '').toLowerCase()) {
    case 'critical':
      return 'critical';
    case 'high':
      return 'high';
    case 'medium':
    case 'elevated':
      return 'elevated';
    default:
      return 'nominal';
  }
}

interface RiskChipProps {
  severity: Severity;
  label: string;
  className?: string;
  'data-testid'?: string;
}

export function RiskChip({ severity, label, className, 'data-testid': dataTestId }: RiskChipProps) {
  const tone = TONE[severity];
  return (
    <span
      data-testid={dataTestId}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-2xs font-medium uppercase tracking-[0.1em] ring-1 ring-inset',
        'bg-foreground/[0.04]',
        tone.text,
        tone.ring,
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', tone.dot)} aria-hidden="true" />
      {label}
    </span>
  );
}
