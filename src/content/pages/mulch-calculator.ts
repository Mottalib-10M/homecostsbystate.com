import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { looseVolume, bagsOf, CUFT_PER_CUYD } from '../../lib/engine/materials';

const M = K.P.materials;
const [dLo, dHi] = M.mulchDepthIn;
const per1in = M.mulchSqFtPerCuYdAt1In;
// The calculator's defaults (LooseCalc, mulch): a 30 x 4 ft bed, 2 cu ft bags; bag sizes offered: 1.5, 2, 3 cu ft.
const v = looseVolume(30 * 4, dHi);
const bags2 = bagsOf(v.cuFt, 2);
const bags3 = bagsOf(v.cuFt, 3);
const v2 = looseVolume(30 * 4, dLo);
const perYd = { b15: bagsOf(CUFT_PER_CUYD, 1.5), b2: bagsOf(CUFT_PER_CUYD, 2), b3: bagsOf(CUFT_PER_CUYD, 3) };
const hundred = looseVolume(100, dHi);
const ring = looseVolume(Math.PI * 4 ** 2, dHi); // a ring 8 ft across around a tree
const topUp = looseVolume(30 * 4, 1);
const big = looseVolume(1000, dHi);
const lw = K.natWage('landscaping');
const areas = [50, 100, 200, 300, 500, 1000];

export default definePage({
  id: 'mulch-calculator', group: 'materials', order: 40, slug: 'mulch-calculator', nav: 'Mulch calculator',
  card: 'Cubic yards and bags of mulch for a bed, at the depth extension services advise',
  title: 'Mulch Calculator 2026: Bags and Cubic Yards per Bed',
  description: `Mulch calculator 2026: a 30 x 4 ft bed at ${dHi} in deep takes ${K.num(v.cuYd, 2)} cu yd, or ${bags2} bags of 2 cu ft. One yard covers ${per1in} sq ft an inch deep (Clemson Extension).`,
  h1: 'Mulch calculator',
  intro: 'Enter the bed size, the depth and the bag size on the label: the bags and the bulk cubic yards appear together, with the cost if you type a price.',
  resume: `A planting bed 30 feet long and 4 feet wide, mulched ${dHi} inches deep, takes ${K.num(v.cuFt)} cubic feet of mulch: ${K.num(v.cuYd, 2)} cubic yards in bulk, ${bags2} bags of 2 cubic feet or ${bags3} bags of 3 cubic feet. Clemson Cooperative Extension gives the rule behind it: one cubic yard covers ${per1in} square feet one inch deep, so ${K.num(per1in / dLo)} square feet at ${dLo} inches and ${K.num(per1in / dHi)} at ${dHi}. Extension services put the right depth at ${dLo} to ${dHi} inches for fine wood and bark mulch, and the University of Florida IFAS advises no more than ${dHi}. At ${dLo} inches the same bed needs ${K.num(v2.cuYd, 2)} cubic yards. A cubic yard equals ${perYd.b2} bags of 2 cubic feet once you round up, ${perYd.b3} bags of 3 cubic feet or ${perYd.b15} bags of 1.5, which is the comparison that decides whether bulk delivery pays. Type the price of a bag and the calculator totals it.`,
  tool: 'mulch',
  body: (h) => `
<h2>The ${per1in} square foot rule</h2>
<p>A cubic yard is ${CUFT_PER_CUYD} cubic feet. Spread one inch thick, ${CUFT_PER_CUYD} cubic feet cover ${CUFT_PER_CUYD} times 12, or ${per1in} square feet, the figure the ${h.src('clemson_mulch', 'Clemson Home and Garden Information Center')} prints in its mulch fact sheet. Everything else follows from it: divide ${per1in} by your depth in inches to see how far a yard goes, or multiply your bed area by the depth in inches and divide by ${per1in} to see how many yards you need. The calculator does the second sum, then divides the cubic feet by the volume on the bag, rounding up because a half bag is still a bag at the register.</p>
${h.table(['Bed area', `Cu yd at ${dLo} in`, `2 cu ft bags at ${dLo} in`, `Cu yd at ${dHi} in`, `2 cu ft bags at ${dHi} in`, `3 cu ft bags at ${dHi} in`], areas.map((a) => { const x = looseVolume(a, dLo); const y = looseVolume(a, dHi); return [`${h.num(a)} sq ft`, h.num(x.cuYd, 2), bagsOf(x.cuFt, 2), h.num(y.cuYd, 2), bagsOf(y.cuFt, 2), bagsOf(y.cuFt, 3)]; }), `Mulch by bed area at the ${dLo} to ${dHi} inch depth advised by Clemson Extension and UF/IFAS.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>How deep to spread it</h2>
<p>Clemson says many wood and bark mulches, made of fine particles, should not go deeper than ${dLo} to ${dHi} inches. The ${h.src('ufifas_mulch', 'University of Florida IFAS Gardening Solutions')} page recommends ${dHi} inches and a ${dLo} to ${dHi} inch layer around established trees, shrubs and bedding plants, and tells readers not to apply more than ${dHi}. More is not better here, and both services draw the line at the same place. That is why the calculator suggests ${dLo} to ${dHi} inches in the depth field and starts at ${dHi}.</p>
<h3>Keep it off trunks, stems and walls</h3>
<p>Both extension services warn against piling mulch against plants. Clemson asks for 2 to 3 inches of clearance around the stems of woody plants and 6 to 12 inches from the walls of buildings, so leave a strip of bare soil or gravel along the foundation. UF/IFAS calls the cone of mulch heaped around a trunk "volcano mulching" and says it holds moisture and encourages rot; for large plants and trees it advises keeping mulch about a foot from the base. A ring 8 feet across around a young tree, ${dHi} inches deep, takes ${h.num(ring.cuFt, 1)} cubic feet, or ${bagsOf(ring.cuFt, 2)} bags of 2 cubic feet, before you subtract the bare circle at the trunk.</p>
<h2>Topping up an old bed</h2>
<p>Mulch breaks down, so most beds need a refresh rather than a full layer. Push a trowel into the bed and measure what is left, then enter only the depth you are adding. Bringing the 30 by 4 foot bed back up by one inch takes ${h.num(topUp.cuFt)} cubic feet, ${bagsOf(topUp.cuFt, 2)} bags of 2 cubic feet, a fraction of a new installation. If the old layer has matted into a crust that sheds water, break it up with a rake before you add more.</p>
<h2>Bags or a bulk load</h2>
<p>Bags are clean, easy to carry to a back corner and simple to store, and they win on small beds. Bulk mulch from a landscape yard is sold by the cubic yard and dumped in the driveway, so it pays when the job is large: the 1,000 square foot border in the table needs ${h.num(big.cuYd, 1)} cubic yards at ${dHi} inches, or ${bagsOf(big.cuFt, 2)} bags of 2 cubic feet. Compare the yard's delivered price per cubic yard with ${perYd.b2} times your bag price; that one multiplication answers the question for your area. Check the bag label too, since sizes vary between 1.5, 2 and 3 cubic feet and the calculator lets you pick each one.</p>
<h2>Paying someone to spread it</h2>
<p>${h.src('bls_oews', 'BLS')} counted ${h.num(lw.emp ?? 0)} landscaping and groundskeeping workers in ${h.wageRef.reference}, with a mean wage of ${h.usd(lw.mean, 2)} an hour and the middle half between ${h.usd(lw.p25 ?? 0, 2)} and ${h.usd(lw.p75 ?? 0, 2)}. A landscaping company bills above that wage for its truck, equipment and insurance, and some quote mulch installed per cubic yard; the yards on this page let you check that figure. If the bed borders a gravel path, the ${h.a('gravel-calculator', 'gravel calculator')} sizes the stone with the same length, width and depth inputs.</p>`,
  faqs: [
    { q: 'How many bags of mulch are in a cubic yard?', a: `A cubic yard holds ${CUFT_PER_CUYD} cubic feet, so it equals ${K.num(CUFT_PER_CUYD / 2, 1)} bags of 2 cubic feet, ${perYd.b2} once you round up to whole bags. With 3 cubic foot bags it is exactly ${perYd.b3}, and with 1.5 cubic foot bags ${perYd.b15}. Compare the price of that many bags with a delivered cubic yard before choosing bulk or bagged mulch.` },
    { q: 'How much mulch do I need for 100 square feet?', a: `At ${dHi} inches deep, 100 square feet takes ${K.num(hundred.cuFt)} cubic feet, which is ${K.num(hundred.cuYd, 2)} cubic yards or ${bagsOf(hundred.cuFt, 2)} bags of 2 cubic feet. At ${dLo} inches it takes ${K.num(looseVolume(100, dLo).cuFt, 1)} cubic feet, or ${bagsOf(looseVolume(100, dLo).cuFt, 2)} bags. Clemson Extension's rule is one cubic yard for every ${per1in} square feet an inch deep.` },
    { q: 'How deep should mulch be around trees and shrubs?', a: `${dLo} to ${dHi} inches. UF/IFAS recommends a ${dLo} to ${dHi} inch layer around established trees, shrubs and bedding plants and no more than ${dHi} inches, and Clemson says fine wood and bark mulch should stay within the same range. Keep it 2 to 3 inches away from woody stems and about a foot from the base of large trees.` },
    { q: 'How far from the house should mulch stop?', a: `Clemson Cooperative Extension advises keeping mulch 6 to 12 inches away from the walls of buildings. It also asks for 2 to 3 inches of clearance around woody stems and warns against piling mulch on trunks. Measure your bed from that line outward when you enter the width in the calculator.` },
    { q: 'Should I add new mulch on top of old mulch?', a: `Yes, if the old layer is thin. Measure what remains and add only enough to reach ${dLo} to ${dHi} inches in total, since UF/IFAS advises never going past ${dHi}. Topping up a 30 by 4 foot bed by one inch takes ${K.num(topUp.cuFt)} cubic feet, or ${bagsOf(topUp.cuFt, 2)} bags of 2 cubic feet. Break up any matted crust with a rake first.` },
  ],
  related: ['gravel-calculator', 'square-footage-calculator', 'fence-cost-calculator', 'deck-cost-calculator', 'concrete-calculator'],
  sources: ['clemson_mulch', 'ufifas_mulch', 'bls_oews'],
});
