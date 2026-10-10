import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'mississippi';
const r = K.job('roof', slug);
const us = K.job('roof');
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const f = K.facts(slug);
const lic = f.licensing!;
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const all = K.states.map((s) => s.slug);
const priceRank = [...all].sort((a, b) => K.job('roof', a).typical - K.job('roof', b).typical).indexOf(slug) + 1;
const wageRank = [...all].sort((a, b) => (K.wage(a, 'roofers')?.mean ?? 99) - (K.wage(b, 'roofers')?.mean ?? 99)).indexOf(slug) + 1;
const hurRank = [...all].sort((a, b) => (K.facts(b).nri.hurricane?.buildingLossUsd ?? 0) - (K.facts(a).nri.hurricane?.buildingLossUsd ?? 0)).indexOf(slug) + 1;
const ord = (n: number) => { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`; };
const bottom = (k: number, what: string) => (k === 1 ? `the lowest ${what} of the 51 jurisdictions` : `the ${ord(k)} lowest ${what} of the 51 jurisdictions`);
const mil = (x: number | null) => `${K.usd(Math.round((x ?? 0) / 1e6))} million`;
const under = Math.round((1 - w.mean / nat.mean) * 100);
const regionGap = Math.round((1 - r.region) * 100);
const saving = K.usd(us.typical - r.typical);
const al = K.wage('alabama', 'roofers')!;
const tn = K.wage('tennessee', 'roofers')!;
const la = K.wage('louisiana', 'roofers')!;
const laJob = K.job('roof', 'louisiana');

export default defineState({
  slug,
  title: 'Roof Replacement Cost Mississippi 2026: Lowest U.S. Prices',
  description: `Mississippi roof replacement in 2026: about ${K.usd(r.typical)} typical, ${K.usd(r.low)} to ${K.usd(r.high)} for most jobs, the lowest estimate on this site, with MSBOC roofing licenses.`,
  intro: `Mississippi has the lowest roof replacement estimate and the lowest roofer wage of any state on this site.`,
  resume: `At about ${K.usd(r.typical)}, a professional roof replacement in Mississippi is ${bottom(priceRank, 'estimate')}, and half of jobs cost between ${K.usd(r.low)} and ${K.usd(r.high)}. That is roughly ${saving} under the national median of ${K.usd(us.typical)}. The East South Central division sets the base: owners there reported paying about ${regionGap}% less than the U.S. median in the 2023 American Housing Survey. Mississippi wages then shave a little more. BLS measured a mean of ${K.usd(w.mean, 2)} an hour for the state's roofers in ${K.wageRef.reference}, ${under}% under the national ${K.usd(nat.mean, 2)} and ${bottom(wageRank, 'roofer wage')}. For a home of ${small.bin!.label}, expect about ${K.usd(small.typical)}; for ${big.bin!.label}, about ${K.usd(big.typical)}. A low price does not mean a low-risk roof: FEMA's National Risk Index puts expected annual hurricane losses to Mississippi buildings near ${mil(f.nri.hurricane.buildingLossUsd)}, with tornado and hail losses also rated substantial. Residential roofing requires a license from the state Board of Contractors.`,
  body: (h) => `
<h2>Why Mississippi sits at the bottom of the price table</h2>
<p>Two things line up in Mississippi. The East South Central division reported the lowest roof prices relative to the national median in the survey, and Mississippi's ${h.usd(w.mean, 2)} hourly mean for roofers is below Alabama's ${h.usd(al.mean, 2)} and Tennessee's ${h.usd(tn.mean, 2)}. Next door, Louisiana roofers earn ${h.usd(la.mean, 2)}, and Louisiana belongs to a different division, so its estimate of ${h.usd(laJob.typical)} runs well above Mississippi's. Shingles and underlayment cost about the same on either side of the river; the gap is labor and the regional price level. BLS counted ${h.num(w.emp ?? 0)} roofers in the state.</p>
<h2>Gulf hurricanes and inland tornadoes</h2>
<p>The ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) estimates expected annual hurricane losses to Mississippi buildings at about ${mil(f.nri.hurricane.buildingLossUsd)}, the ${ord(hurRank)} largest in the country, rated ${f.nri.hurricane.rating}. Tornadoes add roughly ${mil(f.nri.tornado.buildingLossUsd)}, rated ${f.nri.tornado.rating}, and hail ${mil(f.nri.hail.buildingLossUsd)}, rated ${f.nri.hail.rating}. Strong wind comes in at ${mil(f.nri.strong_wind.buildingLossUsd)}. Many Mississippi roofs are therefore replaced after a storm, through an insurance claim where the deductible and the adjuster's scope matter more to the owner than the survey range.</p>
<h3>The MSBOC residential roofing license</h3>
<p>The Mississippi State Board of Contractors (MSBOC) licenses residential contractors, and Residential Roofing is one of its residential license classifications. The board states that performing residential construction or residential improvement without a valid license is unlawful. Ask for the license number and check it on the board's site before work starts, especially after a storm, when unfamiliar crews arrive quickly. For a house of ${big.bin!.label}, the Mississippi estimate is ${h.usd(big.typical)}, and half of comparable jobs fall between ${h.usd(big.low)} and ${h.usd(big.high)}. A rock-bottom bid well under that band deserves a close look at what it leaves out: tear-off of every layer, replacement of soft decking, new flashing and hauling. A complete bid priced near the median usually costs less in the long run than a partial one priced far below it.</p>`,
  faqs: [
    { q: 'How much does a roof replacement cost in Mississippi in 2026?', a: `About ${K.usd(r.typical)} for a professional job, with half of Mississippi replacements between ${K.usd(r.low)} and ${K.usd(r.high)}. That is the East South Central price level from the 2023 American Housing Survey, ${regionGap}% under the national median, adjusted to the Mississippi roofer wage of ${K.usd(w.mean, 2)} an hour, the lowest BLS reports for any state.` },
    { q: 'Do Mississippi roofers need a license?', a: `Yes. The Mississippi State Board of Contractors licenses residential contractors, with Residential Roofing as one of its classifications, and the board says it is unlawful to perform residential construction or improvement without a valid license. Check the number on the MSBOC site before any money changes hands, particularly after a storm.` },
    { q: 'Why is a new roof cheaper in Mississippi than in Louisiana?', a: `Mississippi sits in the East South Central division, where owners reported roof prices about ${regionGap}% under the national median, while Louisiana belongs to a higher-priced division. Mississippi roofers also earn ${K.usd(w.mean, 2)} an hour against ${K.usd(la.mean, 2)} in Louisiana. The result is about ${K.usd(r.typical)} here versus ${K.usd(laJob.typical)} there.` },
  ],
  related: ['roof-replacement-cost', 'roof:alabama', 'roof:louisiana', 'roof:tennessee', 'roofing-calculator'],
  extraSources: [{ name: 'Mississippi State Board of Contractors: license types', url: lic.url }],
});
