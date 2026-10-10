import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'wyoming';
const r = K.job('roof', slug);
const us = K.job('roof');
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const co = K.wage('colorado', 'roofers')!;
const mt = K.wage('montana', 'roofers')!;
const ut = K.wage('utah', 'roofers')!;
const sd = K.wage('south-dakota', 'roofers')!;
const coR = K.job('roof', 'colorado');
const sdR = K.job('roof', 'south-dakota');
const f = K.facts(slug);
const n = f.nri;
const ord = (x: number) => { const s = ['th', 'st', 'nd', 'rd'], v = x % 100; return `${x}${s[(v - 20) % 10] || s[v] || s[0]}`; };
const windLow = K.states.map((s) => K.facts(s.slug).nri.strong_wind.buildingLossUsd ?? 0).sort((a, b) => a - b).indexOf(n.strong_wind.buildingLossUsd ?? 0) + 1;
const mil = (x: number | null) => { const v = (x ?? 0) / 1e6; return `$${K.num(v, v >= 10 ? 0 : 1)} million`; };
const emp = w.emp ?? 0;
const payGap = Math.round((1 - w.mean / nat.mean) * 100);

export default defineState({
  slug,
  title: 'Roof Replacement Cost Wyoming 2026: Mountain West Prices',
  description: `Wyoming roof replacement in 2026: about ${K.usd(r.typical)} typical, ${K.usd(r.low)} to ${K.usd(r.high)} for most jobs, with roofer pay ${payGap}% under the U.S. mean and few storm losses.`,
  intro: `Wyoming has one of the smallest roofing workforces in the country and some of the lowest expected storm losses to buildings.`,
  resume: `Wyoming's typical professional roof replacement costs about ${K.usd(r.typical)}, with half of jobs between ${K.usd(r.low)} and ${K.usd(r.high)}, slightly above the ${K.usd(us.typical)} national median. The Mountain division, where the Census Bureau places Wyoming alongside Colorado, Montana, Idaho, Utah, Nevada, Arizona and New Mexico, reported prices above the national level in the 2023 American Housing Survey. Wyoming pay pulls that back. BLS counted only about ${K.num(emp)} roofers in the state in ${K.wageRef.reference}, earning a mean of ${K.usd(w.mean, 2)} an hour, ${payGap}% under the ${K.usd(nat.mean, 2)} national mean and below Colorado, Montana and Utah, so the labor share of a Wyoming job costs less than elsewhere in the division. Storms are not the main concern. In FEMA's National Risk Index, Wyoming's expected annual strong wind losses to buildings rank ${ord(windLow)} smallest among the states, and ice storms are rated ${n.ice_storm.rating}. Wildfire, rated ${n.wildfire.rating}, carries the largest dollar figure.`,
  body: (h) => `
<h2>A small workforce spread over a big state</h2>
<p>About ${h.num(emp)} roofers worked in Wyoming at the time of the BLS count, one of the smallest totals of any state. That matters more for scheduling than for price. A homeowner far from Cheyenne, Casper or the larger towns may find fewer firms willing to travel, and the quote may include mobilization or lodging for the crew. Ask whether it does, and compare bids on that line as well as on the roof itself.</p>
<p>On wages, Wyoming roofers earn ${h.usd(w.mean, 2)} an hour, against ${h.usd(co.mean, 2)} in Colorado, ${h.usd(mt.mean, 2)} in Montana and ${h.usd(ut.mean, 2)} in Utah. South Dakota, outside the division, pays ${h.usd(sd.mean, 2)}. Colorado's estimate on this site is ${h.usd(coR.typical)} and South Dakota's ${h.usd(sdR.typical)}; Wyoming sits between them at ${h.usd(r.typical)}.</p>
<h2>Low storm figures, with wildfire on top</h2>
<p>The ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) estimates Wyoming's expected annual strong wind losses to buildings at only ${mil(n.strong_wind.buildingLossUsd)}, the ${ord(windLow)} smallest figure nationwide. The index measures expected losses to buildings, so a thinly built state scores low partly because there is less to damage. Wildfire leads at ${mil(n.wildfire.buildingLossUsd)}, rated ${n.wildfire.rating}, followed by hail at ${mil(n.hail.buildingLossUsd)} and tornadoes at ${mil(n.tornado.buildingLossUsd)}. Winter weather is rated ${n.winter_weather.rating}, and hurricanes do not apply.</p>
<p>For a homeowner, these numbers say that a Wyoming roof is more often replaced for age than after a single event. Ask about the nailing pattern and edge details anyway; a low statewide total says little about the exposure of one house on an open ridge.</p>
<h3>House size and the Wyoming estimate</h3>
<p>On a house of ${big.bin!.label}, the estimate is ${h.usd(big.typical)}, with most jobs between ${h.usd(big.low)} and ${h.usd(big.high)}. For ${small.bin!.label}, expect about ${h.usd(small.typical)}. Ask whether the price includes an ice and water membrane along the eaves and in valleys, how many sheets of decking are included before extra charges start, and how debris will be hauled from your property.</p>
<p>Wildfire is the hazard worth a separate conversation. If grass, sage or timber grows close to the house, request a price for a fire-rated covering and ember-resistant vents next to the standard option, and clear gutters of needles and leaves once the new roof is on.</p>
${h.mini('wageGap', { state: 'Wyoming', job: 'Roof replacement', median: us.typical * r.region, L: r.L, index: r.index })}`,
  faqs: [
    { q: 'How much does a roof replacement cost in Wyoming?', a: `About ${K.usd(r.typical)} for a typical professional job in Wyoming, with half of replacements between ${K.usd(r.low)} and ${K.usd(r.high)}. The estimate takes the Mountain division price level from the American Housing Survey and scales its labor share to Wyoming roofer pay from BLS. Travel to remote addresses and decking repairs can add to a quote.` },
    { q: 'How many roofers work in Wyoming?', a: `BLS counted about ${K.num(emp)} roofers in Wyoming in ${K.wageRef.reference}, one of the smallest roofing workforces of any state, earning a mean of ${K.usd(w.mean, 2)} an hour. With so few crews, booking ahead and asking whether a quote includes travel or lodging charges matters more in Wyoming than in larger states.` },
    { q: 'Is wind a big cause of roof losses in Wyoming according to FEMA?', a: `Not in FEMA's dollar terms. The National Risk Index estimates only about ${mil(n.strong_wind.buildingLossUsd)} a year in expected strong wind losses to Wyoming buildings, the ${ord(windLow)} smallest of any state. Wildfire produces the largest figure. Edge fastening still deserves attention on a Wyoming roof, since low totals partly reflect a small number of buildings.` },
  ],
  related: ['roof-replacement-cost', 'roof:colorado', 'roof:montana', 'roof:south-dakota', 'roofing-calculator'],
  extraSources: [],
});
