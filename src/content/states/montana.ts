import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'montana';
const r = K.job('roof', slug);
const us = K.job('roof');
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const id = K.wage('idaho', 'roofers')!;
const wy = K.wage('wyoming', 'roofers')!;
const nd = K.wage('north-dakota', 'roofers')!;
const f = K.facts(slug);
const n = f.nri;
const lic = f.licensing!;
const code = f.code!;
const licStart = lic.summary.match(/[A-Z][a-z]+ \d{1,2}, 20\d\d/)![0];
const ircYear = code.summary.match(/20\d\d/)![0];
const codeDate = code.summary.match(/[A-Z][a-z]+ \d{1,2}, 20\d\d/)![0];
const mil = (x: number | null) => { const v = (x ?? 0) / 1e6; return `$${K.num(v, v >= 10 ? 0 : 1)} million`; };
const aboveUs = Math.round((r.typical / us.typical - 1) * 100);

export default defineState({
  slug,
  title: 'Roof Replacement Cost Montana 2026: New License Rule, Prices',
  description: `Montana roof replacement cost in 2026: about ${K.usd(r.typical)} typical, ${K.usd(r.low)} to ${K.usd(r.high)} for most jobs, under a state contractor license rule that began this year.`,
  intro: `Montana now requires every construction contractor, roofers included, to hold a state license, and its winters weigh more on roofs than its storms.`,
  resume: `A roof replacement done by a professional in Montana runs about ${K.usd(r.typical)}, and most jobs cost between ${K.usd(r.low)} and ${K.usd(r.high)}, roughly ${aboveUs}% over the national median of ${K.usd(us.typical)}. Two forces push it up. First, the Mountain division, which includes Montana, Idaho, Wyoming, Colorado, Utah, Nevada, Arizona and New Mexico, reported prices above the national level in the 2023 American Housing Survey. Second, Montana roofers are paid more than the division average: BLS measured a mean of ${K.usd(w.mean, 2)} an hour in ${K.wageRef.reference}, against ${K.usd(id.mean, 2)} in Idaho and ${K.usd(wy.mean, 2)} in Wyoming, though still under the ${K.usd(nat.mean, 2)} national mean. On the hazard side, FEMA rates expected annual losses to buildings from winter weather as ${n.winter_weather.rating}, while hail, wind and tornado losses are all ${n.hail.rating}. Since ${licStart}, the roofer you hire must also hold a Montana construction contractor license.`,
  body: (h) => `
<h2>Montana's contractor license now covers reroofing</h2>
<p>Until recently Montana asked contractors to register. Under the change reported by the ${h.ext(lic.url, 'Department of Labor and Industry')}, all construction contractors in Montana must be licensed with the department from ${licStart}, replacing the old registration, and the statute's definition of a construction contractor expressly includes installing or repairing roofing. It is a general contractor license, not a roofing specialty credential, so it tells you the company is on the state's books rather than that it passed a roofing exam. Ask for the license number with the quote and look it up before you sign.</p>
<p>The building code is moving too. The department lists the ${ircYear} edition of the International Residential Code, as adopted by Montana, effective ${codeDate}. If a permit applies to your reroof in your city or county, the inspector works from that edition once it takes effect.</p>
<h2>Snow and smoke, not hail</h2>
<p>Montana's profile in the ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) looks nothing like the plains to its east. Expected annual losses to buildings from winter weather are rated ${n.winter_weather.rating}, though the dollar figure is modest at ${mil(n.winter_weather.buildingLossUsd)} because the population is small. Wildfire is the largest line at ${mil(n.wildfire.buildingLossUsd)}, rated ${n.wildfire.rating}. Hail sits at ${n.hail.rating}, strong wind and tornadoes at ${n.strong_wind.rating}, and the index does not score hurricanes for Montana at all. For a homeowner, that points the conversation toward snow load, ice dams at the eaves and ember resistance, rather than toward impact ratings.</p>
<h3>What a Montana quote should cover</h3>
<p>On a house of ${big.bin!.label}, the estimate here is ${h.usd(big.typical)}, against ${h.usd(small.typical)} for ${small.bin!.label}. Have the contractor state how much ice and water barrier goes along the eaves and in the valleys, whether the old shingles come off down to the deck, and how many sheets of replacement plywood the price already includes. North Dakota roofers average ${h.usd(nd.mean, 2)}, a reminder that pay across the northern tier is not uniformly low.</p>
<p>Wildfire exposure is worth raising with the bidder as well. If your house sits near grass or timber, ask which coverings and vent products the company installs that carry a fire classification, and what that choice adds to the total. A separate line for that option lets you weigh it without guessing.</p>`,
  faqs: [
    { q: 'How much is a new roof in Montana in 2026?', a: `About ${K.usd(r.typical)} for a typical professional replacement, with half of jobs between ${K.usd(r.low)} and ${K.usd(r.high)}. The figure combines the Mountain division price level from the American Housing Survey with the Montana roofer wage published by BLS. Steep pitches, extra ice barrier and decking repairs are the usual reasons a Montana quote lands above that range.` },
    { q: 'Do roofers need a license in Montana now?', a: `Yes. Montana's Department of Labor and Industry states that from ${licStart} all construction contractors must be licensed with the department, replacing the former registration, and the legal definition of construction contractor includes roofing installation and repair. It is a general contractor license rather than a roofing-specific one, so check the number before work starts.` },
    { q: 'Which weather losses matter most for Montana roofs?', a: `In FEMA's National Risk Index, Montana's expected annual losses to buildings from winter weather are rated ${n.winter_weather.rating}, and wildfire produces the largest dollar figure at about ${mil(n.wildfire.buildingLossUsd)} a year. Hail, wind and tornado losses are all rated low, which sets Montana apart from neighbors on the Great Plains.` },
  ],
  related: ['roof-replacement-cost', 'roof:idaho', 'roof:wyoming', 'roof:north-dakota', 'roofing-calculator'],
  extraSources: [
    { name: 'Montana Department of Labor and Industry, Construction Contractor Program', url: lic.url },
    { name: 'Montana Building Codes Bureau, current codes', url: code.url },
  ],
});
