import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'washington';
const r = K.job('roof', slug);
const us = K.job('roof');
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const or = K.wage('oregon', 'roofers')!;
const id = K.wage('idaho', 'roofers')!;
const ca = K.wage('california', 'roofers')!;
const ak = K.wage('alaska', 'roofers')!;
const hi = K.wage('hawaii', 'roofers')!;
const idR = K.job('roof', 'idaho');
const orR = K.job('roof', 'oregon');
const f = K.facts(slug);
const n = f.nri;
const lic = f.licensing!;
const code = f.code!;
const specialties = lic.summary.match(/one of (\d+)/)![1];
const ircYear = code.summary.match(/(20\d\d) edition/)![1];
const wac = code.summary.match(/WAC [\d-]+/)![0];
const ranked = K.states.map((s) => ({ s, t: K.job('roof', s.slug).typical })).sort((a, b) => b.t - a.t);
const top = ranked[0].s.slug === slug;
const ord = (x: number) => { const s = ['th', 'st', 'nd', 'rd'], v = x % 100; return `${x}${s[(v - 20) % 10] || s[v] || s[0]}`; };
const fireRank = K.states.map((s) => K.facts(s.slug).nri.wildfire.buildingLossUsd ?? 0).sort((a, b) => b - a).indexOf(n.wildfire.buildingLossUsd ?? 0) + 1;
const mil = (x: number | null) => { const v = (x ?? 0) / 1e6; return `$${K.num(v, v >= 10 ? 0 : 1)} million`; };
const over = r.typical - us.typical;

export default defineState({
  slug,
  title: 'Roof Replacement Cost Washington 2026: Top Price in the U.S.',
  description: `Washington roof replacement costs about ${K.usd(r.typical)} in 2026, most jobs ${K.usd(r.low)} to ${K.usd(r.high)}, the highest typical estimate of any state, driven by Pacific prices.`,
  intro: `Washington has the highest typical roof estimate on this site, the product of Pacific division prices and some of the best roofer pay in the country.`,
  resume: `A professional roof replacement in Washington costs about ${K.usd(r.typical)}, with the middle half of jobs between ${K.usd(r.low)} and ${K.usd(r.high)}, ${top ? 'the highest typical figure of any state on this site' : 'among the highest typical figures on this site'} and about ${K.usd(over)} more than the national median. Two factors stack up. The Pacific division, Washington with Oregon, California, Alaska and Hawaii, reported prices well above the national level in the 2023 American Housing Survey, the steepest of any division. Washington roofers then earn more than the division average: BLS measured a mean of ${K.usd(w.mean, 2)} an hour in ${K.wageRef.reference}, above the ${K.usd(nat.mean, 2)} national mean and above both Oregon and California. The hazards that drive roof work elsewhere are muted. FEMA's National Risk Index rates Washington's expected annual hail losses to buildings as ${n.hail.rating} and tornado losses as ${n.tornado.rating}; wildfire, rated ${n.wildfire.rating}, is the big line. Every roofing contractor must register with the Department of Labor and Industries.`,
  body: (h) => `
<h2>Why Washington tops the price table</h2>
<p>No other state on this site combines the Pacific division's price level with a roofer wage this high. Across the division, Alaska roofers earn ${h.usd(ak.mean, 2)}, California ${h.usd(ca.mean, 2)}, Oregon ${h.usd(or.mean, 2)} and Hawaii ${h.usd(hi.mean, 2)}, against ${h.usd(w.mean, 2)} in Washington. The Oregon estimate here is ${h.usd(orR.typical)}. Cross into Idaho, in the Mountain division, and the typical job drops to ${h.usd(idR.typical)}, with roofers earning ${h.usd(id.mean, 2)}. For households near Spokane, a bidder from the Idaho side may come in lower, though the contractor still has to be registered in Washington to work there.</p>
<p>Within Washington, the statewide mean blends the Puget Sound metro area with the rest of the state, so read the range as a midpoint. On a house of ${big.bin!.label}, the estimate reaches ${h.usd(big.typical)}, with most jobs between ${h.usd(big.low)} and ${h.usd(big.high)}; on ${small.bin!.label}, about ${h.usd(small.typical)}.</p>
<h2>Registration with Labor and Industries</h2>
<p>The ${h.ext(lic.url, 'Washington State Department of Labor and Industries')} requires all construction contractors to register, with a bond and insurance. Roofing is one of ${specialties} regulated specialties, and a specialty contractor may work only in the specialty it registered for. That gives you two checks: that the registration is active, and that it covers roofing or a general contractor category.</p>
<p>For the house itself, ${h.ext(code.url, wac)} adopts the ${ircYear} edition of the International Residential Code with Washington amendments. Your city or county building department decides whether a reroof needs a permit.</p>
<h3>A wildfire-weighted hazard profile</h3>
<p>In the ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}), Washington's expected annual wildfire losses to buildings, about ${mil(n.wildfire.buildingLossUsd)}, rank ${ord(fireRank)} in the country. Strong wind adds ${mil(n.strong_wind.buildingLossUsd)} and tornadoes ${mil(n.tornado.buildingLossUsd)}. Ice storms carry a ${n.ice_storm.rating} rating but a small dollar figure, and hail stays at ${mil(n.hail.buildingLossUsd)}. The index gives Washington no hurricane score. For a house near grass or timber, ask about fire-rated coverings and ember-resistant vents. Under any older roof, the condition of the decking deserves a close look before you sign, since replacement sheets are billed on top of the base price.</p>
<p>With storms playing a small role, Washington owners usually have time to compare. Ask three registered contractors for written bids that separate tear-off, disposal, decking per sheet, underlayment and the shingle or metal product, then check each registration with the department before signing.</p>
${h.mini('wageGap', { state: 'Washington', job: 'Roof replacement', median: us.typical * r.region, L: r.L, index: r.index })}`,
  faqs: [
    { q: 'Why does a new roof cost so much in Washington State?', a: `Two reasons. Owners in the Pacific division reported the highest prices of any division in the 2023 American Housing Survey, and Washington roofers earn a mean of ${K.usd(w.mean, 2)} an hour, more than in Oregon or California. Together they put the typical Washington estimate at ${K.usd(r.typical)}, ${top ? 'the highest of any state on this site' : 'near the top of this site'}.` },
    { q: 'How much does a roof replacement cost in Washington in 2026?', a: `About ${K.usd(r.typical)} for a typical professional job in Washington, with half of replacements between ${K.usd(r.low)} and ${K.usd(r.high)}. The estimate scales the Pacific division price level from the American Housing Survey to Washington roofer pay. Large homes, steep roofs and decking repairs move quotes above the range.` },
    { q: 'Do roofers need to register with the state in Washington?', a: `Yes. Washington's Department of Labor and Industries requires every construction contractor to register, bonded and insured, and roofing is one of ${specialties} regulated specialties. A specialty contractor may only work in its registered specialty, so confirm that the Washington registration is active and covers roofing.` },
  ],
  related: ['roof-replacement-cost', 'roof:oregon', 'roof:idaho', 'roof:california', 'solar-panel-cost'],
  extraSources: [
    { name: 'Washington State Department of Labor and Industries, contractor registration', url: lic.url },
    { name: 'Washington Administrative Code, residential code adoption', url: code.url },
  ],
});
