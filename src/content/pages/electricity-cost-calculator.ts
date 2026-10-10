import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { appliance } from '../../lib/engine/energy';

const byPrice = [...K.states].sort((a, b) => K.elec(a.slug) - K.elec(b.slug));
const low = byPrice[0];
const high = byPrice[byPrice.length - 1];
const usC = K.elec('us');
const tx = appliance(1500, 4, 30, K.elec('texas'));
const lowRun = appliance(1500, 4, 30, K.elec(low.slug));
const highRun = appliance(1500, 4, 30, K.elec(high.slug));
const watts = [10, 100, 500, 1000, 1500, 3000, 5000];
const period = K.energyMeta.electricityText;
const lastYearUs = K.usage('us').cents;
const cheap5 = byPrice.slice(0, 5).map((s) => s.name);
const dear5 = byPrice.slice(-5).reverse().map((s) => s.name);
const standby = appliance(10, 24, 30, usC);
const halfDuty = appliance(1500, 2, 30, usC);

export default definePage({
  id: 'electricity-cost-calculator',
  group: 'energy',
  order: 50,
  slug: 'electricity-cost-calculator',
  nav: 'Electricity cost calculator',
  card: 'What any appliance costs to run per hour, month and year in your state',
  title: 'Electricity Cost Calculator 2026: Appliance Cost by State',
  description: `Electricity cost calculator 2026: 1,500 W used 4 hours a day costs ${K.usd(tx.month, 2)} a month in Texas at ${K.cents(K.elec('texas'))} per kWh. Price any appliance in any state, no ZIP asked.`,
  h1: 'Electricity cost calculator',
  intro: 'Type the watts on the rating plate and the hours of use: the cost per hour, month and year shows at your state’s average price.',
  resume: `Running a 1,500-watt appliance four hours a day costs ${K.usd(tx.month, 2)} a month in Texas, where homes paid an average ${K.cents(K.elec('texas'))} per kWh in ${period}, and ${K.usd(highRun.month, 2)} in ${high.name}, the most expensive state at ${K.cents(K.elec(high.slug))}. The arithmetic is short: watts times hours of use, divided by 1,000, gives kilowatt-hours, and kilowatt-hours times the price per kWh gives dollars. Those four hours a day for 30 days come to ${K.num(tx.kwhMonth)} kWh. The calculator fills in your state's average residential price from the Energy Information Administration, which divides what utilities billed households by the electricity they sold, so delivery charges and fixed monthly fees are spread into the figure. The national average was ${K.cents(usC)}, against ${K.cents(lastYearUs)} for 2024 as a whole. Appliances with a thermostat or a compressor draw their full rated power only part of the time, so their real cost is usually lower than the label suggests.`,
  tool: 'electricity',
  body: (h) => `
<h2>Watts, kilowatt-hours and the price on your bill</h2>
<p>A watt measures how fast a device draws power at a given moment. A kilowatt-hour is 1,000 watts drawn for one hour, and it is the unit your utility bills. A 1,500 W device running for one hour uses 1.5 kWh; a 10 W device would need 150 hours to use the same amount. Once you have kWh, the bill follows from your price. At the U.S. average of ${h.cents(usC)}, each kWh costs about ${h.usd(usC / 100, 2)}, so 1,000 W for one hour costs the same.</p>
<p>The calculator multiplies the watts you enter by hours per day and days per month, divides by 1,000, and multiplies by the price. With its defaults, 1,500 W for 4 hours over 30 days in Texas, that is ${h.num(tx.kwhMonth)} kWh and ${h.usd(tx.month, 2)} a month, ${h.usd(tx.year)} a year, or ${h.usd(tx.perHour, 2)} per hour of use.</p>
${h.table(['Power', `Per hour, ${low.name}`, 'Per hour, U.S. average', `Per hour, ${high.name}`, 'Per month at 4 h a day, U.S.'], watts.map((w) => [`${h.num(w)} W`, h.usd(appliance(w, 1, 1, K.elec(low.slug)).perHour, 2), h.usd(appliance(w, 1, 1, usC).perHour, 2), h.usd(appliance(w, 1, 1, K.elec(high.slug)).perHour, 2), h.usd(appliance(w, 4, 30, usC).month, 2)]), `Average residential prices, ${period} (EIA Electric Power Monthly, table 5.6.B). Small amounts round to the nearest cent.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>Finding the real wattage</h2>
<p>The rating plate, usually on the back or bottom of the device or inside the door, gives either watts or volts and amps. Multiply volts by amps when watts are missing: a plate reading 120 V and 10 A means a maximum of 1,200 W. That maximum is the ceiling, not the average. A refrigerator, a window air conditioner, a space heater with a thermostat or an electric oven cycles on and off to hold a temperature, so over an hour it may draw full power for twenty minutes or for fifty. A plug-in energy meter measures actual kWh over a few days and removes the guesswork.</p>
<h3>Duty cycle in practice</h3>
<p>If a 1,500 W heater holds a room at temperature by running half the time, enter 2 hours instead of 4: the monthly cost at the U.S. average falls from ${h.usd(appliance(1500, 4, 30, usC).month, 2)} to ${h.usd(halfDuty.month, 2)}. Devices that never switch off work the other way. A 10 W standby draw around the clock adds ${h.num(standby.kwhMonth, 1)} kWh and ${h.usd(standby.month, 2)} a month, small alone, noticeable when a home has a dozen of them.</p>
<h2>Where a kWh costs the most and the least</h2>
<p>The five cheapest states in ${period} were ${h.listOf(cheap5)}; the five most expensive were ${h.listOf(dear5)}, according to the ${h.src('eia_epm', 'EIA Electric Power Monthly')}. The same 1,500 W used four hours a day costs ${h.usd(lowRun.month, 2)} a month in ${low.name} and ${h.usd(highRun.month, 2)} in ${high.name}. The calculator lets you overwrite the state average with the rate on your own bill, which is the better choice if your utility uses tiers, time-of-use pricing or a large fixed customer charge.</p>
<h3>Why your rate may differ from the state average</h3>
<p>The EIA average blends every residential customer in the state, cities and rural cooperatives alike, and spreads fixed monthly fees into the per-kWh price. A household that uses little electricity sees those fees weigh more per kWh; a large user sees them weigh less. On a time-of-use plan, the same appliance costs more in the late afternoon than overnight, so shifting a dryer or a dishwasher can matter more than replacing it. To see how all your devices add up to a month, the ${h.a('electric-bill-calculator', 'electric bill calculator')} starts from total kWh, and the ${h.a('ev-charging-cost-calculator', 'EV charging calculator')} handles the largest new load many homes add.</p>`,
  faqs: [
    { q: 'How much does it cost to run a 1,500 watt heater for 24 hours?', a: `Running nonstop for 24 hours, 1,500 W uses 36 kWh. At the U.S. average of ${K.cents(usC)} per kWh in ${period}, that costs ${K.usd(appliance(1500, 24, 1, usC).month, 2)}, from ${K.usd(appliance(1500, 24, 1, K.elec(low.slug)).month, 2)} in ${low.name} to ${K.usd(appliance(1500, 24, 1, K.elec(high.slug)).month, 2)} in ${high.name}. A heater with a thermostat cycles off once the room is warm, so the real cost is often lower.` },
    { q: 'How do I calculate the cost of electricity per kWh for an appliance?', a: `Multiply the appliance's watts by the hours it runs, divide by 1,000 to get kWh, then multiply by your price per kWh. A 100 W device used 10 hours makes 1 kWh, about ${K.usd(usC / 100, 2)} at the U.S. average of ${K.cents(usC)}. Use the price per kWh on your bill, including delivery charges, for the closest result.` },
    { q: 'How much does 1 kWh of electricity cost in 2026?', a: `American homes paid an average of ${K.cents(usC)} per kWh from ${period}, according to EIA, up from ${K.cents(lastYearUs)} over 2024. State averages ran from ${K.cents(K.elec(low.slug))} in ${low.name} to ${K.cents(K.elec(high.slug))} in ${high.name}. These averages include fixed charges spread over the kWh sold, so your marginal rate may be lower or higher.` },
    { q: 'Does unplugging appliances save money?', a: `A little. A device drawing 10 W on standby around the clock uses ${K.num(standby.kwhMonth, 1)} kWh a month, about ${K.usd(standby.month, 2)} at the U.S. average price, or ${K.usd(standby.year, 2)} a year. Ten such devices add up to real money, while many small chargers draw much less. A plug-in meter shows the standby draw of each one.` },
  ],
  related: ['electric-bill-calculator', 'ev-charging-cost-calculator', 'heat-pump-vs-furnace', 'solar-panel-calculator'],
  sources: ['eia_epm', 'eia_861', 'eia_btu'],
});
