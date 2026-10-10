import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'missouri';
const r = K.job('roof', slug);
const us = K.job('roof');
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const ks = K.wage('kansas', 'roofers')!;
const il = K.wage('illinois', 'roofers')!;
const ar = K.wage('arkansas', 'roofers')!;
const f = K.facts(slug);
const n = f.nri;
const ord = (x: number) => { const s = ['th', 'st', 'nd', 'rd'], v = x % 100; return `${x}${s[(v - 20) % 10] || s[v] || s[0]}`; };
const rankOf = (key: string) => { const all = K.states.map((s) => K.facts(s.slug).nri[key].buildingLossUsd ?? 0).sort((a, b) => b - a); return all.indexOf(n[key].buildingLossUsd ?? 0) + 1; };
const iceRank = rankOf('ice_storm');
const hailRank = rankOf('hail');
const mil = (x: number | null) => `$${K.num((x ?? 0) / 1e6)} million`;
const under = Math.round((1 - w.mean / nat.mean) * 1000) / 10;

export default defineState({
  slug,
  title: 'Roof Replacement Cost Missouri 2026: Ice, Hail and Prices',
  description: `Missouri roof replacement in 2026: about ${K.usd(r.typical)} for a typical job, ${K.usd(r.low)} to ${K.usd(r.high)} for most, with ice storm losses to buildings near the top in FEMA data.`,
  intro: `Missouri sits where ice storms, hail and tornadoes overlap, and its roofers earn close to the national mean.`,
  resume: `Expect to pay around ${K.usd(r.typical)} to have a professional replace a roof in Missouri, with the middle half of jobs between ${K.usd(r.low)} and ${K.usd(r.high)}. That sits almost on the national median of ${K.usd(us.typical)}, because the West North Central division, which groups Missouri with Kansas, Iowa, Nebraska, Minnesota and the Dakotas, reported prices at the national level in the 2023 American Housing Survey. Missouri roofers earned a mean of ${K.usd(w.mean, 2)} an hour in ${K.wageRef.reference}, according to BLS, about ${under}% under the ${K.usd(nat.mean, 2)} national figure, so the labor adjustment barely moves the bill. What sets the state apart is the weather. FEMA's National Risk Index puts Missouri's expected annual losses to buildings from ice storms at ${n.ice_storm.rating}, the ${ord(iceRank)} largest in dollars nationwide, and its hail losses rank ${ord(hailRank)}. Ice, hail and tornado damage all end up on the roof, which is why many Missouri replacements happen well before the shingles wear out.`,
  body: (h) => `
<h2>Ice storms put Missouri in a small group</h2>
<p>Few states carry ice storm losses on the scale Missouri does. The ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) estimates ${mil(n.ice_storm.buildingLossUsd)} a year in expected damage to Missouri buildings from freezing rain and ice accretion, rated ${n.ice_storm.rating}. Ice that coats a roof adds weight to the decking and gutters, and the refreeze cycle can lift shingle edges or force water under the first courses. Tree limbs that snap under glaze are another path to a punctured roof.</p>
<p>The same index rates hail at ${n.hail.rating} with about ${mil(n.hail.buildingLossUsd)} a year, tornadoes at ${n.tornado.rating} with ${mil(n.tornado.buildingLossUsd)}, and strong wind at ${n.strong_wind.rating}. Hurricane losses are ${n.hurricane.rating}, as you would expect this far inland, and wildfire is ${n.wildfire.rating}. The combination means Missouri homeowners face damage from two seasons, winter glaze and spring convection, rather than one.</p>
<h2>Labor costs near the middle of the map</h2>
<p>A Missouri roofer's mean wage of ${h.usd(w.mean, 2)} lands between the neighbors: Kansas at ${h.usd(ks.mean, 2)}, Arkansas at ${h.usd(ar.mean, 2)}, and Illinois far higher at ${h.usd(il.mean, 2)}. Because the calculator only scales the labor share of the job to state pay, the gap with Illinois changes a Missouri estimate by hundreds of dollars, not thousands. Kansas City straddles the Kansas line and St. Louis faces Illinois across the river, so a quote from a metro firm may reflect pay on either side.</p>
<h3>Sizing the job for a Missouri house</h3>
<p>For a home of ${big.bin!.label}, the Missouri estimate rises to ${h.usd(big.typical)}, with most jobs from ${h.usd(big.low)} to ${h.usd(big.high)}. A house of ${small.bin!.label} sits nearer ${h.usd(small.typical)}. After an ice event, ask the contractor to inspect the decking around eaves and valleys before pricing, since soft plywood found mid-job is billed separately, often by the sheet. Gutters bent by ice loads are a separate line too; some roofers replace them, others leave that to a gutter company. If you file a claim, keep the photos taken before any tarp goes on; the adjuster's scope and your deductible will set what you actually pay.</p>
${h.mini('wageGap', { state: 'Missouri', job: 'Roof replacement', median: us.typical * r.region, L: r.L, index: r.index })}`,
  faqs: [
    { q: 'What does a full roof replacement cost in Missouri in 2026?', a: `A typical professional job in Missouri comes to about ${K.usd(r.typical)}, and half fall between ${K.usd(r.low)} and ${K.usd(r.high)}. The estimate uses prices reported by owners in the West North Central division to the American Housing Survey, adjusted for the Missouri roofer wage BLS measured in ${K.wageRef.reference}. Decking repairs, a second shingle layer or a steep pitch can push a quote higher.` },
    { q: 'How often do ice storms damage roofs in Missouri?', a: `FEMA does not count individual storms on its state index, but it rates Missouri's expected annual ice storm losses to buildings as ${n.ice_storm.rating}, about ${mil(n.ice_storm.buildingLossUsd)} a year, the ${ord(iceRank)} largest total in the country. That makes ice a regular cause of roof repairs and early replacements, alongside hail and tornado damage in spring.` },
    { q: 'Are roofers in Missouri cheaper than in Illinois?', a: `Yes, by a wide margin on wages: BLS measured ${K.usd(w.mean, 2)} an hour for Missouri roofers against ${K.usd(il.mean, 2)} in Illinois. Labor is only part of a roofing bill, though, so the difference in a finished roof is smaller than the wage gap suggests. Materials and dumpster fees cost roughly the same on both sides of the Mississippi.` },
  ],
  related: ['roof-replacement-cost', 'roof:kansas', 'roof:illinois', 'roof:arkansas', 'roofing-calculator'],
  extraSources: [],
});
