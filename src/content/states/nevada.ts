import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'nevada';
const r = K.job('roof', slug);
const us = K.job('roof');
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1600);
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const az = K.wage('arizona', 'roofers')!;
const ut = K.wage('utah', 'roofers')!;
const ca = K.wage('california', 'roofers')!;
const caR = K.job('roof', 'california');
const f = K.facts(slug);
const n = f.nri;
const lic = f.licensing!;
const nrs = lic.summary.match(/NRS [\d.]+\d/)![0];
const mil = (x: number | null) => `$${K.num((x ?? 0) / 1e6)} million`;
const tornadoRank = K.states.map((s) => K.facts(s.slug).nri.tornado.buildingLossUsd ?? 0).sort((a, b) => a - b).indexOf(n.tornado.buildingLossUsd ?? 0) + 1;
const ord = (x: number) => { const s = ['th', 'st', 'nd', 'rd'], v = x % 100; return `${x}${s[(v - 20) % 10] || s[v] || s[0]}`; };

export default defineState({
  slug,
  title: 'Roof Replacement Cost Nevada 2026: Prices, Wildfire, License',
  description: `A Nevada roof replacement costs about ${K.usd(r.typical)} in 2026, most jobs ${K.usd(r.low)} to ${K.usd(r.high)}. Roofers need a state contractor license, and wildfire leads losses.`,
  intro: `In Nevada, wildfire accounts for nearly all of FEMA's expected roof-relevant losses, and contracting without a state license is a crime.`,
  resume: `Plan on about ${K.usd(r.typical)} for a professional roof replacement in Nevada, with most jobs landing between ${K.usd(r.low)} and ${K.usd(r.high)}. That is above the ${K.usd(us.typical)} national median for two reasons. The Mountain division, where the Census Bureau places Nevada, reported higher prices than the country as a whole in the 2023 American Housing Survey. And Nevada roofers out-earn most of the division: BLS measured a mean of ${K.usd(w.mean, 2)} an hour in ${K.wageRef.reference}, against ${K.usd(az.mean, 2)} in Arizona and ${K.usd(ut.mean, 2)} in Utah, though it stays below the ${K.usd(nat.mean, 2)} national mean and well below California. Storm damage is not the story here. FEMA's National Risk Index rates Nevada's expected annual losses to buildings from hail as ${n.hail.rating} and from tornadoes as ${n.tornado.rating}, while wildfire is rated ${n.wildfire.rating}. Any company you hire must hold an active license from the Nevada State Contractors Board.`,
  body: (h) => `
<h2>Almost no tornado or hail exposure, plenty of fire</h2>
<p>Nevada's expected tornado losses to buildings are the ${ord(tornadoRank)} smallest in the ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}), at about ${h.usd(n.tornado.buildingLossUsd ?? 0)} a year. Ice storms barely register at ${h.usd(n.ice_storm.buildingLossUsd ?? 0)}. Hail, rated ${n.hail.rating}, and strong wind, rated ${n.strong_wind.rating}, are also small. Wildfire changes the picture: FEMA estimates ${mil(n.wildfire.buildingLossUsd)} a year in expected losses to Nevada buildings, rated ${n.wildfire.rating}. Embers landing on a roof and in its gutters are a common way fire reaches a house, so the roof covering and the edge details matter more here than impact ratings.</p>
<p>So with a Nevada roofer it makes sense to ask about the fire classification of the shingles or tile, the vents, and the cleanup of debris under the eaves, before you ask about storm warranties.</p>
<h2>Who can legally take the job</h2>
<p>The ${h.ext(lic.url, 'Nevada State Contractors Board')} quotes ${nrs}: it is unlawful to work as a contractor, meaning anyone who builds, alters, repairs or improves a building, without an active Board license. Roofing falls under the Board's specialty classifications. Ask for the license number on the written bid and confirm it on the Board's site; an unlicensed operator leaves you with little recourse if the roof fails.</p>
<h3>Comparing Nevada with its neighbors</h3>
<p>California roofers earn ${h.usd(ca.mean, 2)} an hour, and the California estimate on this site reaches ${h.usd(caR.typical)}, partly because the Pacific division reported much higher prices. Nevada sits between that level and the cheaper interior West. For a house of ${big.bin!.label}, the Nevada figure is ${h.usd(big.typical)}; a house of ${small.bin!.label} comes in around ${h.usd(small.typical)}. Concrete tile and other heavier coverings cost far more than the asphalt-dominated range above, so a tile reroof should be priced on its own terms.</p>
<p>For a Nevada home, a few questions sharpen any bid. How many layers come off, and is the deck underneath plywood or older plank boards? Is the underlayment a synthetic sheet or felt, and what is its rated exposure time? Does the price include new flashing at walls and chimneys, or does the crew reuse what is there? Answers in writing make two Nevada quotes comparable line by line.</p>`,
  faqs: [
    { q: 'How much does it cost to reroof a house in Nevada?', a: `About ${K.usd(r.typical)} for a typical professional job in Nevada, with half of replacements between ${K.usd(r.low)} and ${K.usd(r.high)}. The estimate pairs Mountain division prices from the American Housing Survey with Nevada roofer pay from BLS. Tile, steep slopes and extra decking work lift the price, often well beyond the top of that range.` },
    { q: 'Does a roofer need a license in Nevada?', a: `Yes. The Nevada State Contractors Board cites ${nrs}, which makes it unlawful to act as a contractor on a building without an active Board license, and roofing is one of the Board's specialty classifications. Check the license number on the Board's website before you sign a contract or pay a deposit.` },
    { q: 'Which natural hazard matters most for roofs in Nevada?', a: `Wildfire. FEMA's National Risk Index puts Nevada's expected annual wildfire losses to buildings at about ${mil(n.wildfire.buildingLossUsd)}, rated ${n.wildfire.rating}, while hail and tornado losses are rated very low. That makes fire-rated roof coverings and ember-resistant vents a more relevant conversation than hail-rated shingles for most Nevada homes.` },
  ],
  related: ['roof-replacement-cost', 'roof:california', 'roof:arizona', 'roof:utah', 'solar-panel-cost'],
  extraSources: [
    { name: 'Nevada State Contractors Board, contracting without a license', url: lic.url },
  ],
});
