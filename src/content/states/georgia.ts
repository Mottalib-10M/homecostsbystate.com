import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'georgia';
const r = K.job('roof', slug);
const us = K.job('roof');
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const f = K.facts(slug);
const code = f.code!;
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const all = K.states.map((s) => s.slug);
const lossRank = (hz: string) => [...all].sort((a, b) => (K.facts(b).nri[hz]?.buildingLossUsd ?? 0) - (K.facts(a).nri[hz]?.buildingLossUsd ?? 0)).indexOf(slug) + 1;
const ord = (n: number) => { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`; };
const mil = (x: number | null) => `${K.usd(Math.round((x ?? 0) / 1e6))} million`;
const under = Math.round((1 - w.mean / nat.mean) * 100);
const peers = K.states.filter((s) => s.division === K.state(slug).division);
const lowestInDiv = peers.every((s) => (K.wage(s.slug, 'roofers')?.mean ?? Infinity) >= w.mean);
const fl = K.wage('florida', 'roofers')!;
const sc = K.wage('south-carolina', 'roofers')!;
const nc = K.wage('north-carolina', 'roofers')!;
const irc = code.summary.match(/Code, (\d{4}) Edition/)?.[1];
const effective = code.summary.match(/effective ([A-Z][a-z]+ \d+, \d{4})/)?.[1];

export default defineState({
  slug,
  title: 'Roof Replacement Cost Georgia 2026: Prices, Pay and Storms',
  description: `Georgia roof replacement in 2026 costs about ${K.usd(r.typical)}, with most jobs ${K.usd(r.low)} to ${K.usd(r.high)}. See tornado, hurricane and ice losses and the ${irc} IRC timing.`,
  intro: `Georgia is exposed to tornadoes, hurricanes and ice storms at once, and its roofers earn the lowest pay in the South Atlantic division.`,
  resume: `In Georgia, a professional roof replacement costs about ${K.usd(r.typical)} in 2026, and half of jobs run from ${K.usd(r.low)} to ${K.usd(r.high)}, close to the national median of ${K.usd(us.typical)}. The South Atlantic division, which takes in Georgia, its coastal neighbors and the mid-Atlantic, reported prices at the national level in the 2023 American Housing Survey. Georgia labor trims that figure slightly. BLS measured a mean roofer wage of ${K.usd(w.mean, 2)} an hour in ${K.wageRef.reference}, ${under}% under the national ${K.usd(nat.mean, 2)}${lowestInDiv ? ' and the lowest in the division' : ''}. Weather is the bigger story. FEMA's National Risk Index ranks Georgia ${ord(lossRank('tornado'))} for expected annual tornado losses to buildings and ${ord(lossRank('hurricane'))} for hurricane losses, with ice storms rated ${f.nri.ice_storm.rating} as well. A house of ${small.bin!.label} is estimated at ${K.usd(small.typical)}; a house of ${big.bin!.label} at ${K.usd(big.typical)}. A new state minimum residential code is scheduled for ${effective}.`,
  body: (h) => `
<h2>Tornado, hurricane and ice: Georgia's three-way exposure</h2>
<p>Most states have one hazard that dominates the roof conversation. Georgia has three. The ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) estimates expected annual losses to Georgia buildings of about ${mil(f.nri.hurricane.buildingLossUsd)} from hurricanes and ${mil(f.nri.tornado.buildingLossUsd)} from tornadoes, the ${ord(lossRank('tornado'))} largest tornado figure in the country, rated ${f.nri.tornado.rating}. Ice storms add ${mil(f.nri.ice_storm.buildingLossUsd)}, rated ${f.nri.ice_storm.rating}, and hail ${mil(f.nri.hail.buildingLossUsd)}. A house near the coast and one farther inland may face different threats, so a contractor's recommendations should match the hazard that applies to your address. Ask the roofer to explain why each upgrade on the quote is there, whether it is a sealed underlayment, heavier fastening at the edges, or a different ridge vent, and to price it separately so you can weigh it against the base job.</p>
<h2>A code change dated ${effective}</h2>
<p>The Department of Community Affairs board has adopted the ${h.ext(code.url, `International Residential Code, ${irc} Edition, with Georgia Amendments`)} as a mandatory state minimum code, effective on ${effective}. Until that date, an earlier edition may still be what local inspectors enforce. If your replacement is planned for late 2026, ask the contractor and the building department which edition your permit falls under; the answer can affect underlayment and edge details written into the quote.</p>
<h3>Georgia wages beside the coastal states</h3>
<p>Georgia roofers average ${h.usd(w.mean, 2)} an hour, a hair under Florida's ${h.usd(fl.mean, 2)}, while South Carolina pays ${h.usd(sc.mean, 2)} and North Carolina ${h.usd(nc.mean, 2)}. Labor is one part of the bill, so the gap moves a typical Georgia job by tens of dollars. House size matters far more: for ${big.bin!.label}, the estimate climbs to ${h.usd(big.typical)}, with half of comparable jobs between ${h.usd(big.low)} and ${h.usd(big.high)}. When a quote overshoots that band, the usual suspects are replacement decking, a second layer of old shingles, or a steep, cut-up roof with many valleys. Each should appear on its own line so the bids can be compared fairly.</p>`,
  faqs: [
    { q: 'What is a fair price for a new roof in Georgia in 2026?', a: `Around ${K.usd(r.typical)} for a professional replacement, with half of Georgia jobs between ${K.usd(r.low)} and ${K.usd(r.high)}. That is the South Atlantic price level from the 2023 American Housing Survey, moved to ${K.month(K.ahsMeta.cpi.to)} dollars and adjusted to the Georgia roofer wage of ${K.usd(w.mean, 2)} an hour. Bigger or steeper roofs cost more.` },
    { q: 'When does the 2024 IRC take effect in Georgia?', a: `The Department of Community Affairs lists the International Residential Code, ${irc} Edition, with Georgia Amendments, as a mandatory state minimum code effective ${effective}. Before then, local inspectors may still apply the earlier edition. Ask your building department which version covers your permit if the reroof falls close to the changeover.` },
    { q: 'Which storms cause the most roof damage in Georgia?', a: `FEMA's National Risk Index puts expected annual losses to Georgia buildings at about ${mil(f.nri.hurricane.buildingLossUsd)} from hurricanes and ${mil(f.nri.tornado.buildingLossUsd)} from tornadoes, with ice storms rated ${f.nri.ice_storm.rating}. Storm replacements usually go through insurance, where the deductible and the adjuster's estimate decide the owner's share rather than the survey range.` },
  ],
  related: ['roof-replacement-cost', 'roof:florida', 'roof:south-carolina', 'roof:tennessee', 'roofing-calculator'],
  extraSources: [{ name: 'Georgia DCA: current state minimum construction codes', url: code.url }],
});
