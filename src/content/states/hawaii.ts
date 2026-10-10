import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'hawaii';
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
const priceRank = [...all].sort((a, b) => K.job('roof', b).typical - K.job('roof', a).typical).indexOf(slug) + 1;
const ord = (n: number) => { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`; };
const thou = (x: number | null) => K.usd(Math.round((x ?? 0) / 1000) * 1000);
const mil = (x: number | null) => `${K.usd(Math.round((x ?? 0) / 1e6))} million`;
const above = Math.round((w.mean / nat.mean - 1) * 100);
const underDiv = Math.round((1 - r.index) * 100);
const regionUp = Math.round((r.region - 1) * 100);
const thr = K.usd(lic.threshold_usd ?? 0);
const irc = code.summary.match(/(\d{4}) IRC/)?.[1];
const ca = K.wage('california', 'roofers')!;
const wa = K.wage('washington', 'roofers')!;

export default defineState({
  slug,
  title: 'Roof Replacement Cost Hawaii 2026: Island Prices and Wages',
  description: `A Hawaii roof replacement in 2026 averages about ${K.usd(r.typical)}, most jobs ${K.usd(r.low)} to ${K.usd(r.high)}, as island roofer pay runs ${underDiv}% under the Pacific division mean wage.`,
  intro: `Hawaii roofers earn less than their Pacific peers, yet the regional price level keeps island roofs among the costliest on this site.`,
  resume: `A professional roof replacement in Hawaii costs roughly ${K.usd(r.typical)} in 2026, with half of jobs between ${K.usd(r.low)} and ${K.usd(r.high)}, the ${ord(priceRank)} highest estimate of the 51 jurisdictions and far above the national median of ${K.usd(us.typical)}. The cause is the Pacific division: owners there reported paying about ${regionUp}% more than the U.S. median in the 2023 American Housing Survey. Hawaii wages actually pull the estimate down a little. BLS measured a mean of ${K.usd(w.mean, 2)} an hour for island roofers in ${K.wageRef.reference}, ${above}% above the national ${K.usd(nat.mean, 2)} but about ${underDiv}% under the division's weighted average, which California and Washington lift. A home of ${small.bin!.label} comes out near ${K.usd(small.typical)}, one of ${big.bin!.label} near ${K.usd(big.typical)}. FEMA's index rates nearly every hazard to Hawaii buildings Very Low; wildfire, rated ${f.nri.wildfire.rating}, is the exception. A contractor's license is required above ${thr} or whenever a permit is needed.`,
  body: (h) => `
<h2>Paid below the Pacific average, priced near the top</h2>
<p>Hawaii shows how this site separates the regional price level from local pay. The division median, built from Pacific homeowners' reports, starts about ${regionUp}% above the national figure. Then only the labor share moves to the state wage, and Hawaii's ${h.usd(w.mean, 2)} hourly mean trails California's ${h.usd(ca.mean, 2)} and Washington's ${h.usd(wa.mean, 2)}. The wage step therefore lowers the Hawaii estimate by a few hundred dollars, yet the result still ranks ${ord(priceRank)} on the site. Shipping costs for materials are not modeled separately; they sit inside what Pacific owners reported paying.</p>
${h.mini('wageGap', { state: 'Hawaii', job: 'Roof replacement', median: us.typical * r.region, L: r.L, index: r.index })}
<h2>A short list of hazards for Hawaii buildings</h2>
<p>The ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) rates expected annual losses to Hawaii buildings from hail, strong wind, tornadoes, winter weather and ice storms all Very Low, with hail near ${thou(f.nri.hail.buildingLossUsd)} a year. Hurricanes are rated ${f.nri.hurricane.rating} at about ${mil(f.nri.hurricane.buildingLossUsd)}. Wildfire stands out at roughly ${mil(f.nri.wildfire.buildingLossUsd)}, rated ${f.nri.wildfire.rating}. With so little storm pressure in the federal estimates, most Hawaii roofs reach replacement through age, sun and moisture rather than a single event, which means owners can usually plan the job, gather several written bids and pick a dry stretch of the year for the tear-off.</p>
<h3>License threshold and county codes</h3>
<p>According to the Department of Commerce and Consumer Affairs, a contractor's license is required for any project over ${thr} in labor and materials, or for any project that needs a building, electrical or plumbing permit. That is the general contractor licensing regime; a roofing specialty class could not be confirmed on the pages we read. The ${h.ext(code.url, `State Residential Code`)} is the ${irc} IRC as adopted by the State Building Code Council, and each county adopts and amends it locally, so the permit counter on your island decides which details apply. For a house of ${big.bin!.label}, the Hawaii estimate is ${h.usd(big.typical)}, with half of comparable jobs between ${h.usd(big.low)} and ${h.usd(big.high)}.</p>`,
  faqs: [
    { q: 'How much does a roof replacement cost in Hawaii in 2026?', a: `About ${K.usd(r.typical)} for a professional job, with half of Hawaii replacements between ${K.usd(r.low)} and ${K.usd(r.high)}. The estimate starts from the Pacific division price level in the 2023 American Housing Survey, in ${K.month(K.ahsMeta.cpi.to)} dollars, then adjusts the labor share to the Hawaii roofer wage of ${K.usd(w.mean, 2)} an hour.` },
    { q: 'When does a Hawaii roofing job need a licensed contractor?', a: `The Department of Commerce and Consumer Affairs says a contractor's license is needed for any project over ${thr} in labor and materials, or any project requiring a building, electrical or plumbing permit. A full reroof is well over that amount, so check the license with the Contractors License Board before signing.` },
    { q: 'Why is Hawaii roofing expensive if roofers earn less than in California?', a: `Because the regional price level matters more than the wage. Pacific division owners reported roof jobs about ${regionUp}% above the national median. Hawaii roofers earn ${K.usd(w.mean, 2)} an hour, under California's ${K.usd(ca.mean, 2)}, which lowers the labor share a little but leaves the total among the highest in the country.` },
  ],
  related: ['roof-replacement-cost', 'roof:california', 'roof:alaska', 'solar-panel-cost'],
  extraSources: [
    { name: 'Hawaii DCCA Professional and Vocational Licensing: hire a licensed contractor', url: lic.url },
    { name: 'Hawaii State Building Code Council: building code rules', url: code.url },
  ],
});
