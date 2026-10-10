import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'maine';
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
const ord = (n: number) => { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`; };
const mil = (x: number | null) => `${K.usd(Math.round((x ?? 0) / 1e6))} million`;
const under = Math.round((1 - w.mean / nat.mean) * 100);
const underDiv = Math.round((1 - r.index) * 100);
const regionUp = Math.round((r.region - 1) * 100);
const contract = K.usd(lic.threshold_usd ?? 0);
const nh = K.wage('new-hampshire', 'roofers')!;
const vt = K.wage('vermont', 'roofers')!;
const ma = K.wage('massachusetts', 'roofers')!;
const save = K.usd(us.typical * r.region - r.typical);

export default defineState({
  slug,
  title: 'Roof Replacement Cost Maine 2026: Prices and Contract Rules',
  description: `Maine roof replacement in 2026: about ${K.usd(r.typical)} typical, ${K.usd(r.low)} to ${K.usd(r.high)} for most jobs, with no state roofer license and a written contract over ${contract}.`,
  intro: `Maine does not license roofers at all, but any home repair contract over ${contract} has to be in writing.`,
  resume: `Budget about ${K.usd(r.typical)} for a professional roof replacement in Maine in 2026, with half of jobs between ${K.usd(r.low)} and ${K.usd(r.high)}, above the national median of ${K.usd(us.typical)}. New England as a whole is expensive: owners there reported paying about ${regionUp}% more than the U.S. median in the 2023 American Housing Survey. Maine wages pull the state back from that level. BLS measured a mean of ${K.usd(w.mean, 2)} an hour for Maine roofers in ${K.wageRef.reference}, ${under}% under the national ${K.usd(nat.mean, 2)} and about ${underDiv}% under the New England average, the lowest pay in the division. That gap saves roughly ${save} on a typical job compared with the division median. A home of ${small.bin!.label} is estimated near ${K.usd(small.typical)}; one of ${big.bin!.label} near ${K.usd(big.typical)}. The rules are light: the Maine Attorney General says general contractors and trades such as roofing are not licensed, while home construction or repair over ${contract} requires a written contract. FEMA rates Maine's ice storm and winter weather losses to buildings ${f.nri.ice_storm.rating}.`,
  body: (h) => `
<h2>No license, but a contract law with teeth in Maine</h2>
<p>Maine is one of the places where nobody checks a roofer's credentials before the job. According to the Office of the Attorney General, general contractors and trades such as roofing are not licensed or regulated in the state. What Maine does require is paper: home construction or repair work over ${contract} needs a written contract. For a reroof, that contract is your main protection, so it should state the total price, the payment schedule, start and finish dates, the materials by brand, what happens if rotten boards turn up, and how change orders are approved. Without a license to look up, references, proof of insurance and a local track record matter more here than in most states.</p>
<h2>Ice, snow and Maine roofs</h2>
<p>The ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) rates expected annual ice storm losses to Maine buildings ${f.nri.ice_storm.rating}, about ${mil(f.nri.ice_storm.buildingLossUsd)}, the ${ord(iceRank)} largest figure in the country. Winter weather is rated ${f.nri.winter_weather.rating}. Hurricanes add roughly ${mil(f.nri.hurricane.buildingLossUsd)}, while hail, tornadoes and wildfire barely register. A winter-heavy hazard profile puts the eaves under stress, so ask how a bid treats the waterproof membrane along the lower edge and the ventilation that keeps the deck cold. Those two items rarely dominate the price, yet they decide whether meltwater stays on top of the shingles or finds its way into the ceiling below.</p>
${h.mini('wageGap', { state: 'Maine', job: 'Roof replacement', median: us.typical * r.region, L: r.L, index: r.index })}
<h3>Maine labor in New England terms</h3>
<p>At ${h.usd(w.mean, 2)} an hour, Maine roofers earn less than their peers in New Hampshire (${h.usd(nh.mean, 2)}), Vermont (${h.usd(vt.mean, 2)}) and especially Massachusetts (${h.usd(ma.mean, 2)}). The site's method keeps the New England price level and moves only the labor share, so Maine lands below its neighbors without dropping to the national median. For a house of ${big.bin!.label}, the estimate is ${h.usd(big.typical)}, and half of comparable jobs fall between ${h.usd(big.low)} and ${h.usd(big.high)}.</p>`,
  faqs: [
    { q: 'How much does a roof replacement cost in Maine in 2026?', a: `About ${K.usd(r.typical)} for a professional job, with half of Maine replacements between ${K.usd(r.low)} and ${K.usd(r.high)}. The New England price level from the 2023 American Housing Survey starts high, and the Maine roofer wage of ${K.usd(w.mean, 2)} an hour, the lowest in the division, brings the estimate down a little.` },
    { q: 'Are roofers licensed in Maine?', a: `No. The Maine Attorney General states that general contractors and trades such as roofing are not licensed or regulated in the state. The protection comes from contract law instead: home construction or repair over ${contract} requires a written contract, so make sure yours lists the price, schedule, materials and how extra work is approved.` },
    { q: 'Why does a Maine roof cost more than the national median when wages are lower?', a: `Because the regional price level weighs more than the wage. New England owners reported paying about ${regionUp}% above the national median for roof jobs. Maine roofers earn ${K.usd(w.mean, 2)} an hour, ${under}% under the national mean, which trims the labor share but leaves the total above the U.S. figure.` },
  ],
  related: ['roof-replacement-cost', 'roof:new-hampshire', 'roof:vermont', 'roof:massachusetts', 'heat-pump-cost'],
  extraSources: [{ name: 'Maine Attorney General: home construction and repair', url: lic.url }],
});
