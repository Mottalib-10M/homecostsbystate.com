import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'louisiana';
const r = K.job('roof', slug);
const us = K.job('roof');
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const f = K.facts(slug);
const lic = f.licensing!;
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const all = K.states.map((s) => s.slug);
const hurRank = [...all].sort((a, b) => (K.facts(b).nri.hurricane?.buildingLossUsd ?? 0) - (K.facts(a).nri.hurricane?.buildingLossUsd ?? 0)).indexOf(slug) + 1;
const hur = f.nri.hurricane.buildingLossUsd ?? 0;
const bn = `$${(hur / 1e9).toFixed(1)} billion`;
const mil = (x: number | null) => `${K.usd(Math.round((x ?? 0) / 1e6))} million`;
const under = Math.round((1 - w.mean / nat.mean) * 100);
const overDiv = Math.round((r.index - 1) * 100);
const reg = K.usd(lic.threshold_usd ?? 0);
const resLic = lic.summary.match(/over (\$[\d,]+) requires a Residential license/)?.[1];
const subclass = lic.summary.match(/subclassification \(([\d.]+)\)/)?.[1];
const tx = K.wage('texas', 'roofers')!;
const ar = K.wage('arkansas', 'roofers')!;
const ms = K.job('roof', 'mississippi');

export default defineState({
  slug,
  title: 'Roof Replacement Cost Louisiana 2026: Prices and LSLBC Rules',
  description: `Louisiana roof replacement in 2026 costs about ${K.usd(r.typical)}, most jobs ${K.usd(r.low)} to ${K.usd(r.high)}. Hurricane losses near ${bn} a year and LSLBC licensing tiers.`,
  intro: `Louisiana's expected hurricane losses to buildings are second only to Florida's, and roof work above ${reg} needs a state credential.`,
  resume: `In Louisiana, a professional roof replacement costs about ${K.usd(r.typical)} in 2026, and half of jobs fall between ${K.usd(r.low)} and ${K.usd(r.high)}, almost level with the national median of ${K.usd(us.typical)}. The West South Central division reported prices a little under the national level in the 2023 American Housing Survey, and Louisiana pay nudges the figure back up: BLS measured a mean of ${K.usd(w.mean, 2)} an hour for the state's roofers in ${K.wageRef.reference}, ${under}% below the national ${K.usd(nat.mean, 2)} but ${overDiv}% above the division average, the best roofer pay in a group that includes Texas, Oklahoma and Arkansas. A home of ${small.bin!.label} comes out near ${K.usd(small.typical)}, and one of ${big.bin!.label} near ${K.usd(big.typical)}. The coast defines the risk. FEMA's National Risk Index puts expected annual hurricane losses to Louisiana buildings near ${bn}, rated ${f.nri.hurricane.rating}. Contractor rules come in tiers: home improvement work of ${reg} or more needs a registration or license, and larger residential projects need a full license.`,
  body: (h) => `
<h2>${bn} in yearly hurricane losses to Louisiana buildings</h2>
<p>The ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) estimates expected annual hurricane losses to Louisiana buildings at about ${bn}, ${hurRank === 2 ? 'the second largest total in the country' : `ranked ${hurRank} nationally`}, with a score of ${Math.round(f.nri.hurricane.score ?? 0)}. Ice storms, perhaps surprisingly, are rated ${f.nri.ice_storm.rating} at roughly ${mil(f.nri.ice_storm.buildingLossUsd)} a year, and tornadoes add ${mil(f.nri.tornado.buildingLossUsd)}. Hail is rated ${f.nri.hail.rating}. After a major storm, demand for roofers spikes across whole parishes, and prices and wait times follow; the survey range on this page describes ordinary market conditions, not the weeks after landfall. If your roof is aging and still sound, scheduling the replacement outside hurricane season usually means more bidders, steadier prices and a crew that is not splitting its days among a dozen emergency tarps.</p>
<h2>Three tiers of Louisiana contractor credentials</h2>
<p>The Louisiana State Licensing Board for Contractors (LSLBC) sorts residential work by size. Home improvement work on an existing residence valued at ${reg} or more requires a home improvement registration or a license. Residential construction or home improvement over ${resLic} requires a Residential license. Within the residential classes, the board has a Residential Roofing subclassification (${subclass}) that comes with a trade exam. A typical reroof falls in the registration band, so ask which credential the company holds and check it on the board's site.</p>
<h3>Louisiana pay and the neighbors</h3>
<p>Louisiana roofers average ${h.usd(w.mean, 2)} an hour, ahead of Texas at ${h.usd(tx.mean, 2)} and Arkansas at ${h.usd(ar.mean, 2)}. Across the river, Mississippi belongs to a lower-priced division, and its estimate is ${h.usd(ms.typical)}. For a house of ${big.bin!.label}, the Louisiana estimate reaches ${h.usd(big.typical)}, and half of comparable jobs run from ${h.usd(big.low)} to ${h.usd(big.high)}. In storm season, read every contract for the deposit amount and the payment schedule, and make sure the name on the paperwork matches the registered company.</p>`,
  faqs: [
    { q: 'How much does a new roof cost in Louisiana in 2026?', a: `About ${K.usd(r.typical)} for a professional replacement, with half of Louisiana jobs between ${K.usd(r.low)} and ${K.usd(r.high)}. The estimate uses the West South Central price level from the 2023 American Housing Survey and moves the labor share to the Louisiana roofer wage of ${K.usd(w.mean, 2)} an hour, the highest in that division.` },
    { q: 'What license does a Louisiana roofer need?', a: `It depends on the job's value. LSLBC requires a home improvement registration or license for work on an existing home of ${reg} or more, and a Residential license for projects over ${resLic}. The board also offers a Residential Roofing subclassification with its own trade exam. Check the credential on the LSLBC site before signing.` },
    { q: 'How big are hurricane losses to Louisiana buildings?', a: `FEMA's National Risk Index estimates expected annual hurricane losses to Louisiana buildings at about ${bn}, second only to Florida. Ice storms add roughly ${mil(f.nri.ice_storm.buildingLossUsd)}. Storm replacements in Louisiana usually go through insurance, where the deductible and the adjuster's scope decide the owner's share.` },
  ],
  related: ['roof-replacement-cost', 'roof:texas', 'roof:mississippi', 'roof:arkansas', 'hvac-replacement-cost'],
  extraSources: [{ name: 'Louisiana State Licensing Board for Contractors: types of licenses', url: lic.url }],
});
