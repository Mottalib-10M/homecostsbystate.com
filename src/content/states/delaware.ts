import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'delaware';
const r = K.job('roof', slug);
const us = K.job('roof');
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const f = K.facts(slug);
const lic = f.licensing!;
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const mil = (x: number | null) => `${K.usd(Math.round((x ?? 0) / 1e6))} million`;
const below = Math.round((1 - w.mean / nat.mean) * 100);
const overDiv = Math.round((r.index - 1) * 100);
const lift = K.usd(r.typical - us.typical * r.region);
const md = K.wage('maryland', 'roofers')!;
const va = K.wage('virginia', 'roofers')!;
const fl = K.wage('florida', 'roofers')!;
const hz = ['hail', 'strong_wind', 'hurricane', 'tornado', 'winter_weather', 'ice_storm', 'wildfire'];
const top = hz.reduce((a, b) => ((f.nri[b]?.buildingLossUsd ?? 0) > (f.nri[a]?.buildingLossUsd ?? 0) ? b : a));

export default defineState({
  slug,
  title: 'Roof Replacement Cost Delaware 2026: Prices and Roofer Wages',
  description: `Delaware roof replacement in 2026 runs about ${K.usd(r.typical)}, most jobs ${K.usd(r.low)} to ${K.usd(r.high)}. Delaware roofer pay sits ${overDiv}% above the South Atlantic average wage.`,
  intro: `Delaware has one of the smallest roofing workforces in the country and a hazard profile that is low across the board.`,
  resume: `A professionally installed roof in Delaware costs roughly ${K.usd(r.typical)} in 2026, and half of all jobs fall between ${K.usd(r.low)} and ${K.usd(r.high)}, a touch above the national median of ${K.usd(us.typical)}. The South Atlantic division reported prices at the national level in the 2023 American Housing Survey, so the gap comes from wages alone. Delaware's ${K.num(w.emp ?? 0)} roofers earned a mean of ${K.usd(w.mean, 2)} an hour in ${K.wageRef.reference}, ${below}% under the national ${K.usd(nat.mean, 2)} yet about ${overDiv}% over the division's weighted mean, which is pulled down by large, lower-paid workforces farther south. That difference adds about ${lift} to a typical Delaware job. A home of ${small.bin!.label} is estimated at ${K.usd(small.typical)}, one of ${big.bin!.label} at ${K.usd(big.typical)}. FEMA's National Risk Index rates no hazard above moderate for Delaware buildings; hurricanes produce the largest expected annual loss, about ${mil(f.nri.hurricane.buildingLossUsd)} a year, rated ${f.nri.hurricane.rating}.`,
  body: (h) => `
<h2>A small Delaware workforce, paid above its region</h2>
<p>BLS counted just ${h.num(w.emp ?? 0)} roofers in Delaware in ${K.wageRef.reference}, among the smallest totals of any state. Their mean pay of ${h.usd(w.mean, 2)} an hour is below the national figure but above what roofers earn in much of the South Atlantic division, where Florida's ${h.usd(fl.mean, 2)} and Virginia's ${h.usd(va.mean, 2)} weigh on the average. Maryland next door pays ${h.usd(md.mean, 2)}. Because this site prices a job from the division level and then moves only the labor share to the state wage, Delaware ends up a few hundred dollars over the division median rather than under it.</p>
${h.mini('wageGap', { state: 'Delaware', job: 'Roof replacement', median: us.typical * r.region, L: r.L, index: r.index })}
<h2>Quiet numbers in Delaware's hazard table</h2>
<p>The ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) gives Delaware a calm profile. The largest expected annual loss to buildings comes from ${top === 'hurricane' ? 'hurricanes' : top.replace('_', ' ')}, about ${mil(f.nri.hurricane.buildingLossUsd)}, rated ${f.nri.hurricane.rating}. Hail is rated ${f.nri.hail.rating}, wildfire ${f.nri.wildfire.rating}, and strong wind ${f.nri.strong_wind.rating}. Roofs here tend to reach the end of their service life before a storm takes them, which lets owners plan the work, collect bids in a slow season, and avoid the price spikes that follow regional disasters.</p>
<h3>The Delaware contractor license is a business license</h3>
<p>Any contractor doing business in Delaware has to register with the Division of Revenue and obtain a business license, through either the resident or the non-resident contractor package; non-resident firms also post a bond. That is a tax and business requirement, not a trade license that tests roofing skill. Ask for the license number, and judge competence through references, manufacturer certifications and the detail in the bid. For a house of ${big.bin!.label}, the Delaware estimate is ${h.usd(big.typical)}, with half of comparable jobs between ${h.usd(big.low)} and ${h.usd(big.high)}. A bid that bundles everything into one figure should be split into tear-off, sheathing allowance, materials and disposal before you compare it.</p>`,
  faqs: [
    { q: 'What will a roof replacement cost in Delaware in 2026?', a: `About ${K.usd(r.typical)} for a typical professional job, and half of Delaware replacements cost between ${K.usd(r.low)} and ${K.usd(r.high)}. The South Atlantic division reported prices at the national level in the 2023 American Housing Survey, and the Delaware roofer wage of ${K.usd(w.mean, 2)} an hour, above the division mean, lifts the estimate slightly.` },
    { q: 'Do roofers need a license to work in Delaware?', a: `Every contractor doing business in Delaware must register with the Division of Revenue and hold a business license, with separate packages for resident and non-resident firms; non-residents also post a bond. It is a general business license rather than a roofing trade license, so check references and insurance on your own before signing.` },
    { q: 'Is Delaware exposed to major roof-damaging storms?', a: `Less than most coastal states. FEMA's National Risk Index rates hurricane losses to Delaware buildings ${f.nri.hurricane.rating}, about ${mil(f.nri.hurricane.buildingLossUsd)} a year, and hail ${f.nri.hail.rating}. With no hazard above moderate, most Delaware roofs are replaced for age, which leaves owners time to compare several written quotes.` },
  ],
  related: ['roof-replacement-cost', 'roof:maryland', 'roof:pennsylvania', 'roof:new-jersey', 'water-heater-replacement-cost'],
  extraSources: [{ name: 'Delaware Division of Revenue: resident and non-resident contractor licenses', url: lic.url }],
});
