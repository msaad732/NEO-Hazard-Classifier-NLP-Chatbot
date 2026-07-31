import { Panel } from './Panel';

/**
 * Layout family: asymmetric 5/7 prose column plus a hairline definition list.
 * Deliberately not the three-equal-cards grid used nowhere else in this app.
 */

const CAPABILITIES = [
  {
    term: 'Catalogue',
    detail:
      'Tracked near-Earth objects with diameter, encounter speed, miss distance and close-approach date.',
  },
  {
    term: 'Simulator',
    detail:
      'Forward model of a hypothetical impact: yield, crater, fireball and seismic magnitude.',
  },
  {
    term: 'Predictor',
    detail:
      'Machine-learning risk classification from orbital and physical parameters.',
  },
  {
    term: 'Analyst',
    detail:
      'Retrieval-backed assistant for questions about the catalogue and defence strategy.',
  },
];

const RELATIONS = [
  { name: 'Kinetic energy', expr: 'E = ½mv²,  m = (π/6)d³ρ' },
  { name: 'Transient crater', expr: 'Dtc = 1.161 (ρi/ρt)⅓ L⁰·⁷⁸ v⁰·⁴⁴ g⁻⁰·²² sin(θ)⅓' },
  { name: 'Fireball radius', expr: 'Rf = 0.002 E⅓' },
  { name: 'Seismic magnitude', expr: 'M = 0.67 log₁₀(E) − 5.87' },
];

export function About() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <Panel className="lg:col-span-5">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          What this console does
        </h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Neo-Sentinel brings four planetary-defence workflows into one surface: browsing
            tracked near-Earth objects, modelling what a given impactor would do on arrival,
            classifying risk from orbital parameters, and asking questions in plain language.
          </p>
          <p>
            The impact model implements published first-order scaling relations rather than a
            hydrocode. Treat every output as an order-of-magnitude estimate, useful for
            comparing scenarios against each other and not for operational planning.
          </p>
        </div>

        <dl className="mt-6 divide-y divide-border border-t border-border">
          {CAPABILITIES.map(({ term, detail }) => (
            <div key={term} className="grid grid-cols-3 gap-4 py-3">
              <dt className="text-sm font-medium text-foreground">{term}</dt>
              <dd className="col-span-2 text-sm leading-snug text-muted-foreground">{detail}</dd>
            </div>
          ))}
        </dl>
      </Panel>

      <Panel className="lg:col-span-7">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Scaling relations
        </h2>
        <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-muted-foreground">
          The simulator evaluates the relations below for a stony impactor at 3,000 kg/m³
          striking a sedimentary land target at 2,500 kg/m³.
        </p>

        <ul className="mt-6 space-y-px overflow-hidden rounded-md border border-border">
          {RELATIONS.map(({ name, expr }) => (
            <li
              key={name}
              className="flex flex-col gap-1 bg-foreground/[0.02] px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <span className="text-sm text-foreground">{name}</span>
              <code className="font-mono text-xs text-muted-foreground sm:text-right">{expr}</code>
            </li>
          ))}
        </ul>

        <p className="mt-6 max-w-[62ch] text-xs leading-relaxed text-muted-foreground">
          Relations after Collins, Melosh &amp; Marcus (2005),{' '}
          <span className="italic">Earth Impact Effects Program</span>, Meteoritics &amp;
          Planetary Science 40, 817-840. Crater diameters above roughly 3.2 km transition to
          complex morphology, which the simple-crater factor used here understates.
        </p>
      </Panel>
    </div>
  );
}
