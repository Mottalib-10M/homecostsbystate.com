import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { shapeArea, paintGallons, looseVolume, drywall } from '../../lib/engine/materials';

const M = K.P.materials;
// Exact definitions used by the calculator: 1 sq yd = 9 sq ft, 1 sq ft = 0.09290304 sq m.
const SQYD = 9;
const SQM = 0.09290304;
// The calculator's default (SqftCalc): one 12 x 14 ft rectangle.
const room = shapeArea('rect', 12, 14);
const r12 = shapeArea('rect', 12, 12);
const lMain = shapeArea('rect', 20, 12);
const lWing = shapeArea('rect', 10, 8);
const lShape = lMain + lWing;
const tri = shapeArea('triangle', 24, 6);
const circle = shapeArea('circle', 12);
const trap = shapeArea('trapezoid', 10, 16, 12);
const bay = shapeArea('trapezoid', 8, 4, 2);
const per1in = M.mulchSqFtPerCuYdAt1In;
const cov = M.paintCoverage.default;
const sheet = M.drywallSheets['4x8'];
const floorPaint = paintGallons(room, M.paintCoatsRecommended, cov);
const circleMulch = looseVolume(circle, M.mulchDepthIn[1]);
const ceilingBoard = drywall({ areaSqFt: room, sheetSqFt: sheet, wastePct: 0, per1000: {} });
const examples: Array<[string, string, number]> = [
  ['Rectangle', '12 x 14 ft bedroom', room],
  ['Square', '12 x 12 ft room', r12],
  ['L shape', '20 x 12 ft plus 10 x 8 ft', lShape],
  ['Triangle', 'Gable end, 24 ft base, 6 ft high', tri],
  ['Circle', 'Patio 12 ft across', circle],
  ['Trapezoid', 'Lot, 10 and 16 ft sides, 12 ft deep', trap],
];

export default definePage({
  id: 'square-footage-calculator', group: 'materials', order: 20, slug: 'square-footage-calculator', nav: 'Square footage calculator',
  card: 'Area of rooms, lots and patios in square feet, square yards and square meters',
  title: 'Square Footage Calculator 2026: Rooms, Lots, L Shapes',
  description: `Square footage calculator 2026: a 12 x 14 ft room is ${K.num(room)} sq ft, ${K.num(room / SQYD, 2)} sq yd. Add rectangles, triangles, circles and trapezoids, with your price per sq ft.`,
  h1: 'Square footage calculator',
  intro: 'Describe up to four shapes in feet: the total area shows in square feet, square yards and square meters, and in dollars if you add a price.',
  resume: `A 12 by 14 foot room measures ${K.num(room)} square feet, which is ${K.num(room / SQYD, 2)} square yards or ${K.num(room * SQM, 2)} square meters: multiply length by width in feet and you have it. Rooms and yards that are not rectangles break into simple shapes. An L-shaped living area of 20 by 12 feet with a 10 by 8 foot wing adds ${K.num(lMain)} and ${K.num(lWing)} for ${K.num(lShape)} square feet. A triangle is half of base times height, so a gable wall 24 feet wide and 6 feet tall above the eaves has ${K.num(tri)} square feet. A round patio 12 feet across covers ${K.num(circle, 1)} square feet, pi times the radius squared, and a trapezoid lot is the average of its two parallel sides times the depth. The calculator takes up to four shapes at once, gives the total in all three units and, if you type a price per square foot for flooring, sod or paint labor, multiplies it out.`,
  tool: 'square-footage',
  body: (h) => `
<h2>Measuring a room so the number holds up</h2>
<p>Measure wall to wall at floor level, not along the baseboard tops, and write each dimension in feet with a decimal. Inches convert by dividing by 12: 7 inches is ${h.num(7 / 12, 2)} feet, so a wall of 11 feet 7 inches is ${h.num(11 + 7 / 12, 2)} feet. Rounding every dimension to the nearest half foot before multiplying can shift a large room by more than you think, so keep two decimals and round only the final answer. Closets with the same flooring count as part of the room; measure them as separate rectangles.</p>
<p>For any shape that is not a plain rectangle, sketch it on paper first and draw lines that cut it into rectangles, triangles and half circles. Each piece goes into one row of the calculator. The table shows the result for common shapes.</p>
${h.table(['Shape', 'Example', 'Square feet', 'Square yards', 'Square meters'], examples.map(([s, e, a]) => [s, e, h.num(a, 1), h.num(a / SQYD, 2), h.num(a * SQM, 2)]), 'Areas from the shape formulas the calculator uses; 1 sq yd = 9 sq ft, 1 sq ft = 0.0929 sq m.', ['l', 'l', 'r', 'r', 'r'])}
<h3>L shapes, bay windows and angled walls</h3>
<p>An L-shaped room has two correct splits, one long rectangle plus one short, or two overlapping ones minus the overlap; the first is simpler. A bay window that pushes out 2 feet with a back of 8 feet and a face of 4 feet is a trapezoid of ${h.num(bay)} square feet. A wall that meets another at an angle leaves a triangle you add or subtract. If you are pricing a floor, include the area under a fridge or a freestanding tub, but leave out kitchen cabinets and built-in islands that the flooring will not run under.</p>
<h2>Turning square feet into material</h2>
<p>Area is the starting point for almost every purchase in the house, and each material speaks its own unit. Carpet is often priced by the square yard, which is why the calculator shows it. Paint labels give coverage per gallon, around ${h.num(cov)} square feet per coat in the default of the ${h.a('paint-calculator', 'paint calculator')} and ${h.num(M.paintCoverage.bmRegal[0])} to ${h.num(M.paintCoverage.bmRegal[1])} on the ${h.src('bm_regal', 'Benjamin Moore Regal Select data sheet')}; two coats on the 12 by 14 foot ceiling would take ${h.num(floorPaint.exact, 2)} gallons. Drywall sheets cover ${sheet} square feet each in the 4 by 8 size listed by ${h.src('usg_j371', 'USG')}, so the 12 by 14 foot ceiling needs ${ceilingBoard.sheets} sheets before any allowance. Mulch is bought by the cubic yard: ${h.src('clemson_mulch', 'Clemson Extension')} puts one yard at ${per1in} square feet an inch deep, so the round patio area as a planting bed would take ${h.num(circleMulch.cuYd, 2)} cubic yards at ${M.mulchDepthIn[1]} inches. Roofing is sold by the square of 100 square feet, and the ${h.src('oc_spec', 'Owens Corning specification')} rates one square of three-tab shingles at 100 square feet of coverage; the ${h.a('roofing-calculator', 'roofing calculator')} adds the pitch.</p>
<h2>Living area is a different number</h2>
<p>The square footage on a listing or an appraisal follows its own rules about stairs, attics, ceiling height and finished space, and it is often measured from the outside of the walls, so it rarely matches the sum of the rooms you measure inside. Use your own measurements for materials and contractor quotes; use the listed living area when a source like the ${h.a('roof-replacement-cost', 'roof replacement cost page')} groups prices by house size.</p>
<h2>Pricing a job by the square foot</h2>
<p>Flooring installers, sod suppliers, painters and concrete finishers often quote per square foot. Type that price into the optional field and the calculator multiplies it by the total. Add a margin for cuts and pattern matching on flooring and tile before you buy: the waste depends on the layout and the product, and the installer or the box label gives the figure that fits your floor.</p>`,
  faqs: [
    { q: 'How do I calculate the square footage of an L-shaped room?', a: `Split the L into two rectangles, find each area and add them. A room of 20 by 12 feet with a 10 by 8 foot wing is ${K.num(lMain)} plus ${K.num(lWing)}, or ${K.num(lShape)} square feet. Enter each rectangle as a separate area in the calculator and it adds them, then converts the total to ${K.num(lShape / SQYD, 1)} square yards for carpet.` },
    { q: 'How many square feet is a 12x12 room?', a: `${K.num(r12)} square feet, which is ${K.num(r12 / SQYD)} square yards or ${K.num(r12 * SQM, 2)} square meters. Multiply the length by the width in feet. If either side includes inches, convert them first by dividing by 12, so 12 feet 6 inches becomes ${K.num(12.5, 1)} feet and the room becomes ${K.num(shapeArea('rect', 12.5, 12))} square feet.` },
    { q: 'How do I convert square feet to square yards for carpet?', a: `Divide the square feet by ${SQYD}, since a square yard is 3 feet by 3 feet. A 12 by 14 foot bedroom of ${K.num(room)} square feet is ${K.num(room / SQYD, 2)} square yards. Carpet comes in fixed roll widths, so seams and cuts add to the quantity the store will sell you; the calculator gives the net area to start from.` },
    { q: 'How do I find the area of a round patio?', a: `Multiply pi, about 3.1416, by the radius squared. The radius is half the width across, so a patio 12 feet across has a radius of 6 feet and an area of ${K.num(circle, 1)} square feet. Choose the circle shape in the calculator, type the diameter, and it does the arithmetic. A half circle is half that figure.` },
    { q: 'How do I measure the square footage of a triangular wall?', a: `Multiply the base by the height and divide by 2. A gable end 24 feet wide and 6 feet tall from the eaves to the peak has ${K.num(tri)} square feet. Add it to the rectangle of wall below it to get the whole end of the house, which you then use for siding or paint.` },
  ],
  related: ['paint-calculator', 'drywall-calculator', 'mulch-calculator', 'roofing-calculator', 'concrete-calculator', 'roof-replacement-cost'],
  sources: ['bm_regal', 'usg_j371', 'clemson_mulch', 'oc_spec'],
});
