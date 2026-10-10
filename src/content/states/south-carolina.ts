import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'south-carolina';
const r = K.job('roof', slug);
const us = K.job('roof');
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const nc = K.wage('north-carolina', 'roofers')!;
const ga = K.wage('georgia', 'roofers')!;
const fl = K.wage('florida', 'roofers')!;
const f = K.facts(slug);
const n = f.nri;
const lic = f.licensing!;
const sections = lic.summary.match(/40-59-\d+(\(\d+\))?/g)!;
const [title40, ch59] = sections[0].split('-');
const ch11 = lic.summary.match(/Chapter (\d+)/)![1];
const ord = (x: number) => { const s = ['th', 'st', 'nd', 'rd'], v = x % 100; return `${x}${s[(v - 20) % 10] || s[v] || s[0]}`; };
const hurRank = K.states.map((s) => K.facts(s.slug).nri.hurricane.buildingLossUsd ?? 0).sort((a, b) => b - a).indexOf(n.hurricane.buildingLossUsd ?? 0) + 1;
const all = Object.values(n).reduce((t, x) => t + (x.buildingLossUsd ?? 0), 0);
const hurShare = (n.hurricane.buildingLossUsd ?? 0) / all;
const bil = (x: number | null) => `$${K.num((x ?? 0) / 1e9, 2)} billion`;
const mil = (x: number | null) => `$${K.num((x ?? 0) / 1e6)} million`;

export default defineState({
  slug,
  title: 'Roof Replacement Cost South Carolina 2026: Prices, Licensing',
  description: `South Carolina roof replacement costs about ${K.usd(r.typical)} in 2026, most jobs ${K.usd(r.low)} to ${K.usd(r.high)}; roofers must register above ${K.usd(lic.threshold_usd ?? 0)} and hurricanes lead losses.`,
  intro: `South Carolina names roofers in its residential specialty contractor law, and hurricanes make up the bulk of FEMA's expected building losses there.`,
  resume: `In South Carolina, a professional roof replacement typically costs about ${K.usd(r.typical)}, with most jobs between ${K.usd(r.low)} and ${K.usd(r.high)}, almost exactly the ${K.usd(us.typical)} national median. Owners in the South Atlantic division reported prices at the national level in the 2023 American Housing Survey, and South Carolina roofers sit right at the division's average pay: BLS measured a mean of ${K.usd(w.mean, 2)} an hour in ${K.wageRef.reference}, under the ${K.usd(nat.mean, 2)} national mean and level with North Carolina. Hurricanes are the defining risk. FEMA's National Risk Index estimates South Carolina's expected annual hurricane losses to buildings at about ${bil(n.hurricane.buildingLossUsd)}, the ${ord(hurRank)} largest in the country and roughly ${K.pct(hurShare, 0)} of the state's total across the hazards this site follows; ice storms are rated ${n.ice_storm.rating} too. State law lists roofers among residential specialty contractors, who must register with or be licensed by the Residential Builders Commission for work over ${K.usd(lic.threshold_usd ?? 0)}.`,
  body: (h) => `
<h2>Roofers are named in South Carolina law</h2>
<p>South Carolina does not leave roofing to a general category. Section ${sections[0]} of the ${h.ext(lic.url, `South Carolina Code, Title ${title40}, Chapter ${ch59}`)} lists roofers as a residential specialty contracting area for undertakings over ${h.usd(lic.threshold_usd ?? 0)} not regulated by Chapter ${ch11}, and section ${sections[1]} makes it a misdemeanor to do residential specialty contracting without first registering with, or being licensed by, the Residential Builders Commission. Every reroof priced on this page is far above that threshold, so the person you hire should be able to show a current registration or license.</p>
<p>Ask for it with the written estimate, look it up with the Commission, and make sure the name on the contract matches the name on the credential. Storm chasers who arrive after a hurricane may not hold one.</p>
<h2>What hurricane exposure means for a South Carolina roof</h2>
<p>The ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) rates South Carolina's expected annual hurricane losses to buildings ${n.hurricane.rating}, at about ${bil(n.hurricane.buildingLossUsd)}. Tornadoes add ${mil(n.tornado.buildingLossUsd)}, ice storms ${mil(n.ice_storm.buildingLossUsd)}, rated ${n.ice_storm.rating}, and hail ${mil(n.hail.buildingLossUsd)}. Strong wind is ${n.strong_wind.rating} and wildfire ${n.wildfire.rating}.</p>
<p>A roof built for that profile pays attention to uplift: the nailing pattern, the starter strip at the eaves and rakes, the ridge cap and any sealed deck under the underlayment. Ask each bidder to describe those details in writing and to quote any wind-rated upgrade as its own line, so you can see what it adds and discuss it with your insurer.</p>
<h3>Wages from Charlotte to Savannah</h3>
<p>North Carolina roofers average ${h.usd(nc.mean, 2)} and Georgia roofers ${h.usd(ga.mean, 2)}, a narrow band around South Carolina's ${h.usd(w.mean, 2)}; Florida pays ${h.usd(fl.mean, 2)}. All four states share the South Atlantic price level, so labor makes only small differences between their estimates. House size matters more: ${h.usd(big.typical)} for ${big.bin!.label} in South Carolina, with most jobs between ${h.usd(big.low)} and ${h.usd(big.high)}, against ${h.usd(small.typical)} for ${small.bin!.label}.</p>
<p>After a storm, take photos of every slope and of the interior ceilings before any repair, and keep receipts for emergency tarping. A detailed contract with tear-off, decking per sheet and product names makes the adjuster's estimate easier to compare.</p>`,
  faqs: [
    { q: 'How much does a new roof cost in South Carolina?', a: `About ${K.usd(r.typical)} for a typical professional job, with half of South Carolina replacements between ${K.usd(r.low)} and ${K.usd(r.high)}. The range combines South Atlantic prices from the American Housing Survey with South Carolina roofer wages from BLS. Wind-rated upgrades, steep roofs and decking repairs can push a quote above it.` },
    { q: 'Do roofers need a license in South Carolina?', a: `Yes, for jobs over ${K.usd(lic.threshold_usd ?? 0)}. South Carolina Code section ${sections[0]} lists roofers as a residential specialty contracting area, and section ${sections[1]} makes it a misdemeanor to perform that work without registering with or being licensed by the Residential Builders Commission. Verify the credential before signing.` },
    { q: 'How large are hurricane losses for South Carolina homes?', a: `FEMA's National Risk Index estimates about ${bil(n.hurricane.buildingLossUsd)} in expected annual hurricane losses to South Carolina buildings, the ${ord(hurRank)} largest of any state and rated ${n.hurricane.rating}. That makes wind uplift details, such as nailing pattern and edge fastening, a central part of any South Carolina roof replacement bid.` },
  ],
  related: ['roof-replacement-cost', 'roof:north-carolina', 'roof:georgia', 'roofing-calculator'],
  extraSources: [
    { name: 'South Carolina Code of Laws, residential builders and specialty contractors', url: lic.url },
  ],
});
