import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'alabama';
const r = K.job('roof', slug);
const us = K.job('roof');
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const f = K.facts(slug);
const lic = f.licensing!;
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const cpi = K.month(K.ahsMeta.cpi.to);
const mil = (x: number | null) => `${K.usd(Math.round((x ?? 0) / 1e6))} million`;
const ord = (n: number) => { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`; };
const lossRank = (hz: string) => K.states.map((s) => s.slug).sort((a, b) => (K.facts(b).nri[hz]?.buildingLossUsd ?? 0) - (K.facts(a).nri[hz]?.buildingLossUsd ?? 0)).indexOf(slug) + 1;
const div = K.state(slug);
const divNames = K.states.filter((s) => s.division === div.division).map((s) => s.name);
const regionGap = Math.round((1 - r.region) * 100);
const natGap = Math.round((1 - w.mean / nat.mean) * 100);
const ms = K.wage('mississippi', 'roofers')!;
const ky = K.wage('kentucky', 'roofers')!;
const wageMove = K.pct(Math.abs(r.L * (r.index - 1)));
const thr = K.usd(lic.threshold_usd ?? 0);

export default defineState({
  slug,
  title: 'Roof Replacement Cost Alabama 2026: Prices and License Rule',
  description: `Alabama roof replacement in 2026: about ${K.usd(r.typical)} typical, ${K.usd(r.low)} to ${K.usd(r.high)} for most jobs, with the HBLB roofer license rule and FEMA storm losses by hazard.`,
  intro: `Alabama roofs cost less than in most of the country, yet any reroof above ${thr} calls for a state-licensed roofer.`,
  resume: `Plan on roughly ${K.usd(r.typical)} for a professionally installed roof in Alabama, with the middle half of jobs between ${K.usd(r.low)} and ${K.usd(r.high)}. That is well under the national median of ${K.usd(us.typical)}, because homeowners in the ${div.divisionName} division (${K.listOf(divNames)}) told the 2023 American Housing Survey they paid about ${regionGap}% less than the U.S. figure for the same kind of job. Wages inside the state barely shift the result: Alabama roofers averaged ${K.usd(w.mean, 2)} an hour in BLS data for ${K.wageRef.reference}, almost exactly the division's weighted mean and ${natGap}% under the national ${K.usd(nat.mean, 2)}. All prices are in ${cpi} dollars. House size changes the bill more than geography does, from about ${K.usd(small.typical)} for a home of ${small.bin!.label} to ${K.usd(big.typical)} at ${big.bin!.label}. Storms set the calendar for many owners here, since FEMA puts expected annual tornado losses to Alabama buildings near ${mil(f.nri.tornado.buildingLossUsd)}.`,
  body: (h) => `
<h2>Two wind hazards on one Alabama roof</h2>
<p>Alabama is one of the few states where hurricanes and tornadoes both sit near the top of the federal loss tables. The ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion} release) puts expected annual losses to Alabama buildings from hurricanes at about ${mil(f.nri.hurricane.buildingLossUsd)}, the ${ord(lossRank('hurricane'))} largest total among the 51 jurisdictions, and from tornadoes at ${mil(f.nri.tornado.buildingLossUsd)}, a figure rated ${f.nri.tornado.rating}. Hail is a minor line by comparison, at ${mil(f.nri.hail.buildingLossUsd)} a year and rated ${f.nri.hail.rating}. An Alabama roof is therefore more exposed to uplift and wind-driven debris than to the bruised shingles that dominate claims on the Plains.</p>
<p>That pattern deserves attention when the contract arrives. Ask how the crew fastens the first course along the eaves and rakes, how many nails each shingle receives, and whether the ridge cap carries the same wind rating as the field shingles. Those choices rarely add much to the price, and they govern how the roof behaves in the next named storm.</p>
<h2>What the ${thr} line means for an Alabama homeowner</h2>
<p>Under Alabama law, a residential roofer counts as a home builder once the job costs more than ${thr}, and the Home Builders Licensure Board (HBLB) issues a dedicated Roofers License for that work. The license is backed by a license or permit bond, and the company must also hold a local contractor business license. Practically every full replacement on this page clears the threshold, since even the low end for a small house is ${h.usd(small.low)}. Search the company on the board's site before signing and copy the license number onto the contract.</p>
<h3>Labor that tracks its neighbors</h3>
<p>BLS counted ${h.num(w.emp ?? 0)} roofers in Alabama in ${K.wageRef.reference}. Mississippi's mean of ${h.usd(ms.mean, 2)} sits below the Alabama figure and Kentucky's ${h.usd(ky.mean, 2)} sits above, so the state lands near the middle of its division and the wage step moves the estimate by only ${wageMove}. The survey level of the division does the heavy lifting: the same job is priced about ${regionGap}% under the national median before wages enter the calculation. For a house of ${big.bin!.label}, the Alabama estimate is ${h.usd(big.typical)}, with half of comparable jobs between ${h.usd(big.low)} and ${h.usd(big.high)}. A quote far above that band usually hides decking replacement, a second layer to strip, or a steep pitch, and each can be priced as its own line.</p>`,
  faqs: [
    { q: 'What does a full roof replacement cost in Alabama this year?', a: `The Alabama estimate for 2026 is about ${K.usd(r.typical)}, and half of professional jobs fall between ${K.usd(r.low)} and ${K.usd(r.high)}. It starts from what ${div.divisionName} homeowners reported paying roofers in the 2023 American Housing Survey, adjusted to ${cpi} dollars, then moves the labor share to the Alabama roofer wage of ${K.usd(w.mean, 2)} an hour.` },
    { q: 'Does an Alabama roofer need a state license for my job?', a: `Yes, once the job costs more than ${thr}. Alabama law treats a residential roofer above that amount as a home builder, and the Home Builders Licensure Board issues a separate Roofers License, which requires a bond and a local contractor business license. Since a full replacement almost always exceeds that sum, ask for the license number before any deposit changes hands.` },
    { q: 'How do hurricanes and tornadoes shape roofing in Alabama?', a: `FEMA's National Risk Index estimates expected annual losses to Alabama buildings of about ${mil(f.nri.hurricane.buildingLossUsd)} from hurricanes and ${mil(f.nri.tornado.buildingLossUsd)} from tornadoes, far above the ${mil(f.nri.hail.buildingLossUsd)} attributed to hail. Many replacements follow storms and run through insurance, where the deductible and the adjuster's scope decide the out-of-pocket share rather than the survey range.` },
  ],
  related: ['roof-replacement-cost', 'roof:mississippi', 'roof:georgia', 'roof:tennessee', 'roofing-calculator'],
  extraSources: [{ name: 'Alabama Home Builders Licensure Board: unlicensed builders and roofers', url: lic.url }],
});
