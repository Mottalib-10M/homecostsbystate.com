import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'illinois';
const r = K.job('roof', slug);
const us = K.job('roof');
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const f = K.facts(slug);
const lic = f.licensing!;
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const all = K.states.map((s) => s.slug);
const wageRank = [...all].sort((a, b) => (K.wage(b, 'roofers')?.mean ?? 0) - (K.wage(a, 'roofers')?.mean ?? 0)).indexOf(slug) + 1;
const torRank = [...all].sort((a, b) => (K.facts(b).nri.tornado?.buildingLossUsd ?? 0) - (K.facts(a).nri.tornado?.buildingLossUsd ?? 0)).indexOf(slug) + 1;
const mil = (x: number | null) => `${K.usd(Math.round((x ?? 0) / 1e6))} million`;
const above = Math.round((w.mean / nat.mean - 1) * 100);
const overDiv = Math.round((r.index - 1) * 100);
const lift = K.usd(r.typical - us.typical * r.region);
const ind = K.wage('indiana', 'roofers')!;
const wi = K.wage('wisconsin', 'roofers')!;
const mo = K.wage('missouri', 'roofers')!;
const top = wageRank === 1 ? 'the highest of any state' : `ranked ${wageRank} nationally`;

export default defineState({
  slug,
  title: 'Roof Replacement Cost Illinois 2026: Top Wages and Prices',
  description: `Illinois roof replacement in 2026: about ${K.usd(r.typical)} typical, ${K.usd(r.low)} to ${K.usd(r.high)} for most jobs, with Illinois roofer pay of ${K.usd(w.mean, 2)} an hour and the IDFPR license.`,
  intro: `Illinois roofers earn more per hour than roofers in any other state, and Illinois licenses roofing contractors under its own act.`,
  resume: `The 2026 estimate for a professional roof replacement in Illinois is about ${K.usd(r.typical)}, with half of jobs between ${K.usd(r.low)} and ${K.usd(r.high)}, a few hundred dollars over the national median of ${K.usd(us.typical)}. Owners in the East North Central division reported paying at the national level in the 2023 American Housing Survey, so the whole premium comes from pay. BLS measured a mean of ${K.usd(w.mean, 2)} an hour for Illinois roofers in ${K.wageRef.reference}, ${top}, ${above}% above the national ${K.usd(nat.mean, 2)} and ${overDiv}% above the division average. That adds roughly ${lift} to a typical job; it would be more if labor were a larger share of a roofer's bill. A home of ${small.bin!.label} is estimated near ${K.usd(small.typical)} and one of ${big.bin!.label} near ${K.usd(big.typical)}. Illinois is also a storm state: FEMA's National Risk Index puts expected annual tornado losses to its buildings near ${mil(f.nri.tornado.buildingLossUsd)}, and strong wind is rated ${f.nri.strong_wind.rating}.`,
  body: (h) => `
<h2>The best-paid roofers in the country work in Illinois</h2>
<p>At ${h.usd(w.mean, 2)} an hour, the Illinois mean wage for roofers is ${top}, and it towers over the neighbors: Indiana pays ${h.usd(ind.mean, 2)}, Wisconsin ${h.usd(wi.mean, 2)} and Missouri ${h.usd(mo.mean, 2)}. BLS counted ${h.num(w.emp ?? 0)} roofers in the state. Yet the price of a typical Illinois roof ends up only modestly above Indiana's, because payroll and benefits are a minority of what roofing contractors charge. Materials, dumpsters, insurance and margin cost roughly the same on both sides of the state line. The calculator above makes the split visible: it starts from the division median, which reflects what owners across five Midwestern states paid, and moves only the labor portion to the Illinois wage. If a Chicago-area bid seems out of line with that estimate, the difference is more likely to sit in overhead, access or permit costs than in the hourly rate alone.</p>
${h.mini('wageGap', { state: 'Illinois', job: 'Roof replacement', median: us.typical * r.region, L: r.L, index: r.index })}
<h2>Tornado and wind losses in Illinois</h2>
<p>The ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) estimates expected annual tornado losses to Illinois buildings at about ${mil(f.nri.tornado.buildingLossUsd)}, ${torRank === 2 ? 'second only to one other state' : torRank === 1 ? 'the largest in the country' : `ranked ${torRank} nationally`}, rated ${f.nri.tornado.rating}. Strong wind adds ${mil(f.nri.strong_wind.buildingLossUsd)} and is rated ${f.nri.strong_wind.rating}, hail ${mil(f.nri.hail.buildingLossUsd)}, and winter weather is rated ${f.nri.winter_weather.rating}. In practice, many Illinois reroofs follow a wind or hail claim, and the insurer's scope, not the survey range, then decides the payout.</p>
<h3>A roofing-specific license</h3>
<p>Unlike states that fold roofing into a general registration, Illinois licenses roofing contractors under the Illinois Roofing Industry Licensing Act. The Department of Financial and Professional Regulation (IDFPR) issues the license, and each contractor needs a designated qualifying party who has passed the roofing contractor examination. Look the license up on the IDFPR site before signing, and confirm that the company name on the bid matches the licensee rather than a subcontractor. For a house of ${big.bin!.label}, the Illinois estimate is ${h.usd(big.typical)}, and half of comparable jobs land between ${h.usd(big.low)} and ${h.usd(big.high)}.</p>`,
  faqs: [
    { q: 'How much does a roof replacement cost in Illinois in 2026?', a: `About ${K.usd(r.typical)} for a typical professional job, with half of Illinois replacements between ${K.usd(r.low)} and ${K.usd(r.high)}. The East North Central division reported prices at the national level in the 2023 American Housing Survey; the Illinois roofer wage of ${K.usd(w.mean, 2)} an hour lifts the labor share and adds a few hundred dollars.` },
    { q: 'Why are Illinois roofers paid more than roofers anywhere else?', a: `BLS measured a mean of ${K.usd(w.mean, 2)} an hour for Illinois roofers in ${K.wageRef.reference}, ${above}% above the national mean and well over Indiana's ${K.usd(ind.mean, 2)}. The data do not give a cause, only the level. Because labor is a minority of a roofing bill, the effect on a typical Illinois roof is a few hundred dollars.` },
    { q: 'Do roofing contractors need a license in Illinois?', a: `Yes. IDFPR licenses roofing contractors under the Illinois Roofing Industry Licensing Act, and each licensed company must have a designated qualifying party who passed the roofing contractor examination. Check the license number on the IDFPR lookup before you sign, and make sure the name on the contract matches the licensee.` },
  ],
  related: ['roof-replacement-cost', 'roof:indiana', 'roof:wisconsin', 'roof:missouri', 'roofing-calculator'],
  extraSources: [{ name: 'Illinois IDFPR: roofing contractor licensing', url: lic.url }],
});
