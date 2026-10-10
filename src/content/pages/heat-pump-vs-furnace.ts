import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { heatingCosts, copFromHspf2 } from '../../lib/engine/energy';

const E = K.P.efficiency;
const B = K.P.btu;
const hspf = E.heatPumpSplit.hspf2;
const afue = E.gasFurnaceAfue;
const cop = copFromHspf2(hspf, B.kwh);
const mmbtuPerMcf = (B.gasCuFt * 1000) / 1e6;
/** Electricity price (cents/kWh) at which a heat pump and a furnace cost the same per unit of heat. */
const evenGas = (perMcf: number, eff: number) => ((perMcf / mmbtuPerMcf / eff) * B.kwh * cop) / 1e4;
const evenPropane = (perGal: number, eff: number) => ((perGal / (B.propaneGal / 1e6) / eff) * B.kwh * cop) / 1e4;
const run = (slug: string) => {
  const heat = K.recs(slug, 'gas').value * afue;
  return {
    heat,
    c: heatingCosts({ heatMMBtu: heat, afue, hspf2: hspf, btu: B, prices: { gasPerMcf: K.gas(slug) ?? K.usEnergy.gas, propanePerGal: K.propane(slug) ?? K.usEnergy.propane, oilPerGal: K.oil(slug) ?? K.usEnergy.oil, centsPerKwh: K.elec(slug) } }),
  };
};
const withGas = K.states.filter((s) => K.gas(s.slug) != null);
const ranked = withGas.map((s) => ({ s, r: run(s.slug) })).map((x) => ({ ...x, ratio: x.r.c.heatPump.cost / x.r.c.gas!.cost })).sort((a, b) => a.ratio - b.ratio);
const hpWins = ranked.filter((x) => x.ratio < 1);
const best = ranked[0];
const worst = ranked[ranked.length - 1];
const mid = ranked[Math.floor(ranked.length / 2)];
const pickSlugs = [...new Set([best.s.slug, 'ohio', mid.s.slug, 'new-york', worst.s.slug])];
const usEven = evenGas(K.usEnergy.gas, afue);
const usEven95 = evenGas(K.usEnergy.gas, E.gasFurnaceAfueFuture);
const usEvenPropane = evenPropane(K.usEnergy.propane, afue);
const usCents = K.elec('us');
const propaneStates = K.states.filter((s) => K.propane(s.slug) != null);
const hpBeatsPropane = propaneStates.filter((s) => K.elec(s.slug) < evenPropane(K.propane(s.slug)!, afue));
const propaneShare = hpBeatsPropane.length === propaneStates.length ? `all ${K.num(propaneStates.length)}` : `${K.num(hpBeatsPropane.length)} of the ${K.num(propaneStates.length)}`;
const oh = run('ohio');
const ohTherms = Math.round(K.recs('ohio', 'gas').value * 10);
const futureDay = K.day(E.gasFurnaceFutureDate);

export default definePage({
  id: 'heat-pump-vs-furnace',
  group: 'energy',
  order: 40,
  slug: 'heat-pump-vs-furnace',
  nav: 'Heat pump vs furnace',
  card: 'Yearly heating bill with gas, propane, oil or a heat pump at your state’s prices',
  title: 'Heat Pump vs Furnace 2026: Heating Cost by Fuel and State',
  description: `Heat pump vs furnace in 2026: a minimum heat pump beats an 80% gas furnace when power costs under ${K.cents(usEven)} a kWh at U.S. gas prices. Compare yours by state.`,
  h1: 'Heat pump vs furnace: which costs less to run?',
  intro: 'Pick your state and your current fuel: the same winter of heat is priced with gas, propane, oil, a heat pump and baseboard heat.',
  resume: `A heat pump at the federal minimum of ${K.num(hspf, 1)} HSPF2 heats more cheaply than an ${K.num(afue * 100)}% gas furnace wherever electricity costs less than about ${K.cents(usEven)} per kWh, at the U.S. average residential gas price of last winter, ${K.usd(K.usEnergy.gas, 2)} per thousand cubic feet. The national average electricity price is ${K.cents(usCents)}, so in the typical state gas still wins on running cost, but the heat pump comes out ahead in ${K.num(hpWins.length)} of the ${K.num(withGas.length)} states where EIA publishes a winter gas price. Against propane the picture flips: the break-even electricity price climbs to ${K.cents(usEvenPropane)} at the national propane average, and a minimum heat pump undercuts a propane furnace in ${propaneShare} states with a propane price. Oil and baseboard heat are usually the costliest. The calculator prices the same delivered heat with every system, using your state's EIA prices and the space-heating use RECS 2020 measured in your Census division.`,
  tool: 'heating-compare',
  body: (h) => `
<h2>Same heat, five price tags</h2>
<p>The comparison only works if each system delivers the same amount of heat. The calculator starts from what you burn or buy today, by default the average space-heating use that the ${h.src('eia_recs', 'Residential Energy Consumption Survey 2020')} found in your division, and multiplies it by your system's efficiency to get the heat that actually reached the rooms. In Ohio, the default state, the gas default is ${h.num(ohTherms)} therms a year; at ${h.num(afue * 100)}% AFUE that delivers ${h.num(oh.heat, 1)} million Btu. Then it asks what each alternative would spend to supply that heat: a gas, propane or oil furnace at ${h.num(afue * 100)}% efficiency, a heat pump at the HSPF2 rating you set, and electric resistance at 100%.</p>
<p>Fuel contents follow ${h.src('eia_btu', 'EIA conversion factors')}: ${h.num(B.kwh)} Btu per kWh, ${h.num(B.gasCuFt)} per cubic foot of gas, ${h.num(B.propaneGal)} per gallon of propane and ${h.num(B.oilGal)} per gallon of heating oil. A heat pump's HSPF2 divided by 3.412 gives its seasonal coefficient of performance: ${h.num(cop, 2)} at the minimum, so each kWh bought moves a little over two kWh of heat indoors.</p>
${h.table(['State', 'Gas furnace', 'Propane furnace', 'Oil furnace', 'Heat pump', 'Baseboard'], pickSlugs.map((slug) => { const r = run(slug).c; return [K.state(slug).name, h.usd(r.gas!.cost), h.usd(r.propane!.cost), h.usd(r.oil!.cost), h.usd(r.heatPump.cost), h.usd(r.resistance.cost)]; }), `Yearly cost of the heat an average gas-heated home in each division uses (RECS 2020 × ${h.num(afue * 100)}% AFUE), heat pump at HSPF2 ${h.num(hspf, 1)}. Electricity ${K.energyMeta.electricityText}; fuels ${K.energyMeta.gas} (EIA). Where EIA publishes no state fuel price, the U.S. average is used, as in the calculator.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>The break-even electricity price</h2>
<p>Every comparison boils down to one ratio: the price of a kWh against the price of fuel, adjusted for efficiency. At the national gas average, a ${h.num(hspf, 1)} HSPF2 heat pump matches an ${h.num(afue * 100)}% furnace at ${h.cents(usEven)} per kWh. Against a ${h.num(E.gasFurnaceAfueFuture * 100)}% condensing furnace the bar drops to ${h.cents(usEven95)}, because the furnace wastes less. Against propane it rises to ${h.cents(usEvenPropane)}. Your utility bill shows your own rates; if they differ from the state average, type them into the calculator.</p>
<p>The spread between states is wide. The heat pump does best against gas in ${best.s.name}, where it costs ${h.pct(best.ratio, 0)} of the gas bill, and worst in ${worst.s.name}, where it costs ${h.pct(worst.ratio, 0)}, driven by a ${h.cents(K.elec(worst.s.slug))} electricity price against gas at ${h.usd(K.gas(worst.s.slug)!, 2)} per thousand cubic feet.</p>
<h3>Cold weather and the rating</h3>
<p>HSPF2 is a seasonal average for a standard climate. In a long, very cold winter a heat pump delivers less heat per kWh, and many rely on resistance strips when the outdoor temperature falls far enough. If your winters are harsh, use a lower HSPF2 in the calculator than the label shows, or ask the installer for the model's capacity and efficiency at low temperatures. In mild climates the real efficiency can beat the rating.</p>
<h2>Rules that shape the choice in 2026</h2>
<p>Under ${h.src('ecfr_430_32', '10 CFR 430.32')}, a new split heat pump must reach ${h.num(E.heatPumpSplit.seer2, 1)} SEER2 and ${h.num(hspf, 1)} HSPF2. A new non-weatherized gas furnace must reach ${h.num(afue * 100)}% AFUE today; the minimum moves to ${h.num(E.gasFurnaceAfueFuture * 100)}% on ${futureDay}. That later rule does not ban furnaces, but it ends the cheapest non-condensing models and their simple venting.</p>
<p>The federal 30% credit for heat pumps and efficient furnaces covered improvements made through December 31, 2025, the ${h.src('irs_25c', 'IRS')} says, so it plays no part in a 2026 decision. Utility rebates exist in places and change during the year. A heat pump also replaces the air conditioner, which a furnace does not, so price the pair: ${h.a('heat-pump-cost', 'heat pump installation')} and ${h.a('hvac-replacement-cost', 'furnace and AC replacement')} each have their own page.</p>`,
  faqs: [
    { q: 'At what electricity price does a heat pump beat a gas furnace?', a: `At last winter's U.S. average gas price of ${K.usd(K.usEnergy.gas, 2)} per thousand cubic feet, a heat pump at the federal minimum of ${K.num(hspf, 1)} HSPF2 matches an ${K.num(afue * 100)}% furnace at about ${K.cents(usEven)} per kWh. Below that price the heat pump is cheaper to run; against a ${K.num(E.gasFurnaceAfueFuture * 100)}% furnace the threshold falls to ${K.cents(usEven95)}.` },
    { q: 'Is a heat pump cheaper than propane heat?', a: `Usually, yes. At the national propane average of ${K.usd(K.usEnergy.propane, 2)} a gallon, a minimum heat pump beats an ${K.num(afue * 100)}% propane furnace whenever electricity costs under ${K.cents(usEvenPropane)} per kWh. That held in ${propaneShare} states where EIA published a winter propane price, based on each state's average electricity rate.` },
    { q: 'Will gas furnaces be banned in 2028?', a: `No. The federal standard in 10 CFR 430.32 raises the minimum efficiency of new non-weatherized gas furnaces from ${K.num(afue * 100)}% to ${K.num(E.gasFurnaceAfueFuture * 100)}% AFUE on ${futureDay}. Furnaces remain on sale; the cheapest non-condensing models drop out. Condensing furnaces need a drain and plastic venting, which can add to installation work in some older homes.` },
    { q: 'How much does it cost to heat a house with baseboard heaters?', a: `Electric resistance turns one kWh into one kWh of heat, so it costs about ${K.num(cop, 1)} times as much as a minimum heat pump for the same warmth. For the heat an average gas-heated Ohio home uses, baseboard heat would cost ${K.usd(oh.c.resistance.cost)} a year at Ohio's average electricity price, against ${K.usd(oh.c.heatPump.cost)} with a heat pump.` },
    { q: 'Should I replace my oil furnace with a heat pump?', a: `On running cost, often yes. At the U.S. average heating oil price of ${K.usd(K.usEnergy.oil, 2)} a gallon, oil heat costs more than gas or a heat pump in most states shown above. Oil homes cluster in the Northeast, where electricity is also expensive, so run your own state in the calculator and get a quote for the installation before deciding.` },
  ],
  related: ['heat-pump-cost', 'hvac-replacement-cost', 'electric-bill-calculator', 'electricity-cost-calculator', 'water-heater-replacement-cost'],
  sources: ['eia_recs', 'eia_btu', 'eia_gas', 'eia_heating_fuels', 'eia_epm', 'ecfr_430_32', 'irs_25c'],
});
