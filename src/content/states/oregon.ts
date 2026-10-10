import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'oregon';
const r = K.job('roof', slug);
const us = K.job('roof');
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const wa = K.wage('washington', 'roofers')!;
const ca = K.wage('california', 'roofers')!;
const idw = K.wage('idaho', 'roofers')!;
const idR = K.job('roof', 'idaho');
const waR = K.job('roof', 'washington');
const f = K.facts(slug);
const n = f.nri;
const lic = f.licensing!;
const code = f.code!;
const ch1 = code.summary.match(/chapter (\d+) effective/)![1];
const orsc = code.summary.match(/(20\d\d) Oregon Residential/)![1];
const prior = code.summary.match(/(20\d\d) ORSC applies/)![1];
const codeDates = code.summary.match(/[A-Z][a-z]+\.? \d{1,2}, 20\d\d/g)!;
const mil = (x: number | null) => `$${K.num((x ?? 0) / 1e6)} million`;
const regionPct = Math.round((r.region - 1) * 100);

export default defineState({
  slug,
  title: 'Roof Replacement Cost Oregon 2026: Pacific Prices, CCB Rules',
  description: `Oregon roof replacement costs about ${K.usd(r.typical)} in 2026, with most jobs ${K.usd(r.low)} to ${K.usd(r.high)}, as Pacific prices run ${regionPct}% over the U.S. and roofers need a CCB license.`,
  intro: `Oregon sits in the most expensive Census division for roof work, though its roofers earn less than their California and Washington neighbors.`,
  resume: `Oregon homeowners pay about ${K.usd(r.typical)} for a typical professional roof replacement, and the middle half of jobs runs from ${K.usd(r.low)} to ${K.usd(r.high)}, far above the ${K.usd(us.typical)} national median. The reason is regional. Owners in the Pacific division, which groups Oregon with Washington, California, Alaska and Hawaii, reported prices about ${regionPct}% above the national level in the 2023 American Housing Survey, the highest of any division. Oregon then comes in a little under its division on pay: BLS measured a mean of ${K.usd(w.mean, 2)} an hour for roofers in ${K.wageRef.reference}, above the ${K.usd(nat.mean, 2)} national mean but below Washington and California, which trims the labor share slightly. Storm losses are modest. FEMA's National Risk Index rates Oregon's expected annual losses to buildings from hail as ${n.hail.rating} and from tornadoes as ${n.tornado.rating}, while wildfire is rated ${n.wildfire.rating}. Roofing is work that requires a license from the Oregon Construction Contractors Board, and a new residential code is phasing in.`,
  body: (h) => `
<h2>Oregon pays Pacific prices for a mild storm profile</h2>
<p>Hail and tornadoes hardly register on Oregon roofs. The ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) expects about ${mil(n.hail.buildingLossUsd)} a year in hail losses to buildings and ${mil(n.tornado.buildingLossUsd)} from tornadoes, and hurricanes are left unscored for Oregon. Strong wind is rated ${n.strong_wind.rating} at ${mil(n.strong_wind.buildingLossUsd)}. Wildfire is the exception, with ${mil(n.wildfire.buildingLossUsd)} in expected annual losses, rated ${n.wildfire.rating}. So the high Oregon price is not a storm premium. It reflects what owners across the Pacific division pay for the same work.</p>
<p>That has a consequence for planning. Oregon roofs are more often replaced at the end of their service life than after a sudden event, which leaves room to schedule, compare bids and pick materials. If the house is near forest or grassland, the fire classification of the covering and ember-resistant vents are worth pricing as separate lines.</p>
<h2>CCB licensing and the new residential code</h2>
<p>The ${h.ext(lic.url, 'Oregon Construction Contractors Board')} lists roofing among the work that requires a CCB license, with residential or commercial endorsements. It is a general contractor license rather than a roofing specialty, so ask for the number on the bid and confirm with the board that it is active.</p>
<p>The ${h.ext(code.url, 'Building Codes Division')} reports that the ${orsc} Oregon Residential Specialty Code takes effect on ${codeDates[0]}. Chapter ${ch1} is mandatory from that date; the technical chapters become mandatory on ${codeDates[codeDates.length - 1]}, and the ${prior} edition applies to them until then. If your reroof needs a permit during that window, ask the building department which edition it applies.</p>
<h3>Between Washington and Idaho on price</h3>
<p>Oregon roofers average ${h.usd(w.mean, 2)}, compared with ${h.usd(wa.mean, 2)} in Washington, ${h.usd(ca.mean, 2)} in California and ${h.usd(idw.mean, 2)} in Idaho. Washington's estimate on this site is ${h.usd(waR.typical)}; Idaho, in the cheaper Mountain division, is ${h.usd(idR.typical)}. For an Oregon house of ${big.bin!.label}, the figure is ${h.usd(big.typical)}, with most jobs from ${h.usd(big.low)} to ${h.usd(big.high)}; for ${small.bin!.label}, about ${h.usd(small.typical)}. Growth and debris on an older roof can hide soft decking, so ask the bidder to walk the roof or check from the attic before quoting.</p>
${h.mini('wageGap', { state: 'Oregon', job: 'Roof replacement', median: us.typical * r.region, L: r.L, index: r.index })}`,
  faqs: [
    { q: 'How much does a new roof cost in Oregon?', a: `About ${K.usd(r.typical)} for a typical professional replacement in Oregon, with half of jobs between ${K.usd(r.low)} and ${K.usd(r.high)}. The estimate applies Oregon roofer wages to the Pacific division price level from the American Housing Survey, the highest of any division. Steep roofs, decking repairs and premium materials can push a quote above that range.` },
    { q: 'Why is roof replacement more expensive in Oregon than the national average?', a: `Mainly because Pacific division owners reported prices about ${regionPct}% above the national median in the 2023 American Housing Survey. Oregon roofers earn ${K.usd(w.mean, 2)} an hour, more than the national mean but less than in Washington and California, so labor trims the Oregon estimate slightly within its division.` },
    { q: 'Do Oregon roofers need a CCB license?', a: `Yes. The Oregon Construction Contractors Board lists roofing among the work that requires a CCB license, with residential or commercial endorsements. It is a general contractor license, not a roofing-specific one. Look up the license number on the board's website before signing an Oregon roofing contract or paying a deposit.` },
  ],
  related: ['roof-replacement-cost', 'roof:washington', 'roof:california', 'roof:idaho', 'solar-panel-cost'],
  extraSources: [
    { name: 'Oregon Construction Contractors Board, CCB license', url: lic.url },
    { name: 'Oregon Building Codes Division, adopted codes', url: code.url },
  ],
});
