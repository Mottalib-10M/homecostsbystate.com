import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'rhode-island';
const r = K.job('roof', slug);
const us = K.job('roof');
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const ma = K.wage('massachusetts', 'roofers')!;
const ct = K.wage('connecticut', 'roofers')!;
const maR = K.job('roof', 'massachusetts');
const ctR = K.job('roof', 'connecticut');
const f = K.facts(slug);
const n = f.nri;
const code = f.code!;
const risbc = code.summary.match(/RISBC-\d/)![0];
const ircYear = code.summary.match(/(20\d\d) edition/)![1];
const ord = (x: number) => { const s = ['th', 'st', 'nd', 'rd'], v = x % 100; return `${x}${s[(v - 20) % 10] || s[v] || s[0]}`; };
const total = (slugX: string) => Object.values(K.facts(slugX).nri).reduce((t, x) => t + (x.buildingLossUsd ?? 0), 0);
const quietRank = K.states.map((s) => total(s.slug)).sort((a, b) => a - b).indexOf(total(slug)) + 1;
const mil = (x: number | null) => { const v = (x ?? 0) / 1e6; return `$${K.num(v, v >= 10 ? 0 : 1)} million`; };
const regionPct = Math.round((r.region - 1) * 100);

export default defineState({
  slug,
  title: 'Roof Replacement Cost Rhode Island 2026: Prices and Code',
  description: `Rhode Island roof replacement in 2026: about ${K.usd(r.typical)} typical, ${K.usd(r.low)} to ${K.usd(r.high)} for most jobs, a price set by New England levels rather than by storm losses.`,
  intro: `Rhode Island's roofs face some of the smallest combined storm and fire losses in FEMA's index, so the price is about region and labor.`,
  resume: `Replacing a roof in Rhode Island with a professional contractor costs about ${K.usd(r.typical)}, and most jobs fall between ${K.usd(r.low)} and ${K.usd(r.high)}, compared with ${K.usd(us.typical)} at the national median. Most of that premium is regional. The New England division reported prices about ${regionPct}% above the national level in the 2023 American Housing Survey, and every state in it, from Connecticut to Maine, starts from that figure. Rhode Island roofers earned a mean of ${K.usd(w.mean, 2)} an hour in ${K.wageRef.reference}, per BLS, above the ${K.usd(nat.mean, 2)} national mean but below Massachusetts and Connecticut, which pulls the estimate a little under theirs. Weather plays a small role. Adding up the ${Object.keys(n).length} hazards this site reads from FEMA's National Risk Index, Rhode Island has the ${ord(quietRank)} smallest expected annual losses to buildings of any state; even hurricanes, the largest line, are rated only ${n.hurricane.rating}. The state's one- and two-family dwelling code is based on the International Residential Code.`,
  body: (h) => `
<h2>One of the calmest hazard profiles in the country</h2>
<p>Few states show less storm exposure than Rhode Island. Across hail, strong wind, hurricanes, tornadoes, winter weather, ice storms and wildfire, the ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) puts its combined expected annual losses to buildings at about ${mil(total(slug))}, the ${ord(quietRank)} lowest total nationwide. Hurricanes account for most of it, ${mil(n.hurricane.buildingLossUsd)}, rated ${n.hurricane.rating}. Tornadoes add ${mil(n.tornado.buildingLossUsd)}. Hail is ${n.hail.rating}, winter weather ${n.winter_weather.rating} and wildfire ${n.wildfire.rating}.</p>
<p>Part of the reason is size: a small state has fewer buildings to lose, so dollar totals stay low. The ratings are low as well, not just the dollar figures. For an owner, it means the roof decision usually comes from age, leaks or a sale rather than from a storm, and there is time to gather bids.</p>
<h2>Paying less than Boston or Hartford crews</h2>
<p>Massachusetts roofers average ${h.usd(ma.mean, 2)} and Connecticut roofers ${h.usd(ct.mean, 2)}, both above Rhode Island's ${h.usd(w.mean, 2)}. All three share the New England price level, so the difference in the estimates comes from labor alone: ${h.usd(maR.typical)} in Massachusetts, ${h.usd(ctR.typical)} in Connecticut and ${h.usd(r.typical)} here. In a state this compact, a bid may come from a firm based in either neighbor, and its price may reflect that home wage.</p>
<h3>The Rhode Island dwelling code</h3>
<p>The ${h.ext(code.url, 'Rhode Island State One and Two Family Dwelling Code')}, known as ${risbc}, adopts the ${ircYear} International Residential Code with Rhode Island amendments; the rule shows a technical revision as the current version. Your local building official decides whether a reroof needs a permit at your address.</p>
<p>On a house of ${big.bin!.label}, the Rhode Island estimate reaches ${h.usd(big.typical)}, with the middle half between ${h.usd(big.low)} and ${h.usd(big.high)}. A smaller home of ${small.bin!.label} comes to about ${h.usd(small.typical)}. Coastal houses near the bay may justify extra attention to edge fastening and flashing, the details that hold up when a tropical storm does pass through; ask whether those are in the base price.</p>
<p>With no storm deadline pushing the decision, compare at least three written bids line by line: tear-off and disposal, decking allowance per sheet, underlayment type, shingle line and the length of the workmanship warranty. Differences between Rhode Island quotes often hide in those lines rather than in the total.</p>`,
  faqs: [
    { q: 'What does a roof replacement cost in Rhode Island in 2026?', a: `About ${K.usd(r.typical)} for a typical professional replacement in Rhode Island, with half of jobs between ${K.usd(r.low)} and ${K.usd(r.high)}. The estimate pairs New England prices from the American Housing Survey with Rhode Island roofer wages from BLS. Extra layers, rotten sheathing or a complex roof push quotes higher.` },
    { q: 'Is Rhode Island cheaper than Massachusetts for a new roof?', a: `Somewhat. Rhode Island roofers earn ${K.usd(w.mean, 2)} an hour against ${K.usd(ma.mean, 2)} in Massachusetts, according to BLS. Both states share the New England price level, so the typical Rhode Island estimate is ${K.usd(r.typical)} versus ${K.usd(maR.typical)} for Massachusetts. Labor is only part of a roofing bill, which keeps the gap moderate.` },
    { q: 'Which building code covers houses in Rhode Island?', a: `Rhode Island's State One and Two Family Dwelling Code, ${risbc}, adopts the ${ircYear} International Residential Code with state amendments, according to the official rule. Whether a reroof needs a permit is decided by your local building official, so call that office before work starts and ask what inspection, if any, will follow.` },
  ],
  related: ['roof-replacement-cost', 'roof:massachusetts', 'roof:connecticut', 'heat-pump-cost'],
  extraSources: [
    { name: 'Rhode Island State One and Two Family Dwelling Code (RISBC-2)', url: code.url },
  ],
});
