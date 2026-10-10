import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'north-carolina';
const r = K.job('roof', slug);
const us = K.job('roof');
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const sc = K.wage('south-carolina', 'roofers')!;
const va = K.wage('virginia', 'roofers')!;
const tn = K.wage('tennessee', 'roofers')!;
const f = K.facts(slug);
const n = f.nri;
const lic = f.licensing!;
const gs = lic.summary.match(/G\.S\. [\d-]+/)![0];
const code = f.code!;
const ncYear = code.summary.match(/(20\d\d) NC codes/)![1];
const iccYear = code.summary.match(/(20\d\d) International/)![1];
const since = code.summary.match(/effective ([A-Z][a-z]{2} \d{1,2}, 20\d\d)/)![1];
const nextYear = code.summary.match(/(20\d\d) NC State Building Code/)![1];
const ord = (x: number) => { const s = ['th', 'st', 'nd', 'rd'], v = x % 100; return `${x}${s[(v - 20) % 10] || s[v] || s[0]}`; };
const hurRank = K.states.map((s) => K.facts(s.slug).nri.hurricane.buildingLossUsd ?? 0).sort((a, b) => b - a).indexOf(n.hurricane.buildingLossUsd ?? 0) + 1;
const bil = (x: number | null) => `$${K.num((x ?? 0) / 1e9, 2)} billion`;
const mil = (x: number | null) => `$${K.num((x ?? 0) / 1e6)} million`;
const payGap = Math.round((1 - w.mean / nat.mean) * 100);

export default defineState({
  slug,
  title: 'Roof Replacement Cost North Carolina 2026: Hurricane Prices',
  description: `North Carolina roof replacement in 2026 costs about ${K.usd(r.typical)}, with most jobs ${K.usd(r.low)} to ${K.usd(r.high)}, while hurricane losses to buildings top ${bil(n.hurricane.buildingLossUsd)} a year.`,
  intro: `North Carolina's roof price lands right on the national median, yet FEMA expects more than a billion dollars a year in hurricane losses to its buildings.`,
  resume: `North Carolina's typical professional roof replacement comes to about ${K.usd(r.typical)}, with most jobs between ${K.usd(r.low)} and ${K.usd(r.high)}, practically the same as the ${K.usd(us.typical)} national median. That is no coincidence of rounding. The South Atlantic division, which runs from Delaware to Florida, reported prices at the national level in the 2023 American Housing Survey, and North Carolina roofers earn almost exactly the division's average: BLS measured a mean of ${K.usd(w.mean, 2)} an hour in ${K.wageRef.reference}, ${payGap}% under the ${K.usd(nat.mean, 2)} national mean. Storm exposure is anything but average. FEMA's National Risk Index puts North Carolina's expected annual hurricane losses to buildings at about ${bil(n.hurricane.buildingLossUsd)}, the ${ord(hurRank)} largest in the nation, and rates winter weather and ice storms ${n.ice_storm.rating} as well. A general contractor license from the state is required once a project reaches ${K.usd(lic.threshold_usd ?? 0)}, which a single-family reroof rarely does.`,
  body: (h) => `
<h2>Hurricanes and ice in the same state</h2>
<p>Few places pair coastal storm exposure with serious winter icing the way North Carolina does. The ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) rates hurricane losses to buildings ${n.hurricane.rating} at about ${bil(n.hurricane.buildingLossUsd)} a year, while ice storms, rated ${n.ice_storm.rating}, add ${mil(n.ice_storm.buildingLossUsd)} and winter weather scores ${n.winter_weather.rating}. Tornadoes contribute ${mil(n.tornado.buildingLossUsd)}, rated ${n.tornado.rating}, and hail ${mil(n.hail.buildingLossUsd)}. Wildfire is ${n.wildfire.rating}.</p>
<p>The coastal plain and the mountains therefore ask different things of a roof. Near the sound and the barrier islands, wind uplift, sealed roof decks and edge fastening come first. In the western counties, an ice and water membrane along the eaves earns its cost. A contractor who works statewide should be able to explain which details belong on your house.</p>
<h2>The license line and the code on record</h2>
<p>Under ${gs}, the ${h.ext(lic.url, 'North Carolina Licensing Board for General Contractors')} explains that a general contractor must hold a state license when the total project cost reaches ${h.usd(lic.threshold_usd ?? 0)}. No roofing-specific rule turned up on the pages this site read. For most single-family reroofs, the price on this page sits below that line, so the license is no guarantee that applies to your job; references, insurance certificates and a local address count for more.</p>
<p>On codes, the ${h.ext(code.url, 'Office of State Fire Marshal')} page states that the ${ncYear} North Carolina codes, based on the ${iccYear} International Codes and in force since ${since}, are currently effective. It also lists the ${nextYear} North Carolina State Building Code as approved, with its effective date addressed separately. Ask your county inspections office which edition it enforces on the day of your permit.</p>
<h3>Wages along the Carolinas and Virginia line</h3>
<p>South Carolina roofers average ${h.usd(sc.mean, 2)}, Virginia ${h.usd(va.mean, 2)} and Tennessee ${h.usd(tn.mean, 2)}, a narrow band around the North Carolina figure. For ${big.bin!.label}, the estimate here is ${h.usd(big.typical)}; for ${small.bin!.label}, about ${h.usd(small.typical)}.</p>
<p>When a named storm is in the forecast, roofers book up and tarps sell out, so a planned replacement goes more smoothly outside the peak of storm season. If you are replacing after damage, photograph every slope before temporary repairs, keep receipts for tarping, and ask for a contract that ties payment to the insurer's schedule. A North Carolina bid that lists tear-off, decking per sheet, underlayment and the shingle line separately is far easier to reconcile with an adjuster's estimate.</p>`,
  faqs: [
    { q: 'What is the average cost of a new roof in North Carolina?', a: `About ${K.usd(r.typical)} for a typical professional replacement, with half of North Carolina jobs between ${K.usd(r.low)} and ${K.usd(r.high)}. That matches the national median closely because the South Atlantic price level and North Carolina roofer wages are both near average. Storm-season demand, steep roofs and decking repairs push individual quotes higher.` },
    { q: 'Does a roofer need a state license in North Carolina?', a: `North Carolina requires a general contractor license when the total project cost is ${K.usd(lic.threshold_usd ?? 0)} or more, according to the state licensing board. No roofing-specific state rule was found on the pages this site read. Most single-family reroofs cost less than that threshold, so check insurance and references even when a license is not required.` },
    { q: 'How much hurricane damage do North Carolina buildings face?', a: `FEMA's National Risk Index estimates North Carolina's expected annual hurricane losses to buildings at about ${bil(n.hurricane.buildingLossUsd)}, the ${ord(hurRank)} largest of any state, rated ${n.hurricane.rating}. Ice storms are rated ${n.ice_storm.rating} too. Coastal roofs need wind-focused details, while inland mountain homes benefit from ice protection at the eaves.` },
  ],
  related: ['roof-replacement-cost', 'roof:south-carolina', 'roof:virginia', 'roof:tennessee', 'roofing-calculator'],
  extraSources: [
    { name: 'North Carolina Licensing Board for General Contractors, consumer FAQ', url: lic.url },
    { name: 'North Carolina Office of State Fire Marshal, current and past codes', url: code.url },
  ],
});
