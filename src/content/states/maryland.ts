import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'maryland';
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
const overDiv = Math.round((r.index - 1) * 100);
const lift = K.usd(r.typical - us.typical * r.region);
const irc = code.summary.match(/adopt the (\d{4}) International/)?.[1];
const comar = code.summary.match(/\(COMAR ([\d.]+)\)/)?.[1];
const va = K.wage('virginia', 'roofers')!;
const de = K.wage('delaware', 'roofers')!;
const pa = K.wage('pennsylvania', 'roofers');
const dc = K.wage('district-of-columbia', 'roofers')!;

export default defineState({
  slug,
  title: 'Roof Replacement Cost Maryland 2026: Prices and MHIC License',
  description: `Maryland roof replacement in 2026: about ${K.usd(r.typical)} typical, ${K.usd(r.low)} to ${K.usd(r.high)} for most jobs, with Maryland roofer pay ${overDiv}% over the region and MHIC rules.`,
  intro: `Maryland roofers earn well above the South Atlantic average, and reroofing counts as home improvement under the MHIC license.`,
  resume: `The Maryland estimate for a professional roof replacement is about ${K.usd(r.typical)} in 2026, with half of jobs between ${K.usd(r.low)} and ${K.usd(r.high)}, a bit above the national median of ${K.usd(us.typical)}. The South Atlantic division, stretching from Delaware to Florida, reported roof prices at the national level in the 2023 American Housing Survey, so the gap comes from Maryland's labor market. BLS measured a mean of ${K.usd(w.mean, 2)} an hour for the state's ${K.num(w.emp ?? 0)} roofers in ${K.wageRef.reference}, ${above}% above the national ${K.usd(nat.mean, 2)} and ${overDiv}% above the division's weighted average. That raises a typical job by about ${lift}. For a home of ${small.bin!.label}, the estimate is ${K.usd(small.typical)}; for ${big.bin!.label}, ${K.usd(big.typical)}. Two Maryland rules shape the paperwork. The Maryland Home Improvement Commission licenses home improvement contractors, and its definition reaches the replacement of any part of a residence. The state building standards adopt the ${irc} International Residential Code with Maryland changes, which local jurisdictions may amend.`,
  body: (h) => `
<h2>Reroofing under the Maryland Home Improvement Commission</h2>
<p>Maryland does not have a roofing-only license. Instead, the Maryland Home Improvement Commission (MHIC), part of the Maryland Department of Labor, licenses and regulates home improvement contractors and salespersons. Home improvement covers the alteration, repair or replacement of a building or part of a building used as a residence, which takes in a reroof. Before signing, look up the MHIC license number, confirm that the salesperson who visited is registered too, and check that the name on the contract matches the license. A general license says nothing about roofing experience, so ask for addresses of recent roofs the company completed nearby.</p>
<h2>A higher-paid workforce than most of the South Atlantic</h2>
<p>Maryland roofers average ${h.usd(w.mean, 2)} an hour, compared with ${h.usd(va.mean, 2)} in Virginia and ${h.usd(de.mean, 2)} in Delaware${pa ? `, and ${h.usd(pa.mean, 2)} across the line in Pennsylvania` : ''}. Only the District of Columbia, at ${h.usd(dc.mean, 2)}, pays more nearby. The method here keeps the South Atlantic price level and moves the labor share to the Maryland wage, so the premium shows up as a few hundred dollars rather than the full wage gap. Shingles, underlayment and disposal fees cost about the same in Baltimore as in Richmond, so the labor line is where Maryland bids part ways with those of its neighbors.</p>
${h.mini('wageGap', { state: 'Maryland', job: 'Roof replacement', median: us.typical * r.region, L: r.L, index: r.index })}
<h3>Maryland storm losses and the state code</h3>
<p>The ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) puts expected annual hurricane losses to Maryland buildings at about ${mil(f.nri.hurricane.buildingLossUsd)}, rated ${f.nri.hurricane.rating}, with tornadoes at ${mil(f.nri.tornado.buildingLossUsd)} and strong wind at ${mil(f.nri.strong_wind.buildingLossUsd)}. Winter weather is rated ${f.nri.winter_weather.rating}, hail ${f.nri.hail.rating}. The ${h.ext(code.url, `Maryland Building Performance Standards (COMAR ${comar})`)} adopt the ${irc} International Residential Code with state modifications, and counties and cities may amend it, except for the energy and accessibility provisions. Your local permit office therefore decides the exact details a reroof must meet. For a house of ${big.bin!.label}, the estimate is ${h.usd(big.typical)}, and half of comparable jobs fall between ${h.usd(big.low)} and ${h.usd(big.high)}.</p>`,
  faqs: [
    { q: 'How much does a roof replacement cost in Maryland in 2026?', a: `About ${K.usd(r.typical)} for a professional job, with half of Maryland replacements between ${K.usd(r.low)} and ${K.usd(r.high)}. The South Atlantic division reported prices at the national level in the 2023 American Housing Survey, and the Maryland roofer wage of ${K.usd(w.mean, 2)} an hour, well above the division mean, adds a few hundred dollars.` },
    { q: 'Does a Maryland roofer need an MHIC license?', a: `Reroofing a home falls under home improvement in Maryland, defined as the alteration, repair or replacement of a residence or part of one, and the Maryland Home Improvement Commission licenses those contractors and their salespersons. It is a general home improvement license, not a roofing-specific one. Look up the number on the Department of Labor site.` },
    { q: 'Which residential code applies to a Maryland reroof?', a: `The Maryland Building Performance Standards, in COMAR ${comar}, adopt the ${irc} International Residential Code with state modifications. Local jurisdictions may amend it, except for the energy and accessibility codes, so the county or city permit office decides which details apply to your reroof. Ask whether the permit fee is inside the quote.` },
  ],
  related: ['roof-replacement-cost', 'roof:virginia', 'roof:delaware', 'roof:pennsylvania', 'roof:district-of-columbia'],
  extraSources: [
    { name: 'Maryland Home Improvement Commission (Maryland Department of Labor)', url: lic.url },
    { name: 'COMAR 09.12.51: Maryland Building Performance Standards', url: code.url },
  ],
});
