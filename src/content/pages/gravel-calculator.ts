import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { looseVolume, tons, CUFT_PER_CUYD } from '../../lib/engine/materials';

const M = K.P.materials;
const dense = M.aggregateTonsPerCuYd.denseBase;
const select = M.aggregateTonsPerCuYd.selectCrushed;
const usgs = M.usgsCrushedStonePerMetricTon2025;
// Exact definitions: 1 short ton = 2,000 lb = 0.90718474 metric ton.
const MT_PER_TON = 0.90718474;
// The calculator's defaults (LooseCalc, gravel): 20 x 10 ft, 4 in deep.
const v = looseVolume(20 * 10, 4);
const t = tons(v.cuYd, dense);
const tSel = tons(v.cuYd, select);
const pad = looseVolume(20 * 20, 4);
const padT = tons(pad.cuYd, dense);
const drive = looseVolume(12 * 50, 6);
const driveT = tons(drive.cuYd, dense);
const path = looseVolume(3 * 40, 2);
const pathT = tons(path.cuYd, select);
const perTonSqFt2 = (CUFT_PER_CUYD / dense) * 12 / 2;
const usgsShort = usgs * MT_PER_TON;
const stoneValue = t * MT_PER_TON * usgs;
const lab = K.natWage('laborers');
const depths = [2, 3, 4, 6, 8, 12];

export default definePage({
  id: 'gravel-calculator', group: 'materials', order: 30, slug: 'gravel-calculator', nav: 'Gravel calculator',
  card: 'Cubic yards and tons of gravel or crushed stone for a driveway, pad or path',
  title: 'Gravel Calculator 2026: Tons and Cubic Yards to Order',
  description: `Gravel calculator 2026: a 20 x 10 ft area 4 in deep holds ${K.num(v.cuYd, 2)} cu yd, about ${K.num(t, 2)} tons of compacted crushed base at ${K.num(dense, 2)} t per yard (state DOT figure, 2025).`,
  h1: 'Gravel calculator',
  intro: 'Type the length, width and depth of the area: the cubic yards and the tons of stone appear at once, with your delivered price if you have one.',
  resume: `A gravel area 20 feet long, 10 feet wide and 4 inches deep holds ${K.num(v.cuFt, 1)} cubic feet, or ${K.num(v.cuYd, 2)} cubic yards, and at ${K.num(dense, 2)} tons per cubic yard for compacted dense crushed base you should order about ${K.num(t, 2)} tons. Those weights come from the Wisconsin Department of Transportation, whose 2025 standard specifications convert in-place dense graded base at ${K.num(dense, 2)} tons per cubic yard and select crushed material at ${K.num(select, 2)}; with the lighter figure the same area takes ${K.num(tSel, 2)} tons. Quarries usually sell by the ton, weighed on a truck scale, so tons are the number to give them. A 20 by 20 foot parking pad at the same depth calls for ${K.num(padT, 2)} tons, and a 12 by 50 foot driveway built 6 inches deep for ${K.num(driveT, 1)} tons. For context, the U.S. Geological Survey estimated the 2025 average value of crushed stone at ${K.usd(usgs, 2)} per metric ton, about ${K.usd(usgsShort, 2)} per short ton, before trucking or a yard's markup.`,
  tool: 'gravel',
  body: (h) => `
<h2>Volume first, weight second</h2>
<p>The calculator does two things. It turns the area and depth into volume: square feet times inches divided by 12 gives cubic feet, and ${CUFT_PER_CUYD} cubic feet make a cubic yard. Then it multiplies the cubic yards by a unit weight in tons per cubic yard, the number that turns a hole in your yard into a ticket at the scale. The default of ${h.num(dense, 2)} comes from ${h.src('wisdot_305', 'Wisconsin DOT section 305')}, the conversion the state uses to pay contractors for dense graded base once it is compacted in place. ${h.src('wisdot_312', 'Section 312')} gives ${h.num(select, 2)} for select crushed material, a coarser fill. Both are in the field so you can switch.</p>
${h.table(['Depth', 'Cubic yards', `Tons at ${h.num(dense, 2)}`, `Tons at ${h.num(select, 2)}`], depths.map((d) => { const x = looseVolume(200, d); return [`${d} in`, h.num(x.cuYd, 2), h.num(tons(x.cuYd, dense), 2), h.num(tons(x.cuYd, select), 2)]; }), 'Gravel for 200 sq ft (a 20 x 10 ft area), Wisconsin DOT in-place unit weights.', ['l', 'r', 'r', 'r'])}
<h3>Why compacted weight is the right one to use</h3>
<p>Stone arrives loose and fluffed up, then shrinks when you run a plate compactor over it. That makes cubic yards a slippery unit: a yard in the truck is not a yard in the driveway. Tons do not change when you compact, so the smart move is to work out the compacted volume you want, convert it with a compacted unit weight such as the DOT figures, and order that weight. If a yard sells by the loose cubic yard instead, ask how much its scale says one of those yards weighs and divide the tons on this page by that figure. The calculator note says the same: loose gravel weighs less per cubic yard than compacted base.</p>
<h2>Depth by layer</h2>
<p>Driveways and paths are often built in layers, and each layer is a separate order because the stone sizes differ. Run the calculator once per layer with its own depth. A coarse base course, a finer crushed layer that locks it in, and sometimes a decorative top dressing: the tons add up quickly. A garden path 3 feet wide and 40 feet long with 2 inches of select crushed stone needs only ${h.num(pathT, 2)} tons. The 12 by 50 foot driveway at 6 inches is ${h.num(drive.cuYd, 1)} cubic yards and ${h.num(driveT, 1)} tons, enough to ask the yard how many truckloads it will take. At 2 inches deep, one ton of dense base spreads over about ${h.num(perTonSqFt2)} square feet.</p>
<p>Edges matter as much as depth. Without a border of steel, timber or pavers, gravel migrates into the lawn and the depth you paid for thins out over time. Lay landscape fabric under paths if weeds are a concern, and slope the surface slightly so water runs off instead of pooling and softening the base.</p>
<h2>What the stone itself is worth</h2>
<p>The ${h.src('usgs_stone', 'USGS Mineral Commodity Summaries 2026')} estimates the average unit value of crushed stone sold in 2025 at ${h.usd(usgs, 2)} per metric ton, up from ${h.usd(K.P.materials.usgsCrushedStonePerMetricTon2021, 2)} in 2021. That is a producer average over all crushed stone, most of it limestone and dolomite for roads and cement, so it leaves out trucking and the yard's margin entirely, both of which weigh more on a small residential order than on a highway contract. At that average, the ${h.num(t, 2)} tons of the default example would be worth about ${h.usd(stoneValue)} at that producer average. Your yard's delivered price per ton is the figure to type into the calculator; it multiplies it by the tons for a total.</p>
<h2>Spreading it yourself or hiring help</h2>
<p>Spreading a few tons with a wheelbarrow, rake and rented plate compactor is within reach of a handy owner. Larger driveways usually need a skid steer and a grader blade to get an even crown. ${h.src('bls_oews', 'BLS')} counted ${h.num(lab.emp ?? 0)} construction laborers in ${h.wageRef.reference}, with a mean wage of ${h.usd(lab.mean, 2)} an hour; an excavation or paving contractor bills above that for equipment, fuel and insurance. If you are pouring a slab on top of the gravel, the ${h.a('concrete-calculator', 'concrete calculator')} sizes the pour, and a ${h.a('mulch-calculator', 'mulch calculator')} handles the planting beds alongside.</p>`,
  faqs: [
    { q: 'How many tons of gravel do I need for a 20x20 driveway pad?', a: `At 4 inches deep, a 20 by 20 foot pad holds ${K.num(pad.cuYd, 2)} cubic yards. With compacted dense crushed base at ${K.num(dense, 2)} tons per cubic yard, the Wisconsin DOT figure, that is ${K.num(padT, 2)} tons. With select crushed material at ${K.num(select, 2)} tons per yard it is ${K.num(tons(pad.cuYd, select), 2)} tons. A deeper base for heavy vehicles raises the order in proportion.` },
    { q: 'How much does a cubic yard of crushed stone weigh?', a: `Once compacted in place, about ${K.num(dense, 2)} tons for dense graded base and ${K.num(select, 2)} tons for select crushed material, according to the Wisconsin DOT standard specifications. Loose stone in a pile or a truck weighs less per cubic yard because of the air between the pieces. Ask the yard which figure its scale ticket is based on before converting yards to tons.` },
    { q: 'How many square feet does a ton of gravel cover?', a: `At 2 inches deep, one ton of compacted dense base at ${K.num(dense, 2)} tons per cubic yard covers about ${K.num(perTonSqFt2)} square feet. At 4 inches it covers half that, about ${K.num(perTonSqFt2 / 2)}. Type your own area and depth into the calculator and switch the unit weight if the yard quotes a lighter or heavier stone.` },
    { q: 'What does crushed stone cost per ton in 2026?', a: `The U.S. Geological Survey estimated the 2025 average unit value of crushed stone at ${K.usd(usgs, 2)} per metric ton, about ${K.usd(usgsShort, 2)} per short ton, across all producers. That is a producer average, not a retail price. Yards add handling and trucking on top, so get a delivered price per ton and type it into the calculator.` },
    { q: 'Should I order gravel by the ton or by the cubic yard?', a: `By the ton when you can. Weight does not change when the stone settles or is compacted, while a loose cubic yard shrinks under a compactor. Work out the compacted volume, convert it with ${K.num(dense, 2)} tons per cubic yard for dense base, and order that weight. Yards that sell by volume can tell you what one of their yards weighs.` },
  ],
  related: ['concrete-calculator', 'mulch-calculator', 'square-footage-calculator', 'fence-cost-calculator', 'deck-cost-calculator'],
  sources: ['wisdot_305', 'wisdot_312', 'usgs_stone', 'bls_oews'],
});
