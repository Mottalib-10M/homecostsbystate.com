import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const ac = K.job('centralAc');
const he = K.job('heating');
const aA = K.ahs('centralAc');
const aH = K.ahs('heating');
const sh = K.shares('centralAc');
const hv = K.natWage('hvac');
const E = K.P.efficiency;
const cpiMonth = K.month(K.ahsMeta.cpi.to);
const ranked = K.states.map((s) => ({ s, ac: K.job('centralAc', s.slug), he: K.job('heating', s.slug) })).sort((x, y) => x.ac.typical - y.ac.typical);
const sample = ['florida', 'arizona', 'ohio', 'new-york', 'california', 'minnesota'].map((s) => ({ s: K.state(s), ac: K.job('centralAc', s), he: K.job('heating', s), w: K.wage(s, 'hvac') }));

export default definePage({
  id: 'hvac-replacement-cost',
  group: 'costs',
  order: 30,
  slug: 'hvac-replacement-cost',
  nav: 'HVAC replacement cost',
  card: 'Central AC and furnace prices by state, side by side',
  title: 'HVAC Replacement Cost 2026: AC and Furnace Prices by State',
  description: `HVAC replacement cost in 2026: central AC ${K.usd(ac.typical)} and furnace ${K.usd(he.typical)} typical, from Census survey jobs and BLS HVAC wages in each state. No ZIP code asked.`,
  h1: 'HVAC replacement cost: central air and heating',
  intro: 'Air conditioning and heating priced separately for your state, the way homeowners reported them to the Census Bureau.',
  resume: `Replacing or adding central air conditioning cost ${K.usd(ac.typical)} at the national median, with half of professional jobs between ${K.usd(ac.low)} and ${K.usd(ac.high)}, and a furnace or other built-in heating system cost ${K.usd(he.typical)}, with the middle half between ${K.usd(he.low)} and ${K.usd(he.high)}. Both figures come from the 2023 American Housing Survey (${K.num(aA.pro.n)} air conditioning jobs and ${K.num(aH.pro.n)} heating jobs done by professionals from 2021 to 2023), moved to ${cpiMonth} dollars. A full system change, condenser plus furnace or air handler, is reported by many owners as two jobs, so the two medians give an order of magnitude for both, not a precise package price. In your state the calculator moves the labor part with the wage of HVAC mechanics, ${K.usd(hv.mean, 2)} an hour on average nationally in ${K.wageRef.reference}.`,
  tool: 'hvac',
  body: (h) => `
<h2>Air conditioning and heating are two prices</h2>
<p>The American Housing Survey asks about central air conditioning and built-in heating equipment separately, and that is how the calculator shows them. Built-in heating covers furnaces, boilers and heat pumps used as the main heat; the survey does not say which, so the heating range mixes them in the proportions owners actually installed. Air conditioning includes jobs that added central air to a house without it, which tend to cost more than a straight swap because ducts may be needed.</p>
${h.table(['State', 'Central AC, typical', 'Heating, typical', 'HVAC mechanic wage'], sample.map((x) => [x.s.name, h.usd(x.ac.typical), h.usd(x.he.typical), x.w ? h.usd(x.w.mean, 2) : 'not published']), `Professional jobs, AHS 2023 in ${cpiMonth} dollars, with the division level and state HVAC wages (BLS, ${h.wageRef.reference}).`, ['l', 'r', 'r', 'r'])}
<p>Across all states, the typical central air job ranges from ${h.usd(ranked[0].ac.typical)} in ${ranked[0].s.name} to ${h.usd(ranked[ranked.length - 1].ac.typical)} in ${ranked[ranked.length - 1].s.name}. The division level does most of that work: owners in the Pacific and New England states reported far higher medians than those in the Midwest.</p>
<h2>What the federal efficiency rules require in 2026</h2>
<p>Since January 1, 2023, a new split-system central air conditioner must reach ${h.num(E.centralAcNorth, 1)} SEER2 in the northern states and ${h.num(E.centralAcSouth, 1)} SEER2 for smaller units in the Southeast and Southwest, and a split heat pump must reach ${h.num(E.heatPumpSplit.seer2, 1)} SEER2 and ${h.num(E.heatPumpSplit.hspf2, 1)} HSPF2 everywhere, under ${h.src('ecfr_430_32', '10 CFR 430.32')}. A non-weatherized gas furnace must reach ${h.num(E.gasFurnaceAfue * 100)}% AFUE until ${h.day(E.gasFurnaceFutureDate)}, when the minimum rises to ${h.num(E.gasFurnaceAfueFuture * 100)}%. Contractors can only install equipment that met the standard on its manufacturing date, which is why an old 10 SEER condenser cannot be replaced by an identical new one.</p>
<h3>The labor inside the price</h3>
<p>For plumbing, heating and air-conditioning contractors, payroll was ${h.pct(sh.payroll)} and benefits ${h.pct(sh.benefits)} of the value of their work in the ${h.src('census_ec', '2022 Economic Census')}, materials and equipment ${h.pct(sh.materials)}. An HVAC changeout involves refrigerant recovery, brazing the line set or replacing it, electrical work, a new pad and commissioning, so crew hours matter as much as the box on the pad. Two quotes for the same equipment can differ by a crew-day of work, so ask what each installer plans to replace besides the units themselves: line set, pad, disconnect, thermostat, duct transitions.</p>
<h2>Repair, replace or switch to a heat pump</h2>
<p>When a system fails in July, the decision is usually made in a hurry. Get the age of both halves of the system and the cost of the repair before deciding; replacing only the outdoor unit of an old split system can leave a mismatched pair that never reaches its rating. If the furnace is also near the end of its life, a heat pump that heats and cools can replace both, and its running cost depends on electricity and gas prices in your state: the ${h.a('heat-pump-vs-furnace', 'heat pump versus furnace calculator')} compares them, and the ${h.a('heat-pump-cost', 'heat pump cost page')} explains what the survey says about installing one. The federal tax credit for efficient HVAC (25C) covered improvements made through December 31, 2025, according to the ${h.src('irs_25c', 'IRS')}.</p>`,
  faqs: [
    { q: 'How much does it cost to replace central air conditioning in 2026?', a: `About ${K.usd(ac.typical)} at the national median for a professional job, with half of jobs between ${K.usd(ac.low)} and ${K.usd(ac.high)}, from the 2023 American Housing Survey in ${cpiMonth} dollars. Adding central air where there was none, replacing ductwork or upsizing the system pushes the price above that middle range.` },
    { q: 'How much does a new furnace cost installed?', a: `Built-in heating equipment, which includes furnaces, boilers and heat pumps used as the main heat, cost ${K.usd(he.typical)} at the median for professional jobs, with half between ${K.usd(he.low)} and ${K.usd(he.high)}. A like-for-like gas furnace swap often lands in the lower half; a boiler or a switch of fuel lands higher.` },
    { q: 'What is the minimum SEER2 for a new air conditioner in 2026?', a: `Under 10 CFR 430.32, split-system central air conditioners must reach ${K.num(E.centralAcNorth, 1)} SEER2 in the northern states and ${K.num(E.centralAcSouth, 1)} SEER2 for units under 45,000 Btu per hour in the Southeast and Southwest, since January 1, 2023. Split heat pumps must reach ${K.num(E.heatPumpSplit.seer2, 1)} SEER2 and ${K.num(E.heatPumpSplit.hspf2, 1)} HSPF2 nationwide.` },
    { q: 'Is there still a federal tax credit for a new furnace or AC?', a: `The IRS states that the Energy Efficient Home Improvement Credit (25C) applied to qualifying improvements made through December 31, 2025. Equipment installed in 2026 no longer qualifies for it. Some utilities and states run their own rebates, which change often; check your utility's website before signing a contract.` },
  ],
  related: ['heat-pump-cost', 'heat-pump-vs-furnace', 'water-heater-replacement-cost', 'electric-bill-calculator'],
  sources: ['census_ahs', 'bls_oews', 'census_ec', 'ecfr_430_32', 'irs_25c', 'bls_cpi'],
});
