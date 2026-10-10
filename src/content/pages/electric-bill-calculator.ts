import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { bill } from '../../lib/engine/energy';

const period = K.energyMeta.electricityText;
const rows = K.states
  .map((s) => { const u = K.usage(s.slug); const c = K.elec(s.slug); return { s, u, c, now: bill(u.kwhMonth, c).month }; })
  .sort((a, b) => a.now - b.now);
const low = rows[0];
const high = rows[rows.length - 1];
const us = K.usage('us');
const usC = K.elec('us');
const usNow = bill(us.kwhMonth, usC);
const rise = usC / us.cents - 1;
const tx = rows.find((r) => r.s.slug === 'texas')!;
const useMost = [...rows].sort((a, b) => b.u.kwhMonth - a.u.kwhMonth)[0];
const useLeast = [...rows].sort((a, b) => a.u.kwhMonth - b.u.kwhMonth)[0];
const k1000 = bill(1000, usC);
const k2000 = bill(2000, usC);

export default definePage({
  id: 'electric-bill-calculator',
  group: 'energy',
  order: 60,
  slug: 'electric-bill-calculator',
  nav: 'Electric bill calculator',
  card: 'Your monthly bill from kWh and your state’s price, against the state average',
  title: 'Electric Bill Calculator 2026: Monthly Bill by State',
  description: `Electric bill calculator 2026: the average U.S. home using ${K.num(us.kwhMonth)} kWh a month pays about ${K.usd(usNow.month)} at ${K.cents(usC)} per kWh. Enter your kWh and state, no ZIP or phone.`,
  h1: 'Electric bill calculator',
  intro: 'Enter the kWh on your bill: the calculator prices them at your state’s 2026 average and sets the result beside the typical home there.',
  resume: `The average American home used ${K.num(us.kwhMonth)} kWh of electricity a month in 2024, and at the 2026 national average price of ${K.cents(usC)} per kWh that comes to about ${K.usd(usNow.month)} a month, or ${K.usd(usNow.year)} a year. The price rose ${K.pct(rise, 0)} from the ${K.cents(us.cents)} average of 2024, when the same use cost ${K.usd(us.bill)} a month. Your state changes both halves of the multiplication. With 2024 use and ${period} prices from the Energy Information Administration, the lowest typical bill is in ${low.s.name}, ${K.usd(low.now)} a month, and the highest in ${high.s.name}, ${K.usd(high.now)}. Use varies more than most people expect: ${useMost.s.name} homes averaged ${K.num(useMost.u.kwhMonth)} kWh a month, ${useLeast.s.name} homes ${K.num(useLeast.u.kwhMonth)}. Type the kWh printed on your own bill and the calculator returns the monthly and yearly cost at your state's average rate, with the gap to the typical 2024 bill there.`,
  tool: 'electric-bill',
  body: (h) => `
<h2>Two numbers make the bill</h2>
<p>The calculator multiplies the kWh you used by the average residential price in your state, then by twelve for the year. It opens on Texas, where the average home used ${h.num(tx.u.kwhMonth)} kWh a month in 2024 and the price in ${period} was ${h.cents(tx.c)}: ${h.usd(tx.now)} a month. The EIA price is total residential revenue divided by kWh sold, so customer charges, delivery and taxes collected through the bill are spread inside it. That makes it a fair average, and a poor guide to a tiered rate or a time-of-use plan, where the next kWh can cost much more or much less than the average. If your bill lists a price per kWh, type it in place of the state figure.</p>
<p>Use is the half you control. The 2024 state averages come from ${h.src('eia_861', 'EIA form 861')}, which collects sales, customers and revenue from every utility. Homes in the South use the most, because air conditioning runs for months and many houses heat with electricity; homes in the Northeast and the West Coast use less but often pay more per kWh. At the national price, 1,000 kWh a month costs ${h.usd(k1000.month)} and 2,000 kWh costs ${h.usd(k2000.month)}.</p>
${h.table(['State', `Price, ${period}`, 'Use a month, 2024', 'Average bill, 2024', 'Same use at 2026 price'], [...rows.map((r) => [r.s.name, h.cents(r.c), `${h.num(r.u.kwhMonth)} kWh`, h.usd(r.u.bill), h.usd(r.now)]), ['<strong>United States</strong>', h.cents(usC), `${h.num(us.kwhMonth)} kWh`, h.usd(us.bill), h.usd(usNow.month)]], `Sorted by the last column. Prices: EIA Electric Power Monthly, table 5.6.B. Use and 2024 bill: EIA Electric Sales, Revenue and Average Price 2024, table 5A.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>Reading the gap with the state average</h2>
<p>Below the result, the calculator shows how far your estimate sits from the typical 2024 bill in your state. A large positive gap usually points to one of a few loads: electric heat or a heat pump in winter, central air in summer, an electric water heater, a pool pump, a well pump, or an electric car charged at home. A bill far under the average often means gas heat and gas cooking, a small apartment, or rooftop solar netting out part of the use.</p>
<h3>Seasons make single months misleading</h3>
<p>One month says little. In hot states summer bills can run far above spring ones, and electrically heated homes in cold states see the same jump in January. Add the twelve monthly kWh figures from your account and divide by twelve before you enter them, or enter your highest month to see the worst case. Many utilities offer budget billing that spreads the year evenly; it changes when you pay, not what you pay.</p>
<h2>Bringing the number down</h2>
<p>Find the big loads first. The ${h.a('electricity-cost-calculator', 'appliance cost calculator')} prices any device from its watts and hours, which shows quickly whether the old freezer in the garage or the space heater under the desk deserves attention. Heating is usually the largest single item in a home that heats with electricity; the ${h.a('heat-pump-vs-furnace', 'heating comparison')} sets a heat pump against baseboard heat and fuel. If you are thinking about panels, the ${h.a('solar-panel-calculator', 'solar calculator')} turns this same kWh figure into a system size.</p>
<p>Rate plans matter as well. Some utilities offer time-of-use or seasonal plans, and in states with retail choice a supplier can sell the energy part of the bill. Terms and fees differ, so compare the total price per kWh on a full year of your own use rather than a teaser rate.</p>`,
  faqs: [
    { q: 'What is the average electric bill in 2026?', a: `At the national average price of ${K.cents(usC)} per kWh for ${period} and the 2024 average use of ${K.num(us.kwhMonth)} kWh a month, a typical home pays about ${K.usd(usNow.month)} a month. State figures run from ${K.usd(low.now)} in ${low.s.name} to ${K.usd(high.now)} in ${high.s.name}, combining each state's price with its average use from EIA.` },
    { q: 'How much is an electric bill for 1,000 kWh?', a: `At the U.S. average of ${K.cents(usC)} per kWh in ${period}, 1,000 kWh costs about ${K.usd(k1000.month)}. In ${K.state('texas').name}, at ${K.cents(K.elec('texas'))}, it costs ${K.usd(bill(1000, K.elec('texas')).month)}; in California, at ${K.cents(K.elec('california'))}, it costs ${K.usd(bill(1000, K.elec('california')).month)}. Tiered or time-of-use rates move the real figure up or down, so check the rate printed on your own bill.` },
    { q: 'Why is my electric bill so high this month?', a: `Weather is the usual reason: air conditioning in summer and electric heat in winter can double use within weeks. Compare this month's kWh with the same month last year on your account; if use is flat, the rate or a fixed charge changed. The U.S. average price rose ${K.pct(rise, 0)} between 2024 and ${period}, according to EIA.` },
    { q: 'How many kWh does a house use per month?', a: `The average U.S. home used ${K.num(us.kwhMonth)} kWh a month in 2024, according to EIA. State averages ranged from ${K.num(useLeast.u.kwhMonth)} kWh in ${useLeast.s.name} to ${K.num(useMost.u.kwhMonth)} kWh in ${useMost.s.name}. Heating fuel, air conditioning, house size and the number of people at home explain most of the difference between two households.` },
  ],
  related: ['electricity-cost-calculator', 'ev-charging-cost-calculator', 'heat-pump-vs-furnace', 'solar-panel-calculator', 'solar-payback-calculator'],
  sources: ['eia_epm', 'eia_861', 'eia_recs'],
});
