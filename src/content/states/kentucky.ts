import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'kentucky';
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
const regionGap = Math.round((1 - r.region) * 100);
const overDiv = Math.round((r.index - 1) * 100);
const peers = K.states.filter((s) => s.division === K.state(slug).division);
const topInDiv = peers.every((s) => (K.wage(s.slug, 'roofers')?.mean ?? 0) <= w.mean);
const tn = K.wage('tennessee', 'roofers')!;
const oh = K.wage('ohio', 'roofers')!;
const ohJob = K.job('roof', 'ohio');
const irc = code.summary.match(/the (\d{4}) International/)?.[1];
const krc = code.summary.match(/in the (\d{4}) Kentucky Residential Code \(([^)]+)\)/);
const amended = code.summary.match(/eff\. (\d+)-(\d+)-(\d{4})/);
const amendedDay = amended ? K.day(`${amended[3]}-${amended[1].padStart(2, '0')}-${amended[2].padStart(2, '0')}`) : amended;

export default defineState({
  slug,
  title: 'Roof Replacement Cost Kentucky 2026: Prices, Code and Pay',
  description: `Kentucky roof replacement in 2026: about ${K.usd(r.typical)} typical, ${K.usd(r.low)} to ${K.usd(r.high)} for most jobs, ${regionGap}% under the U.S. level, plus the Kentucky Residential Code.`,
  intro: `Kentucky pays the best roofer wages in a low-priced division, so its estimates sit just above Alabama, Mississippi and Tennessee.`,
  resume: `A professional roof replacement in Kentucky costs about ${K.usd(r.typical)} in 2026, with half of jobs between ${K.usd(r.low)} and ${K.usd(r.high)}, well below the national median of ${K.usd(us.typical)}. That reflects the East South Central division, where owners reported paying about ${regionGap}% less than the U.S. median in the 2023 American Housing Survey. Kentucky's own roofers lift the figure slightly: BLS measured a mean of ${K.usd(w.mean, 2)} an hour in ${K.wageRef.reference}, ${under}% below the national ${K.usd(nat.mean, 2)} yet ${overDiv}% above the division average${topInDiv ? ', the highest of the four states in it' : ''}. Expect about ${K.usd(small.typical)} for a home of ${small.bin!.label} and ${K.usd(big.typical)} for one of ${big.bin!.label}. The state's weather is mixed: FEMA's National Risk Index rates Kentucky's expected annual ice storm losses to buildings ${f.nri.ice_storm.rating}, and hail and strong wind each rank in the top dozen states by dollars. Single-family homes fall under a mandatory statewide residential code based on the ${irc} IRC.`,
  body: (h) => `
<h2>Kentucky's place in the cheapest roofing region</h2>
<p>Kentucky sits on the edge of two price worlds. To the south, its division partners Tennessee, Alabama and Mississippi share the low East South Central level; to the north, Ohio belongs to a division priced at the national median, and the Ohio estimate is ${h.usd(ohJob.typical)}. Kentucky roofers average ${h.usd(w.mean, 2)} an hour, above Tennessee's ${h.usd(tn.mean, 2)} though below Ohio's ${h.usd(oh.mean, 2)}. Because the division level carries more weight than wages in the calculation, a Kentucky roof stays closer to its southern neighbors than to Ohio.</p>
<h2>Ice, hail and wind across Kentucky</h2>
<p>The ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) estimates expected annual losses to Kentucky buildings of about ${mil(f.nri.hail.buildingLossUsd)} from hail, the ${ord(lossRank('hail'))} largest figure in the country, ${mil(f.nri.strong_wind.buildingLossUsd)} from strong wind and ${mil(f.nri.ice_storm.buildingLossUsd)} from ice storms, rated ${f.nri.ice_storm.rating}. Tornadoes add ${mil(f.nri.tornado.buildingLossUsd)}. Winter weather is rated ${f.nri.winter_weather.rating}. That spread means Kentucky roofs face damage in every season, and an older roof is worth inspecting before winter as well as after spring storms.</p>
<h3>The mandatory Kentucky Residential Code</h3>
<p>Under ${h.ext(code.url, '815 KAR 7:125')}, the ${irc} International Residential Code, with Kentucky amendments published in the ${krc?.[1]} Kentucky Residential Code (${krc?.[2]}), is the mandatory state residential building code for single-family homes, two-family homes and townhouses; its latest amendment took effect on ${amendedDay}. A reroof that needs a permit is inspected under it. Ask the contractor who obtains the permit and whether the fee is in the price. For a house of ${big.bin!.label}, the estimate is ${h.usd(big.typical)}, and half of comparable jobs fall between ${h.usd(big.low)} and ${h.usd(big.high)}. Older Kentucky houses can carry two layers of shingles or plank sheathing; the quote should say whether removal of both is included, and at what price each replaced board or sheet is billed if the deck turns out to be soft.</p>`,
  faqs: [
    { q: 'How much does a roof replacement cost in Kentucky in 2026?', a: `About ${K.usd(r.typical)} for a professional job, with half of Kentucky replacements between ${K.usd(r.low)} and ${K.usd(r.high)}. The East South Central price level from the 2023 American Housing Survey sits ${regionGap}% under the national median, and the Kentucky roofer wage of ${K.usd(w.mean, 2)} an hour, above the division average, adds a little.` },
    { q: 'Which building code governs a reroof in Kentucky?', a: `Kentucky regulation 815 KAR 7:125 makes the ${irc} International Residential Code, with Kentucky amendments in the ${krc?.[1]} Kentucky Residential Code, the mandatory residential code for single-family homes, two-family homes and townhouses. Its latest amendment took effect on ${amendedDay}. The permit office applies it when your reroof requires a permit.` },
    { q: 'Are Kentucky roofers paid more than roofers in Tennessee?', a: `Yes. BLS measured ${K.usd(w.mean, 2)} an hour for Kentucky roofers in ${K.wageRef.reference}, against ${K.usd(tn.mean, 2)} in Tennessee. Kentucky's wage is ${overDiv}% above its division average, which lifts the labor share of a Kentucky roof a little, while the low division price level keeps the total well under the national median.` },
  ],
  related: ['roof-replacement-cost', 'roof:tennessee', 'roof:ohio', 'roof:indiana', 'roofing-calculator'],
  extraSources: [{ name: 'Kentucky Administrative Regulations 815 KAR 7:125: Kentucky Residential Code', url: code.url }],
});
