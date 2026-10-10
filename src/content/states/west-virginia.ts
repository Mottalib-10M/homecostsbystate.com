import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'west-virginia';
const r = K.job('roof', slug);
const us = K.job('roof');
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const ky = K.wage('kentucky', 'roofers')!;
const oh = K.wage('ohio', 'roofers')!;
const va = K.wage('virginia', 'roofers')!;
const pa = K.wage('pennsylvania', 'roofers')!;
const kyR = K.job('roof', 'kentucky');
const ohR = K.job('roof', 'ohio');
const f = K.facts(slug);
const n = f.nri;
const total = (s: string) => Object.values(K.facts(s).nri).reduce((t, x) => t + (x.buildingLossUsd ?? 0), 0);
const lowRank = K.states.map((s) => total(s.slug)).sort((a, b) => a - b).indexOf(total(slug)) + 1;
const ord = (x: number) => { const s = ['th', 'st', 'nd', 'rd'], v = x % 100; return `${x}${s[(v - 20) % 10] || s[v] || s[0]}`; };
const mil = (x: number | null) => { const v = (x ?? 0) / 1e6; return `$${K.num(v, v >= 10 ? 0 : 1)} million`; };
const vsKy = r.typical - kyR.typical;

export default defineState({
  slug,
  title: 'Roof Replacement Cost West Virginia 2026: Prices and Storms',
  description: `West Virginia roof replacement in 2026: about ${K.usd(r.typical)} typical, ${K.usd(r.low)} to ${K.usd(r.high)} for most jobs, with expected storm losses to buildings among the lowest.`,
  intro: `West Virginia's roofs face low expected storm losses, and its Census grouping with the Atlantic states, not Kentucky, sets its price level.`,
  resume: `In West Virginia, a professional roof replacement typically costs about ${K.usd(r.typical)}, with most jobs between ${K.usd(r.low)} and ${K.usd(r.high)}, essentially the ${K.usd(us.typical)} national median. That may surprise anyone comparing with Kentucky next door. The Census Bureau places West Virginia in the South Atlantic division, which reported prices at the national level in the 2023 American Housing Survey, while Kentucky belongs to the cheaper East South Central division; the typical West Virginia estimate is therefore ${K.usd(vsKy)} higher than Kentucky's even though roofers in both states earn similar wages. BLS measured a mean of ${K.usd(w.mean, 2)} an hour for West Virginia roofers in ${K.wageRef.reference}, under the ${K.usd(nat.mean, 2)} national mean and just above the division average. The weather side is quiet. Summing the hazards this site reads from FEMA's National Risk Index, West Virginia has the ${ord(lowRank)} smallest expected annual losses to buildings in the country, with hail rated ${n.hail.rating} and tornadoes ${n.tornado.rating}.`,
  body: (h) => `
<h2>Atlantic pricing in an Appalachian state</h2>
<p>The method behind this page starts from a Census division, and West Virginia's is the South Atlantic, the same group as Virginia, Maryland and Florida. Kentucky, across the Big Sandy and the Ohio, sits in the East South Central division, where owners reported prices well under the national median. Ohio, in the East North Central division, lands at ${h.usd(ohR.typical)}. The wages are close: ${h.usd(w.mean, 2)} in West Virginia, ${h.usd(ky.mean, 2)} in Kentucky, ${h.usd(oh.mean, 2)} in Ohio and ${h.usd(va.mean, 2)} in Virginia. So the gap between ${h.usd(r.typical)} here and ${h.usd(kyR.typical)} in Kentucky comes from the regional price level, not from what roofers earn.</p>
<p>In practice, a homeowner in the Huntington or Wheeling area may receive bids from firms based in Kentucky, Ohio or Pennsylvania, where roofers average ${h.usd(pa.mean, 2)}. Comparing those quotes on the same written scope is more useful than comparing them with any statewide figure.</p>
<h2>Low storm exposure across the board</h2>
<p>The ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) puts West Virginia's combined expected annual losses to buildings from the main roof hazards at about ${mil(total(slug))}. The largest line, hurricanes, shows ${mil(n.hurricane.buildingLossUsd)}, rated ${n.hurricane.rating}. Hail comes to ${mil(n.hail.buildingLossUsd)}, tornadoes ${mil(n.tornado.buildingLossUsd)} and strong wind ${mil(n.strong_wind.buildingLossUsd)}, each rated low. Ice storms are ${n.ice_storm.rating} and winter weather ${n.winter_weather.rating}.</p>
<p>With that profile, age and wear are the likelier triggers for a replacement. It also gives the owner time: collect several bids, ask each roofer to check the decking from the attic, and settle in writing how many layers come off and how many plywood sheets the price includes.</p>
<h3>Price bands for West Virginia homes</h3>
<p>A house of ${big.bin!.label} comes to about ${h.usd(big.typical)}, with most jobs between ${h.usd(big.low)} and ${h.usd(big.high)}. For ${small.bin!.label}, the estimate is close to ${h.usd(small.typical)}. Steep hillside lots can complicate access for dumpsters and material deliveries; if yours is one, ask whether the quote includes extra handling.</p>
<p>Gutters, chimney flashing and pipe boots are the small items that separate one West Virginia bid from another. Some roofers replace flashing as a matter of course, others reuse it unless asked. Have each contractor say which, and price any chimney work as its own line.</p>`,
  faqs: [
    { q: 'How much does a new roof cost in West Virginia?', a: `About ${K.usd(r.typical)} for a typical professional replacement in West Virginia, with half of jobs between ${K.usd(r.low)} and ${K.usd(r.high)}. The estimate starts from South Atlantic prices in the American Housing Survey and adjusts the labor share to West Virginia roofer wages from BLS. Difficult access, extra layers or decking repairs raise individual quotes.` },
    { q: 'Why is a roof estimate higher in West Virginia than in Kentucky?', a: `Because of Census divisions. West Virginia belongs to the South Atlantic division, which reported prices at the national level, while Kentucky sits in the East South Central division, priced well below it. Roofer wages are similar, ${K.usd(w.mean, 2)} an hour in West Virginia against ${K.usd(ky.mean, 2)} in Kentucky, so the region explains most of the ${K.usd(vsKy)} difference.` },
    { q: 'Do storms damage many roofs in West Virginia?', a: `Relatively few. FEMA's National Risk Index gives West Virginia the ${ord(lowRank)} smallest combined expected annual losses to buildings from the main roof-related hazards, about ${mil(total(slug))}. Hail, tornado and strong wind losses are all rated low, so age and wear are the likelier reasons a West Virginia roof needs replacing.` },
  ],
  related: ['roof-replacement-cost', 'roof:kentucky', 'roof:virginia', 'roof:ohio', 'roofing-calculator'],
  extraSources: [],
});
