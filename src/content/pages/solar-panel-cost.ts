import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { price, panels } from '../../lib/engine/solar';

const kw = K.P.solar.medianResidentialKw2023;
const ratio = K.reportedToQuote();
const us = K.solarQuote('us');
const usP = price(kw, us.perW, ratio);
const ny = K.nyReported;
const nyQ = K.solarQuote('new-york').perW;
const n = panels(kw, K.panelWatts);
const credit = K.day(K.P.solar.residentialCreditEnded);
const quoted = K.states
  .filter((s) => K.solarQuote(s.slug).scope === 'state')
  .map((s) => ({ s, q: K.solarQuote(s.slug).perW, p: price(kw, K.solarQuote(s.slug).perW, ratio) }))
  .sort((a, b) => a.q - b.q);
const lo = quoted[0];
const hi = quoted[quoted.length - 1];
const pvStates = K.states.filter((s) => K.pv(s.slug));
const ex = pvStates.find((s) => K.solarQuote(s.slug).scope === 'state') ?? pvStates[0];
const exPv = ex ? K.pv(ex.slug) : null;
const exP = ex ? price(kw, K.solarQuote(ex.slug).perW, ratio) : usP;
const sizes = [4, 6, kw, 10, 12];
const p10 = price(10, us.perW, ratio);
const lostCredit = usP.low * 0.3;

export default definePage({
  id: 'solar-panel-cost',
  group: 'energy',
  order: 10,
  slug: 'solar-panel-cost',
  nav: 'Solar panel cost',
  card: 'Installed price per watt and per system, by state, before incentives',
  title: 'Solar Panel Cost 2026: Price per Watt and System by State',
  description: `Solar panel cost in 2026: a ${K.num(kw, 1)} kW home system runs ${K.usd(usP.low)} to ${K.usd(usP.high)} before incentives, ${K.usd(us.perW, 2)} per watt at the median quote. Prices by state, no ZIP or phone.`,
  h1: 'Solar panel cost by state',
  intro: 'Choose a state and a system size: the price range per watt and per system appears at once, before any incentive.',
  resume: `A home solar system of ${K.num(kw, 1)} kW, the median size installed in 2023, costs about ${K.usd(usP.low)} to ${K.usd(usP.high)} in 2026 before incentives, which is ${K.usd(us.perW, 2)} to ${K.usd(usP.perWHigh, 2)} per watt. The low figure is the U.S. median of competitive quotes made on the EnergySage marketplace in the second half of 2025, published by the National Laboratory of the Rockies (formerly NREL) in its Spring 2026 industry update. The high figure applies the gap New York measured in 2025 between prices reported to NYSERDA by installers, a median of ${K.usd(ny.median, 2)} per watt over ${K.num(ny.n)} purchased home systems, and the EnergySage quote for the same state, ${K.usd(nyQ, 2)}: a factor of ${K.num(ratio, 3)}. Median quotes ranged from ${K.usd(lo.q, 2)} per watt in ${lo.s.name} to ${K.usd(hi.q, 2)} in ${hi.s.name}. The federal 30% residential clean energy credit does not apply to systems placed in service after ${credit}, so a 2026 buyer pays the full sticker price unless a state or utility program helps.`,
  tool: 'solar-cost',
  body: (h) => `
<h2>Price per watt is the number to compare</h2>
<p>Installers quote a total, but two totals for different system sizes say nothing until each is divided by its DC rating in watts. A ${h.num(kw, 1)} kW system holds ${h.num(kw * 1000)} watts of panels; at the national median quote of ${h.usd(us.perW, 2)} per watt that is ${h.usd(usP.low)}, and at the reported-price level of ${h.usd(usP.perWHigh, 2)} it is ${h.usd(usP.high)}. With panels of ${h.num(K.panelWatts)} W, the median rating in New York's 2025 installations, the roof carries ${h.num(n)} of them. A quote far above the high figure deserves a line-by-line explanation; one below the low figure deserves a look at the panel and inverter models.</p>
<p>The ${h.src('nlr_siu_2026', 'Spring 2026 Solar and Storage Industry Update')} lists the EnergySage median for ${h.num(quoted.length)} states. They are the states where the marketplace had enough quotes to publish, so the calculator falls back to the U.S. median elsewhere and says so in the result.</p>
${h.table(['State', 'Median quote', `${h.num(kw, 1)} kW at the quote`, `${h.num(kw, 1)} kW at reported prices`], [...quoted.map((x) => [x.s.name, `${h.usd(x.q, 2)}/W`, h.usd(x.p.low), h.usd(x.p.high)]), ['United States', `${h.usd(us.perW, 2)}/W`, h.usd(usP.low), h.usd(usP.high)]], 'EnergySage median gross quotes, second half of 2025 (NLR); reported level = quote × the 2025 New York ratio of reported prices to quotes.', ['l', 'r', 'r', 'r'])}
<h2>Why the price you pay can sit above the quote</h2>
<p>Marketplace quotes are competitive bids for a plain system. The ${h.src('nyserda_solar', 'NYSERDA installation records')} show what New York homeowners who bought their systems in 2025 actually reported: one in five paid less than ${h.usd(ny.p20, 2)} per watt, one in five paid more than ${h.usd(ny.p80, 2)}, and the median was ${h.usd(ny.median, 2)}. Part of that spread comes from things a bare quote leaves out, such as a main panel upgrade, conduit runs across a long attic, or a steep or tile roof. Part comes from how the sale is financed: a loan with a dealer fee folds that fee into the system price.</p>
<h3>What this range does not cover</h3>
<p>Batteries, ground-mounted arrays, re-roofing before installation and trenching to a detached garage all add to the bill and are priced separately by installers. Leases and power purchase agreements are not priced per watt at all; the owner of the panels sells you their output per kWh, so compare those offers against your utility rate, not against this page.</p>
${ex && exPv ? `<p>In ${ex.name}, where the calculator reads sun data for ${exPv.city}, ${h.num(kw, 1)} kW produces about ${h.num(kw * exPv.kwhPerKw)} kWh a year and costs ${h.usd(exP.low)} to ${h.usd(exP.high)}. The ${h.a('solar-panel-calculator', 'panel calculator')} sizes a system to your own use instead of the median.</p>` : ''}
<h2>From kilowatts to dollars</h2>
<p>The calculator multiplies watts by the per-watt figure, so a system twice as large shows twice the price. Real quotes bend that line a little: permits, design, the inverter setup and the crew's trip cost about the same for 4 kW as for 12 kW, so small systems carry a higher price per watt and large ones a lower one.</p>
${h.table(['System size', 'Panels', 'Low', 'High'], sizes.map((s) => { const p = price(s, us.perW, ratio); return [`${h.num(s, 1)} kW`, h.num(panels(s, K.panelWatts)), h.usd(p.low), h.usd(p.high)]; }), `At the U.S. median quote of ${h.usd(us.perW, 2)} per watt, panels of ${h.num(K.panelWatts)} W.`, ['l', 'r', 'r', 'r'])}
<h2>No federal credit in 2026</h2>
<p>The ${h.src('irs_25d', 'IRS')} states that the residential clean energy credit is not available for property placed in service after ${credit}. On a median system at the quoted price, the 30% credit was worth about ${h.usd(lostCredit)}, which buyers in 2026 no longer get back at tax time. Some states and utilities run their own rebates or performance payments; their amounts and deadlines change, so ask the installer to show any incentive as a separate line and check it with the program itself. The ${h.a('solar-payback-calculator', 'payback calculator')} turns the price into years of bill savings.</p>
<h3>A quote you can check</h3>
<p>Ask for the DC size in kW, the panel model and wattage, the inverter type, the total before incentives and the price per watt. Put that per-watt figure next to the median for your state in the table above. This page asks for no ZIP code and no phone number, so nobody calls you back with a sales pitch.</p>`,
  faqs: [
    { q: 'How much does a 10 kW solar system cost in 2026?', a: `At the U.S. median EnergySage quote of ${K.usd(us.perW, 2)} per watt, 10 kW costs about ${K.usd(p10.low)} before incentives. Applying the gap New York measured in 2025 between reported installed prices and quotes lifts it to ${K.usd(p10.high)}. State medians run from ${K.usd(lo.q, 2)} to ${K.usd(hi.q, 2)} per watt, and larger systems often price a little lower per watt.` },
    { q: 'What is a good price per watt for solar panels?', a: `A quote near your state's EnergySage median is competitive: ${K.usd(us.perW, 2)} per watt nationally in the second half of 2025, ${K.usd(lo.q, 2)} in ${lo.s.name} and ${K.usd(hi.q, 2)} in ${hi.s.name}. New York buyers reported a median of ${K.usd(ny.median, 2)} in 2025, so anything above that level should come with a clear reason, such as electrical work.` },
    { q: 'Is there still a federal tax credit for solar panels in 2026?', a: `No. The IRS says the residential clean energy credit under section 25D is not available for property placed in service after ${credit}. A system finished in 2026 gets no federal credit, which removes about ${K.usd(lostCredit)} of value on a median ${K.num(kw, 1)} kW system at the quoted price. State or utility programs may still exist; confirm them directly.` },
    { q: 'Why do solar quotes vary so much between installers?', a: `Hardware is only part of the price. Design, permits, labor, electrical upgrades, overhead and financing fees make up the rest, and each installer prices them differently. In New York's 2025 records, the cheapest fifth of buyers paid under ${K.usd(ny.p20, 2)} per watt and the priciest fifth over ${K.usd(ny.p80, 2)}. Compare quotes per watt and ask what each line covers.` },
    { q: 'Are solar panels cheaper in some states?', a: `Yes. Among the states with a published EnergySage median, ${lo.s.name} was lowest at ${K.usd(lo.q, 2)} per watt and ${hi.s.name} highest at ${K.usd(hi.q, 2)}, so a ${K.num(kw, 1)} kW system differs by about ${K.usd(hi.p.low - lo.p.low)} at the quote. Labor costs, permitting rules and how many installers compete in a market explain much of that spread.` },
  ],
  related: ['solar-panel-calculator', 'solar-payback-calculator', 'electric-bill-calculator', 'roof-replacement-cost', 'roofing-calculator'],
  sources: ['nlr_siu_2026', 'nyserda_solar', 'lbnl_tts_2024', 'irs_25d', 'nlr_pvwatts'],
});
