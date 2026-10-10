import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'california';
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
const priceRank = [...all].sort((a, b) => K.job('roof', b).typical - K.job('roof', a).typical).indexOf(slug) + 1;
const nth = (k: number) => (k === 1 ? '' : k === 2 ? 'second ' : k === 3 ? 'third ' : `${k}th `);
const fire = f.nri.wildfire.buildingLossUsd ?? 0;
const bn = `$${(fire / 1e9).toFixed(1)} billion`;
const mil = (x: number | null) => `${K.usd(Math.round((x ?? 0) / 1e6))} million`;
const above = Math.round((w.mean / nat.mean - 1) * 100);
const regionUp = Math.round((r.region - 1) * 100);
const edition = code.summary.match(/^(\d{4}) California/)?.[1];
const effective = code.summary.match(/effective ([A-Z][a-z]+ \d+, \d{4})/)?.[1];
const thr = K.usd(lic.threshold_usd ?? 0);

export default defineState({
  slug,
  title: 'Roof Replacement Cost California 2026: Prices, C-39 License',
  description: `California roof replacement in 2026: about ${K.usd(r.typical)} typical, ${K.usd(r.low)} to ${K.usd(r.high)} for most jobs, plus the CSLB C-39 license and the new ${edition} Title 24 code.`,
  intro: `California carries the largest expected wildfire loss to buildings in the country and one of the highest roof prices on this site.`,
  resume: `A typical professional roof replacement in California costs about ${K.usd(r.typical)} in 2026, and half of jobs fall between ${K.usd(r.low)} and ${K.usd(r.high)}, the ${nth(priceRank)}highest estimate among the 51 jurisdictions and well above the national median of ${K.usd(us.typical)}. Most of that premium comes from the Pacific division, where owners told the 2023 American Housing Survey they paid about ${regionUp}% more than the U.S. median. California wages add only a little on top: BLS measured a mean of ${K.usd(w.mean, 2)} an hour for the state's ${K.num(w.emp ?? 0)} roofers in ${K.wageRef.reference}, ${above}% above the national ${K.usd(nat.mean, 2)} and close to the division average. Floor area matters as everywhere, from about ${K.usd(small.typical)} for a house of ${small.bin!.label} to ${K.usd(big.typical)} for ${big.bin!.label}. Two California specifics frame any quote: roofers are licensed by the CSLB under the C-39 classification, and the ${edition} California Building Standards Code takes effect on ${effective}.`,
  body: (h) => `
<h2>A ${bn} wildfire line in California's loss estimates</h2>
<p>The ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) estimates expected annual wildfire losses to California buildings at about ${bn}, rated ${f.nri.wildfire.rating} and the largest of any state. Every other hazard is small next to it: tornado about ${mil(f.nri.tornado.buildingLossUsd)}, hail ${mil(f.nri.hail.buildingLossUsd)} and strong wind ${mil(f.nri.strong_wind.buildingLossUsd)}. Where a home sits matters more than the statewide figure, and a roofer working in fire country will often raise the question of covering class and vents before quoting.</p>
<h2>Licensing and the code that applies in 2026</h2>
<p>The Contractors State License Board licenses roofers under the C-39 Roofing Contractor classification. According to the CSLB, unlicensed work becomes actionable when a job needs a building permit, uses employees, or reaches ${thr} in combined labor and materials. A reroof meets at least one of those conditions in practice, so the license number belongs on the contract, and the board's lookup tool shows whether it is active.</p>
<p>The ${h.ext(code.url, `${edition} California Building Standards Code`)} (Title 24), including Part 2.5, the California Residential Code, was published by the Building Standards Commission and takes effect on ${effective}. A replacement permitted under it follows that edition, as amended by the local building department.</p>
<h3>Sizing a California bid</h3>
<p>BLS counts more roofers in California than in any state but ${empRank === 2 ? 'one' : `${empRank - 1} others`}, so bids are rarely scarce outside peak seasons. For a house of ${big.bin!.label}, the estimate is ${h.usd(big.typical)}, and the middle half of comparable jobs runs from ${h.usd(big.low)} to ${h.usd(big.high)}. Tile and concrete roofs cost well above the asphalt range the survey mostly records. If two quotes disagree sharply, compare their underlayment, the number of sheathing panels allowed before extra charges, and who pulls the permit. A written quote decides the final number; the survey range only tells you whether a bid sits where most California owners ended up paying.</p>`,
  faqs: [
    { q: 'How much does a roof replacement cost in California in 2026?', a: `About ${K.usd(r.typical)} for a typical professional job, with half of California replacements between ${K.usd(r.low)} and ${K.usd(r.high)}. That is the Pacific division level from the 2023 American Housing Survey with the labor share moved to the California roofer wage of ${K.usd(w.mean, 2)} an hour. Tile, steep pitches and sheathing repairs add to it.` },
    { q: 'Which license should a California roofer hold?', a: `The CSLB licenses roofing contractors under the C-39 classification. The board treats unlicensed work as actionable when the job needs a permit, uses employees or totals ${thr} or more in labor and materials, which covers nearly any reroof. Check the license on the CSLB site and have its number written into the contract before work starts.` },
    { q: 'Which building code governs a California reroof starting in 2026?', a: `The ${edition} California Building Standards Code, Title 24, including the California Residential Code in Part 2.5, takes effect on ${effective}, according to the Building Standards Commission. Your local building department applies it with its own amendments when it issues the reroof permit, so ask the contractor which requirements the permit adds to the quote.` },
    { q: 'Does wildfire exposure change how Californians replace roofs?', a: `FEMA's National Risk Index puts expected annual wildfire losses to California buildings near ${bn}, the highest of any state. The survey prices on this page cover ordinary replacements and do not rise with that exposure, but in fire-prone areas owners commonly ask for a fire-rated covering and ember-resistant vents, which a quote should list separately.` },
  ],
  related: ['roof-replacement-cost', 'roof:oregon', 'roof:nevada', 'roof:arizona', 'solar-panel-cost'],
  extraSources: [
    { name: 'California Contractors State License Board: reporting unlicensed contractors', url: lic.url },
    { name: 'California Building Standards Commission: Title 24 codes', url: code.url },
  ],
});
