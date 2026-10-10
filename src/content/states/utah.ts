import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'utah';
const r = K.job('roof', slug);
const us = K.job('roof');
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const co = K.wage('colorado', 'roofers')!;
const id = K.wage('idaho', 'roofers')!;
const nv = K.wage('nevada', 'roofers')!;
const coR = K.job('roof', 'colorado');
const f = K.facts(slug);
const n = f.nri;
const lic = f.licensing!;
const code = f.code!;
const cut = lic.threshold_usd ?? 0;
const affirm = Number(lic.summary.match(/over \$([\d,]+)/)![1].replace(/,/g, ''));
const section = lic.summary.match(/58-55-305\(\d\)\([a-z]\)/)![0];
const ircYear = code.summary.match(/(20\d\d) edition/)![1];
const ord = (x: number) => { const s = ['th', 'st', 'nd', 'rd'], v = x % 100; return `${x}${s[(v - 20) % 10] || s[v] || s[0]}`; };
const fireRank = K.states.map((s) => K.facts(s.slug).nri.wildfire.buildingLossUsd ?? 0).sort((a, b) => b - a).indexOf(n.wildfire.buildingLossUsd ?? 0) + 1;
const all = Object.values(n).reduce((t, x) => t + (x.buildingLossUsd ?? 0), 0);
const fireShare = (n.wildfire.buildingLossUsd ?? 0) / all;
const mil = (x: number | null) => { const v = (x ?? 0) / 1e6; return `$${K.num(v, v >= 10 ? 0 : 1)} million`; };

export default defineState({
  slug,
  title: 'Roof Replacement Cost Utah 2026: Prices and the License Line',
  description: `Utah roof replacement costs about ${K.usd(r.typical)} in 2026, most jobs ${K.usd(r.low)} to ${K.usd(r.high)}; work of ${K.usd(cut)} or more needs a DOPL license, and wildfire leads losses.`,
  intro: `In Utah, a reroof priced at ${K.usd(cut)} or more requires a licensed contractor, and wildfire makes up almost all of FEMA's expected building losses.`,
  resume: `The typical professional roof replacement in Utah costs about ${K.usd(r.typical)}, with half of jobs between ${K.usd(r.low)} and ${K.usd(r.high)}, a little above the ${K.usd(us.typical)} national median. The Mountain division, which groups Utah with Colorado, Idaho, Nevada, Arizona, New Mexico, Wyoming and Montana, reported prices above the national level in the 2023 American Housing Survey. Utah roofers then pull the estimate slightly back: BLS measured a mean of ${K.usd(w.mean, 2)} an hour in ${K.wageRef.reference}, under the ${K.usd(nat.mean, 2)} national mean and below Colorado, Idaho and Nevada. Storms hardly figure. FEMA's National Risk Index rates Utah's expected annual hail losses to buildings as ${n.hail.rating} and ice storm losses as ${n.ice_storm.rating}, while wildfire accounts for about ${K.pct(fireShare, 0)} of the total across the hazards this site follows, the ${ord(fireRank)} largest wildfire figure in the country. Under Utah law, building repair work with a contracted value of ${K.usd(cut)} or more needs a contractor license from the Division of Professional Licensing.`,
  body: (h) => `
<h2>Utah's dollar line for contractor licensing</h2>
<p>Utah sets its rule by price. Section ${section} of the ${h.ext(lic.url, 'Utah Construction Trades Licensing Act')} exempts from licensing only alteration, repair or improvement work whose contracted value, labor and materials together, stays under ${h.usd(cut)}. A reroof at or above that amount therefore requires a contractor license from the Division of Professional Licensing (DOPL). Below it, an exempt job over ${h.usd(affirm)} still requires a one-time insurance affirmation filed with DOPL.</p>
<p>Almost every full replacement on this page clears ${h.usd(cut)}: even the low end of the range, ${h.usd(r.low)}, is above it. A quote split into separate contracts to stay under the line is a warning sign. Ask for the DOPL license number and check it before work begins.</p>
<p>The ${h.ext(code.url, 'Utah Code')} adopts the ${ircYear} edition of the International Residential Code for houses, so that is the edition your local inspector will reference if a permit is required.</p>
<h2>A wildfire state, not a hail state</h2>
<p>The ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) expects about ${mil(n.wildfire.buildingLossUsd)} a year in wildfire losses to Utah buildings, rated ${n.wildfire.rating}. Everything else is small: strong wind ${mil(n.strong_wind.buildingLossUsd)}, tornadoes ${mil(n.tornado.buildingLossUsd)}, hail ${mil(n.hail.buildingLossUsd)}. Winter weather is rated ${n.winter_weather.rating} despite a modest dollar figure. For a house near the wildland edge, the fire classification of the roof covering and the vent design deserve their own line in the quote.</p>
<p>Because hail and ice storms barely register, a Utah roof is more often replaced at the end of its service life than after a single event. That leaves time to gather bids in the slower months and to compare them on the same items: tear-off and disposal, decking allowance, underlayment, shingle line and workmanship warranty.</p>
<h3>Wasatch Front prices against the neighbors</h3>
<p>Colorado roofers average ${h.usd(co.mean, 2)}, Nevada ${h.usd(nv.mean, 2)} and Idaho ${h.usd(id.mean, 2)}, all above Utah's ${h.usd(w.mean, 2)}. Colorado's estimate on this site is ${h.usd(coR.typical)}. In Utah, a house of ${big.bin!.label} comes to ${h.usd(big.typical)}, with most jobs from ${h.usd(big.low)} to ${h.usd(big.high)}; one of ${small.bin!.label} sits near ${h.usd(small.typical)}. Ask bidders to price ice and water membrane at the eaves as its own line, so you can see how far up the slope each one runs it.</p>`,
  faqs: [
    { q: 'How much does a new roof cost in Utah?', a: `About ${K.usd(r.typical)} for a typical professional replacement in Utah, with half of jobs between ${K.usd(r.low)} and ${K.usd(r.high)}. The estimate uses Mountain division prices from the American Housing Survey with the labor share set to Utah roofer wages from BLS. Tile, steep pitches and fire-rated upgrades can raise a Utah quote.` },
    { q: 'When does a roofer need a license in Utah?', a: `Utah exempts from contractor licensing only repair or improvement work with a contracted value under ${K.usd(cut)}, labor and materials included. A reroof at or above that amount requires a license from the Division of Professional Licensing. Exempt jobs over ${K.usd(affirm)} still need a one-time insurance affirmation filed with the division.` },
    { q: 'What natural hazard matters most for Utah roofs?', a: `Wildfire, by far. FEMA's National Risk Index estimates about ${mil(n.wildfire.buildingLossUsd)} a year in expected wildfire losses to Utah buildings, the ${ord(fireRank)} largest in the nation, while hail and ice storm losses are rated very low. Fire-rated coverings and ember-resistant vents are worth pricing for homes near open land.` },
  ],
  related: ['roof-replacement-cost', 'roof:colorado', 'roof:idaho', 'roof:nevada', 'solar-panel-cost'],
  extraSources: [
    { name: 'Utah Code 58-55-305, exemptions from contractor licensure', url: lic.url },
    { name: 'Utah Code 15A-2-103, adopted building codes', url: code.url },
  ],
});
