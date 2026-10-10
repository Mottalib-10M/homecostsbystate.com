import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'pennsylvania';
const r = K.job('roof', slug);
const us = K.job('roof');
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const nj = K.wage('new-jersey', 'roofers')!;
const ny = K.wage('new-york', 'roofers')!;
const oh = K.wage('ohio', 'roofers')!;
const md = K.wage('maryland', 'roofers')!;
const njR = K.job('roof', 'new-jersey');
const ohR = K.job('roof', 'ohio');
const f = K.facts(slug);
const n = f.nri;
const code = f.code!;
const icodes = code.summary.match(/(20\d\d) I-Code series/)![1];
const since = code.summary.match(/effective ([A-Z][a-z]+ \d{1,2}, 20\d\d)/)![1];
const ord = (x: number) => { const s = ['th', 'st', 'nd', 'rd'], v = x % 100; return `${x}${s[(v - 20) % 10] || s[v] || s[0]}`; };
const winterScoreRank = K.states.map((s) => K.facts(s.slug).nri.winter_weather.score ?? 0).sort((a, b) => b - a).indexOf(n.winter_weather.score ?? 0) + 1;
const mil = (x: number | null) => `$${K.num((x ?? 0) / 1e6)} million`;
const gapNj = njR.typical - r.typical;

export default defineState({
  slug,
  title: 'Roof Replacement Cost Pennsylvania 2026: Price and Wage Gap',
  description: `Pennsylvania roof replacement costs about ${K.usd(r.typical)} in 2026 and most jobs ${K.usd(r.low)} to ${K.usd(r.high)}, about ${K.usd(gapNj)} less than in New Jersey for the same typical roof.`,
  intro: `Pennsylvania roofers earn far less than their New Jersey and New York counterparts, which makes the state the cheapest place in its division to replace a roof.`,
  resume: `The typical professional roof replacement in Pennsylvania costs about ${K.usd(r.typical)}, with most jobs running from ${K.usd(r.low)} to ${K.usd(r.high)}. That is above the ${K.usd(us.typical)} national median, since the Middle Atlantic division (Pennsylvania, New York and New Jersey) reported higher prices than the country as a whole in the 2023 American Housing Survey. Within that division, though, Pennsylvania is the bargain. BLS measured a mean of ${K.usd(w.mean, 2)} an hour for Pennsylvania roofers in ${K.wageRef.reference}, under the ${K.usd(nat.mean, 2)} national mean and well under New Jersey at ${K.usd(nj.mean, 2)} and New York at ${K.usd(ny.mean, 2)}. With labor scaled to those wages, a typical Pennsylvania roof comes in about ${K.usd(gapNj)} below the New Jersey estimate. On weather, FEMA's National Risk Index gives Pennsylvania a winter weather score that ranks ${ord(winterScoreRank)} among the states, rated ${n.winter_weather.rating}, while hurricanes produce the largest expected annual dollar losses to buildings.`,
  body: (h) => `
<h2>The cheapest roof in the Middle Atlantic</h2>
<p>Three states share one regional price level in the American Housing Survey, and Pennsylvania pays its roofers the least of them. At ${h.usd(w.mean, 2)} an hour, the Pennsylvania mean is ${h.usd(nj.mean - w.mean, 2)} below New Jersey's and ${h.usd(ny.mean - w.mean, 2)} below New York's. Because the method applies state wages only to the labor share of the job, the estimate here lands at ${h.usd(r.typical)}, against ${h.usd(njR.typical)} across the Delaware. Ohio, in a different division with its own price level, comes to ${h.usd(ohR.typical)} even though its roofers earn ${h.usd(oh.mean, 2)}, close to the Pennsylvania figure. Maryland pays ${h.usd(md.mean, 2)}.</p>
<p>A statewide mean hides the spread between Philadelphia or Pittsburgh crews and rural ones. Use the range as a reference point and expect metro bids nearer its upper half.</p>
<h2>Winter scores high, hurricanes cost the most</h2>
<p>In the ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}), Pennsylvania's winter weather score of ${h.num(n.winter_weather.score ?? 0, 1)} is one of the highest in the country, though the expected annual loss to buildings is about ${mil(n.winter_weather.buildingLossUsd)}. The largest dollar figure comes from hurricanes, at ${mil(n.hurricane.buildingLossUsd)}, rated ${n.hurricane.rating}. Tornadoes add ${mil(n.tornado.buildingLossUsd)}, strong wind ${mil(n.strong_wind.buildingLossUsd)}, rated ${n.strong_wind.rating}, and ice storms ${mil(n.ice_storm.buildingLossUsd)}. Hail is ${n.hail.rating} and wildfire ${n.wildfire.rating}.</p>
<p>That points the bid toward ice and water membrane at the eaves and valleys, adequate attic ventilation, and secure fastening at the edges for wind. Ask where each appears in the quote, and whether the price assumes one layer of old shingles or two; a second layer on an older Pennsylvania house adds tear-off hours and disposal weight.</p>
<h3>Pennsylvania's Uniform Construction Code</h3>
<p>The ${h.ext(code.url, 'Department of Labor and Industry')} explains that the Uniform Construction Code regulations adopting the ${icodes} I-Code series, as amended by the state's Review and Advisory Council, took effect on ${since}. Whether a reroof at your address needs a permit is a question for your township or borough office.</p>
<p>On a house of ${big.bin!.label}, the Pennsylvania estimate is ${h.usd(big.typical)}, with the middle half of jobs between ${h.usd(big.low)} and ${h.usd(big.high)}; on ${small.bin!.label}, about ${h.usd(small.typical)}. Row homes and twins fall outside the detached-house base of the survey, so their prices may not follow this range.</p>`,
  faqs: [
    { q: 'How much is a roof replacement in Pennsylvania in 2026?', a: `About ${K.usd(r.typical)} for a typical professional job in Pennsylvania, with half of replacements between ${K.usd(r.low)} and ${K.usd(r.high)}. The range starts from Middle Atlantic prices in the American Housing Survey and scales the labor share to Pennsylvania roofer wages from BLS. Multiple shingle layers or new sheathing lift the price.` },
    { q: 'Why is a new roof cheaper in Pennsylvania than in New Jersey?', a: `Both states share the Middle Atlantic price level, but BLS measured ${K.usd(w.mean, 2)} an hour for Pennsylvania roofers against ${K.usd(nj.mean, 2)} in New Jersey. Applied to the labor share of the job, that wage gap puts the typical Pennsylvania roof about ${K.usd(gapNj)} below the New Jersey estimate on this site.` },
    { q: 'What building code applies to a reroof in Pennsylvania?', a: `The Pennsylvania Uniform Construction Code. The Department of Labor and Industry states that regulations adopting the ${icodes} I-Code series, as amended by the Review and Advisory Council, took effect on ${since}. Ask your township or borough whether your reroof needs a permit under it.` },
  ],
  related: ['roof-replacement-cost', 'roof:new-jersey', 'roof:new-york', 'roof:ohio', 'roofing-calculator'],
  extraSources: [
    { name: 'Pennsylvania Department of Labor and Industry, Uniform Construction Code', url: code.url },
  ],
});
