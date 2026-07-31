/**
 * Impact scaling relations.
 *
 * Implements the published first-order relations from Collins, Melosh & Marcus,
 * "Earth Impact Effects Program: A Web-Based Computer Program for Calculating the
 * Regional Environmental Consequences of a Meteoroid Impact on Earth",
 * Meteoritics & Planetary Science 40 (2005), 817-840.
 *
 * These are order-of-magnitude estimates for a vertical-to-oblique impact on a
 * competent land target. They are not a substitute for a full hydrocode run, and
 * the UI labels them as estimates.
 */

/** Bulk density of a stony (ordinary chondrite) impactor, kg/m^3. */
export const IMPACTOR_DENSITY = 3000;
/** Bulk density of a sedimentary land target, kg/m^3. */
export const TARGET_DENSITY = 2500;
/** Earth surface gravity, m/s^2. */
export const SURFACE_GRAVITY = 9.81;
/** Energy released by one megaton of TNT, joules. */
export const JOULES_PER_MEGATON = 4.184e15;

export interface ImpactInput {
  /** Impactor diameter, metres. */
  diameterM: number;
  /** Atmospheric entry speed, metres per second. */
  velocityMs: number;
  /** Angle from horizontal, degrees. 90 is vertical. */
  angleDeg: number;
}

export interface ImpactResult {
  /** Impactor mass, kilograms. */
  massKg: number;
  /** Kinetic energy, joules. */
  energyJ: number;
  /** Kinetic energy, megatons of TNT equivalent. */
  energyMt: number;
  /** Final crater rim-to-rim diameter, metres. */
  craterDiameterM: number;
  /** Fireball radius, metres. */
  fireballRadiusM: number;
  /** Equivalent Richter magnitude of the seismic event. */
  seismicMagnitude: number;
  /** Mean interval between impacts of this energy, years. */
  recurrenceYears: number;
}

/**
 * Kinetic energy of a sphere of the given diameter and density.
 * E = 1/2 m v^2, with m = (pi/6) d^3 rho.
 */
export function computeImpact({ diameterM, velocityMs, angleDeg }: ImpactInput): ImpactResult {
  const d = Math.max(diameterM, 0.01);
  const v = Math.max(velocityMs, 1);
  // Clamp away from zero: a grazing impact does not couple energy into the ground,
  // and sin(0) would collapse the crater relation to zero.
  const theta = (Math.max(Math.min(angleDeg, 90), 1) * Math.PI) / 180;

  const massKg = (Math.PI / 6) * d ** 3 * IMPACTOR_DENSITY;
  const energyJ = 0.5 * massKg * v ** 2;
  const energyMt = energyJ / JOULES_PER_MEGATON;

  // Collins et al. eq. 21: transient crater diameter, then eq. 27 for a simple
  // final crater. Craters above ~3.2 km transition to complex morphology; the
  // 1.25 factor understates those, which is acceptable at this altitude.
  const transientCraterM =
    1.161 *
    (IMPACTOR_DENSITY / TARGET_DENSITY) ** (1 / 3) *
    d ** 0.78 *
    v ** 0.44 *
    SURFACE_GRAVITY ** -0.22 *
    Math.sin(theta) ** (1 / 3);
  const craterDiameterM = 1.25 * transientCraterM;

  // Collins et al. eq. 33.
  const fireballRadiusM = 0.002 * energyJ ** (1 / 3);

  // Collins et al. eq. 37, after Schultz & Gault.
  const seismicMagnitude = 0.67 * Math.log10(energyJ) - 5.87;

  // Collins et al. eq. 3: mean impact interval as a function of yield.
  const recurrenceYears = 109 * energyMt ** 0.78;

  return {
    massKg,
    energyJ,
    energyMt,
    craterDiameterM,
    fireballRadiusM,
    seismicMagnitude,
    recurrenceYears,
  };
}

/** Four-step severity band derived from yield, used to colour the readouts. */
export type Severity = 'nominal' | 'elevated' | 'high' | 'critical';

export function severityFromEnergy(energyMt: number): Severity {
  if (energyMt < 1) return 'nominal';
  if (energyMt < 100) return 'elevated';
  if (energyMt < 10000) return 'high';
  return 'critical';
}

/** Plain-language consequence for a yield band. Paired with severityFromEnergy. */
export function consequenceFromEnergy(energyMt: number): string {
  if (energyMt < 1) return 'Airburst likely. Broken windows, little ground damage.';
  if (energyMt < 100) return 'City-scale destruction near the impact point.';
  if (energyMt < 10000) return 'Regional devastation and measurable climate effects.';
  return 'Global effects. Comparable to a mass-extinction impactor.';
}
