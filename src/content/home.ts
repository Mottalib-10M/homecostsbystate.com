/**
 * Home page text (HomePage.astro lays it out). Every figure is read from the kit, never typed.
 */
import { KIT as K } from '../lib/kit';
import type { FAQ, Helpers } from '../lib/page-types';

const roof = K.job('roof');
const wh = K.job('waterHeater');
const ac = K.job('centralAc');
const heat = K.job('heating');
const fence = K.job('fence');
const nomRoof = K.ahs('roof').proNominal;
const cpiMonth = K.month(K.ahsMeta.cpi.to);
const ranked = K.states.map((s) => ({ s, r: K.job('roof', s.slug) })).sort((a, b) => a.r.typical - b.r.typical);
const cheapest = ranked[0];
const dearest = ranked[ranked.length - 1];
const roofShares = K.shares('roof');
const roofers = K.natWage('roofers');
const byElec = K.states.map((s) => ({ s, c: K.elec(s.slug) })).sort((a, b) => a.c - b.c);
const elecMin = byElec[0];
const elecMax = byElec[byElec.length - 1];

export const HOME = {
  title: 'Home Repair Costs by State 2026: Prices With No ZIP Code',
  description: 'Home repair costs in 2026 for every state: roof, water heater, AC, furnace, fence, deck and solar, from Census and BLS data. Shown at once, no ZIP or phone.',
  h1: 'Home repair costs, state by state',
  intro: 'Choose a state and every price appears below: no ZIP code, no phone number, no contractor calling you back.',
  pillars: [
    { tag: 'What people paid', title: 'Census American Housing Survey', text: `Homeowners report the cost of each job they had done. ${K.num(K.ahs('roof').pro.n)} professional roof jobs alone sit behind the roof figures.` },
    { tag: 'What labor costs here', title: 'BLS wages by trade and state', text: `Mean hourly wages of roofers, plumbers, HVAC mechanics and eight other trades, ${K.wageRef.reference}, for all 50 states and DC.` },
    { tag: 'How a price splits', title: 'Economic Census 2022', text: `Roofing contractors spent ${K.pct(roofShares.materials)} of the value of their work on materials and ${K.pct(roofShares.payroll + roofShares.benefits)} on payroll and benefits.` },
  ],
  resume: `A professional roof replacement cost ${K.usd(roof.typical)} at the median in the United States, and half of all jobs fell between ${K.usd(roof.low)} and ${K.usd(roof.high)}, once the prices homeowners reported to the Census Bureau for 2021 to 2023 are brought to ${cpiMonth} dollars with the Consumer Price Index. The same survey puts a water heater at ${K.usd(wh.typical)} (${K.usd(wh.low)} to ${K.usd(wh.high)}), central air conditioning at ${K.usd(ac.typical)}, a furnace or other built-in heating at ${K.usd(heat.typical)} and a fence at ${K.usd(fence.typical)}. Each state then gets its own figure: the price level of its Census division, and the labor share of the job moved up or down with the wage that the Bureau of Labor Statistics measured for that trade in that state in ${K.wageRef.reference}. For a roof, the typical price runs from ${K.usd(cheapest.r.typical)} in ${cheapest.s.name} to ${K.usd(dearest.r.typical)} in ${dearest.s.name}. None of it asks for a ZIP code or a phone number, because nothing is sold to anyone.`,
  tableTitle: 'Roof replacement cost in every state',
  tableIntro: (h: Helpers) => `<p>The table applies one method to all 51 jurisdictions, so the rows compare like with like. A roof is the clearest test of it: the job is similar everywhere, the materials travel on the same national supply chains, and what differs is who climbs the ladder and what they are paid. ${K.usd(roofers.mean, 2)} an hour is the national mean wage of the ${K.num(roofers.emp ?? 0)} roofers BLS counted; ${h.a('roof-replacement-cost', 'the roof replacement calculator')} narrows the figure to the size of your house, and each state page breaks it down further.</p>`,
  foldTitle: 'How the prices on this site are built, and where they stop',
  sections: (h: Helpers) => [
    {
      title: 'Why the price is on the screen before anything else',
      html: `<p>Search for a roof or water heater price and most of the first page is made of quote forms. They ask for a ZIP code, then a name, then a phone number, and the price arrives later, from a contractor who bought your request. That model is legal and sometimes useful, yet it turns a simple question (what does this cost around here?) into a sales call.</p><p>This site works the other way round. The figures come from public statistics that anyone can download: the ${h.src('census_ahs', 'American Housing Survey')} run by the Census Bureau for HUD, the ${h.src('bls_oews', 'Occupational Employment and Wage Statistics')} of the Bureau of Labor Statistics and the ${h.src('census_ec', '2022 Economic Census')} of construction. Because the inputs are public, the calculators can run entirely in your browser and show the result the moment you pick a state. There is no form to submit, and no contractor is told that you looked.</p>`,
    },
    {
      title: 'What homeowners told the Census Bureau they paid',
      html: `<p>Every two years the American Housing Survey asks owners about the home improvement jobs of the past two years: the type of work, whether someone in the household did most of it, the year, and the cost. The 2023 survey recorded ${K.num(K.ahs('roof').pro.n)} roof jobs done by professionals, ${K.num(K.ahs('waterHeater').pro.n)} water heaters, ${K.num(K.ahs('centralAc').pro.n)} central air conditioning jobs and ${K.num(K.ahs('fence').pro.n)} fences. Weighted to the whole country, the median professional roof job was ${K.usd(nomRoof.median)} in the dollars of the year it was paid.</p><p>We keep the middle half of the distribution, from the 25th to the 75th percentile, as the range, and the median as the typical price. Each answer is moved to ${cpiMonth} dollars with the ${h.src('bls_cpi', 'CPI-U')} index of its own year. A survey of real jobs has one strong advantage over a price list: it already contains the tear-off, the permit, the dumpster and the margin, because the homeowner reported what the whole job cost.</p>`,
    },
    {
      title: 'Why a state with the same materials can cost more',
      html: `<p>Shingles, water heaters and condensers are sold through national distribution, so their price varies less between states than labor does. The 2022 Economic Census shows how a contractor's revenue splits: for roofing contractors, ${K.pct(roofShares.materials)} went to materials, ${K.pct(roofShares.payroll)} to payroll, ${K.pct(roofShares.benefits)} to benefits and ${K.pct(roofShares.subcontracted)} to subcontracted work, the rest covering equipment, insurance, overhead and profit.</p><p>Our state figure starts from the price level homeowners reported in the state's Census division, then moves only the labor share with the state's wage for the trade compared with its division. That is why the spread between states is real but bounded: a roofer in ${dearest.s.name} earns more than one in ${cheapest.s.name}, yet the shingles on both roofs cost about the same. ${h.a('method', 'The method page')} gives every step, with the formula and its limits.</p>`,
    },
    {
      title: 'Quantity calculators for the work you do yourself',
      html: `<p>Not every project needs a contractor. The ${h.a('concrete-calculator', 'concrete calculator')} turns a slab, a footing or a row of post holes into cubic yards and bags of 40, 50, 60 or 80 pounds, using the yields printed on the manufacturer's data sheet. The ${h.a('gravel-calculator', 'gravel')} and ${h.a('mulch-calculator', 'mulch')} calculators convert an area and a depth into cubic yards, tons or bags; the ${h.a('paint-calculator', 'paint')} and ${h.a('drywall-calculator', 'drywall')} calculators measure a room net of doors and windows; the ${h.a('roofing-calculator', 'roofing calculator')} applies the pitch of the roof to count squares, bundles and underlayment rolls.</p><p>These tools stop at quantities on purpose. Store prices change weekly and from one aisle to the next, so each calculator lets you type the price from the shelf tag and totals it, rather than showing a national average that would be wrong in your store.</p>`,
    },
    {
      title: 'Energy: what electricity, heating and solar cost where you live',
      html: `<p>Running costs depend on the state far more than installation prices do. Residential electricity averaged ${K.cents(K.elec('us'))} per kilowatt-hour in the United States from ${K.energyMeta.electricityText}, according to the ${h.src('eia_epm', 'Energy Information Administration')}, but the state averages ran from ${K.cents(elecMin.c)} in ${elecMin.s.name} to ${K.cents(elecMax.c)} in ${elecMax.s.name}. The ${h.a('electric-bill-calculator', 'electric bill')} and ${h.a('electricity-cost-calculator', 'appliance')} calculators use the figure of your state, the ${h.a('ev-charging-cost-calculator', 'EV charging calculator')} sets it against gasoline, and the ${h.a('heat-pump-vs-furnace', 'heat pump versus furnace')} comparison prices the same heat with gas, propane, oil or electricity.</p><p>For solar, the federal 30% residential credit ended on ${K.day(K.P.solar.residentialCreditEnded)}, as the ${h.src('irs_25d', 'IRS')} confirms. Our ${h.a('solar-panel-cost', 'solar cost')}, ${h.a('solar-panel-calculator', 'sizing')} and ${h.a('solar-payback-calculator', 'payback')} calculators therefore work without it, with state output figures from PVWatts and price data published by the national laboratories.</p>`,
    },
    {
      title: 'What these figures cannot know about your house',
      html: `<p>A survey median describes many houses, not yours. A steep or cut-up roof, two layers of old shingles, rotten decking, a tankless water heater in place of a tank, a long duct run or a narrow lot all move a real quote, and none of them can be seen from a statistic. Prices also lag: the survey covers jobs from 2021 to 2023, and the CPI adjustment follows general inflation rather than the price of shingles or copper in particular.</p><p>Use the ranges to know whether a written quote is in the usual zone for your state, to plan a budget, or to decide whether a job is worth doing yourself. When a quote sits far above the high end, ask the contractor what makes your job different; there is often a good answer, and sometimes there is not.</p>`,
    },
  ],
  faqs: [
    { q: 'Why does this site not ask for my ZIP code before showing a price?', a: `Because the prices come from public statistics, not from contractors who pay for leads. The Census survey gives what homeowners paid, BLS gives the state wage of each trade, and the calculation runs in your browser. Nothing you choose is sent anywhere, so there is no reason to collect a ZIP code, a name or a phone number before the figure appears.` },
    { q: 'How much does a new roof cost in 2026 on average?', a: `About ${K.usd(roof.typical)} at the national median for a professional replacement, with the middle half of jobs between ${K.usd(roof.low)} and ${K.usd(roof.high)}. That comes from the ${K.num(K.ahs('roof').pro.n)} roof jobs in the 2023 American Housing Survey, moved to ${cpiMonth} dollars. Larger houses sit higher: the roof calculator uses the survey's house-size groups.` },
    { q: 'Which state has the cheapest roof replacement on this site?', a: `${cheapest.s.name}, at a typical ${K.usd(cheapest.r.typical)}, and the most expensive is ${dearest.s.name} at ${K.usd(dearest.r.typical)}. The gap comes from the price level reported in each Census division and from roofer wages, which BLS measured at very different levels across states in May 2025. Materials cost roughly the same everywhere.` },
    { q: 'Are these prices from contractors or from real jobs?', a: `From real jobs. The American Housing Survey asks owners what each improvement cost, and whether someone in the household did most of the work. We keep only the jobs done by professionals for the main price, adjust them for inflation to ${cpiMonth}, and show the middle half of the answers as the range rather than a single number.` },
    { q: 'How old is the data behind the prices?', a: `The wages are from May 2025, released by BLS on ${K.day(K.wageRef.released)}. The job costs come from the 2023 survey, covering work done from 2021 to 2023, brought to ${cpiMonth} dollars with the CPI. Electricity prices run through July 2026. Each page names the release it uses, and the site is rechecked when a new release comes out.` },
    { q: 'Can I trust a range more than a single average price?', a: `For budgeting, yes. Half of the professional roof jobs in the survey cost between ${K.usd(roof.low)} and ${K.usd(roof.high)}, a spread of more than ${K.usd(roof.high - roof.low)}. A single average would hide that, and it would make a fair quote look expensive or a cheap one look normal. Compare your quote with the range for your state, then ask what explains the difference.` },
  ] as FAQ[],
  sources: ['census_ahs', 'bls_oews', 'census_ec', 'bls_cpi', 'eia_epm', 'irs_25d'],
};
