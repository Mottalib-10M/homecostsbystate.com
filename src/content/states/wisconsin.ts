import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'wisconsin';
const r = K.job('roof', slug);
const us = K.job('roof');
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const mn = K.wage('minnesota', 'roofers')!;
const il = K.wage('illinois', 'roofers')!;
const mi = K.wage('michigan', 'roofers')!;
const mnR = K.job('roof', 'minnesota');
const ilR = K.job('roof', 'illinois');
const f = K.facts(slug);
const n = f.nri;
const lic = f.licensing!;
const code = f.code!;
const sps = code.summary.match(/SPS [\d-]+/)![0];
const ord = (x: number) => { const s = ['th', 'st', 'nd', 'rd'], v = x % 100; return `${x}${s[(v - 20) % 10] || s[v] || s[0]}`; };
const hailRank = K.states.map((s) => K.facts(s.slug).nri.hail.buildingLossUsd ?? 0).sort((a, b) => b - a).indexOf(n.hail.buildingLossUsd ?? 0) + 1;
const mil = (x: number | null) => `$${K.num((x ?? 0) / 1e6)} million`;
const centsOff = Math.round((nat.mean - w.mean) * 100);

export default defineState({
  slug,
  title: 'Roof Replacement Cost Wisconsin 2026: Hail Losses and Prices',
  description: `Wisconsin roof replacement costs about ${K.usd(r.typical)} in 2026, most jobs ${K.usd(r.low)} to ${K.usd(r.high)}, with hail losses to buildings ranked ${ord(hailRank)} among all states by FEMA data.`,
  intro: `Wisconsin roofers earn almost exactly the national mean, its hail losses rank near the top, and its houses follow a state-written dwelling code.`,
  resume: `Expect to pay about ${K.usd(r.typical)} for a professional roof replacement in Wisconsin, with half of jobs between ${K.usd(r.low)} and ${K.usd(r.high)}, a bit under the ${K.usd(us.typical)} national median. Wisconsin roofers are paid almost exactly the national average: BLS measured a mean of ${K.usd(w.mean, 2)} an hour in ${K.wageRef.reference}, ${centsOff} cents from the ${K.usd(nat.mean, 2)} national figure. The estimate still lands under the median because the method compares Wisconsin with its own East North Central division, where Illinois pay lifts the average, and the division reported prices at the national level in the 2023 American Housing Survey. Hail is the headline hazard. FEMA's National Risk Index rates Wisconsin's expected annual hail losses to buildings ${n.hail.rating}, about ${mil(n.hail.buildingLossUsd)} a year and the ${ord(hailRank)} largest total of any state, while tornadoes are rated ${n.tornado.rating}. One- and two-family homes in Wisconsin are built under the state's own Uniform Dwelling Code, and a dwelling contractor credential is needed to pull a building permit.`,
  body: (h) => `
<h2>Hail and tornadoes over the dairy state</h2>
<p>Wisconsin's hail figure stands out in the ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}): about ${mil(n.hail.buildingLossUsd)} in expected annual losses to buildings, with a score of ${h.num(n.hail.score ?? 0, 1)}. Tornadoes add ${mil(n.tornado.buildingLossUsd)}, rated ${n.tornado.rating}, and strong wind ${mil(n.strong_wind.buildingLossUsd)}, rated ${n.strong_wind.rating}. Winter weather is rated ${n.winter_weather.rating}, ice storms ${n.ice_storm.rating}, and hurricanes ${n.hurricane.rating.toLowerCase()}, like wildfire.</p>
<p>A hail-damaged roof can look fine from the ground. After a storm, have it inspected soon: bruised shingles lose granules and seal strength and may not leak until months later. Document what you find with dated photos, and keep the insurer informed before work starts.</p>
<h2>Dwelling contractor credentials and the UDC</h2>
<p>Wisconsin does not license roofers as such. The ${h.ext(lic.url, 'Department of Safety and Professional Services')} issues a Dwelling Contractor credential for the business and a Dwelling Contractor Qualifier credential for an individual, and no one may obtain a building permit for a one- or two-family dwelling without them; owner-occupants are exempt. These credentials therefore matter for a reroof only where your municipality requires a building permit for the job.</p>
<p>The construction standard is the ${h.ext(code.url, 'Wisconsin Uniform Dwelling Code')}, chapters ${sps} of the administrative code, a state-written code rather than a direct adoption of the International Residential Code. Your local building inspector applies it when a permit is required.</p>
<h3>Wisconsin and the Upper Midwest wage map</h3>
<p>Minnesota roofers average ${h.usd(mn.mean, 2)} and Illinois roofers ${h.usd(il.mean, 2)}, both well above Wisconsin's ${h.usd(w.mean, 2)}; Michigan pays ${h.usd(mi.mean, 2)}. The Minnesota estimate here is ${h.usd(mnR.typical)} and the Illinois one ${h.usd(ilR.typical)}. For a Wisconsin house of ${big.bin!.label}, the estimate is ${h.usd(big.typical)}, with most jobs from ${h.usd(big.low)} to ${h.usd(big.high)}; for ${small.bin!.label}, about ${h.usd(small.typical)}.</p>
<p>Ask every bidder the same questions: how many layers come off, how much ice and water membrane goes along the eaves and in the valleys, how many decking sheets are included, and whether the shingle line carries an impact rating if hail coverage matters to you.</p>
<p>Spread those answers side by side before choosing. Two Wisconsin bids that differ sharply often describe different roofs, one with full membrane and new flashing, one without.</p>
${h.mini('wageGap', { state: 'Wisconsin', job: 'Roof replacement', median: us.typical * r.region, L: r.L, index: r.index })}`,
  faqs: [
    { q: 'How much does a roof replacement cost in Wisconsin in 2026?', a: `About ${K.usd(r.typical)} for a typical professional replacement in Wisconsin, with half of jobs between ${K.usd(r.low)} and ${K.usd(r.high)}. The range uses East North Central prices from the American Housing Survey with the labor share set to Wisconsin roofer wages from BLS. Hail-rated shingles, extra layers and decking repairs push quotes higher.` },
    { q: 'Do Wisconsin roofers need a state license?', a: `There is no roofing-specific license. Wisconsin's Department of Safety and Professional Services issues Dwelling Contractor and Dwelling Contractor Qualifier credentials, and nobody may obtain a building permit for a one- or two-family home without them, owner-occupants excepted. They apply to a reroof where your municipality requires a building permit.` },
    { q: 'How bad is hail damage to Wisconsin homes?', a: `FEMA's National Risk Index estimates about ${mil(n.hail.buildingLossUsd)} a year in expected hail losses to Wisconsin buildings, the ${ord(hailRank)} largest of any state, rated ${n.hail.rating}. Tornadoes add ${mil(n.tornado.buildingLossUsd)}. Knowing your Wisconsin policy's deductible before the next storm makes the replacement decision easier, and dated photos of each slope help any claim.` },
  ],
  related: ['roof-replacement-cost', 'roof:minnesota', 'roof:illinois', 'roof:michigan', 'heat-pump-vs-furnace'],
  extraSources: [
    { name: 'Wisconsin DSPS, Dwelling Contractor Qualifier credential', url: lic.url },
    { name: 'Wisconsin DSPS, Uniform Dwelling Code', url: code.url },
  ],
});
