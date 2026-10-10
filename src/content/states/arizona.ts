import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'arizona';
const r = K.job('roof', slug);
const us = K.job('roof');
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const f = K.facts(slug);
const lic = f.licensing!;
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const all = K.states.map((s) => s.slug);
const fireRank = [...all].sort((a, b) => (K.facts(b).nri.wildfire?.buildingLossUsd ?? 0) - (K.facts(a).nri.wildfire?.buildingLossUsd ?? 0)).indexOf(slug) + 1;
const fireWord = fireRank === 1 ? 'largest' : fireRank === 2 ? 'second largest' : `${fireRank}th largest`;
const mil = (x: number | null) => `${K.usd(Math.round((x ?? 0) / 1e6))} million`;
const under = Math.round((1 - w.mean / nat.mean) * 100);
const regionUp = Math.round((r.region - 1) * 100);
const nv = K.wage('nevada', 'roofers')!;
const nm = K.wage('new-mexico', 'roofers')!;
const ut = K.wage('utah', 'roofers')!;
const minor = K.usd(lic.threshold_usd ?? 0);

export default defineState({
  slug,
  title: 'Roof Replacement Cost Arizona 2026: Prices, Wages, ROC Rules',
  description: `Arizona roof replacement in 2026: ${K.usd(r.typical)} typical, ${K.usd(r.low)} to ${K.usd(r.high)} for most jobs, roofer pay ${under}% below the U.S. mean and the Arizona ROC license rules.`,
  intro: `Arizona roofers earn less than the national mean, and wildfire, not hail, is the hazard FEMA scores highest for the state.`,
  resume: `An Arizona roof replacement done by a contractor runs about ${K.usd(r.typical)} in 2026, and most jobs cost between ${K.usd(r.low)} and ${K.usd(r.high)}, a little above the national median of ${K.usd(us.typical)}. The premium comes from the Mountain division, where homeowners reported paying around ${regionUp}% more than the U.S. median in the 2023 American Housing Survey. Arizona's own labor pulls the figure back down: BLS put the mean roofer wage at ${K.usd(w.mean, 2)} an hour in ${K.wageRef.reference}, ${under}% under the national ${K.usd(nat.mean, 2)} and below the division's weighted average, even though the state employs ${K.num(w.emp ?? 0)} roofers, one of the larger workforces in the West. Size is the bigger lever, with roughly ${K.usd(small.typical)} for a house of ${small.bin!.label} against ${K.usd(big.typical)} for ${big.bin!.label}. On the hazard side, FEMA's National Risk Index rates Arizona's expected annual wildfire losses to buildings ${f.nri.wildfire.rating}, about ${mil(f.nri.wildfire.buildingLossUsd)} a year.`,
  body: (h) => `
<h2>Wildfire leads Arizona's loss estimates</h2>
<p>Only one state carries a larger expected wildfire loss to buildings than Arizona in the ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}). The index estimates about ${mil(f.nri.wildfire.buildingLossUsd)} a year, the ${fireWord} figure among the 51 jurisdictions, with a score of ${Math.round(f.nri.wildfire.score ?? 0)} out of 100. Hail, at ${mil(f.nri.hail.buildingLossUsd)}, is rated ${f.nri.hail.rating}, and strong wind ${f.nri.strong_wind.rating}. Tornado and winter weather losses are small. For owners near brush or forest, the roof covering is one of the surfaces embers land on, so the material class listed on the quote is worth a question, even though this page prices the ordinary asphalt replacement reported in the survey.</p>
<h2>Arizona labor against its Mountain neighbors</h2>
<p>The wage step lowers the Arizona estimate rather than raising it. Arizona's ${h.usd(w.mean, 2)} mean is under Nevada's ${h.usd(nv.mean, 2)} and Utah's ${h.usd(ut.mean, 2)}, though above New Mexico's ${h.usd(nm.mean, 2)}. Since payroll and benefits make up only part of a roofing contractor's revenue, the discount trims a few hundred dollars, while the Mountain price level adds more than that back. For a house of ${big.bin!.label}, the result is ${h.usd(big.typical)}, and half of comparable jobs fall between ${h.usd(big.low)} and ${h.usd(big.high)}.</p>
<p>Where an Arizona home combines low-slope sections with pitched shingle areas, the two surfaces are priced differently. When a bid arrives as a single lump sum, ask the roofer to break it into the pitched area, the flat area, decking repairs and disposal so you can compare like with like.</p>
<h3>The ROC license and its ${minor} exemption</h3>
<p>Arizona statute bars anyone from contracting without a license from the Registrar of Contractors (ROC). Minor work under ${minor} in labor and materials is exempt, but only when it needs no local building permit and is not part of a larger job, so a full reroof is never inside that carve-out. The specific residential roofing classification could not be confirmed on a page we read, so check the license class directly with the ROC before you sign.</p>
${h.mini('wageGap', { state: 'Arizona', job: 'Roof replacement', median: us.typical * r.region, L: r.L, index: r.index })}`,
  faqs: [
    { q: 'What is the average roof replacement price in Arizona for 2026?', a: `About ${K.usd(r.typical)} for a professional job, with half of Arizona replacements between ${K.usd(r.low)} and ${K.usd(r.high)}. That blends the Mountain division level from the 2023 American Housing Survey, brought to ${K.month(K.ahsMeta.cpi.to)} dollars, with an Arizona roofer wage of ${K.usd(w.mean, 2)} an hour. Flat sections, tile or heavy decking repairs push quotes higher.` },
    { q: 'Does Arizona require a licensed contractor to replace a roof?', a: `Arizona law prohibits contracting without a Registrar of Contractors license. The exemption for minor work covers jobs under ${minor} in labor and materials that need no building permit and are not part of a bigger project. A full roof replacement costs many times that amount, so the company you hire should hold an ROC license.` },
    { q: 'How does wildfire exposure show up for Arizona homeowners?', a: `FEMA's National Risk Index estimates expected annual wildfire losses to Arizona buildings at about ${mil(f.nri.wildfire.buildingLossUsd)}, rated ${f.nri.wildfire.rating}, far above its hail estimate of ${mil(f.nri.hail.buildingLossUsd)}. The roof price on this page does not change with that exposure, but owners near wildland often ask roofers about the fire classification of the covering they quote.` },
  ],
  related: ['roof-replacement-cost', 'roof:nevada', 'roof:new-mexico', 'roof:california', 'solar-panel-cost'],
  extraSources: [
    { name: 'Arizona Revised Statutes 32-1151: contracting without a license', url: lic.url },
    { name: 'Arizona Revised Statutes 32-1121: exemptions for minor work', url: 'https://www.azleg.gov/ars/32/01121.htm' },
  ],
});
