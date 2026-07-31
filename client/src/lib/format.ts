/** Shared number formatting so every readout in the app agrees on precision. */

/** Compact scientific-ish notation for values that span many orders of magnitude. */
export function formatScientific(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return '--';
  if (value === 0) return '0';
  const exponent = Math.floor(Math.log10(Math.abs(value)));
  if (exponent >= -2 && exponent < 5) {
    return value.toLocaleString('en-US', { maximumFractionDigits: digits });
  }
  const mantissa = value / 10 ** exponent;
  return `${mantissa.toFixed(digits)}e${exponent}`;
}

/** Metres, promoted to kilometres once the value earns it. */
export function formatDistance(metres: number): { value: string; unit: string } {
  if (!Number.isFinite(metres)) return { value: '--', unit: 'm' };
  if (Math.abs(metres) >= 1000) {
    return { value: (metres / 1000).toLocaleString('en-US', { maximumFractionDigits: 2 }), unit: 'km' };
  }
  return { value: metres.toLocaleString('en-US', { maximumFractionDigits: 0 }), unit: 'm' };
}

/** Mean recurrence interval, phrased at a readable magnitude. */
export function formatInterval(years: number): string {
  if (!Number.isFinite(years) || years <= 0) return '--';
  if (years < 1) return 'multiple per year';
  if (years < 1000) return `~${Math.round(years).toLocaleString('en-US')} years`;
  if (years < 1e6) return `~${Math.round(years / 1000).toLocaleString('en-US')}k years`;
  return `~${(years / 1e6).toLocaleString('en-US', { maximumFractionDigits: 1 })}M years`;
}

export function formatNumber(value: number, digits = 0): string {
  if (!Number.isFinite(value)) return '--';
  return value.toLocaleString('en-US', { maximumFractionDigits: digits });
}
