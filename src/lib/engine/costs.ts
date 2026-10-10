/**
 * Job costs by state (pure functions, no data import: the calculators receive their figures as props).
 *
 * Method (page /en/method/):
 *  1. National range = what homeowners who hired a professional reported paying in the American Housing
 *     Survey 2023 (25th percentile, median, 75th percentile), brought to August 2026 dollars with CPI-U.
 *  2. Regional level = median of the jobs reported in the state's Census division ÷ national median
 *     (AHS 2023; divisions with fewer than 60 reported jobs keep the national level).
 *  3. State adjustment inside the division = only the labor part moves: L = payroll + benefits as a share
 *     of the value of work of the matching contractor industry (Economic Census 2022), scaled by the state
 *     mean hourly wage of the trade over the division's employment-weighted mean (BLS OEWS, May 2025).
 *     factor = region × ((1 - L) + L × (state wage / division wage))
 *  3. Breakdown of a total: materials share m, labor share L × index, other (subcontracts, equipment,
 *     overhead and profit) 1 - m - L, from the same Economic Census line.
 */
export interface Quartiles { p25: number; median: number; p75: number }
export interface Shares { materials: number; payroll: number; benefits: number; subcontracted?: number }
export interface Range { low: number; typical: number; high: number }
export interface Breakdown { materials: number; labor: number; other: number }

/** Payroll + employer-paid benefits as a share of the value of construction work. */
export const laborShare = (s: Shares) => s.payroll + s.benefits;

/** Ratio of the state mean wage to the national mean wage; 1 when the state figure is not published. */
export function wageIndex(stateMean: number | null | undefined, nationalMean: number): number {
  if (!stateMean || !nationalMean) return 1;
  return stateMean / nationalMean;
}

/** Multiplier applied to a national price: only the labor share follows the state wage. */
export function stateFactor(L: number, index: number): number {
  return 1 - L + L * index;
}

/** Rounded to the nearest step (a range is not precise to the dollar). */
export const roundTo = (x: number, step = 10) => Math.round(x / step) * step;

export function adjustRange(q: Quartiles, factor: number, step = 10): Range {
  return { low: roundTo(q.p25 * factor, step), typical: roundTo(q.median * factor, step), high: roundTo(q.p75 * factor, step) };
}

/** Split of a state-adjusted total into materials, labor and the rest. */
export function breakdown(nationalTotal: number, s: Shares, index: number): Breakdown {
  const L = laborShare(s);
  return { materials: nationalTotal * s.materials, labor: nationalTotal * L * index, other: nationalTotal * (1 - s.materials - L) };
}

export interface SizeBin extends Quartiles { bin: string; label: string }
/** AHS house-size bin for a floor area in square feet (one-family detached homes). */
export function sizeBin(bins: SizeBin[], sqft: number): SizeBin {
  const lower: Record<string, number> = { lt1000: 0, '1000': 1000, '1500': 1500, '2000': 2000, '2500': 2500, '3000': 3000, '4000': 4000 };
  let pick = bins[0];
  for (const b of bins) if (sqft >= (lower[b.bin] ?? 0)) pick = b;
  return pick;
}

/** Everything a job calculator needs, prepared on the server from the data files. */
export interface JobInput {
  key: string;
  national: Quartiles;
  shares: Shares;
  /** state wage ÷ division wage, by state slug */
  index: Record<string, number>;
  /** division median ÷ national median (AHS), by state slug */
  region: Record<string, number>;
  bySize?: SizeBin[];
}

export interface JobResult extends Range { factor: number; region: number; index: number; L: number; parts: Breakdown; basis: Quartiles; bin?: SizeBin }

export function jobCost(job: JobInput, state: string, sqft?: number): JobResult {
  const index = state === 'us' ? 1 : job.index[state] ?? 1;
  const region = state === 'us' ? 1 : job.region[state] ?? 1;
  const L = laborShare(job.shares);
  const factor = region * stateFactor(L, index);
  const bin = job.bySize && sqft != null ? sizeBin(job.bySize, sqft) : undefined;
  const basis: Quartiles = bin ?? job.national;
  const r = adjustRange(basis, factor);
  return { ...r, factor, region, index, L, basis, bin, parts: breakdown(basis.median * region, job.shares, index) };
}
