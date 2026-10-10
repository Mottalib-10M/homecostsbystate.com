import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'new-hampshire';
const r = K.job('roof', slug);
const us = K.job('roof');
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const ma = K.wage('massachusetts', 'roofers')!;
const me = K.wage('maine', 'roofers')!;
const vt = K.wage('vermont', 'roofers')!;
const f = K.facts(slug);
const n = f.nri;
const mil = (x: number | null) => { const v = (x ?? 0) / 1e6; return `$${K.num(v, v >= 10 ? 0 : 1)} million`; };
const extra = r.typical - us.typical;
const regionPct = Math.round((r.region - 1) * 100);

export default defineState({
  slug,
  title: 'Roof Replacement Cost New Hampshire 2026: Prices and Wages',
  description: `New Hampshire roof replacement in 2026: about ${K.usd(r.typical)} typical and ${K.usd(r.low)} to ${K.usd(r.high)} for most jobs, driven by New England price levels more than storms.`,
  intro: `New Hampshire roofs face some of the smallest storm losses in FEMA's index, but New England prices still put the bill above the national median.`,
  resume: `In New Hampshire a professionally replaced roof costs about ${K.usd(r.typical)}, and most jobs run from ${K.usd(r.low)} to ${K.usd(r.high)}, some ${K.usd(extra)} more than the national median. The weather is not what drives that premium. The New England division, which covers New Hampshire with Maine, Vermont, Massachusetts, Rhode Island and Connecticut, reported prices about ${regionPct}% above the national level in the 2023 American Housing Survey, and that regional level is the starting point. BLS then puts New Hampshire roofers at a mean of ${K.usd(w.mean, 2)} an hour in ${K.wageRef.reference}, above the ${K.usd(nat.mean, 2)} national mean yet below Massachusetts, which slightly lowers the estimate within the division. FEMA's National Risk Index, meanwhile, rates the state's expected annual losses to buildings from hail as ${n.hail.rating} and from strong wind as ${n.strong_wind.rating}. A New Hampshire roof is more likely to be replaced because it has aged out than because a storm took it.`,
  body: (h) => `
<h2>Granite State roofs and a quiet hazard ledger</h2>
<p>Hail barely touches New Hampshire buildings: the ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) expects about ${h.usd(n.hail.buildingLossUsd ?? 0)} a year statewide, rated ${n.hail.rating}. Wildfire is rated ${n.wildfire.rating} too. The largest line is hurricanes, at ${mil(n.hurricane.buildingLossUsd)} a year but still rated only ${n.hurricane.rating}, followed by ice storms at ${mil(n.ice_storm.buildingLossUsd)}, rated ${n.ice_storm.rating}. Winter weather is ${n.winter_weather.rating} and tornadoes ${n.tornado.rating}.</p>
<p>In practice, that makes the timing of a replacement more of a choice. Owners can collect several bids, wait for a contractor with an opening, and compare products instead of signing the week after a storm.</p>
<h2>Paying New England rates without Boston wages</h2>
<p>New Hampshire roofers earn ${h.usd(w.mean, 2)} an hour on average, compared with ${h.usd(ma.mean, 2)} in Massachusetts, ${h.usd(vt.mean, 2)} in Vermont and ${h.usd(me.mean, 2)} in Maine. The state therefore sits in the upper middle of its division on pay. Because the calculator applies the division's price level first and then scales only the labor share to state wages, the result lands a little under the Massachusetts estimate and above the Maine and Vermont figures for the same job.</p>
<h3>House size in the New Hampshire estimate</h3>
<p>A home of ${big.bin!.label} comes to about ${h.usd(big.typical)}, with the middle half between ${h.usd(big.low)} and ${h.usd(big.high)}; one of ${small.bin!.label} is closer to ${h.usd(small.typical)}. Older New Hampshire houses sometimes hide two or three shingle layers or plank sheathing, which changes the tear-off labor and the decking repairs. Ask the bidder to open a small section or check from the attic before committing to a number.</p>
<p>Snow is part of the planning even if FEMA's winter score is moderate. The eaves of a cold roof are where ice dams form, so ask how far up the slope the ice and water membrane runs and whether attic ventilation will be improved at the same time. Both items add to a New Hampshire quote, and a bidder who leaves them out is not offering the same roof as one who includes them.</p>
<p>Because storms rarely force the decision, a written comparison of three bids is realistic here. Line them up by tear-off, decking allowance, membrane, shingle line and warranty terms rather than by the bottom number alone.</p>`,
  faqs: [
    { q: 'How much should I budget for a new roof in New Hampshire?', a: `Budget about ${K.usd(r.typical)} for a typical professional replacement in New Hampshire, with most jobs between ${K.usd(r.low)} and ${K.usd(r.high)}. The range reflects New England prices reported to the American Housing Survey, adjusted for New Hampshire roofer wages from BLS. A large home, several old layers or new sheathing can lift the quote toward the upper end.` },
    { q: 'Why does a roof cost more in New Hampshire than the national average?', a: `Mostly because of the region. Owners in the New England division reported prices about ${regionPct}% above the national median in the 2023 American Housing Survey. New Hampshire roofers earn ${K.usd(w.mean, 2)} an hour, more than the national mean but less than in Massachusetts, which trims the state estimate slightly within the division.` },
    { q: 'Do storms cause many roof replacements in New Hampshire?', a: `Fewer than in most states. FEMA rates New Hampshire's expected annual hail losses to buildings as ${n.hail.rating} and strong wind as ${n.strong_wind.rating}. Hurricanes and ice storms produce the largest dollar figures, yet they are rated ${n.hurricane.rating} and ${n.ice_storm.rating}. Most New Hampshire roofs are replaced at the end of their service life.` },
  ],
  related: ['roof-replacement-cost', 'roof:vermont', 'roof:maine', 'roof:massachusetts', 'heat-pump-cost'],
  extraSources: [],
});
