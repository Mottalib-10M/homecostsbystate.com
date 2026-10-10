import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const he = K.job('heating');
const ac = K.job('centralAc');
const aH = K.ahs('heating');
const E = K.P.efficiency;
const cpiMonth = K.month(K.ahsMeta.cpi.to);
const hv = K.natWage('hvac');
const gasUse = K.recs('us', 'gas').value;
const heat = Math.round(gasUse * E.gasFurnaceAfue * 10) / 10;
const usCents = K.elec('us');
const cop = (E.heatPumpSplit.hspf2 * 1000) / K.P.btu.kwh;
const kwh = (heat * 1e6) / K.P.btu.kwh / cop;
const hpYear = (kwh * usCents) / 100;
const gasYear = ((heat * 1e6) / E.gasFurnaceAfue / (K.P.btu.gasCuFt * 1000)) * K.usEnergy.gas;
const bothLow = he.low + ac.low, bothHigh = he.high + ac.high;

export default definePage({
  id: 'heat-pump-cost',
  group: 'costs',
  order: 40,
  slug: 'heat-pump-cost',
  nav: 'Heat pump cost',
  card: 'What installing one costs and what it costs to run',
  title: 'Heat Pump Cost 2026: Install Price and Yearly Bill by State',
  description: `Heat pump cost in 2026: heating systems ran ${K.usd(he.typical)} typical installed and central AC ${K.usd(ac.typical)}, with running costs at your state's power price. No ZIP code.`,
  h1: 'Heat pump cost: installation and running',
  intro: 'A ducted heat pump does the work of a furnace and an air conditioner, so its price is read against both.',
  resume: `No federal survey prices heat pumps on their own, so the honest answer comes in two parts. Built-in heating systems, a category that includes furnaces, boilers and heat pumps used as the main heat, cost ${K.usd(he.typical)} at the median when a professional installed them, with half of jobs between ${K.usd(he.low)} and ${K.usd(he.high)}, in the ${K.num(aH.pro.n)} jobs of the 2023 American Housing Survey brought to ${cpiMonth} dollars. Central air conditioning, the other half of what a ducted heat pump replaces, cost ${K.usd(ac.typical)}. A heat pump that takes over both roles therefore sits somewhere inside those two ranges, depending on whether the ducts, the air handler and the electrical panel can stay. Running it is the other part: at the national average of ${K.cents(usCents)} per kWh, heating an average gas-heated home's load with a minimum-efficiency heat pump costs about ${K.usd(hpYear)} a year.`,
  tool: 'heat-pump',
  body: (h) => `
<h2>Why the survey ranges bracket the price</h2>
<p>The ${h.src('census_ahs', 'American Housing Survey')} lists the job an owner had done, not the technology. A heat pump installed as the main heat counts as built-in heating equipment; a heat pump installed to replace an old air conditioner, with the furnace kept as backup, may be reported as central air conditioning. The calculator therefore shows both ranges for your state. When one system replaces a furnace and an AC at the same time, the two middle halves added together run from ${h.usd(bothLow)} to ${h.usd(bothHigh)}: an upper bound for a straightforward ducted swap, since one outdoor unit and one indoor unit do the work of two systems.</p>
<p>Ductless mini-splits follow another logic. Each indoor head is a separate unit with its own line set, so the price grows with the number of rooms served rather than with the size of the house.</p>
<h2>Federal minimums and the end of the tax credit</h2>
<p>A split heat pump sold for installation today must reach ${h.num(E.heatPumpSplit.seer2, 1)} SEER2 for cooling and ${h.num(E.heatPumpSplit.hspf2, 1)} HSPF2 for heating, under ${h.src('ecfr_430_32', '10 CFR 430.32')}. HSPF2 is a seasonal ratio of Btu of heat per watt-hour; divided by ${h.num(K.P.btu.kwh)} Btu per kWh (${h.src('eia_btu', 'EIA')}), it gives a seasonal coefficient of performance of ${h.num(cop, 2)} at the minimum, meaning about ${h.num(cop, 1)} units of heat per unit of electricity over a standard heating season. Cold-climate models do better at low temperatures; every heat pump loses capacity as the outdoor air gets colder.</p>
<p>The 30% federal credit for heat pumps under section 25C applied to improvements made through December 31, 2025, the ${h.src('irs_25c', 'IRS')} says, so a 2026 installation does not qualify. Utility and state programs remain the place to look for help with the price, and their terms change during the year.</p>
<h2>What it costs to run, against gas</h2>
<p>The average gas-heated home used ${h.num(gasUse, 1)} million Btu of gas for space heating in the ${h.src('eia_recs', 'Residential Energy Consumption Survey')} (2020). Burned in an ${h.num(E.gasFurnaceAfue * 100)}% furnace, that delivers about ${h.num(heat, 1)} million Btu of heat. Delivering the same heat with a minimum-rating heat pump takes ${h.num(kwh)} kWh, or ${h.usd(hpYear)} at the national electricity average, against ${h.usd(gasYear)} of gas at the national residential average for last winter. The mini calculator below lets you change the load, the rating and the price; the ${h.a('heat-pump-vs-furnace', 'full comparison')} uses your state's own gas, propane, oil and electricity prices.</p>
${h.mini('hpRunning', { place: 'U.S.', cents: usCents, heatMMBtu: heat, hspf2: E.heatPumpSplit.hspf2, btuPerKwh: K.P.btu.kwh })}
<h3>Labor and the installer you pick</h3>
<p>HVAC mechanics and installers earned a national mean of ${h.usd(hv.mean, 2)} an hour in ${h.wageRef.reference} (BLS), and the calculator moves the labor share to your state's wage. Sizing matters more than brand: ask for a load calculation rather than a match to the old furnace's size, and get the heat pump's capacity at 17°F in writing if you live where winters are cold.</p>`,
  faqs: [
    { q: 'How much does a heat pump cost to install in 2026?', a: `Federal data do not price heat pumps on their own. Built-in heating jobs, which include heat pumps, had a median of ${K.usd(he.typical)} and central air jobs ${K.usd(ac.typical)} in the 2023 American Housing Survey, in ${cpiMonth} dollars. A ducted heat pump replacing both a furnace and an AC usually costs more than either alone and less than both together.` },
    { q: 'Is a heat pump cheaper to run than a gas furnace?', a: `It depends on your state's prices. For the average gas-heated home's heat load, a minimum-efficiency heat pump would use about ${K.num(kwh)} kWh, ${K.usd(hpYear)} at the U.S. average electricity price, against about ${K.usd(gasYear)} of gas at last winter's national average. Where electricity is expensive and gas cheap, the furnace often wins on running cost.` },
    { q: 'What does HSPF2 7.5 mean for a heat pump?', a: `HSPF2 is the heat delivered over a standard season, in Btu, per watt-hour of electricity. ${K.num(E.heatPumpSplit.hspf2, 1)} is the federal minimum for split heat pumps under 10 CFR 430.32. Divided by ${K.num(K.P.btu.kwh)} Btu per kWh, it equals a seasonal COP of ${K.num(cop, 2)}: each kWh bought delivers a little more than two kWh of heat on average.` },
    { q: 'Can I still get the federal tax credit for a heat pump?', a: `No, not for a 2026 installation. The IRS states that the Energy Efficient Home Improvement Credit, which covered heat pumps at 30% up to an annual limit, applied to improvements made through December 31, 2025. Some utilities and states offer their own rebates; check your utility before you sign, since programs open and close during the year.` },
  ],
  related: ['heat-pump-vs-furnace', 'hvac-replacement-cost', 'electric-bill-calculator', 'water-heater-replacement-cost'],
  sources: ['census_ahs', 'ecfr_430_32', 'irs_25c', 'eia_recs', 'eia_btu', 'eia_gas', 'eia_epm', 'bls_oews'],
});
