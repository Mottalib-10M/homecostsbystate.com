import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'michigan';
const r = K.job('roof', slug);
const us = K.job('roof');
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const f = K.facts(slug);
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const all = K.states.map((s) => s.slug);
const lossRank = (hz: string) => [...all].sort((a, b) => (K.facts(b).nri[hz]?.buildingLossUsd ?? 0) - (K.facts(a).nri[hz]?.buildingLossUsd ?? 0)).indexOf(slug) + 1;
const ord = (n: number) => { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`; };
const mil = (x: number | null) => `${K.usd(Math.round((x ?? 0) / 1e6))} million`;
const above = Math.round((w.mean / nat.mean - 1) * 100);
const underDiv = Math.round((1 - r.index) * 100);
const il = K.wage('illinois', 'roofers')!;
const oh = K.wage('ohio', 'roofers')!;
const wi = K.wage('wisconsin', 'roofers')!;
const ind = K.wage('indiana', 'roofers')!;

export default defineState({
  slug,
  title: 'Roof Replacement Cost Michigan 2026: Prices and Wind Losses',
  description: `Michigan roof replacement in 2026: about ${K.usd(r.typical)} typical, ${K.usd(r.low)} to ${K.usd(r.high)} for most jobs, with strong wind and tornado losses near the top nationally.`,
  intro: `Few states lose more to strong wind and tornadoes than Michigan, and its winter weather losses are rated Very High as well.`,
  resume: `Michigan homeowners pay about ${K.usd(r.typical)} for a professional roof replacement in 2026, and half of jobs run from ${K.usd(r.low)} to ${K.usd(r.high)}, just under the national median of ${K.usd(us.typical)}. The East North Central division reported roof prices at the national level in the 2023 American Housing Survey. Michigan roofers earned a mean of ${K.usd(w.mean, 2)} an hour in BLS data for ${K.wageRef.reference}, ${above}% above the national ${K.usd(nat.mean, 2)}, yet about ${underDiv}% under the division average, which Illinois pulls upward, so the wage step lowers the estimate slightly. A home of ${small.bin!.label} comes out near ${K.usd(small.typical)}, one of ${big.bin!.label} near ${K.usd(big.typical)}. The weather is the striking part. FEMA's National Risk Index ranks Michigan ${ord(lossRank('strong_wind'))} in the country for expected annual strong wind losses to buildings and ${ord(lossRank('tornado'))} for tornado losses, with winter weather rated ${f.nri.winter_weather.rating} and ice storms ${f.nri.ice_storm.rating}. Summer windstorms and winter ice both end up in the roofing schedule.`,
  body: (h) => `
<h2>Michigan's wind problem in FEMA's numbers</h2>
<p>Straight-line wind is the hazard that sets Michigan apart. The ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) estimates expected annual strong wind losses to Michigan buildings at about ${mil(f.nri.strong_wind.buildingLossUsd)}, rated ${f.nri.strong_wind.rating}, the ${ord(lossRank('strong_wind'))} largest such figure among the 51 jurisdictions. Tornadoes add roughly ${mil(f.nri.tornado.buildingLossUsd)}, also ${ord(lossRank('tornado'))} nationally, and hail ${mil(f.nri.hail.buildingLossUsd)}. Winter weather is rated ${f.nri.winter_weather.rating} and ice storms ${f.nri.ice_storm.rating}, at about ${mil(f.nri.ice_storm.buildingLossUsd)} a year.</p>
<p>A roof that faces both summer gusts and winter ice is tested at the edges twice a year. Uplift peels shingles from the eaves, rakes and ridge, and ice that builds along the gutters can push meltwater under the courses above. When comparing bids, look at what each contractor proposes for the starter course, the nailing pattern and the ice barrier at the lower edge; those details cost little and decide how the roof copes with both seasons.</p>
<h2>Michigan labor between Illinois and Ohio</h2>
<p>Michigan's ${h.usd(w.mean, 2)} hourly mean is well under Illinois at ${h.usd(il.mean, 2)}, close to Indiana's ${h.usd(ind.mean, 2)} and above Wisconsin's ${h.usd(wi.mean, 2)} and Ohio's ${h.usd(oh.mean, 2)}. BLS counted ${h.num(w.emp ?? 0)} roofers in the state. Because the division average leans on Illinois, Michigan's wage index comes out below one, and the estimate a few dozen dollars below the division median. In practice, the season and the number of bidders move a Michigan quote far more than that small wage effect.</p>
<h3>Pricing a Michigan reroof</h3>
<p>For a house of ${big.bin!.label}, the estimate is ${h.usd(big.typical)}, with half of comparable jobs between ${h.usd(big.low)} and ${h.usd(big.high)}. Many Michigan reroofs follow a wind or hail claim, where the insurer's scope and the deductible set the owner's share. If the job is planned instead, the shoulder seasons usually bring more available crews. Either way, a bid should list tear-off, sheathing allowance, ice barrier length, ventilation and disposal separately so the totals can be compared fairly.</p>`,
  faqs: [
    { q: 'How much does a roof replacement cost in Michigan in 2026?', a: `About ${K.usd(r.typical)} for a professional job, with half of Michigan replacements between ${K.usd(r.low)} and ${K.usd(r.high)}. The East North Central price level from the 2023 American Housing Survey sits at the national median, and the Michigan roofer wage of ${K.usd(w.mean, 2)} an hour, below the division average, trims it slightly.` },
    { q: 'How much do windstorms cost Michigan buildings each year?', a: `FEMA's National Risk Index estimates expected annual strong wind losses to Michigan buildings at about ${mil(f.nri.strong_wind.buildingLossUsd)}, rated ${f.nri.strong_wind.rating}, and tornado losses near ${mil(f.nri.tornado.buildingLossUsd)}. Both rank among the highest in the country, which is why many Michigan roofs are replaced after a storm through an insurance claim.` },
    { q: 'Are Michigan roofers paid more than the national average?', a: `Yes. BLS measured a mean of ${K.usd(w.mean, 2)} an hour for Michigan roofers in ${K.wageRef.reference}, ${above}% above the national ${K.usd(nat.mean, 2)}. They still earn less than roofers in Illinois at ${K.usd(il.mean, 2)}, so within the East North Central division Michigan's labor share is slightly cheaper than average, and a typical roof lands a little under the regional median.` },
  ],
  related: ['roof-replacement-cost', 'roof:ohio', 'roof:wisconsin', 'roof:indiana', 'roofing-calculator'],
  extraSources: [],
});
