import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'new-jersey';
const r = K.job('roof', slug);
const us = K.job('roof');
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const ny = K.wage('new-york', 'roofers')!;
const pa = K.wage('pennsylvania', 'roofers')!;
const de = K.wage('delaware', 'roofers')!;
const f = K.facts(slug);
const n = f.nri;
const lic = f.licensing!;
const code = f.code!;
const ircYear = code.summary.match(/20\d\d/)![0];
const codeDate = code.summary.match(/[A-Z][a-z]{2} \d{1,2}, 20\d\d/)![0];
const sweepDate = lic.summary.match(/[A-Z][a-z]{2} \d{1,2}, 20\d\d/)![0];
const mil = (x: number | null) => `$${K.num((x ?? 0) / 1e6)} million`;
const payRank = [...K.states].map((s) => K.wage(s.slug, 'roofers')?.mean ?? 0).sort((a, b) => b - a).indexOf(w.mean) + 1;
const ord = (x: number) => { const s = ['th', 'st', 'nd', 'rd'], v = x % 100; return `${x}${s[(v - 20) % 10] || s[v] || s[0]}`; };
const windRank = K.states.map((s) => K.facts(s.slug).nri.strong_wind.buildingLossUsd ?? 0).sort((a, b) => b - a).indexOf(n.strong_wind.buildingLossUsd ?? 0) + 1;
const premium = Math.round((w.mean / nat.mean - 1) * 100);

export default defineState({
  slug,
  title: 'Roof Replacement Cost New Jersey 2026: Wind Losses, Prices',
  description: `New Jersey roof replacement costs about ${K.usd(r.typical)} in 2026, with most jobs ${K.usd(r.low)} to ${K.usd(r.high)}; roofer pay runs ${premium}% over the U.S. mean and wind losses lead.`,
  intro: `No state carries a higher FEMA score for strong wind losses than New Jersey, and its roofers are among the best paid in the country.`,
  resume: `A typical professional roof replacement in New Jersey costs about ${K.usd(r.typical)}, and the middle half of jobs falls between ${K.usd(r.low)} and ${K.usd(r.high)}, well above the ${K.usd(us.typical)} national median. Two numbers explain most of the gap. The Middle Atlantic division, which the Census Bureau defines as New Jersey, New York and Pennsylvania, reported prices above the national level in the 2023 American Housing Survey. On top of that, New Jersey roofers earned a mean of ${K.usd(w.mean, 2)} an hour in ${K.wageRef.reference}, the ${ord(payRank)} highest roofer wage of any state in the BLS survey and ${premium}% over the ${K.usd(nat.mean, 2)} national mean. Weather adds its own pressure. FEMA's National Risk Index rates the state's expected annual losses to buildings from strong wind as ${n.strong_wind.rating}, with a score of ${K.num(n.strong_wind.score ?? 0)}, the top mark nationwide, and hurricane losses as ${n.hurricane.rating}. Home improvement contractors must be registered with the state's Division of Consumer Affairs.`,
  body: (h) => `
<h2>Strong wind tops New Jersey's loss estimates</h2>
<p>Hurricanes get the headlines, but the ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) puts strong wind first for New Jersey buildings: about ${mil(n.strong_wind.buildingLossUsd)} in expected annual losses, ${windRank === 1 ? 'the largest strong wind figure in the country' : `the ${ord(windRank)} largest strong wind figure in the country`}. Hurricanes follow at ${mil(n.hurricane.buildingLossUsd)}, rated ${n.hurricane.rating}, and tornadoes at ${mil(n.tornado.buildingLossUsd)}. Winter weather is rated ${n.winter_weather.rating} and ice storms ${n.ice_storm.rating}, while hail stays ${n.hail.rating}. For roofs, wind damage usually starts at the edges: lifted tabs along the rakes and eaves, then missing shingles, then water under the field.</p>
<p>Asking a bidder how the starter course, drip edge and ridge cap are fastened is a fair question in a state with this profile. A roof that loses its edge in a gust needs repair long before its rated life.</p>
<h2>Registration, code and who signs the contract</h2>
<p>New Jersey regulates roofers through a general home improvement registration rather than a roofing license. The ${h.ext(lic.url, 'Division of Consumer Affairs')} reported on ${sweepDate} that undercover operations had found home improvement businesses bidding on roofing, siding and other projects without an active registration. Ask for the registration number and check it before you pay a deposit.</p>
<p>For one- and two-family homes, the state's ${h.ext(code.url, 'current code list')} shows the International Residential Code ${ircYear}, New Jersey edition, with an adoption date of ${codeDate}. Your municipal construction office decides whether a reroof needs a permit at your address.</p>
<h3>Where the New Jersey estimate lands by house size</h3>
<p>New York roofers average ${h.usd(ny.mean, 2)} and Pennsylvania roofers ${h.usd(pa.mean, 2)}, so a crew based across the Delaware may quote differently from one in Bergen County; Delaware, at ${h.usd(de.mean, 2)}, is cheaper still. For a home of ${big.bin!.label}, the New Jersey figure is ${h.usd(big.typical)}, with most jobs between ${h.usd(big.low)} and ${h.usd(big.high)}. A house of ${small.bin!.label} runs closer to ${h.usd(small.typical)}.</p>
<p>Shore houses and inland suburbs share the same statewide estimate here, but they rarely get the same bid. Near the coast, ask whether the price assumes ring-shank nails, a high-wind nailing pattern and enhanced starter strips, and get the manufacturer's wind warranty terms in writing. Inland, the bigger swing often comes from how many layers of old shingles are stacked on the deck.</p>
${h.mini('wageGap', { state: 'New Jersey', job: 'Roof replacement', median: us.typical * r.region, L: r.L, index: r.index })}`,
  faqs: [
    { q: 'What is the typical roof replacement price in New Jersey for 2026?', a: `About ${K.usd(r.typical)} for a professional job, with half of New Jersey replacements between ${K.usd(r.low)} and ${K.usd(r.high)}. The estimate starts from Middle Atlantic prices in the American Housing Survey and moves the labor share to New Jersey roofer pay. Extra layers, rotten sheathing or a complex roofline usually push a quote higher.` },
    { q: 'Does New Jersey require roofers to be licensed or registered?', a: `New Jersey requires home improvement contractor businesses to register with the Division of Consumer Affairs. It is a general registration, not a roofing-specific license, and the Attorney General's office has cited unregistered businesses bidding on roofing jobs. Ask for the registration number and verify it with the state before work begins.` },
    { q: 'Why are roofing labor costs so high in New Jersey?', a: `BLS measured a mean wage of ${K.usd(w.mean, 2)} an hour for New Jersey roofers in ${K.wageRef.reference}, ${premium}% above the national mean and the ${ord(payRank)} highest among the states. Labor is only part of the bill, yet with the Middle Atlantic price level it lifts the New Jersey estimate clearly above the national median.` },
    { q: 'How much wind damage do New Jersey homes face each year?', a: `FEMA's National Risk Index estimates about ${mil(n.strong_wind.buildingLossUsd)} in expected annual strong wind losses to New Jersey buildings, rated ${n.strong_wind.rating} with the highest score of any state. Hurricane losses add about ${mil(n.hurricane.buildingLossUsd)} a year. Roof edges and ridge lines are where that damage usually begins.` },
  ],
  related: ['roof-replacement-cost', 'roof:new-york', 'roof:pennsylvania', 'roof:delaware', 'roofing-calculator'],
  extraSources: [
    { name: 'New Jersey Division of Consumer Affairs, home improvement contractor enforcement', url: lic.url },
    { name: 'New Jersey Division of Codes and Standards, current code adoptions', url: code.url },
  ],
});
