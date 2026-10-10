import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { ev } from '../../lib/engine/energy';

const cars = K.P.ev.kwhPer100mi as Record<string, number>;
const car = K.P.ev.default;
const eff = cars[car];
const gas = K.usEnergy.gasoline;
const week = K.day(K.energyMeta.gasoline);
const mpg = 25;
const miles = 1000;
const run = (cents: number, e = eff, m = miles) => ev({ milesPerMonth: m, kwhPer100mi: e, lossPct: 0, centsPerKwh: cents, mpg, gasPerGal: gas });
const usC = K.elec('us');
const us = run(usC);
const tx = run(K.elec('texas'));
const byPrice = [...K.states].sort((a, b) => K.elec(a.slug) - K.elec(b.slug));
const low = byPrice[0];
const high = byPrice[byPrice.length - 1];
const lowR = run(K.elec(low.slug));
const highR = run(K.elec(high.slug));
const pickRows = [...byPrice.slice(0, 4), ...byPrice.slice(-4)];
/** Gasoline price at which the gas car costs the same per mile as home charging. */
const evenGas = (r: ReturnType<typeof run>) => (r.evMonth * mpg) / miles;
const carNames = Object.keys(cars).sort((a, b) => cars[a] - cars[b]);
const yearMiles = 12 * miles;
const allBeat = byPrice.every((s) => run(K.elec(s.slug)).evMonth < us.gasMonth);
const highEvenMpg = highR.evMonth > 0 ? (miles * gas) / highR.evMonth : 0;

export default definePage({
  id: 'ev-charging-cost-calculator',
  group: 'energy',
  order: 70,
  slug: 'ev-charging-cost-calculator',
  nav: 'EV charging cost calculator',
  card: 'Home charging cost per month and per mile, against the gasoline it replaces',
  title: 'EV Charging Cost Calculator 2026: Home Charging by State',
  description: `EV charging cost calculator 2026: 1,000 miles a month costs about ${K.usd(us.evMonth)} at home at the U.S. average power price, against ${K.usd(us.gasMonth)} of gas at 25 mpg. Rates by state.`,
  h1: 'EV charging cost calculator',
  intro: 'Pick your state and your car: the cost of charging at home per month and per mile appears next to the gasoline it replaces.',
  resume: `Charging an electric car at home for 1,000 miles a month costs about ${K.usd(us.evMonth)} at the 2026 U.S. average electricity price of ${K.cents(usC)} per kWh, or ${K.num(us.centsPerMile, 1)} cents a mile, for a ${car} rated at ${K.num(eff)} kWh per 100 miles. A 25 mpg gasoline car driving the same distance burns ${K.usd(us.gasMonth)} of fuel at ${K.usd(gas, 2)} a gallon, the U.S. regular price for the week of ${week}, so home charging saves about ${K.usd(us.savingYear)} a year. The state you live in moves the electric side a lot: the same driving costs ${K.usd(lowR.evMonth)} a month in ${low.name} and ${K.usd(highR.evMonth)} in ${high.name}. The calculator multiplies miles by the car's EPA consumption from fueleconomy.gov, then by your state's average residential price from EIA for ${K.energyMeta.electricityText}. It adds nothing for charging losses beyond the rating, and it prices home charging only; public fast chargers bill on their own tariffs, often well above home rates.`,
  tool: 'ev',
  body: (h) => `
<h2>From miles to kWh to dollars</h2>
<p>An EV's efficiency is rated in kWh per 100 miles, the figure ${h.src('fe_side_by_side', 'fueleconomy.gov')} publishes for each model. Multiply your monthly miles by that rating and divide by 100: at ${h.num(miles)} miles and ${h.num(eff)} kWh per 100 miles, the car takes ${h.num(us.kwhWall)} kWh a month. Multiply by the price per kWh and you have the cost. The calculator opens on Texas, where ${h.cents(K.elec('texas'))} per kWh gives ${h.usd(tx.evMonth)} a month and ${h.num(tx.centsPerMile, 1)} cents a mile.</p>
<p>On the gasoline side, miles divided by mpg gives gallons, and gallons times the pump price gives dollars. The default 25 mpg is a placeholder for the car the EV would replace; type the figure of your own car, from its window sticker or your fill-up log, and the weekly gasoline price where you live if it differs from the national figure from ${h.src('eia_gasoline', 'EIA')}.</p>
${h.table(['State', 'Price per kWh', 'Per month', 'Per mile', 'Gas price that would match'], [...pickRows.map((s) => { const r = run(K.elec(s.slug)); return [s.name, h.cents(K.elec(s.slug)), h.usd(r.evMonth), `${h.num(r.centsPerMile, 1)}¢`, h.usd(evenGas(r), 2)]; }), ['<strong>United States</strong>', h.cents(usC), h.usd(us.evMonth), `${h.num(us.centsPerMile, 1)}¢`, h.usd(evenGas(us), 2)]], `${car} at ${h.num(eff)} kWh per 100 miles, ${h.num(miles)} miles a month, the four cheapest and four most expensive states for electricity, ${K.energyMeta.electricityText}. Last column: the gasoline price at which a ${mpg} mpg car costs the same per mile.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>Three EPA ratings, three monthly costs</h2>
<p>The calculator lists three 2026 models with their ratings: ${h.listOf(carNames.map((n) => `the ${n} at ${h.num(cars[n])} kWh per 100 miles`))}. At the national price and ${h.num(miles)} miles, those ratings mean ${h.listOf(carNames.map((n) => h.usd(run(usC, cars[n]).evMonth)))} a month. For ${h.num(yearMiles)} miles a year the difference between the most and least efficient of the three is ${h.usd((run(usC, cars[carNames[carNames.length - 1]]).evMonth - run(usC, cars[carNames[0]]).evMonth) * 12)}. Any other car works too: type its rating in the consumption field.</p>
<h3>Why real use runs above the rating</h3>
<p>Ratings come from standard test cycles. Winter heating of the cabin and battery, sustained highway speeds, roof racks, large wheels and short trips in the cold all raise consumption, sometimes sharply. If your car shows its own lifetime kWh per 100 miles, or miles per kWh (divide 100 by that number), use it instead of the label. The calculator applies no extra charging loss on top of what you enter, so a measured figure from the wall gives the truest result.</p>
<h2>When gasoline would win</h2>
<p>${allBeat ? `Home charging beats a ${h.num(mpg)} mpg car in every state at today's prices.` : `Home charging does not beat a ${h.num(mpg)} mpg car in every state at today's prices.`} In ${high.name}, where power is dearest at ${h.cents(K.elec(high.slug))}, a gas car would need about ${h.num(highEvenMpg)} mpg to match the EV's cost per mile with gasoline at ${h.usd(gas, 2)}. The comparison tilts against the EV mainly when most charging happens at public fast chargers, whose prices per kWh are set by each network and can come close to gasoline per mile.</p>
<h3>Home charging setup and rates</h3>
<p>A standard outlet adds a few miles of range per hour, enough for short commutes; a 240-volt charger fills most batteries overnight. The cost of installing one depends on the panel and wiring and is not part of this calculator. Some utilities sell EV or time-of-use rates with cheap overnight power; if yours does, enter that off-peak price in place of the state average. The ${h.a('electric-bill-calculator', 'electric bill calculator')} shows what the extra ${h.num(us.kwhWall)} kWh do to a whole monthly bill, and the ${h.a('solar-panel-calculator', 'solar panel calculator')} can size panels with the car included.</p>`,
  faqs: [
    { q: 'How much does it cost to charge an electric car at home per month?', a: `For 1,000 miles a month in a car rated ${K.num(eff)} kWh per 100 miles, about ${K.usd(us.evMonth)} at the U.S. average of ${K.cents(usC)} per kWh in ${K.energyMeta.electricityText}. The same driving costs ${K.usd(lowR.evMonth)} in ${low.name} and ${K.usd(highR.evMonth)} in ${high.name}. A time-of-use plan with cheap overnight power can lower your own figure.` },
    { q: 'Is charging an EV cheaper than buying gas?', a: `${allBeat ? 'At home, yes, in every state at current prices.' : 'At home, in most states at current prices.'} A 25 mpg car costs ${K.num((gas / mpg) * 100, 1)} cents a mile with gasoline at ${K.usd(gas, 2)}, the U.S. average for the week of ${week}. Home charging of a ${K.num(eff)} kWh per 100 miles EV costs ${K.num(us.centsPerMile, 1)} cents nationally and ${K.num(highR.centsPerMile, 1)} cents in ${high.name}, the dearest state.` },
    { q: 'How many kWh does it take to drive 100 miles in an EV?', a: `The EPA ratings on fueleconomy.gov for three 2026 models run from ${K.num(cars[carNames[0]])} kWh per 100 miles for the ${carNames[0]} to ${K.num(cars[carNames[carNames.length - 1]])} kWh for the ${carNames[carNames.length - 1]}. Cold weather and highway speed raise real consumption, so many drivers see more than the label in winter.` },
    { q: 'How much will an EV add to my electric bill?', a: `Driving 1,000 miles a month in a car rated ${K.num(eff)} kWh per 100 miles adds about ${K.num(us.kwhWall)} kWh, roughly ${K.pct(us.kwhWall / K.usage('us').kwhMonth, 0)} more than the average home's ${K.num(K.usage('us').kwhMonth)} kWh in 2024. At the U.S. average price, that is ${K.usd(us.evMonth)} more each month, or ${K.usd(us.evYear)} a year. A tiered rate can make the added kWh cost more than the average.` },
  ],
  related: ['electric-bill-calculator', 'electricity-cost-calculator', 'solar-panel-calculator', 'solar-payback-calculator'],
  sources: ['fe_side_by_side', 'eia_epm', 'eia_gasoline', 'eia_861'],
});
