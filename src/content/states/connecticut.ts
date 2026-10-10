import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'connecticut';
const r = K.job('roof', slug);
const us = K.job('roof');
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const f = K.facts(slug);
const lic = f.licensing!;
const code = f.code!;
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const mil = (x: number | null) => `${K.usd(Math.round((x ?? 0) / 1e6))} million`;
const above = Math.round((w.mean / nat.mean - 1) * 100);
const regionUp = Math.round((r.region - 1) * 100);
const thr = K.usd(lic.threshold_usd ?? 0);
const codeYear = code.summary.match(/^(\d{4}) Connecticut/)?.[1];
const iccYear = code.summary.match(/based on the (\d{4}) International/)?.[1];
const fromDate = code.summary.match(/from ([A-Z][a-z]+ \d+, \d{4})/)?.[1];
const ma = K.wage('massachusetts', 'roofers')!;
const ri = K.wage('rhode-island', 'roofers')!;
const me = K.wage('maine', 'roofers')!;

export default defineState({
  slug,
  title: 'Roof Replacement Cost Connecticut 2026: Prices and HIC Rules',
  description: `Connecticut roof replacement in 2026: ${K.usd(r.typical)} typical and ${K.usd(r.low)} to ${K.usd(r.high)} for most jobs, plus the state's ${thr} home improvement registration threshold.`,
  intro: `In Connecticut, roof work on a home needs a registered contractor once the price passes just ${thr}.`,
  resume: `Connecticut homeowners can expect a professional roof replacement to cost about ${K.usd(r.typical)} in 2026, with half of jobs between ${K.usd(r.low)} and ${K.usd(r.high)}, compared with a national median of ${K.usd(us.typical)}. The New England division sets most of that premium: owners there reported paying roughly ${regionUp}% more than the U.S. median in the 2023 American Housing Survey. Connecticut roofers then add a little, with a mean wage of ${K.usd(w.mean, 2)} an hour in BLS data for ${K.wageRef.reference}, ${above}% above the national ${K.usd(nat.mean, 2)} and just over the division average. A house of ${small.bin!.label} comes out near ${K.usd(small.typical)}, and one of ${big.bin!.label} near ${K.usd(big.typical)}. The state's rules are unusually strict on paper: under the Home Improvement Act, roofing on a residence counts as home improvement once the total exceeds ${thr}, which brings almost any repair, let alone a new roof, under the registration requirement. Hurricanes, not hail, produce the largest expected annual losses to Connecticut buildings in FEMA's index.`,
  body: (h) => `
<h2>A ${thr} trigger for Connecticut roof work</h2>
<p>Few states set the bar this low. Connecticut's Home Improvement Act, in Chapter 400 of the General Statutes, says no one may act as a contractor without a certificate of registration, and its definition of home improvement expressly includes roofs on residential property when the total price is more than ${thr}. A patch of a few shingles can cross that line, and a full replacement always does. The registration is a general home improvement credential issued through the Department of Consumer Protection, not a license reserved for roofers, so it says little about a company's roofing skill. Check that the certificate is current and ask separately about crews, warranty and insurance.</p>
<h2>Hurricane exposure and a low hail score</h2>
<p>The ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) puts expected annual hurricane losses to Connecticut buildings at about ${mil(f.nri.hurricane.buildingLossUsd)}, rated ${f.nri.hurricane.rating}. Ice storms are rated ${f.nri.ice_storm.rating}, while hail scores ${f.nri.hail.rating} and wildfire ${f.nri.wildfire.rating}. So the threat to a Connecticut roof is coastal wind and rain more than pounding ice pellets, which puts the emphasis on edge fastening and on how the underlayment is lapped near the eaves.</p>
<h3>Code edition, wages and a worked example</h3>
<p>The ${h.ext(code.url, `${codeYear} Connecticut State Building Code`)}, based on the ${iccYear} International Codes including the residential code, applies to projects whose permit applications were filed from ${fromDate}. On labor, Connecticut's ${h.usd(w.mean, 2)} hourly mean trails Massachusetts at ${h.usd(ma.mean, 2)} but beats Rhode Island at ${h.usd(ri.mean, 2)} and Maine at ${h.usd(me.mean, 2)}. For a home of ${big.bin!.label}, the estimate is ${h.usd(big.typical)}, and half of comparable jobs fall between ${h.usd(big.low)} and ${h.usd(big.high)}. Older Connecticut houses sometimes hide board sheathing or more than one layer of shingles, and either one shows up as an extra line, so ask how the bid treats them before work starts.</p>`,
  faqs: [
    { q: 'How much does replacing a roof cost in Connecticut?', a: `About ${K.usd(r.typical)} in 2026 for a professional job, with half of Connecticut replacements between ${K.usd(r.low)} and ${K.usd(r.high)}. The figure combines the New England price level from the 2023 American Housing Survey with the Connecticut roofer wage of ${K.usd(w.mean, 2)} an hour measured by BLS. A bigger house or extra layers to strip raise the quote.` },
    { q: 'Does a Connecticut roofer have to be registered?', a: `Yes. The Home Improvement Act bars anyone from acting as a contractor without a certificate of registration, and roof work on a residence counts as home improvement once the total price exceeds ${thr}. It is a general registration handled by the Department of Consumer Protection, not a roofing license, so check experience and insurance separately.` },
    { q: 'Which building code covers a Connecticut reroof?', a: `The ${codeYear} Connecticut State Building Code, based on the ${iccYear} International Codes including the residential code, applies to projects with permit applications filed from ${fromDate}, according to the state's safety codes office. The local building official enforces it when issuing the permit, and any requirement it adds should appear as a line in your quote.` },
  ],
  related: ['roof-replacement-cost', 'roof:massachusetts', 'roof:rhode-island', 'roof:new-york', 'hvac-replacement-cost'],
  extraSources: [
    { name: 'Connecticut General Statutes, Chapter 400: Home Improvement Act', url: lic.url },
    { name: 'Connecticut DAS: State Building Code and safety codes', url: code.url },
  ],
});
