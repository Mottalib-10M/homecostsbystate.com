import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { localMove } from '../../lib/engine/moving';
import SHARES from '../../data/shares.json';

const mv = (SHARES as Record<string, { revenueK?: number; payrollK?: number; revenuePerPayrollDollar?: number }>)['484210'];
const ratio = mv.revenuePerPayrollDollar!;
const nat = K.natWage('movers');
const wageOf = (slug: string) => { const w = K.wage(slug, 'movers') ?? nat; return { p25: w.p25 ?? w.mean, mean: w.mean, p75: w.p75 ?? w.mean }; };
const usMove = localMove({ movers: 2, hours: 6, travelHours: 1, wage: { p25: nat.p25 ?? nat.mean, mean: nat.mean, p75: nat.p75 ?? nat.mean }, revenuePerPayroll: ratio });
const sample = ['california', 'new-york', 'texas', 'florida', 'ohio', 'mississippi'].map((s) => ({ s: K.state(s), m: localMove({ movers: 2, hours: 6, travelHours: 1, wage: wageOf(s), revenuePerPayroll: ratio }), w: wageOf(s).mean }));
const mw = K.states.map((s) => K.wage(s.slug, 'movers')?.mean).filter((x): x is number => !!x).sort((a, b) => a - b);
const big = localMove({ movers: 3, hours: 9, travelHours: 1, wage: { p25: nat.p25 ?? nat.mean, mean: nat.mean, p75: nat.p75 ?? nat.mean }, revenuePerPayroll: ratio });

export default definePage({
  id: 'moving-cost-calculator',
  group: 'costs',
  order: 70,
  slug: 'moving-cost-calculator',
  nav: 'Moving cost calculator',
  card: 'Hourly price of a local move from mover wages in your state',
  title: 'Moving Cost Calculator 2026: Local Move Price by State',
  description: `Moving cost calculator 2026: 2 movers for 6 hours plus 1 hour of driving come to about ${K.usd(usMove.typical)} at U.S. wages; priced by state from BLS and Census data.`,
  h1: 'Moving cost calculator for a local move',
  intro: 'Crew size and hours in, a price range out, built from what movers earn in your state and what moving companies charge per dollar of wages.',
  resume: `A local move with two movers working six hours plus an hour of billed driving costs about ${K.usd(usMove.typical)} at national wages, with a range of ${K.usd(usMove.low)} to ${K.usd(usMove.high)}. The figure is built from two federal statistics. BLS measured a national mean of ${K.usd(nat.mean, 2)} an hour for hand laborers and material movers in ${K.wageRef.reference}, and the 2022 Economic Census shows that household moving companies took in ${K.usd(ratio, 2)} of revenue for each dollar of payroll they paid, which is what covers the truck, fuel, insurance, office and margin. Multiplying the two gives an implied price of about ${K.usd(nat.mean * ratio)} per mover-hour. Your state's mover wage moves it up or down, and the hours are yours to set: they depend on how much you own, stairs, the walk to the truck and how well packed the boxes are.`,
  tool: 'moving',
  body: (h) => `
<h2>Why the price is built from wages</h2>
<p>No federal survey records what households pay for a move, and price lists differ from one company to the next. What is published is how moving companies make their money. In the ${h.src('census_ec48', '2022 Economic Census')}, firms classified as used household and office goods moving reported revenue of ${h.usd((mv.revenueK ?? 0) * 1000)} against payroll of ${h.usd((mv.payrollK ?? 0) * 1000)}, a ratio of ${h.num(ratio, 2)}. On average, then, each dollar paid to a crew member comes back as about ${h.usd(ratio, 2)} on the customer's invoice. The calculator applies that ratio to the ${h.src('bls_oews', 'BLS wage')} of movers in your state, using the 25th and 75th percentile wages for the low and high ends.</p>
<p>The ratio is an industry average that includes long-distance hauling, where trucks and fuel weigh more than on a crosstown move. For a short local job it may overstate the overhead somewhat; for a move with lots of packing materials it may understate it. Treat the result as a reasonable middle, not a quote.</p>
${h.table(['State', 'Mover mean wage', '2 movers, 6 h + 1 h driving', 'Range'], sample.map((x) => [x.s.name, h.usd(x.w, 2), h.usd(x.m.typical), `${h.usd(x.m.low)} to ${h.usd(x.m.high)}`]), `BLS OEWS ${h.wageRef.reference} (53-7062), Economic Census 2022 (NAICS 484210).`, ['l', 'r', 'r', 'r'])}
<h2>Estimating your hours</h2>
<p>The hours field is the one only you can fill in, and it drives the price more than the state does. A larger home with three movers working nine hours plus an hour of travel comes to about ${h.usd(big.typical)} at national wages. Movers who visit the home or take a video inventory can give hours in writing; ask for them, along with the crew size, the truck size, the minimum billed hours and how travel time is counted. Elevators, long hallways, a third-floor walk-up and furniture that has to be taken apart all add time.</p>
<h3>Interstate moves follow other rules</h3>
<p>A move across state lines is usually priced by weight and distance rather than by the hour, and interstate household movers come under federal rules enforced by the Federal Motor Carrier Safety Administration rather than state ones. This calculator does not price long-distance moves; use it for local jobs where the crew bills by the hour.</p>
<h2>Keeping a local move inside the range</h2>
<p>Pack before the crew arrives, label boxes by room, empty drawers if the company asks, and reserve elevators and parking. Mid-month weekdays are often easier to book than the last days of the month. Get the estimate in writing, check whether it is binding, and compare two or three companies on the same inventory.</p>
<p>Tips, packing supplies and fees for bulky items such as pianos or safes sit outside the hourly rate, and some companies charge a minimum of several hours even for a small job. On moving day, note the start and finish times yourself; with hourly billing, a dispute is easier to settle when both sides wrote the times down. If something is damaged, report it before the crew leaves and keep photos of fragile items taken during packing, since the claim process depends on what was recorded at the time.</p>`,
  faqs: [
    { q: 'How much do movers charge per hour in 2026?', a: `Built from federal data, the implied price is about ${K.usd(nat.mean * ratio)} per mover-hour at the national mean wage of ${K.usd(nat.mean, 2)} for hand movers (BLS, May 2025), times ${K.usd(ratio, 2)} of revenue per dollar of payroll for moving companies (Economic Census 2022). A two-person crew therefore runs about ${K.usd(nat.mean * ratio * 2)} an hour, truck included on average.` },
    { q: 'How much does it cost to move a two bedroom apartment locally?', a: `With two movers working six hours plus one hour of driving, the calculator gives about ${K.usd(usMove.typical)} at national wages, from ${K.usd(usMove.low)} to ${K.usd(usMove.high)}. Stairs, a long carry to the truck or unpacked boxes can add hours. Ask the mover for its estimated hours in writing and enter them in the calculator.` },
    { q: 'Why is a move more expensive in some states?', a: `Crew wages differ: BLS measured state mean wages for hand movers from ${K.usd(mw[0], 2)} to ${K.usd(mw[mw.length - 1], 2)} an hour in May 2025. Since the price per mover-hour is that wage times the revenue moving companies earn per dollar of payroll, a higher local wage raises the hourly rate in the same proportion.` },
    { q: 'Does this moving calculator work for a long-distance move?', a: `No. Interstate moves are usually priced by the weight of the shipment and the distance, plus packing and valuation coverage, and interstate movers fall under the Federal Motor Carrier Safety Administration. This tool prices local moves billed by the hour, where crew size and time decide the total.` },
  ],
  related: ['square-footage-calculator', 'electric-bill-calculator', 'roof-replacement-cost', 'paint-calculator'],
  sources: ['bls_oews', 'census_ec48', 'bls_oews_release'],
});
