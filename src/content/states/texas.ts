import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.state('texas');
const r = K.job('roof', 'texas');
const us = K.job('roof');
const w = K.wage('texas', 'roofers')!;
const nat = K.natWage('roofers');
const f = K.facts('texas');
const big = K.job('roof', 'texas', 3000);
const gap = Math.round((1 - w.mean / nat.mean) * 100);
const hailUsd = f.nri.hail.buildingLossUsd ?? 0;
const trades = Object.keys(K.P.jobs).length && ['roofers', 'plumbers', 'hvac', 'electricians', 'painters', 'drywall', 'cement', 'laborers', 'carpenters', 'fence', 'solar', 'landscaping', 'movers'];
const below = trades.filter((o) => (K.wage('texas', o)?.mean ?? Infinity) < K.natWage(o).mean).length;

export default defineState({
  slug: 'texas',
  title: 'Roof Replacement Cost Texas 2026: Prices and Roofer Wages',
  description: `Roof replacement cost in Texas for 2026: ${K.usd(r.typical)} typical, ${K.usd(r.low)} to ${K.usd(r.high)} for most jobs, Census data, with Texas roofer wages ${gap}% under the U.S. mean.`,
  intro: `Texas roofers earn less than the national mean, but hail exposure is the highest of any state in FEMA's index.`,
  resume: `A professional roof replacement in Texas costs about ${K.usd(r.typical)}, and most jobs fall between ${K.usd(r.low)} and ${K.usd(r.high)}, slightly under the national median of ${K.usd(us.typical)}. The figure starts from what owners in the West South Central division (Texas, Oklahoma, Louisiana and Arkansas) reported paying professionals in the 2023 American Housing Survey, brought to ${K.month(K.ahsMeta.cpi.to)} dollars. It then moves the labor share of the job to Texas wages: BLS measured a mean of ${K.usd(w.mean, 2)} an hour for roofers in Texas in ${K.wageRef.reference}, ${gap}% below the national ${K.usd(nat.mean, 2)}. Cheaper labor does not make Texas roofs cheap to own, though. FEMA's National Risk Index rates the state's expected yearly hail losses to buildings as ${f.nri.hail.rating}, the top score among all states, so many Texas roofs are replaced after storms rather than at the end of their life.`,
  body: (h) => `
<h2>Hail, not age, retires many Texas roofs</h2>
<p>The ${h.src('fema_nri_states', 'FEMA National Risk Index')} (version of ${h.nriVersion}) estimates that hail costs Texas buildings about ${h.usd(hailUsd)} a year on average, the largest expected hail loss in the country. Strong wind is rated ${f.nri.strong_wind.rating}, tornadoes ${f.nri.tornado.rating} and hurricanes ${f.nri.hurricane.rating}. For an owner, that means two different price situations. A planned replacement, at the end of a shingle's service life, follows the range on this page. A replacement after a storm usually runs through an insurance claim, where the adjuster's estimate and the deductible set what you pay out of pocket, and demand from a whole neighborhood can push roofers' prices up for weeks.</p>
<p>After a large hailstorm, out-of-town crews often arrive within days. Before signing, check that the company has a local address, that the contract lists the tear-off, decking allowance and shingle line separately, and that payment follows the insurer's schedule rather than coming fully up front.</p>
<h2>What lower wages change, and what they do not</h2>
<p>Labor is about a quarter of a roofing contractor's revenue nationally, according to the ${h.src('census_ec', '2022 Economic Census')}. Texas roofer pay ${gap}% under the national mean therefore trims a few hundred dollars from a typical job rather than thousands; shingles, underlayment and dumpsters cost about the same in Dallas as in Denver. The calculator above applies exactly that: the West South Central price level from the survey, with the labor share moved to Texas wages.</p>
<p>Size moves the bill more than location. For a house of 3,000 to 3,999 square feet, the Texas estimate climbs to ${h.usd(big.typical)}, with the middle half of jobs between ${h.usd(big.low)} and ${h.usd(big.high)}. Large single-story homes, common in Texas suburbs, carry more roof per square foot of living space than two-story houses of the same size.</p>
<h3>Reading a Texas roofing quote</h3>
<p>Ask whether the price assumes one layer of old shingles or two, how many sheets of decking are included before extra charges apply, and whether the shingles quoted carry an impact rating if you plan to ask your insurer about it. Compare the total with the range above: a quote far beyond ${h.usd(r.high)} for an ordinary asphalt roof deserves a line-by-line explanation.</p>
${h.mini('wageGap', { state: 'Texas', job: 'Roof replacement', median: us.typical * r.region, L: r.L, index: r.index })}`,
  faqs: [
    { q: 'How much does a new roof cost in Texas in 2026?', a: `About ${K.usd(r.typical)} for a typical professional replacement, with half of jobs between ${K.usd(r.low)} and ${K.usd(r.high)}. That combines what owners in the West South Central division reported to the Census Bureau with the Texas roofer wage BLS measured in May 2025. A larger house, a steep roof or rotten decking pushes the price toward the top of the range.` },
    { q: 'Why are Texas roofers paid less than the national average?', a: `BLS measured a mean of ${K.usd(w.mean, 2)} an hour for Texas roofers in May 2025, against ${K.usd(nat.mean, 2)} nationally. In Texas, ${below} of the ${trades.length} trades this site tracks are paid below their national mean. Because labor is only part of a roofing contractor's costs, the lower wage reduces a typical Texas roof by a modest amount rather than a large one.` },
    { q: 'Does hail damage make roof replacement more common in Texas?', a: `FEMA's National Risk Index rates Texas's expected annual hail losses to buildings as ${f.nri.hail.rating}, the highest score of any state, at about ${K.usd(hailUsd)} a year. Many Texas roofs are therefore replaced after storms through insurance claims, where the deductible and the adjuster's estimate decide what the owner pays.` },
  ],
  related: ['roof-replacement-cost', 'roof:oklahoma', 'roof:louisiana', 'roofing-calculator', 'water-heater-replacement-cost'],
  extraSources: [],
});
