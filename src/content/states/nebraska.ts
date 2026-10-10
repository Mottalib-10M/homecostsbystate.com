import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'nebraska';
const r = K.job('roof', slug);
const us = K.job('roof');
const big = K.job('roof', slug, 3000);
const mid = K.job('roof', slug, 1800);
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const ia = K.wage('iowa', 'roofers')!;
const ks = K.wage('kansas', 'roofers')!;
const co = K.wage('colorado', 'roofers')!;
const f = K.facts(slug);
const n = f.nri;
const hailScoreRank = K.states.map((s) => K.facts(s.slug).nri.hail.score ?? 0).sort((a, b) => b - a).indexOf(n.hail.score ?? 0) + 1;
const ord = (x: number) => { const s = ['th', 'st', 'nd', 'rd'], v = x % 100; return `${x}${s[(v - 20) % 10] || s[v] || s[0]}`; };
const mil = (x: number | null) => `$${K.num((x ?? 0) / 1e6)} million`;
const saved = us.typical - r.typical;
const lowPay = Math.round((1 - w.mean / nat.mean) * 100);

export default defineState({
  slug,
  title: 'Roof Replacement Cost Nebraska 2026: Hail Belt Prices',
  description: `Nebraska roof replacement in 2026 averages ${K.usd(r.typical)}, most jobs ${K.usd(r.low)} to ${K.usd(r.high)}; hail losses to buildings score near the top of FEMA's national index.`,
  intro: `Nebraska pays its roofers less than almost every other state, yet its hail score is one of the highest FEMA assigns.`,
  resume: `Nebraska homeowners pay roughly ${K.usd(r.typical)} for a professionally installed replacement roof, with most jobs between ${K.usd(r.low)} and ${K.usd(r.high)}, about ${K.usd(saved)} under the national median. The discount comes almost entirely from labor. BLS put the mean hourly wage of Nebraska roofers at ${K.usd(w.mean, 2)} in ${K.wageRef.reference}, ${lowPay}% below the ${K.usd(nat.mean, 2)} national mean and lower than in Iowa or Kansas. The regional starting point is neutral: owners in the West North Central division reported prices at the national level in the 2023 American Housing Survey, and the estimate then swaps in Nebraska pay for the labor share. The weather side is less forgiving. On FEMA's National Risk Index, Nebraska's hail score for expected annual losses to buildings is the ${ord(hailScoreRank)} highest among all states, rated ${n.hail.rating}, and tornado and strong wind losses are rated ${n.tornado.rating} as well. A cheap crew does not make a roof last longer in a hail corridor.`,
  body: (h) => `
<h2>A hail score few states match</h2>
<p>The ${h.src('fema_nri_states', 'National Risk Index')} from FEMA (${h.nriVersion}) gives Nebraska a hail score of ${h.num(n.hail.score ?? 0, 1)} out of 100, the ${ord(hailScoreRank)} highest score in the country, with about ${mil(n.hail.buildingLossUsd)} in expected yearly losses to buildings. Tornadoes add ${mil(n.tornado.buildingLossUsd)} and strong wind ${mil(n.strong_wind.buildingLossUsd)}. Winter weather and ice storms are both rated ${n.ice_storm.rating}, while hurricanes, unsurprisingly, show ${n.hurricane.rating.toLowerCase()}.</p>
<p>So a Nebraska roof is often judged by how it handles a single storm rather than by its age. Bruised shingles lose granules and seal strength, and the damage may not leak until months later. Owners who replace on their own schedule pay the range shown above; owners who replace after a storm usually go through an insurer, whose estimate and deductible decide the out-of-pocket amount.</p>
<h2>Why the Nebraska price stays low</h2>
<p>Neighbors pay more for the same trade: Iowa roofers average ${h.usd(ia.mean, 2)}, Kansas ${h.usd(ks.mean, 2)}, and Colorado ${h.usd(co.mean, 2)}. Labor is only one slice of a roofing contractor's revenue, so Nebraska's lower pay shaves a modest sum rather than a dramatic one. Asphalt shingles, synthetic underlayment, drip edge and disposal fees are priced on national supply chains.</p>
<p>For a house of about 1,800 square feet, the Nebraska estimate is ${h.usd(mid.typical)}. Move up to ${big.bin!.label} and it reaches ${h.usd(big.typical)}, with the middle half of jobs between ${h.usd(big.low)} and ${h.usd(big.high)}.</p>
<h3>Before a storm crew knocks</h3>
<p>After a widespread hailstorm, roofing outfits from other states tend to arrive. Ask for a written scope that names the shingle line, the number of decking sheets included, the starter and ridge products and the disposal method. If you are weighing impact-rated shingles, request a separate price for them so you can see the difference and raise it with your insurer.</p>
<p>Once the new roof is on, keep the invoice, the shingle wrapper or product sheet and a few dated photos of every slope. In a state where hail returns, that file answers the first questions an adjuster will ask the next time, and it shows which product line went on in case the manufacturer's warranty comes into play. Gutters, siding and window screens dented in the same storm are usually priced on separate lines, so ask whether the roofer handles them or leaves them to another trade.</p>
${h.mini('wageGap', { state: 'Nebraska', job: 'Roof replacement', median: us.typical * r.region, L: r.L, index: r.index })}`,
  faqs: [
    { q: 'What is the average cost to replace a roof in Nebraska?', a: `The typical Nebraska job is about ${K.usd(r.typical)}, and the middle half of professional replacements cost ${K.usd(r.low)} to ${K.usd(r.high)}. That comes from West North Central prices in the American Housing Survey with the labor share set to Nebraska wages. Square footage, roof pitch and the number of old layers to tear off move the final quote.` },
    { q: 'Is hail damage a major reason for roof replacement in Nebraska?', a: `It is one of the main ones. FEMA rates Nebraska's expected annual hail losses to buildings as ${n.hail.rating}, with a score that ranks ${ord(hailScoreRank)} in the nation, and estimates roughly ${mil(n.hail.buildingLossUsd)} in yearly damage. Many replacements follow storms and are paid partly through homeowners insurance after the deductible.` },
    { q: 'How much do roofers earn per hour in Nebraska?', a: `BLS measured a mean of ${K.usd(w.mean, 2)} an hour for Nebraska roofers in ${K.wageRef.reference}, about ${lowPay}% under the ${K.usd(nat.mean, 2)} national mean. That is less than in Iowa, Kansas or Colorado. Lower wages trim the labor part of a Nebraska roof estimate but leave material costs unchanged.` },
  ],
  related: ['roof-replacement-cost', 'roof:iowa', 'roof:kansas', 'roof:south-dakota', 'roofing-calculator'],
  extraSources: [],
});
