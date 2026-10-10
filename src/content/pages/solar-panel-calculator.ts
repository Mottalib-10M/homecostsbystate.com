import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { systemKw, panels } from '../../lib/engine/solar';

const W = K.panelWatts;
const S = K.P.solar.pvwatts;
const rows = K.states
  .filter((s) => K.pv(s.slug))
  .map((s) => {
    const pv = K.pv(s.slug)!;
    const use = K.usage(s.slug).kwhMonth;
    const kw = systemKw(use * 12, pv.kwhPerKw);
    return { s, pv, use, kw, n: panels(kw, W), k1000: systemKw(1000 * 12, pv.kwhPerKw) };
  });
const bySun = [...rows].sort((a, b) => b.pv.kwhPerKw - a.pv.kwhPerKw);
const sunny = bySun[0];
const dim = bySun[bySun.length - 1];
const ex = rows.find((r) => r.s.slug === 'arizona') ?? sunny;
const extra = dim.pv.kwhPerKw > 0 ? sunny.pv.kwhPerKw / dim.pv.kwhPerKw - 1 : 0;
const half = systemKw(ex.use * 12 * 0.5, ex.pv.kwhPerKw);
const panelYear = (W / 1000) * ex.pv.kwhPerKw;
const usUse = K.usage('us').kwhMonth;
const medKw = K.P.solar.medianResidentialKw2023;

export default definePage({
  id: 'solar-panel-calculator',
  group: 'energy',
  order: 20,
  slug: 'solar-panel-calculator',
  nav: 'Solar panel calculator',
  card: 'How many kW and panels your electricity use needs, from local sun data',
  title: 'Solar Panel Calculator 2026: How Many Panels You Need',
  description: `Solar panel calculator 2026: an average ${ex.s.name} home using ${K.num(ex.use)} kWh a month needs about ${K.num(ex.kw, 1)} kW, ${K.num(ex.n)} panels of ${K.num(W)} W. Local sun data for each state, no ZIP.`,
  h1: 'How many solar panels do I need?',
  intro: 'Enter your monthly kWh and the share you want to cover: the system size and the panel count follow from your state’s sun.',
  resume: `An average ${ex.s.name} home, which used ${K.num(ex.use)} kWh a month in 2024, needs about ${K.num(ex.kw, 1)} kW of solar, or ${K.num(ex.n)} panels of ${K.num(W)} W, to produce all of its electricity over a year. The rule behind that answer fits on one line: yearly use divided by what one kilowatt of panels yields where you live. PVWatts, the model run by the National Laboratory of the Rockies, puts that yield at ${K.num(ex.pv.kwhPerKw)} kWh per kW per year in ${ex.pv.city}, for a south-facing roof tilted ${K.num(S.tilt)} degrees with ${K.num(S.losses)}% system losses. The same number swings by place: among the states loaded so far, ${sunny.s.name} reaches ${K.num(sunny.pv.kwhPerKw)} kWh per kW and ${dim.s.name} ${K.num(dim.pv.kwhPerKw)}, so covering identical use takes ${K.pct(extra, 0)} more panels in ${dim.s.name}. Panel wattage only changes the count; ${K.num(W)} W is the median rating installed in New York in 2025. Your own bill, with twelve months of kWh, is a better input than any state average.`,
  tool: 'solar-size',
  body: (h) => `
<h2>Three steps from your bill to a panel count</h2>
<p>The calculator takes the monthly kWh you type, multiplies by twelve and by the share you want covered, then divides by the yearly output of one kilowatt in your state. That gives kilowatts of DC capacity. Multiply by 1,000 and divide by the panel rating, round up, and you have the number of panels. With the defaults for ${ex.s.name}: ${h.num(ex.use)} kWh times twelve is ${h.num(ex.use * 12)} kWh a year; divided by ${h.num(ex.pv.kwhPerKw)}, that is ${h.num(ex.kw, 2)} kW; at ${h.num(W)} W per panel, ${h.num(ex.n)} panels.</p>
<p>The monthly default is the state's 2024 average from ${h.src('eia_861', 'EIA form 861')}. The national figure was ${h.num(usUse)} kWh a month, but homes vary far more than states do: an electric water heater, a pool pump or an electric car can double the number. Add up the twelve months on your utility account, because summer air conditioning and winter heating make any single month misleading.</p>
${h.table(['State', 'Sun data city', 'kWh per kW a year', 'Average use a month', 'kW for 100%', 'Panels'], rows.map((r) => [r.s.name, r.pv.source === 'pvwatts' ? r.pv.city : `${r.pv.city}*`, h.num(r.pv.kwhPerKw), `${h.num(r.use)} kWh`, h.num(r.kw, 1), h.num(r.n)]), `Average 2024 use (EIA), output of a fixed roof array at ${h.num(S.tilt)}° tilt facing south with ${h.num(S.losses)}% losses (PVWatts v8, or NASA POWER scaled to PVWatts where marked *), panels of ${h.num(W)} W.`, ['l', 'l', 'r', 'r', 'r', 'r'])}
<h2>What a kWh-per-kW figure already includes</h2>
<p>${h.src('nlr_pvwatts', 'PVWatts')}, the model of the National Laboratory of the Rockies, simulates a typical weather year from satellite data for one city per state, hour by hour, and reports what 1 kW of standard panels on a fixed roof mount delivers after ${h.num(S.losses)}% of losses for wiring, inverter conversion, soiling, mismatch and similar effects. Its free access allows only a few runs a day, so ${h.num(h.states.filter((x) => h.pv(x.slug)?.source === 'pvwatts').length)} states use it directly; the others use the yearly sunshine on a tilted roof from ${h.src('nasa_power', 'NASA POWER')}, multiplied by the performance ratio that PVWatts gives in the states computed both ways (${h.num(h.solarCalibration.performanceRatio, 3)}, within ${h.num(h.solarCalibration.maxError * 100, 0)}% of PVWatts in each of them). It does not know your roof. An array facing east or west, a lower or steeper pitch than ${h.num(S.tilt)} degrees, or a tree that shades the panels after 3 p.m. all cut output, and an installer's shade report replaces the state figure with one for your address.</p>
<p>Climate inside a state matters too. The sun data for ${ex.s.name} come from ${ex.pv.city}; a mountain town or a foggy coast in the same state can differ noticeably.</p>
<h3>One panel, one year</h3>
<p>A single ${h.num(W)} W panel in ${ex.pv.city} makes about ${h.num(panelYear)} kWh a year, roughly ${h.num(panelYear / 12)} kWh a month. That is the quickest way to translate a gap on your bill into panels: a monthly shortfall of 100 kWh needs about ${h.num(Math.ceil(100 / (panelYear / 12)))} more.</p>
<h2>Covering part of your use</h2>
<p>Many owners size below 100%. Covering half of ${ex.s.name}'s average use takes ${h.num(half, 1)} kW, ${h.num(panels(half, W))} panels. Roof space, budget and the way your utility credits power sent back to the grid all push in that direction: where exported kWh earn less than the retail price, the last panels of an oversized system pay back slowest. The ${h.a('solar-payback-calculator', 'payback calculator')} lets you set that export share and credit. A figure above 100% makes sense if you plan to add an electric car or a heat pump; the ${h.a('ev-charging-cost-calculator', 'EV charging calculator')} estimates what a car adds in kWh.</p>
<h3>Bigger panels, fewer of them</h3>
<p>Panel ratings change the count, not the system size. The median home system installed in 2023 was ${h.num(medKw, 1)} kW (${h.src('lbnl_tts_2024', 'Berkeley Lab')}): ${h.num(panels(medKw, 350))} panels at 350 W, ${h.num(panels(medKw, W))} at ${h.num(W)} W, ${h.num(panels(medKw, 500))} at 500 W. Higher-wattage panels are physically larger, so they help on a cramped roof only when their efficiency is higher too. Once you know the size, ${h.a('solar-panel-cost', 'the cost page')} prices it for your state.</p>`,
  faqs: [
    { q: 'How many solar panels does it take to run a house?', a: `It depends on use and sunshine, not on the house. An average ${ex.s.name} home at ${K.num(ex.use)} kWh a month needs about ${K.num(ex.n)} panels of ${K.num(W)} W to cover a full year, from PVWatts output of ${K.num(ex.pv.kwhPerKw)} kWh per kW in ${ex.pv.city}. Twelve months of your own kWh give a far better answer than a state average.` },
    { q: 'How many solar panels do I need for 1,000 kWh a month?', a: `About ${K.num(sunny.k1000, 1)} kW in ${sunny.s.name}, or ${K.num(panels(sunny.k1000, W))} panels of ${K.num(W)} W, and ${K.num(dim.k1000, 1)} kW in ${dim.s.name}, or ${K.num(panels(dim.k1000, W))} panels, using PVWatts output for a south-facing roof at ${K.num(S.tilt)} degrees. Shade, a poor orientation or a flat roof raise the count, so treat these as a floor.` },
    { q: 'How much electricity does one solar panel produce?', a: `A ${K.num(W)} W panel, the median size installed in New York in 2025, makes about ${K.num(panelYear)} kWh a year in ${ex.pv.city} and ${K.num((W / 1000) * dim.pv.kwhPerKw)} kWh in ${dim.pv.city}, according to PVWatts with ${K.num(S.losses)}% losses. Output is highest in long summer days and drops in winter, so monthly production follows the season.` },
    { q: 'Should I size solar for 100% of my electric bill?', a: `Only if your utility credits exported power close to the retail rate. Panels cover your use over a year, not hour by hour, so a 100% system exports at midday and buys back at night. Where the export credit is low, a smaller system that matches daytime use often pays back faster. Your utility's tariff page states the rule that applies.` },
    { q: 'Does square footage decide how many panels I need?', a: `Not directly. Two houses of the same size can use very different amounts of electricity depending on heating fuel, air conditioning, appliances and occupants. The average home in the country used ${K.num(usUse)} kWh a month in 2024, but your bills are the real input. Floor area mostly matters for how much roof the panels can use.` },
  ],
  related: ['solar-panel-cost', 'solar-payback-calculator', 'electric-bill-calculator', 'ev-charging-cost-calculator', 'roofing-calculator'],
  sources: ['nlr_pvwatts', 'nasa_power', 'eia_861', 'lbnl_tts_2024', 'nyserda_solar'],
});
