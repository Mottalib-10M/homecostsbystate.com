import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'arkansas';
const r = K.job('roof', slug);
const us = K.job('roof');
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const f = K.facts(slug);
const lic = f.licensing!;
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const all = K.states.map((s) => s.slug);
const iceRank = [...all].sort((a, b) => (K.facts(b).nri.ice_storm?.buildingLossUsd ?? 0) - (K.facts(a).nri.ice_storm?.buildingLossUsd ?? 0)).indexOf(slug) + 1;
const wageRank = [...all].sort((a, b) => (K.wage(a, 'roofers')?.mean ?? 99) - (K.wage(b, 'roofers')?.mean ?? 99)).indexOf(slug) + 1;
const low = (k: number) => (k === 1 ? 'the lowest' : k === 2 ? 'the second lowest' : `number ${k} from the bottom`);
const mil = (x: number | null) => `${K.usd(Math.round((x ?? 0) / 1e6))} million`;
const under = Math.round((1 - w.mean / nat.mean) * 100);
const thr = K.usd(lic.threshold_usd ?? 0);
const since = lic.summary.match(/since (January 1, \d{4})/)?.[1];
const la = K.wage('louisiana', 'roofers')!;
const ok = K.wage('oklahoma', 'roofers')!;

export default defineState({
  slug,
  title: 'Roof Replacement Cost Arkansas 2026: Ice, Prices and Pay',
  description: `Arkansas roof replacement costs about ${K.usd(r.typical)} in 2026, with most jobs from ${K.usd(r.low)} to ${K.usd(r.high)}. Roofer pay, ice storm losses and the ${thr} registration rule.`,
  intro: `No state has larger expected ice storm losses to buildings than Arkansas, and its roofers are among the lowest paid in the country.`,
  resume: `Most Arkansas homeowners pay around ${K.usd(r.typical)} for a professional roof replacement, and the middle half of jobs costs ${K.usd(r.low)} to ${K.usd(r.high)}, below the national median of ${K.usd(us.typical)}. Two pieces of data explain the discount. The West South Central division, which Arkansas shares with Texas, Oklahoma and Louisiana, reported prices slightly under the national level in the 2023 American Housing Survey. And Arkansas roofers earned a mean of ${K.usd(w.mean, 2)} an hour in ${K.wageRef.reference}, ${under}% under the national ${K.usd(nat.mean, 2)} and ${low(wageRank)} of the 51 jurisdictions. Ice is the local twist. FEMA's National Risk Index rates expected annual ice storm losses to Arkansas buildings ${f.nri.ice_storm.rating}, around ${mil(f.nri.ice_storm.buildingLossUsd)} a year, with tornado losses rated ${f.nri.tornado.rating}. For a small home of ${small.bin!.label}, the estimate is ${K.usd(small.typical)}; a house of ${big.bin!.label} reaches ${K.usd(big.typical)}. Jobs above ${thr} require a state registration.`,
  body: (h) => `
<h2>Arkansas tops the country for ice storm losses</h2>
<p>The ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) assigns Arkansas expected annual ice storm losses to buildings of about ${mil(f.nri.ice_storm.buildingLossUsd)}, ${iceRank === 1 ? 'the largest of any state' : `ranked ${iceRank} among the states`}, with a score of ${Math.round(f.nri.ice_storm.score ?? 0)}. Winter weather adds a rating of ${f.nri.winter_weather.rating}, and tornadoes contribute roughly ${mil(f.nri.tornado.buildingLossUsd)} a year. Hail, often the headline elsewhere in the region, is rated ${f.nri.hail.rating}.</p>
<p>Ice does its damage through weight and through trees and limbs falling on the roof, and through meltwater backing up under shingles at the eaves. When comparing Arkansas bids, check what each one says about the membrane along the lower edge of the roof and about gutters and fascia that may need work at the same time. Those lines explain a good part of the spread between two otherwise similar quotes. A crew that only replaces shingles and ignores a sagging gutter line may leave the weakest point of the roof untouched, which is why the cheapest Arkansas bid is not always the lowest cost over the next few winters.</p>
<h2>Low wages, modest savings</h2>
<p>Arkansas roofers averaged ${h.usd(w.mean, 2)} an hour, against ${h.usd(la.mean, 2)} in Louisiana and ${h.usd(ok.mean, 2)} in Oklahoma. Labor is only one slice of a contractor's revenue, so a pay gap this size cuts the price by a few hundred dollars rather than a few thousand. For a house of ${big.bin!.label}, the Arkansas estimate is ${h.usd(big.typical)}, and half of similar jobs land between ${h.usd(big.low)} and ${h.usd(big.high)}.</p>
<h3>The residential roofer registration</h3>
<p>Arkansas requires a Residential Roofer Registration for roofing jobs over ${thr} in labor and materials, issued through the Residential Committee of the Contractors Licensing Board. It took the place of the old Home Improvement Roofing License ${since ? `on ${since}` : 'in a recent change'}. Contractors who already hold a Residential Builder or Residential Remodeler license do not need the separate registration. Since nearly every reroof exceeds the threshold, ask which of those credentials the company holds and write it into the contract.</p>
${h.mini('wageGap', { state: 'Arkansas', job: 'Roof replacement', median: us.typical * r.region, L: r.L, index: r.index })}`,
  faqs: [
    { q: 'How much should a roof replacement cost in Arkansas in 2026?', a: `Plan on about ${K.usd(r.typical)}, with half of professional Arkansas jobs between ${K.usd(r.low)} and ${K.usd(r.high)}. The estimate takes the West South Central price level reported in the 2023 American Housing Survey and adjusts the labor share to the Arkansas roofer wage of ${K.usd(w.mean, 2)} an hour. Larger homes and damaged decking push the figure up.` },
    { q: 'Do Arkansas roofers need a state registration?', a: `Yes, for roofing jobs over ${thr} in labor and materials. The Residential Roofer Registration replaced the earlier Home Improvement Roofing License, and contractors holding a Residential Builder or Residential Remodeler license are exempt from it. A full replacement nearly always passes the threshold, so confirm the credential before paying a deposit.` },
    { q: 'Why do ice storms matter so much for Arkansas roofs?', a: `FEMA's National Risk Index rates expected annual ice storm losses to Arkansas buildings ${f.nri.ice_storm.rating}, about ${mil(f.nri.ice_storm.buildingLossUsd)} a year, the top figure in the country. Ice loads, falling limbs and water backing up at the eaves damage roofs, so Arkansas quotes often include eave protection, gutter or fascia repairs that a basic shingle swap would not.` },
  ],
  related: ['roof-replacement-cost', 'roof:missouri', 'roof:oklahoma', 'roof:tennessee', 'roofing-calculator'],
  extraSources: [{ name: 'Arkansas Contractors Licensing Board: license and registration applications', url: lic.url }],
});
