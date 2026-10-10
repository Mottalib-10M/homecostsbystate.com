import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { roomPaintArea, paintGallons } from '../../lib/engine/materials';

const M = K.P.materials;
const cov = M.paintCoverage.default;
const coats = M.paintCoatsRecommended;
const [regLo, regHi] = M.paintCoverage.bmRegal;
const [priLo, priHi] = M.paintCoverage.bmPrimer;
const [valLo, valHi] = M.paintCoverage.valsparUltra;
// The calculator deducts a 3 x 7 ft door and a 3 x 5 ft window (PaintCalc).
const DOOR = 21;
const WIN = 15;
const room = (l: number, w: number, ht = 8, doors = 1, windows = 2, ceiling = false) => roomPaintArea({ lengthFt: l, widthFt: w, heightFt: ht, doors, windows, doorSqFt: DOOR, windowSqFt: WIN, ceiling });
const a = room(12, 12);
const g = paintGallons(a.total, coats, cov);
const aC = room(12, 12, 8, 1, 2, true);
const gC = paintGallons(aC.total, coats, cov);
const one = paintGallons(a.total, 1, cov);
const lo = paintGallons(a.total, coats, valLo);
const hi = paintGallons(a.total, coats, regHi);
const big = room(14, 16);
const gBig = paintGallons(big.total, coats, cov);
const tall = room(12, 12, 9);
const gTall = paintGallons(tall.total, coats, cov);
const fresh = room(12, 12, 8, 1, 2, true);
const primer = paintGallons(fresh.total, 1, priLo);
const pw = K.natWage('painters');
const sizes: Array<[number, number]> = [[10, 10], [10, 12], [12, 12], [12, 14], [14, 16], [16, 20], [20, 24]];

export default definePage({
  id: 'paint-calculator', group: 'materials', order: 50, slug: 'paint-calculator', nav: 'Paint calculator',
  card: 'Gallons and quarts for a room, doors and windows deducted, ceiling optional',
  title: 'Paint Calculator 2026: Gallons for a Room, Walls, Ceiling',
  description: `Paint calculator 2026: a 12 x 12 ft bedroom with 8 ft walls takes ${g.gallons} gallons for ${coats} coats at ${cov} sq ft per gallon, ${gC.gallons} with the ceiling. Data-sheet coverage.`,
  h1: 'Paint calculator',
  intro: 'Enter the room, the doors and windows and the coverage printed on the can: the gallons, the exact need and the quarts show while you type.',
  resume: `A 12 by 12 foot bedroom with 8 foot walls, one door and two windows has ${K.num(a.total)} square feet of wall to paint, and two coats at ${cov} square feet per gallon take ${K.num(g.exact, 2)} gallons, so you buy ${g.gallons} gallons; add the ceiling and the need climbs to ${K.num(gC.exact, 2)}, or ${gC.gallons} gallons. The calculator subtracts ${DOOR} square feet for each 3 by 7 foot door and ${WIN} for each 3 by 5 foot window, multiplies by the number of coats and divides by the coverage. Its default of ${cov} sits inside the spread rates on manufacturer data sheets: ${regLo} to ${regHi} square feet per gallon for Benjamin Moore Regal Select, ${valLo} to ${valHi} for Valspar Ultra. Benjamin Moore recommends ${coats} coats on bare walls and for full color, and Valspar lists one or two. A single coat over the same color needs only ${K.num(one.exact, 2)} gallons in that bedroom, which ${one.quarts <= 4 ? 'fits in one gallon' : `means ${one.quarts} quarts`}. Type your price per gallon to see the bill.`,
  tool: 'paint',
  body: (h) => `
<h2>Wall area first, then coats, then coverage</h2>
<p>Paint is sold by volume but used by area, so every estimate starts with the walls. The perimeter of the room times the wall height gives the gross area: ${h.num(a.walls)} square feet for the 12 by 12 bedroom. Doors and windows come off next (${h.num(a.openings)} square feet for one door and two windows), leaving ${h.num(a.total)}. Multiply by the coats and divide by the coverage on the label, and you have the exact gallons. The calculator rounds up to whole gallons for the main figure and also shows quarts, since a gallon and a quart or two often beats a second full can.</p>
<p>Ceiling height moves the result more than people expect. The same bedroom with 9 foot walls has ${h.num(tall.total)} square feet to cover and needs ${h.num(gTall.exact, 2)} gallons for two coats, against ${h.num(g.exact, 2)} at 8 feet.</p>
${h.table(['Room', 'Walls to paint', `Walls, ${coats} coats`, 'Walls and ceiling', 'Gallons to buy'], sizes.map(([l, w]) => { const x = room(l, w); const y = room(l, w, 8, 1, 2, true); const gx = paintGallons(x.total, coats, cov); const gy = paintGallons(y.total, coats, cov); return [`${l} x ${w} ft`, `${h.num(x.total)} sq ft`, `${h.num(gx.exact, 2)} gal`, `${h.num(gy.exact, 2)} gal`, `${gx.gallons} / ${gy.gallons}`]; }), `8 ft walls, one door and two windows deducted, ${coats} coats at ${cov} sq ft per gallon. Last column: walls only / with ceiling.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>What the coverage number on the can really means</h2>
<p>The spread rate on a data sheet assumes the film thickness the maker intends, 3.6 to 4.0 mils wet for Regal Select, on a sound surface. ${h.src('bm_regal', 'Benjamin Moore lists Regal Select')} at ${regLo} to ${regHi} square feet per gallon "depending on surface texture and porosity", and ${h.src('valspar_ultra', 'Valspar gives Ultra Interior')} ${valLo} to ${valHi}. On the bedroom above, that spread alone moves the need from ${h.num(hi.exact, 2)} gallons at ${regHi} square feet to ${h.num(lo.exact, 2)} at ${valLo}. Knockdown or orange-peel texture, a roller with a thick nap and fresh patches of joint compound all pull you toward the low end, which is why the calculator starts at ${cov} rather than at the best case printed on the label.</p>
<h3>One coat, two coats, or primer first</h3>
<p>Benjamin Moore recommends ${coats} coats for full color development and on bare substrates, and says previously painted surfaces can take one or two. Valspar lists one or two coats for Ultra, and for drastic color changes or deep, vivid colors it advises a tintable primer first, warning that some bright shades may need an extra coat to hide. In practice, repainting a white wall in a slightly warmer white is often a one-coat job; going from navy to cream is not.</p>
<p>New drywall is its own case. Raw paper and joint compound drink paint unevenly, so the first coat should be a primer made for it. ${h.src('bm_primer', 'Benjamin Moore’s drywall primer')} spreads ${priLo} to ${priHi} square feet per gallon. For the 12 by 12 bedroom with its ceiling, one coat of primer at ${priLo} square feet needs ${h.num(primer.exact, 2)} gallons, before the two finish coats. If you are hanging the board yourself, the ${h.a('drywall-calculator', 'drywall calculator')} uses the same room inputs to count sheets, tape and compound.</p>
<h2>Rooms that are not boxes</h2>
<p>For an open plan or an L-shaped room, add up the length of every wall you will paint, then enter half of that total as the length and zero as the width, since the calculator doubles length plus width to get the perimeter. Stairwells and cathedral ceilings are easier to measure piece by piece with the ${h.a('square-footage-calculator', 'square footage calculator')} (a gable end is a triangle), then divide the total by the coverage yourself. Closets count; built-in shelves and kitchen cabinets do not. Trim, doors and window casings take a different paint, usually a semi-gloss, so price them as a separate small purchase.</p>
<h2>Painting it yourself or hiring a painter</h2>
<p>Paint is the smaller part of a professional job. ${h.src('bls_oews', 'BLS')} counted ${h.num(pw.emp ?? 0)} construction and maintenance painters in ${h.wageRef.reference}, with a mean wage of ${h.usd(pw.mean, 2)} an hour and the middle half between ${h.usd(pw.p25 ?? 0, 2)} and ${h.usd(pw.p75 ?? 0, 2)}. A contractor's hourly rate sits above that wage because it carries insurance, travel, drop cloths and profit, and most of the hours go into moving furniture, filling holes, caulking and cutting in. Ask whether a quote includes the paint and which line it uses, then check its gallon count against the one this page gives for your rooms.</p>`,
  faqs: [
    { q: 'How many gallons of paint do I need for a 12x12 room?', a: `With 8 foot walls, one door and two windows, a 12 by 12 room has ${K.num(a.total)} square feet of wall. Two coats at ${cov} square feet per gallon need ${K.num(g.exact, 2)} gallons, so buy ${g.gallons}. Painting the ceiling too raises the need to ${K.num(gC.exact, 2)} gallons. Textured walls or a large color change can add a gallon, so check the coverage on your can.` },
    { q: 'How many square feet does a gallon of interior paint cover?', a: `Between ${valLo} and ${regHi} square feet per coat on the data sheets read for this page: ${regLo} to ${regHi} for Benjamin Moore Regal Select and ${valLo} to ${valHi} for Valspar Ultra. Benjamin Moore notes the spread rate depends on surface texture and porosity. Rough, patched or unprimed walls land at the low end, which is why the calculator defaults to ${cov}.` },
    { q: 'Do I really need two coats of paint?', a: `On bare drywall or for a real change of color, yes: Benjamin Moore recommends ${coats} coats for full color development and on bare substrates. Over a sound coat of a similar color, one coat may do, and in a 12 by 12 bedroom that halves the need to ${K.num(one.exact, 2)} gallons. Valspar adds that some deep or bright colors may need an extra coat.` },
    { q: 'How much primer do I need for new drywall?', a: `One coat over the whole area you will paint. Benjamin Moore rates its drywall primer at ${priLo} to ${priHi} square feet per gallon, so a 12 by 12 room with 8 foot walls and its ceiling, ${K.num(fresh.total)} square feet after one door and two windows, takes ${K.num(primer.exact, 2)} gallons at the low rate. Set the calculator to one coat and ${priLo} square feet per gallon to run your room.` },
    { q: 'Should I subtract doors and windows when estimating paint?', a: `For a room with several openings, yes. The calculator removes ${DOOR} square feet for each standard door and ${WIN} for each window, which in a 12 by 12 bedroom with one door and two windows saves ${K.num(a.openings)} square feet per coat. Leave large picture windows or sliding doors in as two or three windows, and add nothing back for trim, which uses its own paint.` },
  ],
  related: ['drywall-calculator', 'square-footage-calculator', 'roofing-calculator', 'deck-cost-calculator', 'fence-cost-calculator'],
  sources: ['bm_regal', 'bm_primer', 'valspar_ultra', 'bls_oews'],
});
