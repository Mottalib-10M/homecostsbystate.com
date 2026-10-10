import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'north-dakota';
const r = K.job('roof', slug);
const us = K.job('roof');
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const mn = K.wage('minnesota', 'roofers')!;
const sd = K.wage('south-dakota', 'roofers')!;
const mt = K.wage('montana', 'roofers')!;
const sdR = K.job('roof', 'south-dakota');
const f = K.facts(slug);
const n = f.nri;
const lic = f.licensing!;
const code = f.code!;
const adopted = code.summary.match(/[A-Z][a-z]+\.? \d{1,2}, 20\d\d/)![0];
const ircYear = code.summary.match(/(20\d\d) IRC/)![1];
const winterRank = K.states.map((s) => K.facts(s.slug).nri.winter_weather.buildingLossUsd ?? 0).sort((a, b) => b - a).indexOf(n.winter_weather.buildingLossUsd ?? 0) + 1;
const mil = (x: number | null) => { const v = (x ?? 0) / 1e6; return `$${K.num(v, v >= 10 ? 0 : 1)} million`; };
const chapter = lic.summary.match(/NDCC ch\. ([\d-]+)/)![1];
const over = Math.round((w.mean / nat.mean - 1) * 100);

export default defineState({
  slug,
  title: 'Roof Replacement Cost North Dakota 2026: Winter-Proof Prices',
  description: `North Dakota roof replacement in 2026: about ${K.usd(r.typical)} typical, ${K.usd(r.low)} to ${K.usd(r.high)} for most jobs, where winter weather losses to buildings lead the nation.`,
  intro: `North Dakota has the largest expected winter weather losses to buildings in FEMA's index, and a state contractor license applies to most reroofs.`,
  resume: `For a professional roof replacement in North Dakota, the typical price is about ${K.usd(r.typical)}, with most jobs costing ${K.usd(r.low)} to ${K.usd(r.high)}, slightly above the ${K.usd(us.typical)} national median. The West North Central division that contains North Dakota reported prices at the national level in the 2023 American Housing Survey, so the small premium comes from pay. BLS measured North Dakota roofers at a mean of ${K.usd(w.mean, 2)} an hour in ${K.wageRef.reference}, ${over}% over the national mean of ${K.usd(nat.mean, 2)} and well ahead of South Dakota, though behind Minnesota. Winter shapes roofing here more than anywhere else. FEMA's National Risk Index rates North Dakota's expected annual losses to buildings from winter weather as ${n.winter_weather.rating}, and the dollar figure ranks ${winterRank === 1 ? 'first' : `number ${winterRank}`} in the country; ice storms are rated ${n.ice_storm.rating} and hail ${n.hail.rating}. Any job priced above ${K.usd(lic.threshold_usd ?? 0)} must be done by a contractor licensed with the Secretary of State.`,
  body: (h) => `
<h2>The country's top winter weather loss figure</h2>
<p>The ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) estimates about ${mil(n.winter_weather.buildingLossUsd)} a year in winter weather losses to North Dakota buildings, ${winterRank === 1 ? 'the highest of any state' : 'among the highest of any state'}, with a score of ${h.num(n.winter_weather.score ?? 0, 1)} out of 100. Ice storms add ${mil(n.ice_storm.buildingLossUsd)}, rated ${n.ice_storm.rating}. Hail, though, is the largest single line at ${mil(n.hail.buildingLossUsd)}, rated ${n.hail.rating}, with tornadoes at ${mil(n.tornado.buildingLossUsd)} and strong wind at ${mil(n.strong_wind.buildingLossUsd)}. Hurricanes are not scored for the state.</p>
<p>A roof that faces long freezes is judged at the eaves. Snow that melts over a warm attic and refreezes at the cold overhang builds ice dams that push water under shingles. The fixes are mostly in the bid: how far up the slope the self-adhered membrane goes, how the attic is vented, and whether insulation gaps around the top plates will be sealed while the deck is open.</p>
<h2>License above the threshold, code where adopted</h2>
<p>The ${h.ext(lic.url, 'North Dakota Secretary of State')} explains that when the cost, value or price of a job exceeds ${h.usd(lic.threshold_usd ?? 0)}, the person doing the work must be licensed as a contractor under NDCC chapter ${chapter}. It is a general contractor license, not a roofing specialty. Every price on this page clears that threshold, so ask for the license number.</p>
<p>The state building code, according to the ${h.ext(code.url, 'Department of Commerce')}, consists of the IBC, IRC, IMC and IFGC, and on ${adopted} the ${ircYear} updates with North Dakota amendments were adopted. It applies only in jurisdictions that elect to adopt and enforce building codes, so rural addresses may have no local inspection at all.</p>
<p>Where no inspector visits, the written contract carries more weight. Spell out the underlayment, the fastening pattern, the ventilation changes and the cleanup, and keep the manufacturer's installation sheet with the invoice in case a warranty question comes up after a hard winter.</p>
<h3>Dakota and Minnesota pay compared</h3>
<p>Minnesota roofers average ${h.usd(mn.mean, 2)}, Montana ${h.usd(mt.mean, 2)} and South Dakota ${h.usd(sd.mean, 2)}. The South Dakota estimate on this site is ${h.usd(sdR.typical)}, lower than North Dakota's for the same division price. For a house of ${big.bin!.label}, North Dakota comes to ${h.usd(big.typical)}; for ${small.bin!.label}, about ${h.usd(small.typical)}.</p>
${h.mini('wageGap', { state: 'North Dakota', job: 'Roof replacement', median: us.typical * r.region, L: r.L, index: r.index })}`,
  faqs: [
    { q: 'How much does it cost to replace a roof in North Dakota?', a: `About ${K.usd(r.typical)} for a typical professional replacement in North Dakota, with half of jobs between ${K.usd(r.low)} and ${K.usd(r.high)}. The range uses West North Central prices from the American Housing Survey with the North Dakota roofer wage from BLS. Extra ice membrane, ventilation work and decking repairs can move a quote higher.` },
    { q: 'Do North Dakota roofers need a contractor license?', a: `Yes, when the job's cost, value or price exceeds ${K.usd(lic.threshold_usd ?? 0)}, the person doing the work must hold a North Dakota contractor license from the Secretary of State under NDCC chapter ${chapter}. It is a general license rather than a roofing-specific one. A full reroof costs far more than that threshold.` },
    { q: 'Is North Dakota winter hard on roofs according to FEMA?', a: `FEMA's National Risk Index rates North Dakota's expected annual winter weather losses to buildings as ${n.winter_weather.rating}, at about ${mil(n.winter_weather.buildingLossUsd)} a year, ${winterRank === 1 ? 'the largest figure of any state' : 'one of the largest figures nationally'}. Ice storms are rated ${n.ice_storm.rating}. Ice dam protection and attic ventilation belong in any North Dakota roofing bid.` },
  ],
  related: ['roof-replacement-cost', 'roof:minnesota', 'roof:south-dakota', 'roof:montana', 'heat-pump-vs-furnace'],
  extraSources: [
    { name: 'North Dakota Secretary of State, contractor licensing', url: lic.url },
    { name: 'North Dakota Department of Commerce, State Building Code', url: code.url },
  ],
});
