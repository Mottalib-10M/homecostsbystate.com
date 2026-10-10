import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'kansas';
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
const mo = K.wage('missouri', 'roofers')!;
const ok = K.wage('oklahoma', 'roofers')!;
const ne = K.wage('nebraska', 'roofers')!;
const co = K.job('roof', 'colorado');

export default defineState({
  slug,
  title: 'Roof Replacement Cost Kansas 2026: Prices, Roofer Registry',
  description: `Kansas roof replacement costs about ${K.usd(r.typical)} in 2026, most jobs ${K.usd(r.low)} to ${K.usd(r.high)}. Hail, ice and winter losses, plus the Kansas Roofing Registration Act.`,
  intro: `Kansas makes roofers register with the Attorney General, and FEMA rates both its winter weather and ice storm losses Very High.`,
  resume: `A professional roof replacement in Kansas runs about ${K.usd(r.typical)} in 2026, and half of jobs cost between ${K.usd(r.low)} and ${K.usd(r.high)}, a little under the national median of ${K.usd(us.typical)}. Kansas shares the West North Central division with Iowa, Minnesota, Missouri, Nebraska and the Dakotas, where owners reported paying at the national level in the 2023 American Housing Survey. The state's ${K.num(w.emp ?? 0)} roofers earned a mean of ${K.usd(w.mean, 2)} an hour in BLS data for ${K.wageRef.reference}, ${under}% under the national ${K.usd(nat.mean, 2)}, which trims the labor share. What sets Kansas apart is the breadth of its weather losses. FEMA's National Risk Index rates expected annual winter weather and ice storm losses to Kansas buildings ${f.nri.winter_weather.rating}, hail sits at roughly ${mil(f.nri.hail.buildingLossUsd)} a year with a score of ${Math.round(f.nri.hail.score ?? 0)}, and tornadoes add more. For a home of ${small.bin!.label}, the estimate is ${K.usd(small.typical)}; for ${big.bin!.label}, ${K.usd(big.typical)}. Any roofer working for a fee must hold a state registration certificate.`,
  body: (h) => `
<h2>Kansas roofers answer to the Attorney General</h2>
<p>Kansas regulates roofing through consumer protection law rather than a building trades board. Under the Kansas Roofing Registration Act, no one may act as a roofing contractor without a valid registration certificate, and the Act defines a roofing contractor broadly enough to cover commercial or residential roofing services provided for a fee. The Attorney General administers it. General contractors whose roofing work is a small part of a larger project, and who do not sell door to door, are excluded. For a homeowner, the takeaway is to ask for the registration certificate number before any deposit and to keep it with the contract, especially after a storm brings in crews from outside the state.</p>
<h2>Ice, snow and hail on the Kansas ledger</h2>
<p>The ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) assigns Kansas expected annual winter weather losses to buildings rated ${f.nri.winter_weather.rating}, the ${ord(lossRank('winter_weather'))} largest in dollars, and ice storm losses of about ${mil(f.nri.ice_storm.buildingLossUsd)}, rated ${f.nri.ice_storm.rating}. Hail adds roughly ${mil(f.nri.hail.buildingLossUsd)}, the ${ord(lossRank('hail'))} largest total in the country, and tornadoes about ${mil(f.nri.tornado.buildingLossUsd)}. Wildfire is rated ${f.nri.wildfire.rating}. Few states combine cold-season and warm-season roof hazards at these levels, which means a Kansas roof can be damaged in January by ice and in May by hail.</p>
<p>When a claim is involved, the adjuster's estimate and your deductible decide what you pay. Get the contractor's own written scope too, and compare the two before work begins.</p>
<h3>Kansas labor and the Colorado comparison</h3>
<p>Kansas roofers average ${h.usd(w.mean, 2)} an hour, under Missouri's ${h.usd(mo.mean, 2)} and above Oklahoma's ${h.usd(ok.mean, 2)} and Nebraska's ${h.usd(ne.mean, 2)}. To the west, Colorado's estimate of ${h.usd(co.typical)} reflects the higher Mountain division price level. For a house of ${big.bin!.label}, the Kansas estimate is ${h.usd(big.typical)}, with half of comparable jobs between ${h.usd(big.low)} and ${h.usd(big.high)}. A bid well beyond that band usually includes decking, a second layer of shingles or a complex roof; ask for those items as separate prices so you can see what drives the total.</p>`,
  faqs: [
    { q: 'What is the average cost to replace a roof in Kansas in 2026?', a: `About ${K.usd(r.typical)} for a professional job, with half of Kansas replacements between ${K.usd(r.low)} and ${K.usd(r.high)}. That combines the West North Central price level from the 2023 American Housing Survey with the Kansas roofer wage of ${K.usd(w.mean, 2)} an hour. Larger houses and damaged decking push the price higher.` },
    { q: 'Does Kansas require roofing contractors to register?', a: `Yes. The Kansas Roofing Registration Act says no one may act as a roofing contractor, residential or commercial, without a valid registration certificate, and the Attorney General administers it. General contractors whose roofing work is a minor part of a project and who do not sell door to door are excluded. Ask for the certificate number.` },
    { q: 'How do ice storms and hail affect Kansas roofs?', a: `FEMA's National Risk Index rates expected annual ice storm losses to Kansas buildings ${f.nri.ice_storm.rating}, about ${mil(f.nri.ice_storm.buildingLossUsd)}, and puts hail near ${mil(f.nri.hail.buildingLossUsd)}. Damage can come in winter and in spring, and many Kansas replacements are settled through insurance, where the deductible and the adjuster's scope set the owner's share.` },
  ],
  related: ['roof-replacement-cost', 'roof:missouri', 'roof:oklahoma', 'roof:nebraska', 'roof:colorado'],
  extraSources: [
    { name: 'Kansas Statutes 50-6,123: roofing contractor registration required', url: lic.url },
    { name: 'Kansas Statutes 50-6,122: Roofing Registration Act definitions', url: 'https://www.ksrevisor.gov/statutes/chapters/ch50/050_006_0122.html' },
  ],
});
