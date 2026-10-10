import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'district-of-columbia';
const r = K.job('roof', slug);
const us = K.job('roof');
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const f = K.facts(slug);
const code = f.code!;
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const all = K.states.map((s) => s.slug);
const idxRank = [...all].sort((a, b) => K.job('roof', b).index - K.job('roof', a).index).indexOf(slug) + 1;
const empRank = [...all].sort((a, b) => (K.wage(a, 'roofers')?.emp ?? 0) - (K.wage(b, 'roofers')?.emp ?? 0)).indexOf(slug) + 1;
const mil = (x: number | null) => `${K.usd(Math.round((x ?? 0) / 1e6))} million`;
const above = Math.round((w.mean / nat.mean - 1) * 100);
const overDiv = Math.round((r.index - 1) * 100);
const lift = K.usd(r.typical - us.typical * r.region);
const md = K.wage('maryland', 'roofers')!;
const va = K.wage('virginia', 'roofers')!;
const codeYear = code.summary.match(/^(\d{4}) DC/)?.[1];
const iccYear = code.summary.match(/based on the (\d{4}) ICC/)?.[1];
const since = code.summary.match(/since ([A-Z][a-z]+ \d+, \d{4})/)?.[1];

export default defineState({
  slug,
  title: 'Roof Replacement Cost DC 2026: Washington Prices and Wages',
  description: `Roof replacement in Washington, DC costs about ${K.usd(r.typical)} in 2026, with most jobs ${K.usd(r.low)} to ${K.usd(r.high)}, as local roofer pay runs ${overDiv}% above the regional mean.`,
  intro: `No jurisdiction pays its roofers further above its regional average than the District of Columbia.`,
  resume: `Replacing a roof in the District of Columbia costs about ${K.usd(r.typical)} with a professional crew in 2026, and half of jobs land between ${K.usd(r.low)} and ${K.usd(r.high)}, above the national median of ${K.usd(us.typical)}. The District shares the South Atlantic division with states from Delaware to Florida, whose owners reported paying about the national level in the 2023 American Housing Survey. The difference is labor. BLS measured a mean of ${K.usd(w.mean, 2)} an hour for DC roofers in ${K.wageRef.reference}, ${above}% above the national ${K.usd(nat.mean, 2)} and ${overDiv}% above the division's weighted mean, ${idxRank === 1 ? 'the widest gap between any jurisdiction and its division' : 'one of the widest gaps on the site'}. That premium adds roughly ${lift} to a typical job. A home of ${small.bin!.label} is estimated at ${K.usd(small.typical)}, against ${K.usd(big.typical)} for ${big.bin!.label}. FEMA rates every hazard to DC buildings low, so wages, not weather, explain the price.`,
  body: (h) => `
<h2>Why Washington labor lifts the DC estimate</h2>
<p>The District employs only about ${h.num(w.emp ?? 0)} roofers, ${empRank === 1 ? 'the smallest roofing workforce of the 51 jurisdictions' : 'one of the smallest roofing workforces in the country'}, and pays them ${h.usd(w.mean, 2)} an hour on average. Maryland's mean is ${h.usd(md.mean, 2)} and Virginia's ${h.usd(va.mean, 2)}, so crews crossing into the city leave a lower-wage market for a higher one. This site applies that gap only to the labor share of the job, which keeps the effect to a few hundred dollars instead of the full ${overDiv}% wage difference.</p>
${h.mini('wageGap', { state: 'District of Columbia', job: 'Roof replacement', median: us.typical * r.region, L: r.L, index: r.index })}
<h2>Low loss estimates across every hazard</h2>
<p>In the ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}), the District's largest expected annual loss to buildings comes from hurricanes, about ${mil(f.nri.hurricane.buildingLossUsd)}, rated ${f.nri.hurricane.rating}. Hail is rated ${f.nri.hail.rating}, tornadoes ${f.nri.tornado.rating}, and wildfire ${f.nri.wildfire.rating}. A DC roof is far more likely to be replaced for age or leaks around parapets and chimneys than after a single storm. That changes how to shop: there is rarely a reason to sign in a hurry, and a slow month can bring sharper bids from crews looking to fill their calendar. Ask each bidder to inspect the attic or the underside of the roof deck, since soft or stained boards are the most common reason a final invoice ends up above the first quote.</p>
<h3>Codes, flat roofs and party walls</h3>
<p>The Department of Buildings lists the ${h.ext(code.url, `${codeYear} DC Construction Codes`)}, based on the ${iccYear} ICC model codes including the residential code and amended by Title 12 of the DC Municipal Regulations, as in effect since ${since}. If your house has a low-slope roof behind a parapet, as many row houses do, it is priced differently from a pitched shingle roof; ask the contractor to quote the membrane, the flashing at shared walls and the drains as separate lines. For a larger detached house of ${big.bin!.label}, the estimate is ${h.usd(big.typical)}, and half of comparable jobs fall between ${h.usd(big.low)} and ${h.usd(big.high)}.</p>`,
  faqs: [
    { q: 'How much does a new roof cost in the District of Columbia?', a: `About ${K.usd(r.typical)} in 2026 for a professional replacement, with half of DC jobs between ${K.usd(r.low)} and ${K.usd(r.high)}. The South Atlantic price level from the 2023 American Housing Survey sits at the national median; the District's roofer wage of ${K.usd(w.mean, 2)} an hour, well above the division mean, raises the labor share.` },
    { q: 'Why are DC roofers paid so much more than roofers in nearby states?', a: `BLS measured a mean of ${K.usd(w.mean, 2)} an hour for roofers in the District in ${K.wageRef.reference}, against ${K.usd(md.mean, 2)} in Maryland and ${K.usd(va.mean, 2)} in Virginia. The District's wage runs ${overDiv}% above the South Atlantic average, and with only about ${K.num(w.emp ?? 0)} roofers employed, the market is small and urban.` },
    { q: 'Which construction code applies to roofs in DC?', a: `The Department of Buildings lists the ${codeYear} DC Construction Codes, based on the ${iccYear} ICC model codes and amended by Title 12 of the DC Municipal Regulations, as in effect since ${since}. A newer adoption may follow, so ask your contractor which edition the permit office applies when your reroof is filed.` },
  ],
  related: ['roof-replacement-cost', 'roof:maryland', 'roof:virginia', 'roofing-calculator'],
  extraSources: [{ name: 'DC Department of Buildings: DC Construction Codes', url: code.url }],
});
