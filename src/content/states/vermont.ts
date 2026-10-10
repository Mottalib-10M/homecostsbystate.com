import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'vermont';
const r = K.job('roof', slug);
const us = K.job('roof');
const big = K.job('roof', slug, 3000);
const tiny = K.job('roof', slug, 800);
const small = K.job('roof', slug, 1200);
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const nh = K.wage('new-hampshire', 'roofers')!;
const ny = K.wage('new-york', 'roofers')!;
const ma = K.wage('massachusetts', 'roofers')!;
const nhR = K.job('roof', 'new-hampshire');
const f = K.facts(slug);
const n = f.nri;
const lic = f.licensing!;
const cut = lic.threshold_usd ?? 0;
const since = lic.summary.match(/[A-Z][a-z]+ \d{1,2}, 20\d\d/)![0];
const statute = lic.summary.match(/\d+ V\.S\.A\. \d+\(\w\)/)![0];
const total = (s: string) => Object.values(K.facts(s).nri).reduce((t, x) => t + (x.buildingLossUsd ?? 0), 0);
const lowest = K.states.map((s) => total(s.slug)).sort((a, b) => a - b).indexOf(total(slug)) === 0;
const mil = (x: number) => { const v = x / 1e6; return `$${K.num(v, v >= 10 ? 0 : 1)} million`; };
const regionPct = Math.round((r.region - 1) * 100);

export default defineState({
  slug,
  title: 'Roof Replacement Cost Vermont 2026: Prices and Registration',
  description: `Vermont roof replacement in 2026: about ${K.usd(r.typical)} typical, ${K.usd(r.low)} to ${K.usd(r.high)} for most jobs, with contractor registration required from ${K.usd(cut)} of estimated work.`,
  intro: `Vermont has the smallest combined storm and fire losses to buildings in FEMA's state index, and a contractor registration that covers roofing jobs from ${K.usd(cut)}.`,
  resume: `A professional roof replacement in Vermont costs about ${K.usd(r.typical)}, with most jobs between ${K.usd(r.low)} and ${K.usd(r.high)}, above the ${K.usd(us.typical)} national median. New England is the reason: owners across the division reported prices about ${regionPct}% over the national level in the 2023 American Housing Survey. Vermont softens that a little. BLS measured a mean of ${K.usd(w.mean, 2)} an hour for Vermont roofers in ${K.wageRef.reference}, below the ${K.usd(nat.mean, 2)} national mean and among the lowest in New England, so the labor share of the bill is cheaper than in Massachusetts or New Hampshire. Storms are a minor factor. Summing the ${Object.keys(n).length} hazards this site reads from FEMA's National Risk Index, Vermont ${lowest ? 'has the smallest expected annual losses to buildings of any state' : 'is near the bottom for expected annual losses to buildings'}, and hail is rated ${n.hail.rating}. Since ${since}, residential contractors must register with the Office of Professional Regulation for jobs estimated at ${K.usd(cut)} or more, and roofing is listed as residential contracting.`,
  body: (h) => `
<h2>The smallest hazard total in FEMA's state index</h2>
<p>Add up hail, strong wind, hurricanes, tornadoes, winter weather, ice storms and wildfire in the ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) and Vermont's expected annual losses to buildings come to about ${mil(total(slug))}, ${lowest ? 'the lowest of any state' : 'one of the lowest totals'}. Hurricanes are the largest line at ${mil(n.hurricane.buildingLossUsd ?? 0)}, rated ${n.hurricane.rating}. Strong wind and ice storms follow, each around ${mil(n.strong_wind.buildingLossUsd ?? 0)} or less. Hail is ${n.hail.rating}, at about ${h.usd(n.hail.buildingLossUsd ?? 0)} a year statewide.</p>
<p>For roofing, that means the age of the shingles and the state of the attic decide most replacements. A Vermont roof that leaks at the eaves after a cold spell usually has an ice dam problem rooted in heat loss and ventilation, and a new roof alone will not cure it. Ask the bidder to look at the attic insulation and venting before quoting.</p>
<p>Because no storm forces the timing, a Vermont owner can plan the job for a dry stretch, gather three written bids and compare them on the same lines: tear-off and disposal, decking allowance per sheet, membrane at the eaves, ventilation changes and the shingle or panel product. A bid that leaves the attic out of the conversation is pricing a different job from one that includes it.</p>
<h2>Registration with the Office of Professional Regulation</h2>
<p>Vermont's ${h.ext(lic.url, 'Office of Professional Regulation')} explains that since ${since}, under ${statute}, anyone doing residential construction estimated at ${h.usd(cut)} or more must register; its FAQ lists roofing explicitly as residential contracting. It is a general registration, not a roofing license. The threshold matters here more than in most states: a small house of ${tiny.bin!.label.toLowerCase()} has an estimate near ${h.usd(tiny.typical)}, and the low end of the statewide range, ${h.usd(r.low)}, also sits ${r.low < cut ? 'below' : 'above'} the line. For a full reroof of an ordinary home, assume registration applies and check the contractor's name in the state's lookup.</p>
<h3>Vermont pay next to its neighbors</h3>
<p>New Hampshire roofers average ${h.usd(nh.mean, 2)}, New York ${h.usd(ny.mean, 2)} and Massachusetts ${h.usd(ma.mean, 2)}, all above Vermont's ${h.usd(w.mean, 2)}. The New Hampshire estimate on this site is ${h.usd(nhR.typical)}, a difference that comes from labor alone. For a Vermont house of ${big.bin!.label}, the estimate reaches ${h.usd(big.typical)}, with most jobs between ${h.usd(big.low)} and ${h.usd(big.high)}; for ${small.bin!.label}, about ${h.usd(small.typical)}. Metal roofing costs more than the asphalt-based range here and should be quoted on its own.</p>`,
  faqs: [
    { q: 'How much does a roof replacement cost in Vermont?', a: `About ${K.usd(r.typical)} for a typical professional job in Vermont, with half of replacements between ${K.usd(r.low)} and ${K.usd(r.high)}. The range starts from New England prices in the American Housing Survey and applies Vermont roofer wages from BLS to the labor share. Metal roofing, steep pitches and attic work add to the total.` },
    { q: 'Do roofers have to register in Vermont?', a: `Yes, for residential jobs estimated at ${K.usd(cut)} or more. Since ${since}, Vermont requires residential contractors to register with the Office of Professional Regulation, and its FAQ lists roofing as residential contracting. It is a general registration rather than a roofing-specific license, so look the contractor up before signing.` },
    { q: 'Are storms a major cause of roof replacement in Vermont?', a: `Not really. FEMA's National Risk Index puts Vermont's combined expected annual losses to buildings from the main roof-related hazards at about ${mil(total(slug))}, ${lowest ? 'the smallest of any state' : 'among the smallest of any state'}. A Vermont roof is therefore far more likely to be replaced for age or leaks than after a storm.` },
  ],
  related: ['roof-replacement-cost', 'roof:new-hampshire', 'roof:new-york', 'roof:massachusetts', 'heat-pump-cost'],
  extraSources: [
    { name: 'Vermont Office of Professional Regulation, residential contractor FAQ', url: lic.url },
  ],
});
