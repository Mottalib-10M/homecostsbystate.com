import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const r = K.job('waterHeater');
const a = K.ahs('waterHeater');
const sh = K.shares('waterHeater');
const pl = K.natWage('plumbers');
const cpiMonth = K.month(K.ahsMeta.cpi.to);
const divNames: Record<string, string> = { 1: 'New England', 2: 'Middle Atlantic', 3: 'East North Central', 4: 'West North Central', 5: 'South Atlantic', 6: 'East South Central', 7: 'West South Central', 8: 'Mountain', 9: 'Pacific' };
const divs = Object.entries(a.divisions).map(([d, s]) => ({ d, name: divNames[d], ...s })).sort((x, y) => x.median - y.median);
const ranked = K.states.map((s) => ({ s, r: K.job('waterHeater', s.slug) })).sort((x, y) => x.r.typical - y.r.typical);
const lo = ranked[0], hi = ranked[ranked.length - 1];

export default definePage({
  id: 'water-heater-replacement-cost',
  group: 'costs',
  order: 20,
  slug: 'water-heater-replacement-cost',
  nav: 'Water heater replacement',
  card: 'Installed price range in your state, plumber wages included',
  title: 'Water Heater Replacement Cost 2026: Price in Every State',
  description: `Water heater replacement cost in 2026: ${K.usd(r.typical)} typical installed, ${K.usd(r.low)} to ${K.usd(r.high)} for most jobs, in every state, from Census data. No ZIP code or phone.`,
  h1: 'Water heater replacement cost in your state',
  intro: 'The installed price, unit and plumber together, for any state, without handing over a phone number.',
  resume: `Having a professional replace a water heater cost ${K.usd(r.typical)} at the national median, and half of the jobs fell between ${K.usd(r.low)} and ${K.usd(r.high)}, according to the ${K.num(a.pro.n)} replacements that homeowners reported in the 2023 American Housing Survey, converted to ${cpiMonth} dollars. That price is the whole job: the tank or tankless unit, fittings, venting changes, haul-away and the plumber's time. Location moves it more than for most jobs, because plumbing and HVAC contractors spent ${K.pct(sh.payroll + sh.benefits)} of the value of their work on payroll and benefits in the 2022 Economic Census. Reported medians ran from ${K.usd(divs[0].median)} in the ${divs[0].name} states to ${K.usd(divs[divs.length - 1].median)} in the ${divs[divs.length - 1].name} states, and our state estimates go from ${K.usd(lo.r.typical)} in ${lo.s.name} to ${K.usd(hi.r.typical)} in ${hi.s.name}.`,
  tool: 'water-heater',
  body: (h) => `
<h2>Where the money goes on a water heater job</h2>
<p>For plumbing, heating and air-conditioning contractors as a group, the ${h.src('census_ec', '2022 Economic Census')} puts materials and installed equipment at ${h.pct(sh.materials)} of the value of their work, payroll at ${h.pct(sh.payroll)}, benefits at ${h.pct(sh.benefits)} and subcontracted work at ${h.pct(sh.subcontracted)}. A water heater swap is close to that profile: the appliance is the largest single item, but two or three hours of a licensed plumber, the permit in many cities, new connectors, an expansion tank where the code asks for one and the disposal of the old tank add up to more than the unit itself.</p>
<p>BLS measured a national mean of ${h.usd(pl.mean, 2)} an hour for plumbers, pipefitters and steamfitters in ${h.wageRef.reference}, with the middle half of plumbers between ${h.usd(pl.p25 ?? 0, 2)} and ${h.usd(pl.p75 ?? 0, 2)}. Shop rates are higher than wages because they carry the truck, insurance, training and office; the price range above already includes them, since it comes from what owners paid.</p>
${h.table(['Census division', 'Low', 'Median', 'High', 'Jobs in survey'], divs.map((d) => [d.name, h.usd(d.p25), h.usd(d.median), h.usd(d.p75), h.num(d.n)]), `Professional water heater jobs, American Housing Survey 2023, in ${cpiMonth} dollars.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>Tank, tankless or heat pump</h2>
<p>The survey records the job, not the type of heater, so the range covers the mix that American homes actually bought in 2021 to 2023, mostly like-for-like tank replacements. Switching types costs more than staying with the same one: a gas tankless unit often needs a larger gas line and new venting, and a heat pump water heater needs room, air volume and a condensate drain. If you are changing fuel or type, expect the upper part of the range or above, and ask the plumber to price the conversion work separately from the unit.</p>
<p>Federal efficiency rules set a minimum uniform energy factor for each storage size; the current formulas in ${h.src('ecfr_430_32', '10 CFR 430.32')} apply to heaters made before May 6, 2029, when stricter standards take over. A replacement installed in 2026 only has to meet the rule in force when the unit was made.</p>
<h3>Doing it yourself</h3>
<p>Owners who did most of the work themselves reported a median of ${h.usd(a.diy!.median)}, roughly the cost of the heater and parts. Gas connections, venting and the temperature and pressure relief valve are where amateur installs go wrong, and many jurisdictions require a permit and an inspection even for a like-for-like swap. An electric tank in an accessible spot is the most realistic project for a handy owner.</p>
<h2>Reading a plumber's quote</h2>
<p>A fair quote names the heater (brand, capacity, fuel, warranty years), the labor, the permit, code upgrades such as a drain pan, seismic straps or an expansion tank, and the haul-away. Compare the total with the range for your state in the calculator; a quote well above the high end usually hides a conversion, a hard-to-reach location or emergency pricing for a weekend failure. If the old heater still works, getting two quotes before it fails is the cheapest insurance against that.</p>`,
  faqs: [
    { q: 'How much does it cost to replace a 50 gallon water heater?', a: `The Census survey does not split jobs by tank size, but the typical professional replacement cost ${K.usd(r.typical)} nationally in ${cpiMonth} dollars, with half of jobs between ${K.usd(r.low)} and ${K.usd(r.high)}. A standard 40 or 50 gallon tank swapped like for like usually sits in that middle half; tankless conversions and tight spaces push it higher.` },
    { q: 'Why does a water heater cost more to install in some states?', a: `Labor is a large share of plumbing work: ${K.pct(sh.payroll + sh.benefits)} of contractors' value of work went to payroll and benefits in the 2022 Economic Census. Plumber wages differ a lot between states, and owners in the ${divs[divs.length - 1].name} division reported a median of ${K.usd(divs[divs.length - 1].median)}, the highest of the nine divisions.` },
    { q: 'Is it worth installing a water heater yourself?', a: `Owners who did most of the work reported a median of ${K.usd(a.diy!.median)}, against ${K.usd(a.pro.median)} when a professional did it, in the 2023 American Housing Survey. The saving is real for a simple electric tank. Gas lines, venting and relief valves carry safety risks, and many cities require a permit and inspection for any replacement.` },
    { q: 'How long does a water heater replacement take?', a: `A like-for-like tank swap is usually a half-day job for one plumber, which is why labor is a large part of the bill: plumbers earned a mean of ${K.usd(pl.mean, 2)} an hour nationally in May 2025 according to BLS. Changing fuel, moving the heater or adding venting can turn it into a full day or more.` },
  ],
  related: ['hvac-replacement-cost', 'heat-pump-vs-furnace', 'electric-bill-calculator', 'roof-replacement-cost'],
  sources: ['census_ahs', 'census_ahs_defs', 'bls_oews', 'census_ec', 'ecfr_430_32', 'bls_cpi'],
});
