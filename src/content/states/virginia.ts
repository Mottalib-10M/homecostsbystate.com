import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'virginia';
const r = K.job('roof', slug);
const us = K.job('roof');
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const md = K.wage('maryland', 'roofers')!;
const dc = K.wage('district-of-columbia', 'roofers')!;
const nc = K.wage('north-carolina', 'roofers')!;
const wv = K.wage('west-virginia', 'roofers')!;
const mdR = K.job('roof', 'maryland');
const f = K.facts(slug);
const n = f.nri;
const lic = f.licensing!;
const code = f.code!;
const classC = lic.threshold_usd ?? 0;
const classB = Number(lic.summary.match(/Class B from \$([\d,]+)/)![1].replace(/,/g, ''));
const statute = lic.summary.match(/Va\. Code [\d.]+-\d+/)![0];
const reg = lic.summary.match(/18VAC[\d-]+/)![0];
const usbc = code.summary.match(/(20\d\d) Virginia/)![1];
const usbcDate = code.summary.match(/[A-Z][a-z]+ \d{1,2}, 20\d\d/)![0];
const mil = (x: number | null) => `$${K.num((x ?? 0) / 1e6)} million`;

export default defineState({
  slug,
  title: 'Roof Replacement Cost Virginia 2026: Prices, License Classes',
  description: `Virginia roof replacement costs about ${K.usd(r.typical)} in 2026, most jobs ${K.usd(r.low)} to ${K.usd(r.high)}. Contracts over ${K.usd(classC)} need a state license, with a roofing specialty.`,
  intro: `Virginia licenses contractors by contract size and defines a roofing specialty of its own, and hurricanes lead its expected building losses.`,
  resume: `Virginia's typical professional roof replacement costs about ${K.usd(r.typical)}, and most jobs fall between ${K.usd(r.low)} and ${K.usd(r.high)}, just above the ${K.usd(us.typical)} national median. The South Atlantic division, stretching from Delaware to Florida, reported prices at the national level in the 2023 American Housing Survey, and Virginia roofers earn slightly more than the division average: BLS measured a mean of ${K.usd(w.mean, 2)} an hour in ${K.wageRef.reference}, under the ${K.usd(nat.mean, 2)} national mean but above North Carolina. Maryland and the District of Columbia, both in the same division, pay much more. Hurricanes produce Virginia's largest expected annual losses to buildings in FEMA's National Risk Index, rated ${n.hurricane.rating}, with strong wind rated ${n.strong_wind.rating}. The state requires a contractor license for work over ${K.usd(classC)} per contract, which covers essentially every reroof, and its regulations define a Roofing Contracting specialty.`,
  body: (h) => `
<h2>License classes sized to the contract</h2>
<p>Virginia sorts contractors by the size of the job. Under ${h.ext(lic.url, statute)}, a Class C license is required for work over ${h.usd(classC)} per contract, a Class B license from ${h.usd(classB)}, and Class A above that range. A typical reroof at ${h.usd(r.typical)} falls in Class C territory; a large house near ${h.usd(big.high)} still does. The Board for Contractors also defines a Roofing Contracting (ROC) specialty in ${reg}, and roofing is covered as well under the residential and commercial building classes and the home improvement specialties.</p>
<p>That gives Virginia homeowners a concrete check: the contractor should hold a license of the right class with a specialty that covers roofing. The Department of Professional and Occupational Regulation keeps the records, so look the number up before signing.</p>
<p>On the code side, the ${h.ext(code.url, 'Department of Housing and Community Development')} lists the ${usbc} Virginia Uniform Statewide Building Code, based on the ${usbc} International Codes, as effective since ${usbcDate}. Ask your local building office whether your reroof needs a permit under it.</p>
<h2>Hurricanes first, then wind and tornadoes</h2>
<p>In the ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}), Virginia's expected annual hurricane losses to buildings come to about ${mil(n.hurricane.buildingLossUsd)}. Tornadoes add ${mil(n.tornado.buildingLossUsd)}, strong wind ${mil(n.strong_wind.buildingLossUsd)} and hail ${mil(n.hail.buildingLossUsd)}. Winter weather is rated ${n.winter_weather.rating}, ice storms ${n.ice_storm.rating} and wildfire ${n.wildfire.rating}. The picture favors wind-oriented details: nailing pattern, starter strips at eaves and rakes, and a ridge cap rated for high wind.</p>
<h3>Northern Virginia wages versus the rest</h3>
<p>Maryland roofers average ${h.usd(md.mean, 2)} and those in the District of Columbia ${h.usd(dc.mean, 2)}, far above Virginia's ${h.usd(w.mean, 2)}; North Carolina pays ${h.usd(nc.mean, 2)} and West Virginia ${h.usd(wv.mean, 2)}. The Maryland estimate on this site is ${h.usd(mdR.typical)}. Because a statewide mean blends the Washington suburbs with rural counties, quotes near the capital may run above the Virginia range. For a house of ${big.bin!.label}, the estimate is ${h.usd(big.typical)}; for ${small.bin!.label}, about ${h.usd(small.typical)}.</p>
<p>Older Virginia homes sometimes hide board sheathing or a second layer of shingles. Ask the bidder to check from the attic and to state in writing how many layers the price assumes and how many sheets of new decking it includes, so that surprises during tear-off are priced in advance rather than argued about afterward.</p>
${h.mini('wageGap', { state: 'Virginia', job: 'Roof replacement', median: us.typical * r.region, L: r.L, index: r.index })}`,
  faqs: [
    { q: 'How much does a new roof cost in Virginia in 2026?', a: `About ${K.usd(r.typical)} for a typical professional replacement in Virginia, with half of jobs between ${K.usd(r.low)} and ${K.usd(r.high)}. The estimate uses South Atlantic prices from the American Housing Survey with Virginia roofer wages from BLS. Quotes in the Washington suburbs, steep roofs and decking repairs tend to land higher.` },
    { q: 'What contractor license does a Virginia roofer need?', a: `Virginia requires a Class C contractor license for work over ${K.usd(classC)} per contract, Class B from ${K.usd(classB)} and Class A above that. The Board for Contractors defines a Roofing Contracting specialty, and roofing is also covered under the residential building class and home improvement specialties. Verify the license and its specialty with the state before hiring.` },
    { q: 'What weather causes the largest roof losses in Virginia?', a: `Hurricanes. FEMA's National Risk Index estimates about ${mil(n.hurricane.buildingLossUsd)} a year in expected hurricane losses to Virginia buildings, rated ${n.hurricane.rating}. Tornadoes and strong wind follow. Wind-rated shingles and careful edge fastening are therefore the upgrades most worth pricing on a Virginia roof, each on its own line of the bid.` },
  ],
  related: ['roof-replacement-cost', 'roof:maryland', 'roof:north-carolina', 'roof:west-virginia', 'roofing-calculator'],
  extraSources: [
    { name: 'Code of Virginia 54.1-1100, contractor license classes', url: lic.url },
    { name: 'Virginia Department of Housing and Community Development, building codes', url: code.url },
  ],
});
