import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'idaho';
const r = K.job('roof', slug);
const us = K.job('roof');
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const f = K.facts(slug);
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const all = K.states.map((s) => s.slug);
const fireRank = [...all].sort((a, b) => (K.facts(b).nri.wildfire?.buildingLossUsd ?? 0) - (K.facts(a).nri.wildfire?.buildingLossUsd ?? 0)).indexOf(slug) + 1;
const ord = (n: number) => { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`; };
const mil = (x: number | null) => `${K.usd(Math.round((x ?? 0) / 1e6))} million`;
const under = Math.round((1 - w.mean / nat.mean) * 100);
const regionUp = Math.round((r.region - 1) * 100);
const mt = K.wage('montana', 'roofers')!;
const ut = K.wage('utah', 'roofers')!;
const orw = K.wage('oregon', 'roofers')!;
const orJob = K.job('roof', 'oregon');
const waJob = K.job('roof', 'washington');

export default defineState({
  slug,
  title: 'Roof Replacement Cost Idaho 2026: Mountain West Prices, Pay',
  description: `Idaho roof replacement costs about ${K.usd(r.typical)} in 2026, most jobs ${K.usd(r.low)} to ${K.usd(r.high)}, well below Oregon and Washington. Wildfire leads FEMA's Idaho losses.`,
  intro: `Idaho roofs are priced at the Mountain division level, thousands below the Pacific states just across its western border.`,
  resume: `For a roof replacement by a contractor in Idaho, the 2026 estimate is about ${K.usd(r.typical)}, and half of jobs fall between ${K.usd(r.low)} and ${K.usd(r.high)}, a little above the national median of ${K.usd(us.typical)}. Idaho belongs to the Mountain division, where owners reported paying about ${regionUp}% over the U.S. median in the 2023 American Housing Survey. Its ${K.num(w.emp ?? 0)} roofers earned a mean of ${K.usd(w.mean, 2)} an hour in BLS data for ${K.wageRef.reference}, ${under}% under the national ${K.usd(nat.mean, 2)} and very close to the division average, so the wage step hardly changes the result. The comparison that surprises people is westward: Oregon's estimate is ${K.usd(orJob.typical)} and Washington's ${K.usd(waJob.typical)}, because the Pacific division reported much higher prices. Within Idaho, a home of ${small.bin!.label} comes out near ${K.usd(small.typical)} and one of ${big.bin!.label} near ${K.usd(big.typical)}. Wildfire is the hazard with the largest expected annual loss to Idaho buildings in FEMA's index.`,
  body: (h) => `
<h2>One border, two price levels for Idaho roofs</h2>
<p>The American Housing Survey groups states into Census divisions, and Idaho's western line is also a division line. On the Idaho side, the Mountain level applies; on the Oregon and Washington side, the Pacific level does. The gap between ${h.usd(r.typical)} in Idaho and ${h.usd(orJob.typical)} in Oregon is not about shingles. Oregon roofers average ${h.usd(orw.mean, 2)} an hour against Idaho's ${h.usd(w.mean, 2)}, and the Pacific survey median starts higher. Homeowners near the border who get bids from both sides should expect that spread to show up in labor and overhead lines.</p>
<h2>Wildfire and winter in FEMA's Idaho table</h2>
<p>The ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) puts expected annual wildfire losses to Idaho buildings at about ${mil(f.nri.wildfire.buildingLossUsd)}, rated ${f.nri.wildfire.rating} and the ${ord(fireRank)} largest wildfire figure among the 51 jurisdictions. Winter weather is rated ${f.nri.winter_weather.rating}, though its dollar loss to buildings is small. Hail is rated ${f.nri.hail.rating} and tornadoes ${f.nri.tornado.rating}, so the Plains-style hail claim is not the main driver of Idaho reroofs. Owners on lots near brush or timber can ask roofers which covering class and vent types they propose, and price those choices as separate lines.</p>
<h3>Idaho labor next to Montana and Utah</h3>
<p>Idaho pays ${h.usd(w.mean, 2)} an hour, between Utah's ${h.usd(ut.mean, 2)} and Montana's ${h.usd(mt.mean, 2)}. For a house of ${big.bin!.label}, the estimate is ${h.usd(big.typical)}, and half of comparable jobs land between ${h.usd(big.low)} and ${h.usd(big.high)}. Snow load does not appear as a separate price factor in the survey, but a roof that has carried heavy snow for years may hide soft decking near the eaves, so ask how many sheets the bid covers before extra charges start, and at what price per sheet. A bid that answers those questions in writing is easier to compare than a single total, and it protects you from a surprise invoice once the old shingles come off and the deck is exposed.</p>`,
  faqs: [
    { q: 'How much does a roof replacement cost in Idaho in 2026?', a: `About ${K.usd(r.typical)} for a professional job, with half of Idaho replacements costing ${K.usd(r.low)} to ${K.usd(r.high)}. The estimate is the Mountain division price level from the 2023 American Housing Survey, in ${K.month(K.ahsMeta.cpi.to)} dollars, adjusted to the Idaho roofer wage of ${K.usd(w.mean, 2)} an hour. Larger homes and damaged decking raise it.` },
    { q: 'Why is a roof cheaper in Idaho than in Oregon or Washington?', a: `Idaho sits in the Mountain division and its neighbors to the west in the Pacific division, where owners reported much higher roof prices in the 2023 American Housing Survey. Oregon roofers also earn more, ${K.usd(orw.mean, 2)} an hour against ${K.usd(w.mean, 2)} in Idaho. The result is an Oregon estimate of ${K.usd(orJob.typical)} versus ${K.usd(r.typical)} in Idaho.` },
    { q: 'What hazard causes the largest losses to Idaho buildings?', a: `Wildfire. FEMA's National Risk Index estimates expected annual wildfire losses to Idaho buildings at about ${mil(f.nri.wildfire.buildingLossUsd)}, rated ${f.nri.wildfire.rating}. Hail and tornado losses are small by comparison. The survey price does not rise with fire exposure, but owners near wildland often request fire-rated coverings, which change the quote.` },
  ],
  related: ['roof-replacement-cost', 'roof:montana', 'roof:utah', 'roof:oregon', 'roofing-calculator'],
  extraSources: [],
});
