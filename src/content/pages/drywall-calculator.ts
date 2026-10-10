import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { roomPaintArea, drywall } from '../../lib/engine/materials';

const M = K.P.materials;
const S = M.drywallSheets as Record<string, number>;
const per = M.drywallPer1000;
const per1000 = { screws: per.screwsLb, tapeFt: per.tapeFt, compoundGal: per.compoundGal };
// The calculator's defaults (DrywallCalc): 10% allowance, a 3 x 7 ft door and a 3 x 5 ft window deducted.
const WASTE = 10;
const DOOR = 21;
const WIN = 15;
const area = (l: number, w: number, ht = 8, ceiling = true, doors = 1, windows = 1) => roomPaintArea({ lengthFt: l, widthFt: w, heightFt: ht, doors, windows, doorSqFt: DOOR, windowSqFt: WIN, ceiling });
const sheetsFor = (sq: number, size = '4x8', waste = WASTE) => drywall({ areaSqFt: sq, sheetSqFt: S[size], wastePct: waste, per1000 });
const a = area(12, 12);
const d = sheetsFor(a.total);
const d12 = sheetsFor(a.total, '4x12');
const wallsOnly = area(12, 12, 8, false);
const dWalls = sheetsFor(wallsOnly.total);
const noWaste = sheetsFor(a.total, '4x8', 0);
const bigRoom = area(14, 20, 9);
const dBig = sheetsFor(bigRoom.total);
const garage = area(20, 22, 9, true, 1, 2);
const dGar = sheetsFor(garage.total, '4x12');
// USG UltraLight submittal: 1.25 lb per sq ft nominal for 1/2 in panels.
const ULTRA_LB = 1.25;
const dwW = K.natWage('drywall');
const rooms: Array<[number, number, number]> = [[10, 10, 8], [10, 12, 8], [12, 12, 8], [12, 16, 8], [14, 20, 9], [20, 22, 9]];

export default definePage({
  id: 'drywall-calculator', group: 'materials', order: 60, slug: 'drywall-calculator', nav: 'Drywall calculator',
  card: 'Sheets by size, screws, joint tape and compound for walls and ceiling',
  title: 'Drywall Calculator 2026: Sheets, Screws, Tape, Mud',
  description: `Drywall calculator 2026: a 12 x 12 ft room with 8 ft walls and ceiling takes ${d.sheets} sheets of 4 x 8 with ${WASTE}% extra, plus ${K.num(d.tapeFt ?? 0)} ft of tape. USG material figures.`,
  h1: 'Drywall calculator',
  intro: 'Give the room size and the sheet length: the number of panels, the screws, the joint tape and the gallons of compound appear together.',
  resume: `A 12 by 12 foot room with 8 foot walls and a ceiling, one door and one window cut out, needs ${d.sheets} sheets of 4 by 8 foot drywall once you add a ${WASTE}% allowance for cuts, or ${d12.sheets} sheets of 4 by 12. That board covers ${K.num(d.boardSqFt)} square feet, and the finishing supplies scale from the USG installation guide, which lists ${K.num(per.screwsLb, 1)} lb of Type W screws, ${K.num(per.tapeFt)} feet of joint tape and ${K.num(per.compoundGal)} gallons of all-purpose compound for every 1,000 square feet of panels. For this room that means about ${K.num(d.screws ?? 0, 1)} lb of screws, ${K.num(d.tapeFt ?? 0)} feet of tape and ${K.num(d.compoundGal ?? 0, 1)} gallons of compound. Leave the ceiling out and the walls alone take ${dWalls.sheets} sheets of 4 by 8. The calculator deducts ${DOOR} square feet per door and ${WIN} per window, lets you change the waste allowance and multiplies the sheet count by the price you see in the store.`,
  tool: 'drywall',
  body: (h) => `
<h2>How the sheet count is built</h2>
<p>Drywall is counted the way paint is measured: the four walls (perimeter times height), minus the openings, plus the ceiling if you are covering it. For the 12 by 12 room that is ${h.num(a.wallNet)} square feet of wall and ${h.num(a.ceiling)} of ceiling, ${h.num(a.total)} in all. The calculator adds your allowance, divides by the face of one sheet (${S['4x8']} square feet for 4 by 8, ${S['4x10']} for 4 by 10, ${S['4x12']} for 4 by 12, the three sizes in the ${h.src('usg_j371', 'USG installation guide')}) and rounds up. With no allowance at all the room would need ${noWaste.sheets} sheets; the default ${WASTE}% brings it to ${d.sheets}.</p>
<p>Why add anything? Each window and door leaves offcuts too oddly shaped to reuse and outlet boxes and corners waste narrow strips. A plain bedroom can get by with less, a bathroom full of pipes and a soffit needs more, which is why the field stays open.</p>
${h.table(['Room', 'Area to cover', '4 x 8 sheets', '4 x 12 sheets', 'Screws', 'Tape', 'Compound'], rooms.map(([l, w, ht]) => { const x = area(l, w, ht); const s8 = sheetsFor(x.total); const s12 = sheetsFor(x.total, '4x12'); return [`${l} x ${w} ft, ${ht} ft walls`, `${h.num(x.total)} sq ft`, s8.sheets, s12.sheets, `${h.num(s8.screws ?? 0, 1)} lb`, `${h.num(s8.tapeFt ?? 0)} ft`, `${h.num(s8.compoundGal ?? 0, 1)} gal`]; }), `Walls and ceiling, one door and one window deducted, ${WASTE}% allowance. Supplies scaled from USG figures per 1,000 sq ft of 4 x 8 board.`, ['l', 'r', 'r', 'r', 'r', 'r', 'r'])}
<h2>Long sheets or short sheets</h2>
<p>Four by twelve panels hide most of the butt joints, the short ends that have no tapered edge and are the hardest seams to make flat. On an 8 foot wall laid horizontally, a 12 foot sheet runs the full length of a 12 foot room in one piece. The catch is weight and access. USG lists its ${h.ext('https://www.usg.com/content/dam/USG/pdpmovedocuments/sheetrock-ultralight-panels-submittal-en-wb2501.pdf', 'UltraLight 1/2 inch panel')} at a nominal ${h.num(ULTRA_LB, 2)} lb per square foot, so a 4 by 8 sheet of it weighs about ${h.num(S['4x8'] * ULTRA_LB)} lb and a 4 by 12 about ${h.num(S['4x12'] * ULTRA_LB)} lb, and standard board is heavier still. A 12 foot sheet will not turn the corner of many stairways, and on a ceiling it usually takes two people or a panel lift. For a 20 by 22 foot garage with 9 foot walls, 4 by 12 board brings the count to ${dGar.sheets} panels, where the long sheets cut the number of butt joints to finish.</p>
<h3>Thickness and fastening</h3>
<p>USG makes gypsum panels in 5/8, 1/2, 3/8 and 1/4 inch, and warns that the 1/4 inch panel is only for covering existing walls and ceilings, never as a single layer. Its guide spaces screws at most 12 inches apart on ceilings and 16 inches on walls, at least 3/8 inch from the ends and edges. Those spacings are where the ${h.num(per.screwsLb, 1)} lb per 1,000 square feet comes from. If you nail instead, the same table lists 5.3 lb of nails for 1,000 square feet, cut in half when the board is glued as well.</p>
<h2>Tape and compound: the part people underbuy</h2>
<p>The ${h.num(per.compoundGal)} gallons per 1,000 square feet that USG gives for all-purpose compound covers the flat joints, inside corners and outside corners finished with metal bead in a typical room. A room with many outside corners, a coffered ceiling or a lot of patching will use more. The calculator scales tape and compound to the board you hang rather than the wall area, so the ${WASTE}% allowance raises them too; for the 14 by 20 foot room with 9 foot walls in the table, that is ${h.num(dBig.tapeFt ?? 0)} feet of tape and ${h.num(dBig.compoundGal ?? 0, 1)} gallons of compound on ${dBig.sheets} sheets. Paper tape comes in rolls, compound in buckets and boxes: round both up to the package on the shelf. Before painting, plan a coat of drywall primer; the ${h.a('paint-calculator', 'paint calculator')} sizes it with the same room inputs.</p>
<h2>Hanging it yourself or hiring out</h2>
<p>${h.src('bls_oews', 'BLS')} counted ${h.num(dwW.emp ?? 0)} drywall and ceiling tile installers in ${h.wageRef.reference}, with a mean wage of ${h.usd(dwW.mean, 2)} an hour and the middle half earning between ${h.usd(dwW.p25 ?? 0, 2)} and ${h.usd(dwW.p75 ?? 0, 2)}. Some owners split the job: they hang the board, which is mostly lifting and screwing, and pay a finisher for the coats of mud and the sanding, the step that shows under paint. When you compare quotes, ask whether they price per sheet or per square foot of board and whether the level of finish is stated in writing.</p>`,
  faqs: [
    { q: 'How many sheets of drywall do I need for a 12x12 room?', a: `With 8 foot walls, the ceiling, one door and one window, a 12 by 12 room needs ${d.sheets} sheets of 4 by 8 drywall after a ${WASTE}% allowance for cuts, or ${d12.sheets} sheets of 4 by 12. Walls alone take ${dWalls.sheets} sheets of 4 by 8. The count uses ${K.num(a.total)} square feet of surface divided by ${S['4x8']} square feet per sheet, rounded up.` },
    { q: 'How many drywall screws do I need per sheet?', a: `USG lists ${K.num(per.screwsLb, 1)} lb of Type W screws for 1,000 square feet of panels, with screws no more than 12 inches apart on ceilings and 16 inches on walls. That is about ${K.num(per.screwsLb * S['4x8'] / 1000, 2)} lb for one 4 by 8 sheet. Buy screws by the pound box and keep spares: some always strip or fall.` },
    { q: 'How much joint compound do I need for drywall?', a: `About ${K.num(per.compoundGal)} gallons of all-purpose compound per 1,000 square feet of board, according to USG, for flat joints and inside and outside corners in a typical room. A 12 by 12 room with its ceiling, ${d.sheets} sheets of 4 by 8, takes roughly ${K.num(d.compoundGal ?? 0, 1)} gallons. Rooms with many corners or repairs use more, so round up to the next bucket.` },
    { q: 'How much drywall tape do I need for a room?', a: `USG puts it at ${K.num(per.tapeFt)} feet of joint tape per 1,000 square feet of panels. For a 12 by 12 room with 8 foot walls and a ceiling, hung in ${d.sheets} sheets of 4 by 8, that comes to about ${K.num(d.tapeFt ?? 0)} feet. Compare that with the length printed on the roll before you pick up a second one, and keep a few feet spare for repairs.` },
    { q: 'Are 4x12 drywall sheets better than 4x8?', a: `They leave fewer butt joints to finish, so the walls come out flatter with less taping, and the 12 by 12 room drops from ${d.sheets} to ${d12.sheets} sheets. But a 4 by 12 panel of 1/2 inch UltraLight already weighs about ${K.num(S['4x12'] * ULTRA_LB)} lb at USG's nominal ${K.num(ULTRA_LB, 2)} lb per square foot, and it may not fit up a stairway. Use them where access is easy.` },
  ],
  related: ['paint-calculator', 'square-footage-calculator', 'concrete-calculator', 'roofing-calculator', 'deck-cost-calculator'],
  sources: ['usg_j371', 'bm_primer', 'bls_oews'],
});
