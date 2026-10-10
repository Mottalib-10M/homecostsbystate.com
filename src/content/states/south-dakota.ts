import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'south-dakota';
const r = K.job('roof', slug);
const us = K.job('roof');
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const nd = K.wage('north-dakota', 'roofers')!;
const ne = K.wage('nebraska', 'roofers')!;
const mn = K.wage('minnesota', 'roofers')!;
const ndR = K.job('roof', 'north-dakota');
const f = K.facts(slug);
const n = f.nri;
const ne_ = K.facts('nebraska').nri;
const ord = (x: number) => { const s = ['th', 'st', 'nd', 'rd'], v = x % 100; return `${x}${s[(v - 20) % 10] || s[v] || s[0]}`; };
const wageRank = K.states.map((s) => K.wage(s.slug, 'roofers')?.mean ?? 0).sort((a, b) => a - b).indexOf(w.mean) + 1;
const priceRank = K.states.map((s) => K.job('roof', s.slug).typical).sort((a, b) => a - b).indexOf(r.typical) + 1;
const mil = (x: number | null) => `$${K.num((x ?? 0) / 1e6)} million`;
const below = us.typical - r.typical;
const lowPay = Math.round((1 - w.mean / nat.mean) * 100);

export default defineState({
  slug,
  title: 'Roof Replacement Cost South Dakota 2026: Low Labor Prices',
  description: `South Dakota roof replacement costs about ${K.usd(r.typical)} in 2026, with most jobs ${K.usd(r.low)} to ${K.usd(r.high)}, helped by roofer wages ${lowPay}% under the national mean in BLS data.`,
  intro: `South Dakota pays roofers less than almost any other state, which puts its roof estimate among the lowest on the site.`,
  resume: `Expect about ${K.usd(r.typical)} for a professional roof replacement in South Dakota, with most jobs between ${K.usd(r.low)} and ${K.usd(r.high)}, roughly ${K.usd(below)} less than the national median. Only a handful of states come in lower on this site: South Dakota ranks ${ord(priceRank)} from the bottom. The reason is pay. BLS measured a mean wage of ${K.usd(w.mean, 2)} an hour for South Dakota roofers in ${K.wageRef.reference}, the ${ord(wageRank)} lowest among all states and ${lowPay}% below the ${K.usd(nat.mean, 2)} national mean. The West North Central division, which includes both Dakotas, Nebraska, Kansas, Iowa, Minnesota and Missouri, reported prices at the national level in the 2023 American Housing Survey, so only the labor share pulls the estimate down. FEMA's National Risk Index rates South Dakota's expected annual losses to buildings from winter weather as ${n.winter_weather.rating} and from ice storms as ${n.ice_storm.rating}. Hail, perhaps surprisingly given the neighbors, is rated ${n.hail.rating}.`,
  body: (h) => `
<h2>Bottom-tier roofer pay, middle-of-the-road prices</h2>
<p>At ${h.usd(w.mean, 2)} an hour, a South Dakota roofer earns ${h.usd(nd.mean - w.mean, 2)} less than one in North Dakota and ${h.usd(mn.mean - w.mean, 2)} less than one in Minnesota. Nebraska, at ${h.usd(ne.mean, 2)}, is the closest neighbor in pay. Those differences look large by the hour, but labor is only one slice of a roofing contractor's revenue. Shingles, underlayment, flashing and dumpsters cost the same in Sioux Falls as in Fargo, so the typical South Dakota estimate of ${h.usd(r.typical)} sits only ${h.usd(ndR.typical - r.typical)} under North Dakota's.</p>
<p>The workforce is small, too: BLS counted about ${h.num(w.emp ?? 0)} roofers in the whole state. For an address far from the nearest crew, ask whether the quote includes a travel or mobilization charge, and compare bids on that line.</p>
<h2>Hail is lower than you might think</h2>
<p>Next door, Nebraska's hail losses are rated ${ne_.hail.rating}. South Dakota's are rated ${n.hail.rating} in the ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}), at about ${mil(n.hail.buildingLossUsd)} a year. The biggest dollar line is tornadoes at ${mil(n.tornado.buildingLossUsd)}, rated ${n.tornado.rating}, followed by wildfire at ${mil(n.wildfire.buildingLossUsd)} and strong wind at ${mil(n.strong_wind.buildingLossUsd)}. Winter weather, rated ${n.winter_weather.rating}, and ice storms, rated ${n.ice_storm.rating}, are where the scores run higher than the dollar totals suggest.</p>
<p>So a South Dakota bid should cover the cold season as carefully as the storm season: ice and water membrane at the eaves, ventilation that keeps the deck cold, and a fastening pattern for wind.</p>
<p>Low labor costs also make the quality of the bid more important than its total. When two South Dakota quotes differ by a few hundred dollars, the cheaper one often leaves out drip edge, new pipe boots or a full membrane in the valleys. Ask each contractor to list those parts by name so the comparison is fair.</p>
<h3>Price by house size in South Dakota</h3>
<p>A house of ${big.bin!.label} comes to about ${h.usd(big.typical)}, with the middle half of jobs between ${h.usd(big.low)} and ${h.usd(big.high)}. For ${small.bin!.label}, the estimate is near ${h.usd(small.typical)}. A one-level house spreads all its living space under a single roof, so it needs more roofing material than a two-level home of equal size; if yours is built that way, read the upper half of the band.</p>
${h.mini('wageGap', { state: 'South Dakota', job: 'Roof replacement', median: us.typical * r.region, L: r.L, index: r.index })}`,
  faqs: [
    { q: 'What does it cost to replace a roof in South Dakota?', a: `A typical professional replacement in South Dakota costs about ${K.usd(r.typical)}, with half of jobs between ${K.usd(r.low)} and ${K.usd(r.high)}. That is one of the lowest estimates on this site, because South Dakota roofer wages measured by BLS are among the lowest in the country. Travel to rural addresses and decking repairs can add to a quote.` },
    { q: 'How much do roofers make in South Dakota?', a: `BLS measured a mean wage of ${K.usd(w.mean, 2)} an hour for South Dakota roofers in ${K.wageRef.reference}, the ${ord(wageRank)} lowest of any state and ${lowPay}% under the national mean of ${K.usd(nat.mean, 2)}. North Dakota roofers earn ${K.usd(nd.mean, 2)} and Minnesota roofers ${K.usd(mn.mean, 2)}, both well above South Dakota, though the gap in a finished roof is much smaller than the gap in hourly pay.` },
    { q: 'Is hail a big roofing risk in South Dakota?', a: `Less than in Nebraska. FEMA's National Risk Index rates South Dakota's expected annual hail losses to buildings as ${n.hail.rating}, about ${mil(n.hail.buildingLossUsd)} a year, while Nebraska's are rated ${ne_.hail.rating}. Tornadoes produce South Dakota's largest dollar figure, and winter weather and ice storms carry relatively high scores.` },
  ],
  related: ['roof-replacement-cost', 'roof:north-dakota', 'roof:nebraska', 'roof:minnesota', 'roofing-calculator'],
  extraSources: [],
});
