import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const r = K.job('roof');
const a = K.ahs('roof');
const sh = K.shares('roof');
const w = K.natWage('roofers');
const cpiMonth = K.month(K.ahsMeta.cpi.to);
const sizes = K.jobInput('roof').bySize!;
const small = sizes[1];
const big = sizes[5];
const r1800 = K.job('roof', 'us', 1800);
const ranked = K.states.map((s) => ({ s, r: K.job('roof', s.slug) })).sort((x, y) => x.r.typical - y.r.typical);

export default definePage({
  id: 'roof-replacement-cost',
  group: 'costs',
  order: 10,
  slug: 'roof-replacement-cost',
  nav: 'Roof replacement cost',
  card: 'Typical price and range by state and house size',
  title: 'Roof Replacement Cost 2026: Price by State and House Size',
  description: `Roof replacement cost in 2026: ${K.usd(r.typical)} typical, ${K.usd(r.low)} to ${K.usd(r.high)} for most jobs, by state and house size, from Census and BLS data. No ZIP code asked.`,
  h1: 'Roof replacement cost by state',
  intro: 'Pick your state and the size of the house: the price range shows at once, with what part of it is labor.',
  resume: `A professional roof replacement costs ${K.usd(r.typical)} at the national median in ${cpiMonth} dollars, and half of all jobs land between ${K.usd(r.low)} and ${K.usd(r.high)}. Those figures come from the ${K.num(a.pro.n)} roof jobs that homeowners who hired a roofer reported in the 2023 American Housing Survey, which the Census Bureau runs for HUD, each moved to today's dollars with the Consumer Price Index. House size matters: for a home of ${small.label.toLowerCase()} the median was ${K.usd(small.median)}, against ${K.usd(big.median)} for ${big.label.toLowerCase()}. Your state then shifts the price twice, through the level reported in its Census division and through the wage BLS measured for roofers there in ${K.wageRef.reference}, which drives the labor part of the bill, about ${K.pct(sh.payroll + sh.benefits)} of what roofing contractors charge.`,
  tool: 'roof-cost',
  body: (h) => `
<h2>What a roof job costs, line by line</h2>
<p>Take a house of 1,800 square feet in a state at the national level: the calculator gives ${h.usd(r1800.typical)}, with most jobs between ${h.usd(r1800.low)} and ${h.usd(r1800.high)}. The ${h.src('census_ec', '2022 Economic Census')} shows how roofing contractors spread such a sum. Materials (shingles, underlayment, flashing, nails, vents) took ${h.pct(sh.materials)} of the value of their work. Payroll took ${h.pct(sh.payroll)} and benefits ${h.pct(sh.benefits)}. Work handed to subcontractors took ${h.pct(sh.subcontracted)}, and the remainder paid for trucks, dumpsters, insurance, office costs and profit.</p>
<p>That split explains why two quotes for the same roof can differ so much: the shingles cost the same at any supplier, so the gap sits in labor, overhead and margin. A crew that tears off two layers instead of one, hauls the debris farther or works on a 10/12 pitch with ropes and roof jacks spends more hours, and the quote shows it.</p>
${h.table(['House size', 'Low', 'Typical', 'High'], sizes.map((b) => [b.label, h.usd(K.job('roof', 'us', b.bin === 'lt1000' ? 800 : Number(b.bin)).low), h.usd(K.job('roof', 'us', b.bin === 'lt1000' ? 800 : Number(b.bin)).typical), h.usd(K.job('roof', 'us', b.bin === 'lt1000' ? 800 : Number(b.bin)).high)]), `Professional roof jobs on one-family detached homes, American Housing Survey 2023, in ${cpiMonth} dollars.`, ['l', 'r', 'r', 'r'])}
<h2>Why roofers in some states cost more</h2>
<p>BLS counted ${h.num(w.emp ?? 0)} roofers in May 2025, with a national mean wage of ${h.usd(w.mean, 2)} an hour and a middle half between ${h.usd(w.p25 ?? 0, 2)} and ${h.usd(w.p75 ?? 0, 2)}. Across states the mean ranges widely, and it moves the labor part of the job. The lowest typical price on the site is in ${ranked[0].s.name} (${h.usd(ranked[0].r.typical)}); the highest in ${ranked[ranked.length - 1].s.name} (${h.usd(ranked[ranked.length - 1].r.typical)}). Each state has its own page with the wage table, the price by house size and what the climate and licensing rules add there.</p>
<h3>Square footage of the house is not the area of the roof</h3>
<p>The survey groups jobs by the living area of the house, which is what owners know. The roof itself is larger than the footprint once overhangs and pitch are counted, and a two-story house of the same living area has a smaller roof than a ranch. If you want the actual roof area, squares and bundles, the ${h.a('roofing-calculator', 'roofing calculator')} works from the footprint and the pitch.</p>
<h2>When the quote is higher than the range</h2>
<p>About one job in four costs more than the high end, and there are honest reasons. Replacing rotten decking is billed per sheet of plywood. Metal, tile and slate roofs cost several times as much as asphalt shingles. Some cities require permits priced on the job value, and coastal or hail-prone areas may require specific underlayment or impact-rated shingles. Ask for the quote in lines: tear-off, decking allowance, materials by brand, labor, disposal and permit. A contractor who cannot split the price that way is harder to compare, and a written scope protects you if the crew finds surprises once the old shingles are off.</p>
<p>Insurance claims follow other logic. After hail or wind damage, the insurer's estimate is usually built with commercial pricing software, and the deductible applies; the survey prices on this page include jobs paid by insurance settlements as well as from savings.</p>`,
  faqs: [
    { q: 'How much does it cost to replace a roof on a 2,000 sq ft house?', a: `For a house of 2,000 to 2,499 square feet, the professional jobs in the 2023 American Housing Survey had a median of ${K.usd(K.job('roof', 'us', 2000).typical)} in ${cpiMonth} dollars, and half of them cost between ${K.usd(K.job('roof', 'us', 2000).low)} and ${K.usd(K.job('roof', 'us', 2000).high)}. Pick your state in the calculator to move the labor part to local roofer wages.` },
    { q: 'What share of a roof replacement is labor?', a: `Roofing contractors spent ${K.pct(sh.payroll)} of the value of their work on payroll and ${K.pct(sh.benefits)} on benefits in the 2022 Economic Census, against ${K.pct(sh.materials)} on materials. Another ${K.pct(sh.subcontracted)} went to subcontractors, much of it labor too. So labor and overhead, not shingles, decide most of the gap between two quotes.` },
    { q: 'Is it cheaper to replace a roof myself?', a: `Owners who did most of the work themselves reported a median of ${K.usd(a.diy!.median)} in ${cpiMonth} dollars, against ${K.usd(a.pro.median)} for professional jobs in the same survey. The saving is real but so are the risks: falls, warranty rules that require certified installers, permits and disposal. Many owners hire out the tear-off even when they do the rest.` },
    { q: 'Does a bigger house always mean a more expensive roof?', a: `Mostly, but not in a straight line. In the survey, the median rose from ${K.usd(small.median)} for ${small.label.toLowerCase()} to ${K.usd(big.median)} for ${big.label.toLowerCase()}. A two-story house has less roof per square foot of living space than a ranch, and a complex roof with valleys and dormers costs more per square than a simple gable.` },
    { q: 'Why is my roof quote far above the survey range?', a: `The survey median covers mostly ordinary jobs. Rotten decking, a second layer of old shingles, a steep pitch, metal or tile, required permits or storm-season demand can each lift a quote well past the 75th percentile of ${K.usd(r.high)}. Ask the contractor to price those items separately so you can see which one drives the total.` },
  ],
  related: ['roofing-calculator', 'roof:texas', 'roof:florida', 'roof:california', 'hvac-replacement-cost', 'solar-panel-cost'],
  sources: ['census_ahs', 'census_ahs_defs', 'bls_oews', 'bls_roofers', 'census_ec', 'bls_cpi'],
});
