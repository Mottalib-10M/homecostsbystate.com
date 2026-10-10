import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { payback } from '../../lib/engine/solar';

const kw = K.P.solar.medianResidentialKw2023;
const ratio = K.reportedToQuote();
const credit = K.day(K.P.solar.residentialCreditEnded);
const rows = K.states
  .filter((s) => K.pv(s.slug))
  .map((s) => {
    const pv = K.pv(s.slug)!;
    const q = K.solarQuote(s.slug);
    const cents = K.elec(s.slug);
    const cost = Math.round(kw * 1000 * q.perW);
    const base = payback({ cost, kw, kwhPerKw: pv.kwhPerKw, centsPerKwh: cents, exportShare: 0, exportCents: cents });
    const paid = payback({ cost: cost * ratio, kw, kwhPerKw: pv.kwhPerKw, centsPerKwh: cents, exportShare: 0, exportCents: cents });
    return { s, pv, q, cents, cost, base, paid };
  })
  .sort((a, b) => a.base.years - b.base.years);
const fast = rows[0];
const slow = rows[rows.length - 1];
const ex = rows.find((r) => r.q.scope === 'state' && r !== fast) ?? fast;
const split = payback({ cost: ex.cost, kw, kwhPerKw: ex.pv.kwhPerKw, centsPerKwh: ex.cents, exportShare: 50, exportCents: ex.cents / 2 });
const withCredit = payback({ cost: ex.cost * 0.7, kw, kwhPerKw: ex.pv.kwhPerKw, centsPerKwh: ex.cents, exportShare: 0, exportCents: ex.cents });
const cheapest = [...K.states].sort((a, b) => K.elec(a.slug) - K.elec(b.slug))[0];
const atCheap = payback({ cost: ex.cost, kw, kwhPerKw: ex.pv.kwhPerKw, centsPerKwh: K.elec(cheapest.slug), exportShare: 0, exportCents: K.elec(cheapest.slug) });

export default definePage({
  id: 'solar-payback-calculator',
  group: 'energy',
  order: 30,
  slug: 'solar-payback-calculator',
  nav: 'Is solar worth it?',
  card: 'Years for the bill savings to repay the panels, at your state’s prices',
  title: 'Solar Payback Calculator 2026: Is Solar Worth It by State',
  description: `Solar payback calculator 2026: a ${K.num(kw, 1)} kW system repays its price in ${K.num(fast.base.years, 1)} years in ${fast.s.name} and ${K.num(slow.base.years, 1)} in ${slow.s.name}, with no federal tax credit. No ZIP asked.`,
  h1: 'Is solar worth it?',
  intro: 'Enter the price you were quoted and your electricity rate: the years of bill savings needed to repay it show at once.',
  resume: `Solar repays its price fastest where power is dear and sunshine strong: in 2026 a ${K.num(kw, 1)} kW system bought at the median quote pays for itself in about ${K.num(fast.base.years, 1)} years in ${fast.s.name} and ${K.num(slow.base.years, 1)} years in ${slow.s.name}, if every kWh it makes replaces a kWh bought at the state's average residential price. That is simple payback: the price divided by one year of bill savings. The calculator reads the output from PVWatts for a city in your state, the price from the EnergySage median quotes published by the National Laboratory of the Rockies, and the electricity rate from EIA for ${K.energyMeta.electricityText}. The answer moves with the price you actually sign, which sat ${K.pct(ratio - 1, 0)} above marketplace quotes in New York's 2025 records, and with the credit your utility gives for power sent to the grid. Without the federal 30% credit, which ended for systems placed in service after ${credit}, payback is longer than it was in 2025.`,
  tool: 'solar-payback',
  body: (h) => `
<h2>How the payback figure is built</h2>
<p>The calculator starts from the yearly output of your system: kilowatts times the kWh one kilowatt makes in your state, from ${h.src('nlr_pvwatts', 'PVWatts')} or, for states not run through PVWatts, ${h.src('nasa_power', 'NASA POWER')} sunshine scaled to it. It splits that output in two. The part you use at home is worth your retail price; the part sent to the grid is worth the export credit you enter. The sum is the yearly saving on your bill, and the price you were quoted divided by that saving is the payback in years. By default the export share is 0%, which values every kWh at the full rate, and the price is the median quote for the system size you set.</p>
<p>In ${ex.s.name}, ${h.num(kw, 1)} kW makes about ${h.num(ex.base.kwh)} kWh a year. At ${h.cents(ex.cents)} per kWh, that saves ${h.usd(ex.base.saving)} a year, so a quote of ${h.usd(ex.cost)} repays itself in ${h.num(ex.base.years, 1)} years.</p>
${h.table(['State', `Quote for ${h.num(kw, 1)} kW`, 'Output a year', 'Electricity price', 'Saving a year', 'Payback', 'At reported prices'], rows.map((r) => [r.s.name, `${h.usd(r.cost)}${r.q.scope === 'us' ? '*' : ''}`, `${h.num(r.base.kwh)} kWh`, h.cents(r.cents), h.usd(r.base.saving), `${h.num(r.base.years, 1)} yr`, `${h.num(r.paid.years, 1)} yr`]), `All output valued at the state's EIA average price, ${K.energyMeta.electricityText}. * U.S. median quote, no state figure published. Reported prices = quote × ${h.num(ratio, 3)} (NYSERDA 2025 ÷ EnergySage New York).`, ['l', 'r', 'r', 'r', 'r', 'r', 'r'])}
<h2>The rate you pay matters more than the sun</h2>
<p>Output varies by state, but electricity prices vary more. ${h.src('eia_epm', 'EIA')} measured ${h.cents(K.elec(cheapest.slug))} per kWh in ${cheapest.name}, the cheapest state, for ${K.energyMeta.electricityText}. Valued at that price, the same ${ex.s.name} system would save only ${h.usd(atCheap.saving)} a year and need ${h.num(atCheap.years, 1)} years to repay. That is why a sunny state with cheap power can show a slower payback than a cloudier state with expensive power.</p>
<h3>Export credits can stretch the result</h3>
<p>Panels produce most at midday, when many homes use little, so part of the output flows to the grid. How your utility credits it is set by state rules and tariffs, which differ widely and change; read your utility's own tariff before you sign. As an illustration only: if half of the ${ex.s.name} output were exported and credited at half the retail price, the saving would drop to ${h.usd(split.saving)} and payback would grow to ${h.num(split.years, 1)} years. Batteries and shifting loads such as laundry or car charging to daylight hours raise the share you use yourself.</p>
<h2>What simple payback leaves out</h2>
<p>The formula assumes today's electricity price forever, panels that never lose output, no loan interest and no repairs. Each of those cuts the other way: rising utility rates shorten the real payback, while slow panel aging, an inverter replacement and interest on a loan lengthen it. A loan with a dealer fee also raises the price itself. For a cash purchase in a state with high rates, the simple figure is a fair first test; for a financed system, ask the lender for the total of all payments and use that as the price.</p>
<h3>The missing 30%</h3>
<p>The ${h.src('irs_25d', 'IRS residential clean energy credit')} returned 30% of the cost, but not for property placed in service after ${credit}. Had it still applied, the ${ex.s.name} example would repay in ${h.num(withCredit.years, 1)} years instead of ${h.num(ex.base.years, 1)}. State and utility incentives exist in some places; include one in the calculator by lowering the price, and only once the program has confirmed it in writing.</p>
<h2>Is it worth it for you?</h2>
<p>Put the payback next to two numbers you know: how long you expect to own the house, and how long the panel and workmanship warranties in your quote last. A payback well inside both is a sound purchase on these assumptions. If it runs close to either, a smaller system sized to your daytime use, from the ${h.a('solar-panel-calculator', 'panel calculator')}, or a lower price per watt from the ${h.a('solar-panel-cost', 'state cost table')}, may change the verdict.</p>`,
  faqs: [
    { q: 'How long does it take for solar panels to pay for themselves?', a: `At the 2026 median quote and with every kWh valued at the state's average price, a ${K.num(kw, 1)} kW system repays itself in about ${K.num(fast.base.years, 1)} years in ${fast.s.name} and ${K.num(slow.base.years, 1)} years in ${slow.s.name}. Paying the higher prices New York buyers reported in 2025 stretches that to ${K.num(fast.paid.years, 1)} and ${K.num(slow.paid.years, 1)} years.` },
    { q: 'Is solar worth it without the federal tax credit?', a: `It can be, mainly where electricity is expensive. The 30% credit ended for systems placed in service after ${credit}, which lengthens payback by about ${K.pct(1 / 0.7 - 1, 0)}: in ${ex.s.name}, from ${K.num(withCredit.years, 1)} to ${K.num(ex.base.years, 1)} years on a median ${K.num(kw, 1)} kW quote. A competitive price per watt now matters more than before.` },
    { q: 'Is solar worth it if my utility pays less for exported power?', a: `Less so, unless you use most of the output yourself. In an illustration for ${ex.s.name}, exporting half the output at half the retail price raises payback from ${K.num(ex.base.years, 1)} to ${K.num(split.years, 1)} years. Check your utility's export tariff, then enter the share and the credit in the calculator to see your own figure.` },
    { q: 'Is solar worth it in a state with cheap electricity?', a: `Payback is slow where power is cheap. Valued at ${K.cents(K.elec(cheapest.slug))} per kWh, the ${cheapest.name} average and the lowest in the country, a ${K.num(kw, 1)} kW system producing as much as one in ${ex.s.name} would need ${K.num(atCheap.years, 1)} years to repay its ${K.usd(ex.cost)} quote. A lower price per watt is the main lever there.` },
    { q: 'Should I pay cash or finance solar panels?', a: `Cash gives the simple payback this calculator shows. A loan adds interest and sometimes a dealer fee built into the system price, both of which lengthen the time before savings cover what you paid. Ask the lender for the total of all payments, enter it as the price, and compare it with the cash quote for the same system.` },
  ],
  related: ['solar-panel-cost', 'solar-panel-calculator', 'electric-bill-calculator', 'electricity-cost-calculator'],
  sources: ['nlr_pvwatts', 'nasa_power', 'nlr_siu_2026', 'nyserda_solar', 'eia_epm', 'irs_25d'],
});
