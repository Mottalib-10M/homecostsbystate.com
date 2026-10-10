/**
 * Server-side access to the data files (src/data/*.json, rebuilt by scripts/build-data.py).
 * Calculators never import this file: they receive the few figures they need as props, prepared here.
 */
import STATES_RAW from '../data/states.json';
import WAGES from '../data/wages.json';
import SHARES from '../data/shares.json';
import AHS from '../data/ahs.json';
import ENERGY from '../data/energy.json';
import SOLAR from '../data/solar.json';
import P from '../data/params-2026.json';
import { wageIndex, type JobInput, type Quartiles, type Shares, type SizeBin } from './engine/costs';

export { P };
export interface StateRef { slug: string; name: string; abbr: string; fips: string; division: number; divisionName: string }
export const STATE_LIST: StateRef[] = STATES_RAW as StateRef[];
export const stateRef = (slug: string): StateRef => {
  const s = STATE_LIST.find((x) => x.slug === slug);
  if (!s) throw new Error(`Unknown state ${slug}`);
  return s;
};
export const isState = (slug: string) => STATE_LIST.some((x) => x.slug === slug);

// ---------------------------------------------------------------- wages (BLS OEWS May 2025)
export type Occ = keyof typeof WAGES.occupations;
export interface Wage { mean: number; p25: number | null; median: number | null; p75: number | null; emp: number | null; lq?: number | null }
export const OCCUPATIONS = WAGES.occupations as Record<string, { soc: string; title: string }>;
export const WAGE_REF = { reference: WAGES.reference, released: WAGES.released };
export const nationalWage = (occ: string): Wage => (WAGES.national as Record<string, Wage>)[occ];
export const stateWage = (slug: string, occ: string): Wage | null => ((WAGES.states as Record<string, Record<string, Wage>>)[slug] ?? {})[occ] ?? null;
export const wageIdx = (slug: string, occ: string) => wageIndex(stateWage(slug, occ)?.mean, nationalWage(occ).mean);
/** Employment-weighted mean wage of a trade over the states of a Census division (OEWS). */
export function divisionWage(division: number, occ: string): number {
  let w = 0, e = 0;
  for (const s of STATE_LIST.filter((x) => x.division === division)) { const r = stateWage(s.slug, occ); if (r?.mean && r.emp) { w += r.mean * r.emp; e += r.emp; } }
  return e > 0 ? w / e : nationalWage(occ).mean;
}
/** State wage over its division's wage (1 when the state figure is not published). */
export const wageIdxDivision = (slug: string, occ: string) => wageIndex(stateWage(slug, occ)?.mean, divisionWage(stateRef(slug).division, occ));
export const MIN_DIVISION_JOBS = 60;

// ---------------------------------------------------------------- jobs (AHS 2023 × Economic Census 2022 × OEWS)
export interface JobDef { key: string; ahs: string; naics: string; occ: string; label: string }
export const JOB_DEFS: Record<string, JobDef> = P.jobs as Record<string, JobDef>;
export const sharesOf = (naics: string): Shares & { label: string } => (SHARES as Record<string, Shares & { label: string }>)[naics];
type AhsStats = Quartiles & { n: number; projects: number };
interface AhsJob { pro: AhsStats; proNominal: AhsStats; diy: AhsStats | null; divisions: Record<string, AhsStats>; bySize?: Array<SizeBin & { n: number; projects: number }> }
export const AHS_META = { survey: AHS.survey, years: AHS.jobsYears, cpi: AHS.cpi };
export const ahsJob = (key: string): AhsJob => (AHS.jobs as Record<string, AhsJob>)[JOB_DEFS[key].ahs];

/** Compact input for a job calculator: national quartiles, cost shares and the wage index of every state. */
export function jobInput(key: string): JobInput {
  const d = JOB_DEFS[key];
  const a = ahsJob(key);
  const s = sharesOf(d.naics);
  return {
    key,
    national: { p25: a.pro.p25, median: a.pro.median, p75: a.pro.p75 },
    shares: { materials: s.materials, payroll: s.payroll, benefits: s.benefits, subcontracted: s.subcontracted },
    index: Object.fromEntries(STATE_LIST.map((st) => [st.slug, Math.round(wageIdxDivision(st.slug, d.occ) * 10000) / 10000])),
    region: Object.fromEntries(STATE_LIST.map((st) => { const dv = a.divisions[String(st.division)]; return [st.slug, dv && dv.n >= MIN_DIVISION_JOBS ? Math.round((dv.median / a.pro.median) * 10000) / 10000 : 1]; })),
    ...(a.bySize ? { bySize: a.bySize.map(({ bin, label, p25, median, p75 }) => ({ bin, label, p25, median, p75 })) } : {}),
  };
}

// ---------------------------------------------------------------- energy (EIA, RECS)
export const ENERGY_META = { electricity: ENERGY.electricity.period, electricityText: ENERGY.electricity.periodText, gas: ENERGY.gas.period, propane: ENERGY.propane.period, oil: ENERGY.heatingOil.period, gasoline: ENERGY.gasoline.week };
export const centsPerKwh = (slug: string): number => (ENERGY.electricity.centsPerKwh as Record<string, number>)[slug] ?? (ENERGY.electricity.centsPerKwh as Record<string, number>).us;
export const usage2024 = (slug: string) => (ENERGY.consumption2024 as Record<string, { kwhMonth: number; cents: number; bill: number }>)[slug];
export const gasPerMcf = (slug: string): number | null => (ENERGY.gas.dollarsPerMcf as Record<string, number>)[slug] ?? null;
export const propanePerGal = (slug: string): number | null => (ENERGY.propane.dollarsPerGallon as Record<string, number>)[slug] ?? null;
export const oilPerGal = (slug: string): number | null => (ENERGY.heatingOil.dollarsPerGallon as Record<string, number>)[slug] ?? null;
export const US_ENERGY = { gas: (ENERGY.gas.dollarsPerMcf as Record<string, number>).us, propane: (ENERGY.propane.dollarsPerGallon as Record<string, number>).us, oil: (ENERGY.heatingOil.dollarsPerGallon as Record<string, number>).us, gasoline: ENERGY.gasoline.dollarsPerGallon, cents: centsPerKwh('us') };
type Recs = Record<string, { electricity: number | null; gas: number | null; propane: number | null; oil: number | null }>;
/** RECS 2020 average site MMBtu for space heating in the state's Census division (region, then US, when withheld). */
export function recsHeating(slug: string, fuel: 'electricity' | 'gas' | 'propane' | 'oil'): { value: number; level: string } {
  const r = ENERGY.recsSpaceHeating as Recs;
  const st = slug === 'us' ? null : stateRef(slug);
  const region = st ? ({ 1: 'NE', 2: 'NE', 3: 'MW', 4: 'MW', 5: 'S', 6: 'S', 7: 'S', 8: 'W', 9: 'W' } as Record<number, string>)[st.division] : null;
  if (st && r[String(st.division)]?.[fuel] != null) return { value: r[String(st.division)][fuel]!, level: st.divisionName };
  if (region && r[region]?.[fuel] != null) return { value: r[region][fuel]!, level: { NE: 'Northeast', MW: 'Midwest', S: 'South', W: 'West' }[region]! };
  return { value: r.us[fuel]!, level: 'United States' };
}

// ---------------------------------------------------------------- solar
type Pv = Record<string, { kwhPerKw: number; city: string; source: 'pvwatts' | 'nasa-power' }>;
export const SOLAR_CALIBRATION = SOLAR.calibration;
export const pvwatts = (slug: string) => (SOLAR.pvwatts as Pv)[slug] ?? null;
export const NY_REPORTED = SOLAR.nyReported2025;
export const solarQuote = (slug: string): { perW: number; scope: 'state' | 'us' } => {
  const q = P.solar.quoteMedianPerW as Record<string, number>;
  return q[slug] != null ? { perW: q[slug], scope: 'state' } : { perW: q.us, scope: 'us' };
};
export const reportedToQuote = () => Math.round((NY_REPORTED.median / (P.solar.quoteMedianPerW as Record<string, number>)['new-york']) * 1000) / 1000;
