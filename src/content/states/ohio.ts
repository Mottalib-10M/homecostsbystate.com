import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'ohio';
const r = K.job('roof', slug);
const us = K.job('roof');
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const il = K.wage('illinois', 'roofers')!;
const mi = K.wage('michigan', 'roofers')!;
const ind = K.wage('indiana', 'roofers')!;
const pa = K.wage('pennsylvania', 'roofers')!;
const f = K.facts(slug);
const n = f.nri;
const lic = f.licensing!;
const ord = (x: number) => { const s = ['th', 'st', 'nd', 'rd'], v = x % 100; return `${x}${s[(v - 20) % 10] || s[v] || s[0]}`; };
const rankOf = (key: string) => K.states.map((s) => K.facts(s.slug).nri[key].buildingLossUsd ?? 0).sort((a, b) => b - a).indexOf(n[key].buildingLossUsd ?? 0) + 1;
const tor = rankOf('tornado');
const win = rankOf('winter_weather');
const ice = rankOf('ice_storm');
const hail = rankOf('hail');
const mil = (x: number | null) => `$${K.num((x ?? 0) / 1e6)} million`;
const cheaper = us.typical - r.typical;

export default defineState({
  slug,
  title: 'Roof Replacement Cost Ohio 2026: Prices, Tornado, Ice Data',
  description: `Ohio roof replacement costs about ${K.usd(r.typical)} in 2026, most jobs ${K.usd(r.low)} to ${K.usd(r.high)}, with tornado, winter and ice losses to buildings all in FEMA's national top ten.`,
  intro: `Ohio ranks in FEMA's top ten for four separate kinds of building losses, yet its roof estimate stays under the national median.`,
  resume: `Ohio homeowners can expect a professional roof replacement to cost about ${K.usd(r.typical)}, with the middle half of jobs between ${K.usd(r.low)} and ${K.usd(r.high)}, some ${K.usd(cheaper)} below the national median of ${K.usd(us.typical)}. The East North Central division, which joins Ohio with Indiana, Illinois, Michigan and Wisconsin, reported prices at the national level in the 2023 American Housing Survey. Within that division, Ohio roofers earn less than most: BLS measured a mean of ${K.usd(w.mean, 2)} an hour in ${K.wageRef.reference}, under the ${K.usd(nat.mean, 2)} national mean and far under Illinois, so the labor share of an Ohio job is cheaper. Weather is the counterweight. In FEMA's National Risk Index, Ohio's expected annual tornado losses to buildings rank ${ord(tor)} in the country, winter weather ${ord(win)}, ice storms ${ord(ice)} and hail ${ord(hail)}. There is no state roofing license in Ohio; the state board licenses other trades, and local building departments may require their own registration.`,
  body: (h) => `
<h2>Four hazards in Ohio's national top ten</h2>
<p>Most states have one dominant hazard on the roof. Ohio has several, and four of them rank among the top ten in the ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}). Tornadoes carry the biggest expected annual loss to buildings at ${mil(n.tornado.buildingLossUsd)}, rated ${n.tornado.rating}. Hail follows at ${mil(n.hail.buildingLossUsd)}, strong wind at ${mil(n.strong_wind.buildingLossUsd)} and ice storms at ${mil(n.ice_storm.buildingLossUsd)}, rated ${n.ice_storm.rating}. Winter weather adds ${mil(n.winter_weather.buildingLossUsd)}. Only hurricanes and wildfire are rated low.</p>
<p>The practical result is that Ohio roofs get stressed in every season: wind and hail in the warm months, ice and snow loads in the cold ones. A shingle with a strong wind warranty and an eave membrane against ice dams cover different months of the same year.</p>
<h2>No state roofing license, so check locally</h2>
<p>The ${h.ext(lic.url, 'Ohio Construction Industry Licensing Board')} licenses electrical, HVAC, plumbing, hydronics and refrigeration contractors for commercial work, which leaves no state roofing license. Cities and counties may impose their own contractor registration through the local building department, so call yours before hiring. Where no registration applies, ask for proof of general liability insurance and workers' compensation coverage, and get a lien waiver with the final payment.</p>
<h3>Ohio pay inside a high-wage division</h3>
<p>Illinois roofers average ${h.usd(il.mean, 2)}, which lifts the division's average well above Ohio's ${h.usd(w.mean, 2)}. Michigan pays ${h.usd(mi.mean, 2)}, Indiana ${h.usd(ind.mean, 2)} and Pennsylvania, outside the division, ${h.usd(pa.mean, 2)}. Because the method scales only the labor share to state wages, Ohio ends up among the cheaper states on this site for a typical roof.</p>
<p>House size moves the bill more than the wage. A house of ${big.bin!.label} comes to about ${h.usd(big.typical)}, with most jobs between ${h.usd(big.low)} and ${h.usd(big.high)}, while ${small.bin!.label} lands near ${h.usd(small.typical)}. Older Ohio homes with two layers of shingles, or with board sheathing that needs plywood over it, sit at the top of those ranges.</p>
<p>Timing helps in Ohio too. A roof replaced on your own schedule, between storm seasons, lets you collect three written bids and compare them on the same items: tear-off and disposal, decking by the sheet, membrane at the eaves and valleys, and the exact shingle line with its wind rating. A bid that bundles all of that into one figure is hard to hold against the others.</p>
${h.mini('wageGap', { state: 'Ohio', job: 'Roof replacement', median: us.typical * r.region, L: r.L, index: r.index })}`,
  faqs: [
    { q: 'How much does an average roof replacement cost in Ohio?', a: `About ${K.usd(r.typical)} for a typical professional job in Ohio, and half of replacements cost between ${K.usd(r.low)} and ${K.usd(r.high)}. The estimate pairs East North Central prices from the American Housing Survey with Ohio roofer pay from BLS. Larger homes, steep pitches and decking repairs move individual quotes up.` },
    { q: 'Does Ohio require a license for roofing contractors?', a: `Not at the state level. The Ohio Construction Industry Licensing Board licenses only electrical, HVAC, plumbing, hydronics and refrigeration contractors for commercial work, so there is no state roofing license. Local building departments may impose their own registration, so check with your city or county before signing.` },
    { q: 'Which storms cause the most roof damage in Ohio?', a: `Tornadoes produce Ohio's largest expected annual losses to buildings in FEMA's National Risk Index, about ${mil(n.tornado.buildingLossUsd)}, ranking ${ord(tor)} nationally. Hail, strong wind and ice storms follow, and winter weather ranks ${ord(win)} among the states. Ohio roofs therefore face wind, hail and ice damage over the course of a single year.` },
  ],
  related: ['roof-replacement-cost', 'roof:pennsylvania', 'roof:indiana', 'roof:michigan', 'roofing-calculator'],
  extraSources: [
    { name: 'Ohio Construction Industry Licensing Board', url: lic.url },
  ],
});
