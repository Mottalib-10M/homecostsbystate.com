import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { roof, pitchFactor } from '../../lib/engine/materials';

const M = K.P.materials;
const B = M.shingleBundlesPerSquare as Record<string, number>;
const rollSq = M.underlaymentSquaresPerRoll;
const starterFt = M.starterFtPerBundle;
const ridgeFt = M.ridgeFtPerCarton;
// The calculator's defaults (RoofingCalc): 2,000 sq ft footprint, 6/12, architectural, 10% allowance, 180 ft of eaves and rakes, 50 ft of hips and ridges.
const FP = 2000;
const RISE = 6;
const WASTE = 10;
const EAVES = 180;
const RIDGE = 50;
const r = roof({ footprintSqFt: FP, rise: RISE, wastePct: WASTE, bundlesPerSquare: B.architectural });
const rPrem = roof({ footprintSqFt: FP, rise: RISE, wastePct: WASTE, bundlesPerSquare: B.premium });
const rolls = Math.ceil(r.squares / rollSq);
const starter = Math.ceil(EAVES / starterFt);
const cartons = Math.ceil(RIDGE / ridgeFt);
const flat4 = roof({ footprintSqFt: FP, rise: 4, wastePct: WASTE, bundlesPerSquare: B.architectural });
const steep10 = roof({ footprintSqFt: FP, rise: 10, wastePct: WASTE, bundlesPerSquare: B.architectural });
const small = roof({ footprintSqFt: 1200, rise: 5, wastePct: WASTE, bundlesPerSquare: B.threeTab });
const sloped = roof({ footprintSqFt: FP, rise: 0, wastePct: WASTE, bundlesPerSquare: B.architectural });
const rc = K.job('roof');
const rw = K.natWage('roofers');
const cpi = K.month(K.ahsMeta.cpi.to);
const pitches = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12];

export default definePage({
  id: 'roofing-calculator', group: 'materials', order: 70, slug: 'roofing-calculator', nav: 'Roofing calculator',
  card: 'Roof area from footprint and pitch, squares, shingle bundles, underlayment, ridge',
  title: 'Roofing Calculator 2026: Squares, Bundles and Pitch',
  description: `Roofing calculator 2026: a ${K.num(FP)} sq ft footprint at ${RISE}/12 is ${K.num(r.area)} sq ft of roof, ${K.num(r.squares, 1)} squares with ${WASTE}% extra and ${r.bundles} bundles. No phone, no ZIP code asked.`,
  h1: 'Roofing calculator',
  intro: 'Measure the roof from above, choose the pitch and the shingle: squares, bundles, underlayment rolls, starter and ridge show up at once.',
  resume: `A roof that covers ${K.num(FP)} square feet seen from above, overhangs included, has ${K.num(r.area)} square feet of surface at a ${RISE}/12 pitch, because the slope stretches every foot of run by a factor of ${K.num(pitchFactor(RISE), 3)}. With a ${WASTE}% allowance for cuts, hips and valleys, that is ${K.num(r.squares, 1)} squares of 100 square feet and ${r.bundles} bundles of architectural shingles at ${B.architectural} bundles per square, the figure Owens Corning publishes for its laminated lines; a premium heavyweight shingle packed ${B.premium} bundles per square takes ${rPrem.bundles}. The same calculator counts ${rolls} rolls of synthetic underlayment at ${rollSq} squares a roll, ${starter} bundles of starter strip for ${EAVES} feet of eaves and rakes at ${starterFt} feet per bundle, and ${cartons} cartons of hip and ridge caps for ${RIDGE} feet at ${ridgeFt} feet per carton. A shallower 4/12 roof on the same house needs ${flat4.bundles} bundles, a 10/12 roof ${steep10.bundles}. Type the price per bundle from your supplier to total the shingles.`,
  tool: 'roofing',
  body: (h) => `
<h2>Footprint times pitch factor</h2>
<p>You do not need to climb up to measure a roof. Measure the outline of the roof from the ground, including the overhang of the eaves and rakes, and multiply length by width; on a simple rectangle that is the footprint. Then pick the pitch, the rise in inches for every 12 inches of horizontal run, which you can read with a level and a tape at the gable end or from the attic. The calculator multiplies the footprint by the pitch factor, the square root of 1 plus (rise/12) squared, which is the length of a rafter for each foot of run.</p>
<p>That shortcut has a useful property: for a roof where every plane has the same pitch, the factor applies to the whole footprint whatever the shape. A hip roof and a gable roof over the same ${h.num(FP)} square feet at ${RISE}/12 both carry ${h.num(r.area)} square feet of shingles. What changes is the waste: hips and valleys mean more cut shingles, so raise the allowance for a cut-up roof. Dormers or a porch at a different pitch should be measured separately and added.</p>
${h.table(['Pitch', 'Factor', 'Roof surface', `Squares (+${WASTE}%)`, `Bundles, ${B.architectural} per sq`, `Bundles, ${B.premium} per sq`], pitches.map((p) => { const x = roof({ footprintSqFt: FP, rise: p, wastePct: WASTE, bundlesPerSquare: B.architectural }); const y = roof({ footprintSqFt: FP, rise: p, wastePct: WASTE, bundlesPerSquare: B.premium }); return [`${p}/12`, h.num(pitchFactor(p), 3), `${h.num(x.area)} sq ft`, h.num(x.squares, 1), x.bundles, y.bundles]; }), `Roof of ${h.num(FP)} sq ft seen from above, ${WASTE}% allowance. Bundles per square from the Owens Corning guide specification.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>What a square and a bundle hold</h2>
<p>Roofers price and order in squares, 100 square feet of roof. The ${h.src('oc_spec', 'Owens Corning guide specification')}, revised in January 2026, gives the packaging line by line. Its Supreme three-tab shingle comes ${B.threeTab} bundles to a square, 80 shingles at a 5 inch exposure covering 100 square feet. TruDefinition Duration, a laminated architectural shingle, also comes ${B.architectural} bundles to a square, but 64 shingles cover 98.4 square feet, a detail that matters on a very large roof. Duration Premium, a heavier shingle, is packed ${B.premium} bundles of 16 to the square, which is why the shingle type changes the bundle count without changing the area. Other brands package differently; read the coverage on the wrapper and adjust the type if needed.</p>
<h3>Underlayment, starter and ridge</h3>
<p>The same specification lists RhinoRoof U20 synthetic underlayment at ${rollSq} squares a roll, the figure the calculator uses, and ProArmor at 9.29 squares, so switching products can change the roll count on a large house. ${h.src('oc_starter', 'Starter Strip Plus')} gives about ${starterFt} linear feet a bundle for the first course along the eaves and rakes, and ${h.src('oc_ridge', 'DuraRidge hip and ridge caps')} cover ${ridgeFt} linear feet a carton. Measure the eaves and rakes as the perimeter of the roof edge and the hips and ridges along their slope. A small ranch of 1,200 square feet at 5/12 in three-tab shingles comes to ${h.num(small.squares, 1)} squares and ${small.bundles} bundles, before starter and ridge.</p>
<h2>Materials list versus the roofer's quote</h2>
<p>The bundle count is what a supplier needs to deliver, and it helps you check a written estimate line by line. It is not the price of the job. A professional roof replacement had a median of ${h.usd(rc.typical)} in ${cpi} dollars in the ${h.src('census_ahs', '2023 American Housing Survey')}, with half of jobs between ${h.usd(rc.low)} and ${h.usd(rc.high)}; the ${h.a('roof-replacement-cost', 'roof replacement cost page')} adjusts that by state and house size. Labor is the other large part: ${h.src('bls_roofers', 'BLS')} counted ${h.num(rw.emp ?? 0)} roofers in ${h.wageRef.reference}, paid ${h.usd(rw.mean, 2)} an hour on average. Tear-off of old layers, rotten decking, drip edge, flashing, vents and disposal are priced on top of the shingles. Ask the contractor for the number of squares on the estimate; if it is far from the figure here at the same pitch, ask how it was measured.</p>`,
  faqs: [
    { q: 'How many bundles of shingles do I need for a 2,000 sq ft roof?', a: `It depends on what the 2,000 square feet measures. If it is the footprint seen from above, a ${RISE}/12 pitch turns it into ${K.num(r.area)} square feet of roof, ${K.num(r.squares, 1)} squares with a ${WASTE}% allowance, so ${r.bundles} bundles at ${B.architectural} per square. If 2,000 square feet is already the sloped roof area, that is ${sloped.bundles} bundles with the same allowance.` },
    { q: 'How do I convert roof pitch to a multiplier?', a: `Divide the rise by 12, square it, add 1 and take the square root. A 4/12 roof gives ${K.num(pitchFactor(4), 3)}, a ${RISE}/12 roof ${K.num(pitchFactor(RISE), 3)}, an 8/12 roof ${K.num(pitchFactor(8), 3)} and a 12/12 roof ${K.num(pitchFactor(12), 3)}. Multiply the footprint of the roof, overhangs included, by that factor to get the sloped surface you will shingle.` },
    { q: 'How many squares is a roof on a 2,000 sq ft house?', a: `Living area is not roof area. A two-story house of 2,000 square feet may sit on a 1,000 square foot footprint, while a ranch covers all of it plus the garage. Measure the roof outline from the ground, overhangs included: a ${K.num(FP)} square foot outline at ${RISE}/12 gives ${K.num(r.squares, 1)} squares with a ${WASTE}% allowance, and ${K.num(flat4.squares, 1)} at 4/12.` },
    { q: 'How many rolls of underlayment does a roof need?', a: `Divide the squares by the coverage on the roll. Owens Corning RhinoRoof U20 covers ${rollSq} squares a roll and ProArmor 9.29, so the ${K.num(r.squares, 1)} squares of a ${K.num(FP)} square foot footprint at ${RISE}/12 take ${rolls} rolls of U20. Laps at valleys, ridges and around penetrations use a little more, so round up rather than down.` },
    { q: 'How much starter strip and ridge cap do I need?', a: `Starter goes along every eave and rake: Owens Corning Starter Strip Plus covers about ${starterFt} linear feet a bundle, so ${EAVES} feet takes ${starter} bundles. Hip and ridge caps follow every hip and ridge: DuraRidge covers ${ridgeFt} linear feet a carton, so ${RIDGE} feet takes ${cartons} cartons. Measure both along the roof edges, not the house walls.` },
  ],
  related: ['roof-replacement-cost', 'roof:texas', 'square-footage-calculator', 'solar-panel-cost', 'paint-calculator'],
  sources: ['oc_spec', 'oc_starter', 'oc_ridge', 'census_ahs', 'bls_roofers', 'bls_oews'],
});
