import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'oklahoma';
const r = K.job('roof', slug);
const us = K.job('roof');
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const tx = K.wage('texas', 'roofers')!;
const ks = K.wage('kansas', 'roofers')!;
const ar = K.wage('arkansas', 'roofers')!;
const txR = K.job('roof', 'texas');
const f = K.facts(slug);
const n = f.nri;
const lic = f.licensing!;
const code = f.code!;
const dates = lic.summary.match(/[A-Z][a-z]+ \d{1,2}, 20\d\d/g)!;
const bills = lic.summary.match(/[HS]B \d+/g)!;
const ircNew = code.summary.match(/(20\d\d) edition/)![1];
const ircOld = code.summary.match(/the (20\d\d) IRC/)![1];
const codeDate = code.summary.match(/[A-Z][a-z]{2}\.? \d{1,2}, 20\d\d/)![0];
const ord = (x: number) => { const s = ['th', 'st', 'nd', 'rd'], v = x % 100; return `${x}${s[(v - 20) % 10] || s[v] || s[0]}`; };
const iceRank = K.states.map((s) => K.facts(s.slug).nri.ice_storm.buildingLossUsd ?? 0).sort((a, b) => b - a).indexOf(n.ice_storm.buildingLossUsd ?? 0) + 1;
const mil = (x: number | null) => `$${K.num((x ?? 0) / 1e6)} million`;
const stormSum = (n.hail.buildingLossUsd ?? 0) + (n.tornado.buildingLossUsd ?? 0) + (n.strong_wind.buildingLossUsd ?? 0) + (n.ice_storm.buildingLossUsd ?? 0);

export default defineState({
  slug,
  title: 'Roof Replacement Cost Oklahoma 2026: Roofer Rules and Prices',
  description: `Oklahoma roof replacement runs about ${K.usd(r.typical)} in 2026, most jobs ${K.usd(r.low)} to ${K.usd(r.high)}. Roofers register with the state, and ice storm losses rank ${ord(iceRank)} in FEMA data.`,
  intro: `Oklahoma is one of the few states with a roofing-specific contractor registration, and a new residential roofing endorsement is on the way.`,
  resume: `A professional roof replacement in Oklahoma costs about ${K.usd(r.typical)}, and half of jobs fall between ${K.usd(r.low)} and ${K.usd(r.high)}, a little under the ${K.usd(us.typical)} national median. The West South Central division (Oklahoma, Texas, Arkansas and Louisiana) reported prices slightly below the national level in the 2023 American Housing Survey. Oklahoma roofers earned a mean of ${K.usd(w.mean, 2)} an hour in ${K.wageRef.reference}, according to BLS, under the ${K.usd(nat.mean, 2)} national mean but a bit above Texas, which nudges the estimate up within the division. Weather is relentless. FEMA's National Risk Index rates Oklahoma's expected annual ice storm losses to buildings as ${n.ice_storm.rating}, the ${ord(iceRank)} largest in the nation, with tornado and strong wind losses rated ${n.tornado.rating} and hail adding more than ${mil(n.hail.buildingLossUsd)} a year. Roofing contractors must register with the Construction Industries Board, and a separate Residential Roofing Endorsement is being phased in.`,
  body: (h) => `
<h2>A roofing registration of its own</h2>
<p>Many states license roofers only as part of a general contractor credential, or not at all. Oklahoma's ${h.ext(lic.url, 'Construction Industries Board')} runs a roofing-specific registration, and under ${bills[0]} a new Residential Roofing Endorsement will be required. ${bills[1]} moved the start of the transition to ${dates[0]} and the deadline to obtain the endorsement to ${dates[1]}. Until then, the registration is the check to run: ask for the number and look it up with the board before signing.</p>
<p>The residential code is changing as well. The ${h.ext(code.url, 'Oklahoma Uniform Building Code Commission')} adopted the ${ircNew} edition of the International Residential Code by permanent rule, effective ${codeDate}, replacing the ${ircOld} edition. Whether your reroof needs a permit depends on your city.</p>
<h2>Ice, tornadoes and hail on one roof</h2>
<p>Add Oklahoma's expected annual losses to buildings from hail, tornadoes, strong wind and ice storms in the ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) and you reach about ${mil(stormSum)} a year. Tornadoes lead at ${mil(n.tornado.buildingLossUsd)}, then hail at ${mil(n.hail.buildingLossUsd)}, ice storms at ${mil(n.ice_storm.buildingLossUsd)} and strong wind at ${mil(n.strong_wind.buildingLossUsd)}. Wildfire is rated ${n.wildfire.rating}.</p>
<p>For a homeowner, that raises the value of documentation. Keep the contract, the product names and photos of the finished roof; after the next storm, those papers speed up any insurance claim and show which warranty applies.</p>
<p>Ice loads deserve a specific question. Ask how the contractor handles gutters and the first courses at the eaves, where glaze and refreezing cause the most trouble, and whether drip edge and an ice and water membrane are included in the base price or quoted as extras. In a state where hail and ice both return, the cheapest bid often omits those lines.</p>
<h3>What Oklahoma wages do to the bill</h3>
<p>Oklahoma roofers at ${h.usd(w.mean, 2)} earn more than Texas (${h.usd(tx.mean, 2)}) and Arkansas (${h.usd(ar.mean, 2)}) but less than Kansas (${h.usd(ks.mean, 2)}). Since the calculator moves only the labor share to state pay, the typical Oklahoma roof comes out just ${h.usd(r.typical - txR.typical)} above the Texas estimate, even though both share a division. On ${big.bin!.label}, the Oklahoma estimate climbs to ${h.usd(big.typical)}, with most jobs from ${h.usd(big.low)} to ${h.usd(big.high)}; ${small.bin!.label} sits near ${h.usd(small.typical)}.</p>`,
  faqs: [
    { q: 'How much does a roof replacement cost in Oklahoma in 2026?', a: `About ${K.usd(r.typical)} for a typical professional replacement in Oklahoma, with half of jobs between ${K.usd(r.low)} and ${K.usd(r.high)}. The estimate starts from West South Central prices in the American Housing Survey and applies Oklahoma roofer wages from BLS to the labor share. Storm demand, extra layers and decking repairs raise individual quotes.` },
    { q: 'Do roofers have to register in Oklahoma?', a: `Yes. Oklahoma's Construction Industries Board requires roofing contractors to register, a roofing-specific credential. A new Residential Roofing Endorsement created by ${bills[0]} will also be required, with ${bills[1]} setting the transition start at ${dates[0]} and the deadline at ${dates[1]}. Check the registration number with the board before work begins.` },
    { q: 'Why do Oklahoma roofs get replaced so often?', a: `FEMA's National Risk Index estimates about ${mil(stormSum)} a year in expected Oklahoma building losses from hail, tornadoes, strong wind and ice storms combined. Ice storm losses alone rank ${ord(iceRank)} in the country and are rated ${n.ice_storm.rating}. Many Oklahoma roofs are replaced after storm damage rather than at the end of their service life.` },
  ],
  related: ['roof-replacement-cost', 'roof:texas', 'roof:kansas', 'roof:arkansas', 'roofing-calculator'],
  extraSources: [
    { name: 'Oklahoma Construction Industries Board, Residential Roofing Endorsement', url: lic.url },
    { name: 'Oklahoma Uniform Building Code Commission, IRC adoptions', url: code.url },
  ],
});
