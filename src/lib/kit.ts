/**
 * Writing kit: every figure a page writes comes from here (data files and params), never typed by hand
 * (RECETTE §17.4 point 7). Server side only.
 */
import { usd, num, pct, day, month, listOf, cents } from './fmt';
import { jobCost } from './engine/costs';
import {
  P, STATE_LIST, stateRef, jobInput, ahsJob, sharesOf, JOB_DEFS, AHS_META, nationalWage, stateWage, wageIdx, OCCUPATIONS, WAGE_REF,
  centsPerKwh, usage2024, gasPerMcf, propanePerGal, oilPerGal, US_ENERGY, ENERGY_META, recsHeating, pvwatts, solarQuote, reportedToQuote, NY_REPORTED,
} from './data';
import SOLAR from '../data/solar.json';
import FACTS from '../data/state-facts.json';

export interface NriHazard { rating: string | null; score: number | null; buildingLossUsd: number | null }
export interface StateFacts { nri: Record<string, NriHazard>; licensing: { required: boolean; agency: string; summary: string; url: string; threshold_usd: number | null } | null; code: { summary: string; url: string } | null }

const cache = new Map<string, ReturnType<typeof jobInput>>();
const input = (key: string) => { if (!cache.has(key)) cache.set(key, jobInput(key)); return cache.get(key)!; };

export const KIT = {
  usd, num, pct, day, month, listOf, cents,
  P,
  states: STATE_LIST,
  state: stateRef,
  /** State-adjusted range of a job ("us" for the national figure); roof accepts a floor area. */
  job: (key: string, state = 'us', sqft?: number) => jobCost(input(key), state, sqft),
  jobInput: input,
  ahs: ahsJob,
  ahsMeta: AHS_META,
  shares: (key: string) => sharesOf(JOB_DEFS[key].naics),
  jobDef: (key: string) => JOB_DEFS[key],
  wage: stateWage,
  natWage: nationalWage,
  wageIdx,
  occ: (k: string) => OCCUPATIONS[k],
  wageRef: WAGE_REF,
  elec: centsPerKwh,
  usage: usage2024,
  gas: gasPerMcf,
  propane: propanePerGal,
  oil: oilPerGal,
  usEnergy: US_ENERGY,
  energyMeta: ENERGY_META,
  recs: recsHeating,
  pv: pvwatts,
  solarQuote,
  reportedToQuote,
  nyReported: NY_REPORTED,
  panelWatts: SOLAR.nyPanelWattsMedian as number,
  /** FEMA NRI expected-loss ratings, licensing and building code read for a state (research/state-facts.json). */
  facts: (slug: string) => (FACTS.states as Record<string, StateFacts>)[slug],
  nriVersion: FACTS.nri.version,
};
export type Kit = typeof KIT;
