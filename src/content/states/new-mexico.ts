import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'new-mexico';
const r = K.job('roof', slug);
const us = K.job('roof');
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1500);
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const az = K.wage('arizona', 'roofers')!;
const co = K.wage('colorado', 'roofers')!;
const tx = K.wage('texas', 'roofers')!;
const coR = K.job('roof', 'colorado');
const f = K.facts(slug);
const n = f.nri;
const lic = f.licensing!;
const mil = (x: number | null) => `$${K.num((x ?? 0) / 1e6)} million`;
const share = (n.wildfire.buildingLossUsd ?? 0) / Object.values(n).reduce((t, x) => t + (x.buildingLossUsd ?? 0), 0);
const payGap = Math.round((1 - w.mean / nat.mean) * 100);

export default defineState({
  slug,
  title: 'Roof Replacement Cost New Mexico 2026: Prices and Wages',
  description: `New Mexico roof replacement in 2026: roughly ${K.usd(r.typical)} typical, ${K.usd(r.low)} to ${K.usd(r.high)} for most jobs, with roofer wages ${payGap}% below the U.S. mean and wildfire on top.`,
  intro: `New Mexico combines some of the lowest roofer pay in the Mountain West with a FEMA loss profile dominated by wildfire.`,
  resume: `The typical New Mexico roof replacement by a professional costs about ${K.usd(r.typical)}, and most jobs run between ${K.usd(r.low)} and ${K.usd(r.high)}. That is a touch above the ${K.usd(us.typical)} national median, because the Mountain division as a whole (New Mexico with Arizona, Colorado, Utah, Nevada, Wyoming, Idaho and Montana) reported higher prices in the 2023 American Housing Survey. New Mexico pulls that regional figure down. BLS measured a mean wage of ${K.usd(w.mean, 2)} an hour for roofers in the state in ${K.wageRef.reference}, ${payGap}% under the ${K.usd(nat.mean, 2)} national mean and below both Arizona and Colorado, so the labor share of a New Mexico job is cheaper than elsewhere in the division. Hazards look different from the plains states too. In FEMA's National Risk Index, wildfire accounts for about ${K.pct(share, 0)} of the expected annual losses to buildings across the ${Object.keys(n).length} roof-related hazards this site tracks, rated ${n.wildfire.rating}, while hail is ${n.hail.rating}. New Mexico's Construction Industries Division requires a license to offer construction contracting.`,
  body: (h) => `
<h2>Fire, not hail, leads New Mexico's loss figures</h2>
<p>Of the roof-related hazards in the ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}), wildfire is the heavy one for New Mexico: ${mil(n.wildfire.buildingLossUsd)} in expected annual losses to buildings, rated ${n.wildfire.rating}. Hail comes next at ${mil(n.hail.buildingLossUsd)}, rated only ${n.hail.rating}, and tornadoes add ${mil(n.tornado.buildingLossUsd)}. Winter weather is rated ${n.winter_weather.rating}, yet its dollar figure is small at ${mil(n.winter_weather.buildingLossUsd)}. Hurricane losses are ${n.hurricane.rating}.</p>
<p>That ranking shapes what to ask a roofer. If the house backs onto brush or forest, the covering's fire classification, the vent design and the gap between eaves and nearby vegetation deserve as much attention as the shingle color. Where a house has a flat or low-slope roof, as many Pueblo Revival homes do, the work is a different job entirely, with membranes or coatings, and the asphalt-shingle range on this page is only a rough guide for them.</p>
<h2>Licensing through the Construction Industries Division</h2>
<p>The ${h.ext(lic.url, 'Construction Industries Division')} of New Mexico's Regulation and Licensing Department describes its mission as requiring licensure for anyone who practices or offers to practice construction contracting. The specific roofing classification could not be confirmed on the pages this site read, so ask the contractor which license class it holds and look the number up with the division.</p>
<h3>New Mexico wages against the neighbors</h3>
<p>A New Mexico roofer's ${h.usd(w.mean, 2)} mean compares with ${h.usd(az.mean, 2)} in Arizona, ${h.usd(co.mean, 2)} in Colorado and ${h.usd(tx.mean, 2)} in Texas. Colorado's estimate on this site is ${h.usd(coR.typical)} for the same typical job, a difference that comes from labor alone since both states share the Mountain division price level. On a house of ${big.bin!.label}, the New Mexico estimate is ${h.usd(big.typical)}; for ${small.bin!.label}, about ${h.usd(small.typical)}. Ask whether the quote includes replacing parapet flashing or scuppers where the roof meets a wall, a frequent extra on flat-roofed homes.</p>
<p>Sun exposure is the other conversation worth having. Ask which coating or membrane the contractor proposes for a low-slope section, how many years its warranty covers, and whether the bid includes re-coating later or only the first application. Two New Mexico quotes that look far apart often turn out to describe different systems, so compare them product by product.</p>`,
  faqs: [
    { q: 'How much does a roof replacement cost in New Mexico?', a: `About ${K.usd(r.typical)} for a typical professional replacement, with half of New Mexico jobs between ${K.usd(r.low)} and ${K.usd(r.high)}. The estimate applies New Mexico roofer wages to the Mountain division price level from the American Housing Survey. Flat roofs with membranes, tile or extensive flashing work can fall outside that range.` },
    { q: 'Do I need a licensed contractor for a roof in New Mexico?', a: `New Mexico's Construction Industries Division states that it requires licensure for anyone practicing or offering to practice construction contracting. The exact roofing classification was not confirmed on the pages this site read, so ask the contractor for its license number and class, then verify it with the division before signing.` },
    { q: 'Are roofers paid less in New Mexico than in Colorado?', a: `Yes. BLS measured ${K.usd(w.mean, 2)} an hour for New Mexico roofers in ${K.wageRef.reference}, against ${K.usd(co.mean, 2)} in Colorado. Both states sit in the Mountain division, so the difference in the roof estimates on this site comes from the labor share alone, which keeps the gap in a finished New Mexico roof moderate.` },
  ],
  related: ['roof-replacement-cost', 'roof:arizona', 'roof:colorado', 'roof:texas', 'solar-panel-cost'],
  extraSources: [
    { name: 'New Mexico Regulation and Licensing Department, Construction Industries Division', url: lic.url },
  ],
});
