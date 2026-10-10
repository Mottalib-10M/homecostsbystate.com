import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'massachusetts';
const r = K.job('roof', slug);
const us = K.job('roof');
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const f = K.facts(slug);
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const all = K.states.map((s) => s.slug);
const wageRank = [...all].sort((a, b) => (K.wage(b, 'roofers')?.mean ?? 0) - (K.wage(a, 'roofers')?.mean ?? 0)).indexOf(slug) + 1;
const priceRank = [...all].sort((a, b) => K.job('roof', b).typical - K.job('roof', a).typical).indexOf(slug) + 1;
const hurRank = [...all].sort((a, b) => (K.facts(b).nri.hurricane?.buildingLossUsd ?? 0) - (K.facts(a).nri.hurricane?.buildingLossUsd ?? 0)).indexOf(slug) + 1;
const ord = (n: number) => { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`; };
const mil = (x: number | null) => `${K.usd(Math.round((x ?? 0) / 1e6))} million`;
const above = Math.round((w.mean / nat.mean - 1) * 100);
const regionUp = Math.round((r.region - 1) * 100);
const ct = K.wage('connecticut', 'roofers')!;
const nh = K.wage('new-hampshire', 'roofers')!;
const me = K.wage('maine', 'roofers')!;
const meJob = K.job('roof', 'maine');

export default defineState({
  slug,
  title: 'Roof Replacement Cost Massachusetts 2026: Prices and Wages',
  description: `Massachusetts roof replacement in 2026 costs about ${K.usd(r.typical)}, most jobs ${K.usd(r.low)} to ${K.usd(r.high)}, with roofer pay of ${K.usd(w.mean, 2)} an hour, the top wage in New England.`,
  intro: `Massachusetts roofers are the best paid in New England, which puts the state among the most expensive places on this site to reroof.`,
  resume: `Replacing a roof in Massachusetts with a professional crew costs about ${K.usd(r.typical)} in 2026, and half of jobs land between ${K.usd(r.low)} and ${K.usd(r.high)}, the ${ord(priceRank)} highest estimate among the 51 jurisdictions and well above the national median of ${K.usd(us.typical)}. Two layers of cost stack up. New England owners reported paying about ${regionUp}% more than the U.S. median in the 2023 American Housing Survey, and Massachusetts roofers earned a mean of ${K.usd(w.mean, 2)} an hour in BLS data for ${K.wageRef.reference}, ${above}% above the national ${K.usd(nat.mean, 2)} and the ${ord(wageRank)} highest roofer wage in the country. A house of ${small.bin!.label} is estimated near ${K.usd(small.typical)} and one of ${big.bin!.label} near ${K.usd(big.typical)}, before any extra for slate, multiple layers or a steep roof. Weather losses are moderate. FEMA's National Risk Index puts expected annual hurricane losses to Massachusetts buildings near ${mil(f.nri.hurricane.buildingLossUsd)}, ice storms are rated ${f.nri.ice_storm.rating}, and hail barely registers.`,
  body: (h) => `
<h2>A wage ladder topped by Massachusetts</h2>
<p>Within New England, roofer pay climbs from Maine at ${h.usd(me.mean, 2)} an hour through New Hampshire at ${h.usd(nh.mean, 2)} and Connecticut at ${h.usd(ct.mean, 2)} to Massachusetts at ${h.usd(w.mean, 2)}. BLS counted ${h.num(w.emp ?? 0)} roofers in the state. All six states share the same survey price level, so the difference in their estimates comes only from labor: Maine's typical job is ${h.usd(meJob.typical)}, against ${h.usd(r.typical)} here. Since payroll and benefits are only part of a contractor's revenue, the spread is narrower than the wages alone would suggest. Put differently, a Massachusetts owner pays for the regional price level first and for local wages second, and the second part is the one a sharper bid can move.</p>
<h2>Hurricane and ice, not hail, in Massachusetts</h2>
<p>The ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) estimates expected annual hurricane losses to Massachusetts buildings at about ${mil(f.nri.hurricane.buildingLossUsd)}, the ${ord(hurRank)} largest total in the country, rated ${f.nri.hurricane.rating}. Ice storms add roughly ${mil(f.nri.ice_storm.buildingLossUsd)}, rated ${f.nri.ice_storm.rating}, and tornadoes ${mil(f.nri.tornado.buildingLossUsd)}. Hail is rated ${f.nri.hail.rating} and wildfire ${f.nri.wildfire.rating}. That profile points to wind-driven rain at the edges and ice at the eaves rather than impact damage across the field of the roof.</p>
<h3>Comparing Massachusetts quotes</h3>
<p>For a house of ${big.bin!.label}, the estimate is ${h.usd(big.typical)}, with half of comparable jobs between ${h.usd(big.low)} and ${h.usd(big.high)}. Older homes with steep roofs, dormers or more than one layer of old shingles take more labor hours, and the quote should show where those hours go. The survey mostly captures asphalt jobs; slate and copper work sits in a different price class entirely. When two bids differ widely, line them up on the same items: number of layers removed, sheathing allowance and price per sheet beyond it, ice barrier coverage, flashing at chimneys, and disposal. A written quote decides the final number, and a contractor who cannot break it down that way is hard to hold to it.</p>`,
  faqs: [
    { q: 'How much does a new roof cost in Massachusetts in 2026?', a: `About ${K.usd(r.typical)} for a professional replacement, with half of Massachusetts jobs between ${K.usd(r.low)} and ${K.usd(r.high)}. The estimate combines the New England price level from the 2023 American Housing Survey, in ${K.month(K.ahsMeta.cpi.to)} dollars, with the Massachusetts roofer wage of ${K.usd(w.mean, 2)} an hour, the highest in the division.` },
    { q: 'Why is reroofing in Massachusetts more expensive than in Maine?', a: `Both states share the New England price level, but Massachusetts roofers earn ${K.usd(w.mean, 2)} an hour against ${K.usd(me.mean, 2)} in Maine, according to BLS. Moving the labor share to each state's wage gives about ${K.usd(r.typical)} for a typical Massachusetts job and ${K.usd(meJob.typical)} in Maine. Materials cost about the same in both.` },
    { q: 'What weather damages Massachusetts roofs most?', a: `FEMA's National Risk Index puts expected annual hurricane losses to Massachusetts buildings at about ${mil(f.nri.hurricane.buildingLossUsd)} and rates ice storm losses ${f.nri.ice_storm.rating}. Hail is rated ${f.nri.hail.rating}. Wind-driven rain and ice at the eaves are therefore the usual concerns, and bids often price ice barrier and edge flashing as separate lines.` },
  ],
  related: ['roof-replacement-cost', 'roof:connecticut', 'roof:new-hampshire', 'roof:rhode-island', 'heat-pump-cost'],
  extraSources: [],
});
