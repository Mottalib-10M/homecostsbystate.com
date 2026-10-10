import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'alaska';
const r = K.job('roof', slug);
const us = K.job('roof');
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const f = K.facts(slug);
const lic = f.licensing!;
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const all = K.states.map((s) => s.slug);
const n = all.length;
const lossRank = (hz: string) => [...all].sort((a, b) => (K.facts(b).nri[hz]?.buildingLossUsd ?? 0) - (K.facts(a).nri[hz]?.buildingLossUsd ?? 0)).indexOf(slug) + 1;
const priceRank = [...all].sort((a, b) => K.job('roof', b).typical - K.job('roof', a).typical).indexOf(slug) + 1;
const word = (k: number) => (k === 1 ? '' : k === 2 ? 'second ' : k === 3 ? 'third ' : `number ${k} `);
const least = (hz: string) => (lossRank(hz) === n ? 'the smallest of any state' : `ranked ${lossRank(hz)} of ${n}`);
const thou = (x: number | null) => K.usd(Math.round((x ?? 0) / 1000) * 1000);
const mil = (x: number | null) => `${K.usd(Math.round((x ?? 0) / 1e6))} million`;
const above = Math.round((w.mean / nat.mean - 1) * 100);
const regionUp = Math.round((r.region - 1) * 100);
const divNames = K.states.filter((s) => s.division === K.state(slug).division).map((s) => s.name);
const wa = K.wage('washington', 'roofers')!;
const ca = K.wage('california', 'roofers')!;
const or = K.wage('oregon', 'roofers')!;
const units = lic.summary.match(/work of (\d)-(\d) units/);
const unitText = `${units?.[1]} to ${units?.[2]}`;

export default defineState({
  slug,
  title: 'Roof Replacement Cost Alaska 2026: High Prices, Few Storms',
  description: `Alaska roof replacement in 2026 averages ${K.usd(r.typical)}, the ${word(priceRank)}highest price on this site; most jobs run ${K.usd(r.low)} to ${K.usd(r.high)}, and FEMA storm losses are tiny.`,
  intro: `Alaska pays Pacific-division roofing prices, while FEMA expects almost no hail, wind or tornado losses to its buildings.`,
  resume: `Replacing a roof in Alaska costs about ${K.usd(r.typical)} with a professional crew, and half of all jobs come in between ${K.usd(r.low)} and ${K.usd(r.high)}, which makes it the ${word(priceRank)}most expensive state in our estimates. Two forces push it there. Owners in the Pacific division (${K.listOf(divNames)}) reported paying roughly ${regionUp}% more than the national median of ${K.usd(us.typical)} in the 2023 American Housing Survey, and Alaska roofers earned a mean of ${K.usd(w.mean, 2)} an hour in ${K.wageRef.reference}, ${above}% above the U.S. mean of ${K.usd(nat.mean, 2)} and a little above the division average. Weather plays an unusual role. FEMA's index gives Alaska tiny expected annual losses to buildings from hail, strong wind and tornadoes, so storm replacements are not the force they are elsewhere. Winter weather is the hazard rated ${f.nri.winter_weather.rating}, and wildfire carries the largest dollar figure. Expect about ${K.usd(small.typical)} for a home of ${small.bin!.label} and ${K.usd(big.typical)} for one of ${big.bin!.label}.`,
  body: (h) => `
<h2>A storm ledger that barely registers in Alaska</h2>
<p>Most state pages on this site start with the storm that retires roofs early. Alaska's does the opposite. In the ${h.src('fema_nri_states', 'FEMA National Risk Index')} of ${h.nriVersion}, expected annual losses to Alaska buildings from hail come to about ${thou(f.nri.hail.buildingLossUsd)}, ${least('hail')}. Strong wind adds ${thou(f.nri.strong_wind.buildingLossUsd)} and tornadoes ${thou(f.nri.tornado.buildingLossUsd)}, each ${least('tornado')} as well, and hurricanes are not applicable at all. The lines that do show up are winter weather, about ${mil(f.nri.winter_weather.buildingLossUsd)} a year and rated ${f.nri.winter_weather.rating}, and wildfire at roughly ${mil(f.nri.wildfire.buildingLossUsd)}, rated ${f.nri.wildfire.rating}.</p>
<p>The consequence for budgeting is simple: an Alaska roof is more likely to be replaced because it has aged out than because a single afternoon wrecked it. That gives owners time to collect several bids and to schedule the job in a season that suits local crews, rather than competing with a whole neighborhood after a storm.</p>
<h2>Why the Alaska estimate starts so high</h2>
<p>The price level comes from the division. Pacific homeowners reported roof jobs about ${regionUp}% above the national median, the steepest regional premium in the survey. Within that group, Alaska pay of ${h.usd(w.mean, 2)} an hour sits beside Washington's ${h.usd(wa.mean, 2)} and California's ${h.usd(ca.mean, 2)}, and above Oregon's ${h.usd(or.mean, 2)}. BLS counted only ${h.num(w.emp ?? 0)} roofers in the state, a small workforce for a large territory. For a house of ${big.bin!.label}, the estimate reaches ${h.usd(big.typical)}, and the middle half of jobs runs from ${h.usd(big.low)} to ${h.usd(big.high)}.</p>
<h3>Registration comes before the bid</h3>
<p>Alaska statute bars anyone from bidding on or doing work as a contractor without a certificate of registration, and the definition of contractor reaches specialty trades that repair or alter a fixed structure, which covers a roofing company. This is a general contractor registration rather than a license written for roofers. General contractors taking on residential work of ${unitText} units also need a residential contractor endorsement. Ask for the registration number with the bid, and have the contract spell out tear-off, underlayment, ventilation and debris hauling as separate entries.</p>`,
  faqs: [
    { q: 'How much is a new roof in Alaska in 2026?', a: `About ${K.usd(r.typical)} for a professional replacement, with the middle half of jobs between ${K.usd(r.low)} and ${K.usd(r.high)}. The figure combines the Pacific division price level from the 2023 American Housing Survey with the Alaska roofer wage BLS measured in ${K.wageRef.reference}. A larger floor plan, a steep pitch or rotten sheathing moves a quote toward the upper end.` },
    { q: 'Why do Alaska roofs cost more than the national median?', a: `Two reasons. Pacific division homeowners reported paying about ${regionUp}% above the U.S. median for roof jobs, and Alaska roofers earned ${K.usd(w.mean, 2)} an hour on average, ${above}% above the national mean. Materials cost roughly the same everywhere, so the gap sits mostly in labor and in the regional price level rather than in shingles.` },
    { q: 'What registration does a roofing contractor need in Alaska?', a: `Alaska law says no one may bid on or work as a contractor without a certificate of registration, and specialty contractors who repair or alter fixed structures are included. It is a general registration, not a roofing license. Contractors handling residential work of ${unitText} units also need a residential endorsement. Ask for the certificate number before you sign.` },
  ],
  related: ['roof-replacement-cost', 'roof:washington', 'roof:hawaii', 'roofing-calculator', 'heat-pump-cost'],
  extraSources: [{ name: 'Alaska Statutes 08.18.011 to 08.18.025: contractor registration and residential endorsement', url: lic.url }],
});
