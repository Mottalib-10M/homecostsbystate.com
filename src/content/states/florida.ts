import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'florida';
const r = K.job('roof', slug);
const us = K.job('roof');
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const f = K.facts(slug);
const lic = f.licensing!;
const code = f.code!;
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const all = K.states.map((s) => s.slug);
const empRank = [...all].sort((a, b) => (K.wage(b, 'roofers')?.emp ?? 0) - (K.wage(a, 'roofers')?.emp ?? 0)).indexOf(slug) + 1;
const hurRank = [...all].sort((a, b) => (K.facts(b).nri.hurricane?.buildingLossUsd ?? 0) - (K.facts(a).nri.hurricane?.buildingLossUsd ?? 0)).indexOf(slug) + 1;
const hur = f.nri.hurricane.buildingLossUsd ?? 0;
const bn = `$${(hur / 1e9).toFixed(1)} billion`;
const mil = (x: number | null) => `${K.usd(Math.round((x ?? 0) / 1e6))} million`;
const under = Math.round((1 - w.mean / nat.mean) * 100);
const thr = K.usd(lic.threshold_usd ?? 0);
const edition = code.summary.match(/(\d+th Edition \(\d{4}\))/)?.[1];
const effective = code.summary.match(/effective ([A-Z][a-z]+ \d+, \d{4})/)?.[1];
const ga = K.wage('georgia', 'roofers')!;

export default defineState({
  slug,
  title: 'Roof Replacement Cost Florida 2026: Hurricane State Prices',
  description: `Florida roof replacement in 2026: about ${K.usd(r.typical)} typical, ${K.usd(r.low)} to ${K.usd(r.high)} for most jobs, plus the state roofing license and Florida Building Code rules.`,
  intro: `Florida carries the largest expected hurricane loss to buildings in the country and employs more roofers than any other state.`,
  resume: `The typical professional roof replacement in Florida costs about ${K.usd(r.typical)} in 2026, with half of jobs between ${K.usd(r.low)} and ${K.usd(r.high)}, almost exactly the national median of ${K.usd(us.typical)}. Florida sits in the South Atlantic division, whose owners reported prices at the national level in the 2023 American Housing Survey, and its roofers earn a mean of ${K.usd(w.mean, 2)} an hour according to BLS for ${K.wageRef.reference}, ${under}% below the national ${K.usd(nat.mean, 2)} and slightly under the division average. The workforce is large: ${K.num(w.emp ?? 0)} roofers, ${empRank === 1 ? 'more than in any other state' : 'one of the largest totals in the country'}. The roof itself is where Florida stands apart. FEMA's National Risk Index puts expected annual hurricane losses to Florida buildings near ${bn}, and strong wind and tornado losses are also rated high. A house of ${small.bin!.label} comes out at ${K.usd(small.typical)} and one of ${big.bin!.label} at ${K.usd(big.typical)}, and Florida-specific code and license rules apply to every job.`,
  body: (h) => `
<h2>${bn} a year in expected hurricane losses</h2>
<p>No state comes close to Florida on this line. The ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) estimates expected annual hurricane losses to the state's buildings at about ${bn}, ${hurRank === 1 ? 'the largest total in the country' : `ranked ${hurRank} nationally`}, rated ${f.nri.hurricane.rating}. Strong wind adds ${mil(f.nri.strong_wind.buildingLossUsd)}, also rated ${f.nri.strong_wind.rating}, and tornadoes ${mil(f.nri.tornado.buildingLossUsd)}. Hail is a comparatively modest ${mil(f.nri.hail.buildingLossUsd)}. A Florida roof is designed, permitted and insured around wind, and the price on this page should be read as a starting point before those requirements are added.</p>
<h2>A roofing license of its own in Florida</h2>
<p>Florida statute requires anyone who contracts to be certified or registered, and it defines a separate Roofing Contractor license. A general, building or residential contractor may not take on roofing work unless also certified or registered as a roofing contractor. Minor jobs under ${thr} are exempt, but not when they are part of a larger project or need a permit, so a reroof always falls under the license requirement. Ask for the license number and confirm on the state's licensing portal that it is a roofing credential, not only a general one.</p>
<p>The ${h.ext(code.url, `Florida Building Code, ${edition}`)}, which includes the Residential volume, took effect on ${effective}. A permit for a Florida reroof is reviewed under that code, and the inspections it brings are part of the contractor's schedule.</p>
<h3>Labor in a deep market</h3>
<p>With roughly ${h.num(w.emp ?? 0)} roofers on payroll, Florida rarely lacks bidders outside the weeks after a storm. Its ${h.usd(w.mean, 2)} hourly mean is close to Georgia's ${h.usd(ga.mean, 2)}. For a home of ${big.bin!.label}, the estimate reaches ${h.usd(big.typical)}, with half of comparable jobs between ${h.usd(big.low)} and ${h.usd(big.high)}. Tile and metal roofs sit well above the asphalt range most survey jobs reflect, so compare quotes of the same material.</p>`,
  faqs: [
    { q: 'How much does a roof replacement cost in Florida in 2026?', a: `About ${K.usd(r.typical)} for a professional job, and half of Florida replacements cost ${K.usd(r.low)} to ${K.usd(r.high)}. That is the South Atlantic price level from the 2023 American Housing Survey, adjusted to the Florida roofer wage of ${K.usd(w.mean, 2)} an hour. Tile, metal and sheathing repairs can lift the total well beyond that range.` },
    { q: 'Can a general contractor replace a roof in Florida?', a: `Only if that contractor also holds Florida certification or registration as a roofing contractor. State statute defines a separate Roofing Contractor license and bars general, building and residential contractors from roofing work without it. Minor work under ${thr} is exempt unless it is part of a larger job or needs a permit, which rules out a full reroof.` },
    { q: 'Which edition of the Florida Building Code applies to a new roof?', a: `The Florida Building Code, ${edition}, including its Residential volume, took effect on ${effective} according to the Florida Building Commission. Your reroof permit is reviewed under it, and the contractor schedules the inspections it requires. Ask the roofer which code requirements already appear in the quote and which would be extra.` },
    { q: 'How much do hurricanes cost Florida buildings each year?', a: `FEMA's National Risk Index estimates expected annual hurricane losses to Florida buildings at about ${bn}, the highest of any state, with strong wind adding ${mil(f.nri.strong_wind.buildingLossUsd)}. Many Florida reroofs follow storm claims, where the deductible and the adjuster's scope set the owner's share instead of the survey price.` },
  ],
  related: ['roof-replacement-cost', 'roof:georgia', 'roof:alabama', 'solar-panel-cost', 'hvac-replacement-cost'],
  extraSources: [
    { name: 'Florida Statutes 489.113: certification and registration of contractors', url: lic.url },
    { name: 'Florida Building Commission: Florida Building Code', url: code.url },
  ],
});
