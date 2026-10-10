import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'tennessee';
const r = K.job('roof', slug);
const us = K.job('roof');
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const ky = K.wage('kentucky', 'roofers')!;
const nc = K.wage('north-carolina', 'roofers')!;
const ga = K.wage('georgia', 'roofers')!;
const ncR = K.job('roof', 'north-carolina');
const f = K.facts(slug);
const n = f.nri;
const ord = (x: number) => { const s = ['th', 'st', 'nd', 'rd'], v = x % 100; return `${x}${s[(v - 20) % 10] || s[v] || s[0]}`; };
const cheapRank = K.states.map((s) => K.job('roof', s.slug).typical).sort((a, b) => a - b).indexOf(r.typical) + 1;
const regionGap = Math.round((1 - r.region) * 100);
const mil = (x: number | null) => `$${K.num((x ?? 0) / 1e6)} million`;
const torShare = (n.tornado.buildingLossUsd ?? 0) / Object.values(n).reduce((t, x) => t + (x.buildingLossUsd ?? 0), 0);

export default defineState({
  slug,
  title: 'Roof Replacement Cost Tennessee 2026: Below-Median Prices',
  description: `Tennessee roof replacement costs about ${K.usd(r.typical)} in 2026, most jobs ${K.usd(r.low)} to ${K.usd(r.high)}, the ${ord(cheapRank)} lowest estimate of any state, with tornadoes leading losses.`,
  intro: `Tennessee has one of the cheapest roof estimates in the country, and tornadoes account for most of its expected storm losses to buildings.`,
  resume: `A professional roof replacement in Tennessee costs about ${K.usd(r.typical)}, and half of jobs fall between ${K.usd(r.low)} and ${K.usd(r.high)}, the ${ord(cheapRank)} lowest typical price among the states on this site and well under the ${K.usd(us.typical)} national median. Most of the discount is regional. The East South Central division, where the Census Bureau groups Tennessee with Kentucky, Alabama and Mississippi, reported prices about ${regionGap}% below the national level in the 2023 American Housing Survey, the lowest of any division. Labor trims a little more: BLS measured Tennessee roofers at a mean of ${K.usd(w.mean, 2)} an hour in ${K.wageRef.reference}, under the ${K.usd(nat.mean, 2)} national mean and slightly under the division average. The roof's main enemy is wind. In FEMA's National Risk Index, tornadoes make up about ${K.pct(torShare, 0)} of Tennessee's expected annual losses to buildings across the hazards this site tracks, rated ${n.tornado.rating}, and strong wind is rated ${n.strong_wind.rating}.`,
  body: (h) => `
<h2>Tornadoes dominate Tennessee's loss figures</h2>
<p>The ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) gives Tennessee a tornado score of ${h.num(n.tornado.score ?? 0, 1)} out of 100 and estimates ${mil(n.tornado.buildingLossUsd)} a year in expected tornado losses to buildings. Strong wind adds ${mil(n.strong_wind.buildingLossUsd)}, hail ${mil(n.hail.buildingLossUsd)} and ice storms ${mil(n.ice_storm.buildingLossUsd)}, rated ${n.ice_storm.rating}. Winter weather is ${n.winter_weather.rating}. Hurricanes are rated ${n.hurricane.rating} and wildfire ${n.wildfire.rating}.</p>
<p>A direct tornado hit usually means more than a roof job. Wind around the edges of a storm does subtler damage: lifted tabs, creased shingles and missing ridge caps that may leak only later. If your roof is approaching the end of its life, a wind-rated shingle line and a tighter nailing pattern are reasonable things to price as options.</p>
<h2>The cheapest division, and a low wage inside it</h2>
<p>East South Central prices start about ${regionGap}% under the national median, and Tennessee roofers at ${h.usd(w.mean, 2)} an hour earn a bit less than Kentucky roofers at ${h.usd(ky.mean, 2)}. Across the mountains, North Carolina pays ${h.usd(nc.mean, 2)} and sits in the South Atlantic division, priced at the national level, which is why its typical roof comes to ${h.usd(ncR.typical)} against ${h.usd(r.typical)} here. Georgia pays ${h.usd(ga.mean, 2)}.</p>
<p>Low estimates are not a reason to skip comparison. In a state where a typical job costs this little, a single extra line for decking or a second tear-off layer changes the total by a larger share than it would elsewhere.</p>
<h3>Sizing a Tennessee roof</h3>
<p>For a home of ${big.bin!.label}, the Tennessee estimate is ${h.usd(big.typical)}, with most jobs from ${h.usd(big.low)} to ${h.usd(big.high)}. For ${small.bin!.label}, expect around ${h.usd(small.typical)}. Ask whether the bid prices plywood replacement per sheet, how many sheets it already includes, and whether drip edge and new pipe boots are part of the base price or extras.</p>
<p>When a bad storm passes through a Tennessee county, local roofers fill their calendars quickly. If the damage is limited to a few shingles, a repair can buy time until you can gather written bids for a full replacement on your own schedule. Keep photos of the damage and of any temporary patch, since an insurer will want both.</p>
${h.mini('wageGap', { state: 'Tennessee', job: 'Roof replacement', median: us.typical * r.region, L: r.L, index: r.index })}`,
  faqs: [
    { q: 'How much does a roof replacement cost in Tennessee in 2026?', a: `About ${K.usd(r.typical)} for a typical professional job in Tennessee, with half of replacements between ${K.usd(r.low)} and ${K.usd(r.high)}. That is among the lowest estimates on this site, because East South Central prices in the American Housing Survey run below the national level and Tennessee roofer wages are modest. A large house or decking repairs lift the price.` },
    { q: 'Why is a new roof cheaper in Tennessee than in North Carolina?', a: `Mostly because of the region. Owners in the East South Central division reported prices about ${regionGap}% under the national median, while North Carolina's South Atlantic division sits at the national level. Tennessee roofers also earn ${K.usd(w.mean, 2)} an hour against ${K.usd(nc.mean, 2)} in North Carolina, which widens the gap a little.` },
    { q: 'Do tornadoes cause most roof damage in Tennessee?', a: `They produce the largest share of expected losses. FEMA's National Risk Index estimates about ${mil(n.tornado.buildingLossUsd)} a year in tornado losses to Tennessee buildings, rated ${n.tornado.rating}, with strong wind adding ${mil(n.strong_wind.buildingLossUsd)}. Wind-rated shingles and careful fastening at the edges are sensible options to price.` },
  ],
  related: ['roof-replacement-cost', 'roof:kentucky', 'roof:north-carolina', 'roof:georgia', 'hvac-replacement-cost'],
  extraSources: [],
});
