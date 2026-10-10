import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'colorado';
const r = K.job('roof', slug);
const us = K.job('roof');
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const f = K.facts(slug);
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const all = K.states.map((s) => s.slug);
const lossRank = (hz: string) => [...all].sort((a, b) => (K.facts(b).nri[hz]?.buildingLossUsd ?? 0) - (K.facts(a).nri[hz]?.buildingLossUsd ?? 0)).indexOf(slug) + 1;
const place = (k: number) => (k === 1 ? 'the largest' : k === 2 ? 'the second largest' : k === 3 ? 'the third largest' : `number ${k}`);
const mil = (x: number | null) => `${K.usd(Math.round((x ?? 0) / 1e6))} million`;
const natDiff = Math.round((1 - w.mean / nat.mean) * 100);
const regionUp = Math.round((r.region - 1) * 100);
const ut = K.wage('utah', 'roofers')!;
const wy = K.wage('wyoming', 'roofers')!;
const nv = K.wage('nevada', 'roofers')!;
const hail = f.nri.hail.buildingLossUsd ?? 0;

export default defineState({
  slug,
  title: 'Roof Replacement Cost Colorado 2026: Hail Belt Prices, Wages',
  description: `Colorado roof replacement in 2026 costs about ${K.usd(r.typical)}, most jobs ${K.usd(r.low)} to ${K.usd(r.high)}, with FEMA hail losses near ${mil(hail)} a year and Colorado roofer pay data.`,
  intro: `Colorado's expected hail losses to buildings rank near the top nationally, which makes many replacements storm-driven.`,
  resume: `Expect about ${K.usd(r.typical)} for a professional roof replacement in Colorado, with half of jobs between ${K.usd(r.low)} and ${K.usd(r.high)}, slightly above the national median of ${K.usd(us.typical)}. The estimate begins with the Mountain division price level, roughly ${regionUp}% over the U.S. median in the 2023 American Housing Survey, and then shifts the labor share to Colorado pay. BLS measured a mean of ${K.usd(w.mean, 2)} an hour for the state's ${K.num(w.emp ?? 0)} roofers in ${K.wageRef.reference}, ${natDiff}% under the national ${K.usd(nat.mean, 2)} but above most of its neighbors, so the wage step nudges the price upward. What really shapes Colorado roofing is hail: FEMA's National Risk Index puts expected annual hail losses to buildings at about ${mil(hail)}, ${place(lossRank('hail'))} total among the 51 jurisdictions. Wildfire and winter weather also score high. For a home of ${small.bin!.label} the estimate is ${K.usd(small.typical)}, and for ${big.bin!.label} it is ${K.usd(big.typical)}, before any storm-season surcharge.`,
  body: (h) => `
<h2>Colorado hail, measured in dollars</h2>
<p>Hail is the hazard that defines Colorado roofing. The ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) estimates expected annual hail losses to the state's buildings at about ${mil(hail)}, rated ${f.nri.hail.rating} with a score of ${Math.round(f.nri.hail.score ?? 0)} out of 100, ${place(lossRank('hail'))} dollar figure in the country. Wildfire comes close behind at ${mil(f.nri.wildfire.buildingLossUsd)} and a rating of ${f.nri.wildfire.rating}, and tornadoes add ${mil(f.nri.tornado.buildingLossUsd)}. Winter weather is rated ${f.nri.winter_weather.rating}, although its dollar loss to buildings is far smaller.</p>
<p>With that profile, a large share of Colorado reroofs begin with an insurance adjuster rather than with a shingle that simply wore out. The claim, not the survey range, then decides the out-of-pocket cost: the deductible applies, and the scope the adjuster writes sets what the insurer pays. Get the contractor's quote in writing before the adjuster's visit, so you can compare the two scopes line by line.</p>
<h2>Where Colorado pay sits in the Mountain West</h2>
<p>Colorado's mean of ${h.usd(w.mean, 2)} an hour is above Utah's ${h.usd(ut.mean, 2)} and Wyoming's ${h.usd(wy.mean, 2)}, though a bit under Nevada's ${h.usd(nv.mean, 2)}. That places the state over the division's weighted average, so the labor adjustment raises the estimate slightly while the Mountain price level does the rest. For a house of ${big.bin!.label}, the result is ${h.usd(big.typical)}, and half of comparable jobs run from ${h.usd(big.low)} to ${h.usd(big.high)}.</p>
<h3>After a Colorado hailstorm</h3>
<p>Big storms bring a wave of door-knocking crews within days. A few habits protect you: keep the deposit modest, insist on a company address you can visit, and ask that the contract name the shingle line, the underlayment and the number of decking sheets included. If you want impact-rated shingles, say so before the adjuster's scope is final, because the insurer prices what it is asked to replace, and a later upgrade usually comes out of your pocket.</p>`,
  faqs: [
    { q: 'What is the typical cost of a new roof in Colorado for 2026?', a: `About ${K.usd(r.typical)} for a professional replacement, with half of Colorado jobs between ${K.usd(r.low)} and ${K.usd(r.high)}. The estimate uses the Mountain division price level from the 2023 American Housing Survey, in ${K.month(K.ahsMeta.cpi.to)} dollars, adjusted to a Colorado roofer wage of ${K.usd(w.mean, 2)} an hour. Larger homes and extensive decking repairs move a quote higher.` },
    { q: 'How large are hail losses to Colorado buildings?', a: `FEMA's National Risk Index estimates expected annual hail losses to Colorado buildings at about ${mil(hail)}, rated ${f.nri.hail.rating} and ${place(lossRank('hail'))} total of the 51 jurisdictions. That is why many Colorado roofs are replaced through insurance claims, where the deductible and the adjuster's scope decide how much the owner pays.` },
    { q: 'Are Colorado roofers paid more than roofers in nearby states?', a: `Mostly yes. BLS measured ${K.usd(w.mean, 2)} an hour for Colorado roofers in ${K.wageRef.reference}, against ${K.usd(ut.mean, 2)} in Utah and ${K.usd(wy.mean, 2)} in Wyoming, though Nevada's ${K.usd(nv.mean, 2)} is higher. Colorado is still ${natDiff}% under the national mean, so the effect on a typical roof price is a modest increase within the region.` },
  ],
  related: ['roof-replacement-cost', 'roof:wyoming', 'roof:utah', 'roof:kansas', 'roofing-calculator'],
  extraSources: [],
});
