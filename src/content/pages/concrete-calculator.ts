import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { slabCuFt, cylinderCuFt, concrete, bagsOf, CUFT_PER_CUYD } from '../../lib/engine/materials';

const M = K.P.materials;
const Y = M.concreteYieldCuFt as Record<string, number>;
const [ovLow, ovHigh] = M.concreteOveragePct;
const [truckLow, truckHigh] = M.truckCuYd;
const ex = concrete(slabCuFt(10, 10, 4), ovLow, Y);
const ex12 = concrete(slabCuFt(10, 12, 4), ovLow, Y);
const thick = concrete(slabCuFt(10, 10, 4.125), 0, Y);
const exact4 = concrete(slabCuFt(10, 10, 4), 0, Y);
const bagsPerYd = bagsOf(CUFT_PER_CUYD, Y['80']);
const hole = cylinderCuFt(10, 36 / 12);
const oneHole = concrete(hole, ovLow, Y);
const tenHoles = concrete(hole * 10, ovLow, Y);
const drive = concrete(slabCuFt(12, 24, 4), ovLow, Y);
const drive6 = concrete(slabCuFt(12, 24, 6), ovLow, Y);
const dw = K.job('driveway');
const dwA = K.ahs('driveway');
const sh = K.shares('driveway');
const cw = K.natWage('cement');
const cpi = K.month(K.ahsMeta.cpi.to);
const slabs: Array<[number, number, number]> = [[4, 4, 4], [10, 10, 4], [10, 12, 4], [12, 12, 4], [16, 16, 4], [20, 20, 4], [12, 24, 6]];

export default definePage({
  id: 'concrete-calculator', group: 'materials', order: 10, slug: 'concrete-calculator', nav: 'Concrete calculator',
  card: 'Cubic yards, 80, 60, 50 and 40 lb bags for slabs, footings and post holes',
  title: 'Concrete Calculator 2026: Bags, Cubic Yards and Cost',
  description: `Concrete calculator 2026: a 10 x 10 ft slab 4 in thick needs ${K.num(ex.cuYdWithWaste, 2)} cu yd with ${ovLow}% extra, or ${ex.bags['80']} bags of 80 lb and ${ex.bags['60']} of 60 lb. Post holes too, no ZIP code.`,
  h1: 'Concrete calculator',
  intro: 'Type the size of the slab or the holes: cubic yards and bag counts for every bag size appear at once, with the extra a ready-mix plant would add.',
  resume: `A 10 by 10 foot slab poured 4 inches thick holds ${K.num(ex.cuFt, 1)} cubic feet of concrete, or ${K.num(ex.cuYd, 2)} cubic yards, and with the ${ovLow}% margin the National Ready Mixed Concrete Association puts at the low end of its advice you should plan on ${K.num(ex.cuYdWithWaste, 2)} cubic yards: ${ex.bags['80']} bags of 80 lb, ${ex.bags['60']} bags of 60 lb or ${ex.bags['40']} bags of 40 lb. Those counts use the yields QUIKRETE prints for its Concrete Mix No. 1101, ${K.num(Y['80'], 2)} cubic feet for an 80 lb bag and ${K.num(Y['40'], 2)} for a 40 lb bag. Push the slab to 10 by 12 feet and the order grows to ${ex12.bags['80']} of the big bags. A full cubic yard takes ${bagsPerYd} bags of 80 lb, which is the point where a truck from a ready-mix plant, carrying ${truckLow} to ${truckHigh} cubic yards, starts to make more sense than mixing by hand. Type the shelf price of a bag or your plant's price per yard and the calculator multiplies it for you.`,
  tool: 'concrete',
  body: (h) => `
<h2>From slab size to bag count</h2>
<p>The math has three steps. Multiply length by width in feet, then by the thickness in inches divided by 12: that gives cubic feet. Divide by ${CUFT_PER_CUYD} for cubic yards, the unit every ready-mix plant quotes. For bags, divide the cubic feet by what one bag makes once mixed with water. ${h.src('quikrete_1101', 'QUIKRETE publishes those yields')} on its data sheet: ${h.num(Y['80'], 2)} cubic feet for 80 lb, ${h.num(Y['60'], 2)} for 60 lb, ${h.num(Y['50'], 3)} for 50 lb and ${h.num(Y['40'], 2)} for 40 lb. Each count is rounded up, because a store will not sell you two thirds of a bag.</p>
<p>The table runs the same arithmetic for common pours at ${ovLow}% over the plan volume. The last line is a single car pad thickened to 6 inches, the kind of slab that carries a vehicle rather than a grill.</p>
${h.table(['Pour', 'In the forms', `Order (+${ovLow}%)`, '80 lb bags', '60 lb bags', '40 lb bags'], slabs.map(([l, w, t]) => { const c = concrete(slabCuFt(l, w, t), ovLow, Y); return [`${l} x ${w} ft, ${t} in`, `${h.num(c.cuYd, 2)} cu yd`, `${h.num(c.cuYdWithWaste, 2)} cu yd`, c.bags['80'], c.bags['60'], c.bags['40']]; }), `Concrete for flat pours, QUIKRETE Concrete Mix yields, ${ovLow}% overage.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<h3>Why the plant tells you to order extra</h3>
<p>The ${h.src('nrmca_cip31', 'NRMCA guide to ordering ready mixed concrete')} says to order ${ovLow}% to ${ovHigh}% more than the plan dimensions give, which is why the calculator starts at ${ovLow}% and lets you raise it. The reason is mostly the ground. A gravel base that dips a little under the screed swallows concrete you never see. The ${h.src('nrmca_cip8', 'association’s note on yield discrepancies')} puts a number on it: one eighth of an inch of extra depth on a 4 inch slab is a 3% shortage. On the 10 by 10 example, the exact plan volume is ${exact4.bags['80']} bags of 80 lb; at 4 1/8 inches it becomes ${thick.bags['80']}. Forms that bow outward, spillage from the wheelbarrow and a little left in the mixer drum add to it.</p>
<h2>Post holes, piers and deck footings</h2>
<p>Switch the calculator to round holes and it uses the volume of a cylinder instead. A 10 inch hole dug 36 inches deep holds ${h.num(hole, 2)} cubic feet, so one hole takes ${oneHole.bags['80']} bags of 80 lb with the ${ovLow}% margin, and ten holes take ${tenHoles.bags['80']}, not ten times ${oneHole.bags['80']}, because the rounding happens once on the total. If you set the post in the hole first, the wood or vinyl takes up some of that space and you will have a bag or two left; most builders keep it for the next hole rather than shave the count. Fence posts are priced with their concrete on the ${h.a('fence-cost-calculator', 'fence cost page')}, and footing sizes for a deck are on the ${h.a('deck-cost-calculator', 'deck cost calculator')}.</p>
<h2>Bags or a ready-mix truck</h2>
<p>Bags win for small jobs because nothing has to be scheduled and no truck has to reach the backyard. They lose on labor: ${bagsPerYd} bags of 80 lb make one cubic yard, which is ${h.num(bagsPerYd * 80)} lb lifted, poured and mixed, and the first batch starts to set while you mix the tenth. A 12 by 24 foot pad at 4 inches already calls for ${drive.bags['80']} bags (${h.num(drive.cuYdWithWaste, 2)} cubic yards), and the same pad at 6 inches needs ${h.num(drive6.cuYdWithWaste, 2)} cubic yards. At that size, call two plants for a price per yard and ask whether delivery and a short-load charge are included; the calculator multiplies whatever figure you type by the ordered volume, so you can compare it with the bag total on the same screen.</p>
<h2>What hiring a concrete crew costs</h2>
<p>For driveways and walkways, the ${h.src('census_ahs', '2023 American Housing Survey')} recorded ${h.num(dwA.pro.n)} jobs done by professionals, with a median of ${h.usd(dw.typical)} in ${cpi} dollars and half of them between ${h.usd(dw.low)} and ${h.usd(dw.high)}. Owners who did the work themselves reported a median of ${h.usd(dwA.diy!.median)}. In the ${h.src('census_ec', '2022 Economic Census')}, poured concrete contractors spent ${h.pct(sh.materials)} of the value of their work on materials and ${h.pct(sh.payroll + sh.benefits)} on payroll and benefits. ${h.src('bls_oews', 'BLS')} counted ${h.num(cw.emp ?? 0)} cement masons and concrete finishers in ${h.wageRef.reference}, paid ${h.usd(cw.mean, 2)} an hour on average, with the middle half between ${h.usd(cw.p25 ?? 0, 2)} and ${h.usd(cw.p75 ?? 0, 2)}. A finisher's quote covers forms, base, reinforcement, finishing and cleanup, so it will always sit well above the material figure this page gives.</p>`,
  faqs: [
    { q: 'How many bags of concrete do I need for a 10x10 slab?', a: `At 4 inches thick, a 10 by 10 foot slab holds ${K.num(ex.cuFt, 1)} cubic feet. With ${ovLow}% extra for an uneven base, that is ${ex.bags['80']} bags of 80 lb or ${ex.bags['60']} bags of 60 lb, using the yields on the QUIKRETE Concrete Mix data sheet. A 6 inch slab of the same size needs half as much again, so recheck the thickness before you load the cart.` },
    { q: 'How many 80 lb bags of concrete make a cubic yard?', a: `${bagsPerYd}. A cubic yard is ${CUFT_PER_CUYD} cubic feet and QUIKRETE rates its 80 lb Concrete Mix at ${K.num(Y['80'], 2)} cubic feet per bag, so ${CUFT_PER_CUYD} divided by ${K.num(Y['80'], 2)} gives ${K.num(CUFT_PER_CUYD / Y['80'], 0)} bags with no margin. With 60 lb bags the figure rises to ${bagsOf(CUFT_PER_CUYD, Y['60'])}, and with 40 lb bags to ${bagsOf(CUFT_PER_CUYD, Y['40'])}, before any allowance for waste or a thick spot in the base.` },
    { q: 'How much extra concrete should I order for a slab?', a: `The National Ready Mixed Concrete Association advises ${ovLow}% to ${ovHigh}% over the volume from the plan dimensions. Use the low end for rigid forms on a carefully leveled base and the high end for a hand-dug or sloping site. Its yield note shows why: one eighth of an inch of extra depth on a 4 inch slab already means a 3% shortage.` },
    { q: 'How much concrete do I need for one fence post hole?', a: `A 10 inch hole dug 36 inches deep holds ${K.num(hole, 2)} cubic feet, which is ${oneHole.bags['80']} bags of 80 lb concrete with a ${ovLow}% margin. Ten such holes take ${tenHoles.bags['80']} bags in total. The post itself fills part of the hole, so a bag may be left over. Switch the calculator to round holes and type your own diameter and depth.` },
    { q: 'When is a ready-mix truck better than bags?', a: `Past roughly one cubic yard, which is already ${bagsPerYd} bags of 80 lb to mix by hand. Truck mixers carry ${truckLow} to ${truckHigh} cubic yards, so small orders may carry a short-load fee; ask the plant. Type both the bag price and the price per yard into the calculator and it shows the two totals side by side for your exact pour.` },
    { q: 'What does a professional concrete driveway or walkway cost?', a: `Professional driveway and walkway jobs in the 2023 American Housing Survey had a median of ${K.usd(dw.typical)} in ${cpi} dollars, and half fell between ${K.usd(dw.low)} and ${K.usd(dw.high)}. The survey counts driveways and walkways of any material and size, so treat it as context. A written quote for your own slab decides the price.` },
  ],
  related: ['gravel-calculator', 'fence-cost-calculator', 'deck-cost-calculator', 'square-footage-calculator', 'drywall-calculator'],
  sources: ['quikrete_1101', 'nrmca_cip31', 'nrmca_cip8', 'census_ahs', 'census_ec', 'bls_oews'],
});
