import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { cylinderCuFt } from '../../lib/engine/materials';

const r = K.job('fence');
const a = K.ahs('fence');
const sh = K.shares('fence');
const fw = K.natWage('fence');
const M = K.P.materials;
const cpiMonth = K.month(K.ahsMeta.cpi.to);
const panel = M.woodFencePanelFt.width;
const run = (len: number, depthIn: number, post: '4x4' | '5x5') => {
  const panels = Math.ceil(len / panel); const posts = panels + 1;
  const bags = Math.ceil((cylinderCuFt(M.fenceHoleDiameterIn[post], depthIn / 12) * posts) / M.concreteYieldCuFt['80']);
  return { panels, posts, bags };
};
const ex = run(150, 30, '4x4');
const missing = K.states.filter((s) => !K.wage(s.slug, 'fence')).map((s) => s.name);
const ranked = K.states.map((s) => ({ s, r: K.job('fence', s.slug) })).sort((x, y) => x.r.typical - y.r.typical);

export default definePage({
  id: 'fence-cost-calculator',
  group: 'costs',
  order: 50,
  slug: 'fence-cost-calculator',
  nav: 'Fence cost calculator',
  card: 'Installed price by state, plus posts, panels and concrete',
  title: 'Fence Cost Calculator 2026: Price by State, Posts, Concrete',
  description: `Fence cost calculator 2026: ${K.usd(r.typical)} typical for a professional fence job, ${K.usd(r.low)} to ${K.usd(r.high)} for most, plus the posts and concrete bags for your own length.`,
  h1: 'Fence cost calculator',
  intro: 'What fence jobs cost in your state, and the posts, panels and bags of concrete your own length needs.',
  resume: `A fence installed by a professional cost ${K.usd(r.typical)} at the national median, and half of the jobs cost between ${K.usd(r.low)} and ${K.usd(r.high)}, based on the ${K.num(a.pro.n)} fence jobs that owners reported in the 2023 American Housing Survey, in ${cpiMonth} dollars. The survey does not record length or material, so that range describes the typical residential fence project rather than a price per foot. The calculator adds what the survey cannot: for your length it counts ${panel}-foot panels, posts and 80-pound bags of concrete, so you can price materials at your store. A 150-foot run with posts set 30 inches deep needs ${K.num(ex.panels)} panels, ${K.num(ex.posts)} posts and about ${K.num(ex.bags)} bags. Owners who built their own fence reported a median of ${K.usd(a.diy!.median)}, a reminder that labor is most of the gap.`,
  tool: 'fence',
  body: (h) => `
<h2>Two numbers: the job price and the material list</h2>
<p>The ${h.src('census_ahs', 'Census survey')} gives the price of the whole job as owners paid it: design, digging, posts, panels or pickets, gates, hauling soil away and the installer's margin. It is the right benchmark for a quote. The take-off underneath answers a different question, which is what you would have to buy to build the same fence. It follows the layout of panel fences: one post at each end and one between each pair of panels, so posts equal panels plus one for a straight run. Corners and gates add posts.</p>
${h.table(['Fence length', 'Panels', 'Posts', '80 lb bags (4x4 posts, 30 in deep)'], [50, 100, 150, 200, 300].map((len) => { const x = run(len, 30, '4x4'); return [`${len} ft`, h.num(x.panels), h.num(x.posts), h.num(x.bags)]; }), `Wood panels ${panel} ft wide, holes ${M.fenceHoleDiameterIn['4x4']} in across for 4x4 posts, concrete at ${h.num(M.concreteYieldCuFt['80'], 2)} cu ft per 80 lb bag, post volume not deducted.`, ['l', 'r', 'r', 'r'])}
<p>Hole sizes follow one vinyl fence maker's guide, ${M.fenceHoleDiameterIn['4x4']} inches across for 4x4 posts and ${M.fenceHoleDiameterIn['5x5']} inches for 5x5, dug to the frost line with gravel at the bottom (${h.src('barrette_fence', 'Barrette installation guide')}). Your county's frost depth sets how deep the holes go; the calculator lets you type it. Bag yields come from the ${h.src('quikrete_1101', 'Quikrete data sheet')}.</p>
<h2>Who installs fences, and what they earn</h2>
<p>BLS counts fence erectors as a separate occupation: ${h.num(fw.emp ?? 0)} of them in ${h.wageRef.reference}, with a mean wage of ${h.usd(fw.mean, 2)} an hour. Their employers fall under "all other specialty trade contractors" in the ${h.src('census_ec', 'Economic Census')}, where materials took ${h.pct(sh.materials)} of the value of work and payroll plus benefits ${h.pct(sh.payroll + sh.benefits)}. ${missing.length ? `BLS did not publish a fence erector wage for ${h.listOf(missing)}; there the national wage is used.` : ''}</p>
<p>State estimates run from ${h.usd(ranked[0].r.typical)} in ${ranked[0].s.name} to ${h.usd(ranked[ranked.length - 1].r.typical)} in ${ranked[ranked.length - 1].s.name}. Owners in the New England and Middle Atlantic states reported the highest fence medians of the survey's nine divisions.</p>
<h3>Before the first post goes in</h3>
<p>Call 811 a few days before digging so that utilities mark buried lines; the service is free nationwide. Check the property line on your survey plat rather than trusting an old fence, and read your homeowners association's rules on height, style and which side faces out. Many cities require a permit above a set height, often for front-yard fences in particular.</p>
<h2>Making a quote comparable</h2>
<p>Ask each installer for the length they measured, the material and its grade, post size and spacing, hole depth, number of gates and whether old fence removal is included. With those, the price per foot of two quotes can be compared, and the total checked against the survey range for your state. Gates deserve their own line: a wide drive gate with heavy hinges and a stronger post can cost as much as several sections of plain fence.</p><p>Removal of an old fence is often quoted per foot and can surprise owners who assumed it was included. The same goes for rocky or root-filled ground, where each hole takes longer, and for slopes that require stepped or racked panels instead of the standard straight ones. None of these appear in a statistic, so describe your yard honestly when you ask for a price.</p>`,
  faqs: [
    { q: 'How much does a fence cost to install in 2026?', a: `Professional fence jobs had a median of ${K.usd(r.typical)} in the 2023 American Housing Survey, adjusted to ${cpiMonth} dollars, and half of them cost between ${K.usd(r.low)} and ${K.usd(r.high)}. The survey does not record length or material, so a long vinyl or ornamental fence can exceed the upper end while a short wood run stays below it.` },
    { q: 'How many fence posts do I need for 150 feet?', a: `With ${panel}-foot panels on a straight run, 150 feet takes ${K.num(ex.panels)} panels and ${K.num(ex.posts)} posts: one more post than panels. Every corner, end or gate adds a post. Set 30 inches deep in ${M.fenceHoleDiameterIn['4x4']}-inch holes, those posts need about ${K.num(ex.bags)} bags of 80-pound concrete.` },
    { q: 'How much concrete do I need per fence post?', a: `A ${M.fenceHoleDiameterIn['4x4']}-inch hole 30 inches deep holds about ${K.num(cylinderCuFt(M.fenceHoleDiameterIn['4x4'], 2.5), 2)} cubic feet. An 80-pound bag of Quikrete concrete mix yields ${K.num(M.concreteYieldCuFt['80'], 2)} cubic feet, so plan on about ${K.num(cylinderCuFt(M.fenceHoleDiameterIn['4x4'], 2.5) / M.concreteYieldCuFt['80'], 1)} bags per hole before deducting the post itself, which leaves a small margin for spills and uneven holes.` },
    { q: 'Is building a fence yourself much cheaper?', a: `Owners who did most of the work reported a median of ${K.usd(a.diy!.median)} for their fence, against ${K.usd(a.pro.median)} when a professional did it, in the same Census survey. The saving is mostly labor. Digging dozens of holes to frost depth is the hard part; renting a power auger shortens it considerably.` },
  ],
  related: ['deck-cost-calculator', 'concrete-calculator', 'square-footage-calculator', 'roof-replacement-cost'],
  sources: ['census_ahs', 'bls_oews', 'census_ec', 'barrette_fence', 'quikrete_1101', 'bls_cpi'],
});
