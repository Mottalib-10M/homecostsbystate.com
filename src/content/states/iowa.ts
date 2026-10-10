import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'iowa';
const r = K.job('roof', slug);
const us = K.job('roof');
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const f = K.facts(slug);
const lic = f.licensing!;
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const all = K.states.map((s) => s.slug);
const lossRank = (hz: string) => [...all].sort((a, b) => (K.facts(b).nri[hz]?.buildingLossUsd ?? 0) - (K.facts(a).nri[hz]?.buildingLossUsd ?? 0)).indexOf(slug) + 1;
const ord = (n: number) => { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`; };
const mil = (x: number | null) => `${K.usd(Math.round((x ?? 0) / 1e6))} million`;
const under = Math.round((1 - w.mean / nat.mean) * 100);
const yearly = K.usd(lic.threshold_usd ?? 0);
const mn = K.wage('minnesota', 'roofers')!;
const ne = K.wage('nebraska', 'roofers')!;
const mo = K.wage('missouri', 'roofers')!;
const wind = f.nri.strong_wind.buildingLossUsd ?? 0;
const hail = f.nri.hail.buildingLossUsd ?? 0;
const wsc = r.index < 1 ? 'below' : 'above';

export default defineState({
  slug,
  title: 'Roof Replacement Cost Iowa 2026: Prices, Wind and Hail Data',
  description: `Iowa roof replacement in 2026: about ${K.usd(r.typical)} typical, ${K.usd(r.low)} to ${K.usd(r.high)} for most jobs, with FEMA wind, hail and tornado losses and DIAL contractor registration.`,
  intro: `In Iowa, wind and hail each cost buildings a similar amount every year, and tornadoes cost far more than either.`,
  resume: `Iowa homeowners can budget about ${K.usd(r.typical)} for a professional roof replacement in 2026, with half of jobs between ${K.usd(r.low)} and ${K.usd(r.high)}, slightly below the national median of ${K.usd(us.typical)}. The West North Central division, from Minnesota and the Dakotas down to Missouri and Kansas, reported prices at the national level in the 2023 American Housing Survey. Iowa labor costs bring the estimate down a little: BLS measured a mean of ${K.usd(w.mean, 2)} an hour for the state's roofers in ${K.wageRef.reference}, ${under}% under the national ${K.usd(nat.mean, 2)} and ${wsc} the division's weighted mean, which high Minnesota wages lift. Storms are the reason many Iowa roofs come off early. FEMA's National Risk Index ranks the state ${ord(lossRank('tornado'))} for expected annual tornado losses to buildings and ${ord(lossRank('strong_wind'))} for strong wind, with hail close behind. A home of ${small.bin!.label} is estimated near ${K.usd(small.typical)}, and one of ${big.bin!.label} near ${K.usd(big.typical)}. Contractors register with the state once their construction earnings reach ${yearly} a year.`,
  body: (h) => `
<h2>Wind, hail and tornadoes, almost evenly matched in Iowa</h2>
<p>Iowa is unusual in how its convective hazards split. The ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) estimates expected annual losses to Iowa buildings of about ${mil(wind)} from strong wind, rated ${f.nri.strong_wind.rating}, and about ${mil(hail)} from hail, rated ${f.nri.hail.rating} with a score of ${Math.round(f.nri.hail.score ?? 0)}. Tornadoes, the ${ord(lossRank('tornado'))} largest figure in the country, add roughly ${mil(f.nri.tornado.buildingLossUsd)}. Winter weather is rated ${f.nri.winter_weather.rating}. A roof in Iowa can be lost to a straight-line windstorm in summer as easily as to a hail cell, and both usually go through insurance.</p>
<p>That has a practical side. Wind damage often shows up as lifted or missing tabs along edges and ridges; hail damage shows as bruises and lost granules across a slope. Adjusters treat them differently, and a roofer who documents the pattern with photos before the inspection can save an argument about the scope. Keep copies of any earlier inspection, since proof of the roof's condition before the storm carries weight.</p>
<h2>Registration with DIAL, not a roofer license</h2>
<p>Iowa runs a general construction contractor registration through the Department of Inspections, Appeals, and Licensing (DIAL). Anyone doing construction work must register once they earn at least ${yearly} a year from it, which covers essentially every roofing company. Out-of-state contractors also need an Iowa unemployment insurance number, and a bond applies in some cases. This is a registration, not a test of roofing skill, so check references, insurance certificates and manufacturer credentials on your own.</p>
<h3>Iowa pay against its neighbors</h3>
<p>At ${h.usd(w.mean, 2)} an hour, Iowa roofers earn less than Minnesota's ${h.usd(mn.mean, 2)} and Missouri's ${h.usd(mo.mean, 2)}, though more than Nebraska's ${h.usd(ne.mean, 2)}. For a house of ${big.bin!.label}, the estimate is ${h.usd(big.typical)}, with half of comparable jobs between ${h.usd(big.low)} and ${h.usd(big.high)}. Ranch houses spread the roof over a wide footprint, so the same living area can mean more squares of shingles than a two-story home; the ${h.a('roofing-calculator', 'roofing calculator')} works from the footprint and pitch if you want the actual roof area.</p>`,
  faqs: [
    { q: 'How much does a new roof cost in Iowa in 2026?', a: `About ${K.usd(r.typical)} for a professional replacement, with half of Iowa jobs between ${K.usd(r.low)} and ${K.usd(r.high)}. The estimate takes the West North Central price level from the 2023 American Housing Survey, in ${K.month(K.ahsMeta.cpi.to)} dollars, and adjusts the labor share to the Iowa roofer wage of ${K.usd(w.mean, 2)} an hour.` },
    { q: 'Do Iowa roofing contractors have to register with the state?', a: `Yes, through DIAL's construction contractor registration, which applies to anyone earning at least ${yearly} a year from construction work. It is a general registration, not a roofing license. Out-of-state contractors also need an Iowa unemployment insurance number, and some must post a bond. Ask for the registration number before signing.` },
    { q: 'Which storms damage the most Iowa roofs?', a: `FEMA's National Risk Index puts expected annual losses to Iowa buildings at about ${mil(f.nri.tornado.buildingLossUsd)} from tornadoes, ${mil(wind)} from strong wind and ${mil(hail)} from hail. Wind and hail claims are common, and the insurer's scope and deductible then set what an Iowa owner pays rather than the survey range shown here.` },
  ],
  related: ['roof-replacement-cost', 'roof:nebraska', 'roof:minnesota', 'roof:illinois', 'roofing-calculator'],
  extraSources: [{ name: 'Iowa DIAL: construction contractor registration', url: lic.url }],
});
