import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'new-york';
const r = K.job('roof', slug);
const us = K.job('roof');
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const nj = K.wage('new-jersey', 'roofers')!;
const pa = K.wage('pennsylvania', 'roofers')!;
const vt = K.wage('vermont', 'roofers')!;
const paR = K.job('roof', 'pennsylvania');
const f = K.facts(slug);
const n = f.nri;
const lic = f.licensing!;
const mil = (x: number | null) => `$${K.num((x ?? 0) / 1e6)} million`;
const emp = w.emp ?? 0;

export default defineState({
  slug,
  title: 'Roof Replacement Cost New York 2026: Prices by House Size',
  description: `New York roof replacement costs about ${K.usd(r.typical)} in 2026, with most jobs ${K.usd(r.low)} to ${K.usd(r.high)}, based on Middle Atlantic prices and a mean ${K.usd(w.mean, 2)} roofer wage.`,
  intro: `New York's roof bill reflects Middle Atlantic prices and high roofer pay, and its largest expected building losses come from hurricanes and winter storms.`,
  resume: `Replacing a roof in New York with a professional crew costs about ${K.usd(r.typical)}, and half of jobs fall between ${K.usd(r.low)} and ${K.usd(r.high)}, compared with a national median of ${K.usd(us.typical)}. The estimate begins with what owners in the Middle Atlantic division, New York with New Jersey and Pennsylvania, reported paying in the 2023 American Housing Survey, a level above the country as a whole. It then adjusts the labor share to New York pay: BLS counted about ${K.num(emp)} roofers in the state in ${K.wageRef.reference}, earning a mean of ${K.usd(w.mean, 2)} an hour, above the ${K.usd(nat.mean, 2)} national mean and above Pennsylvania, though under New Jersey. For storms, FEMA's National Risk Index rates New York's expected annual losses to buildings from winter weather as ${n.winter_weather.rating} and from ice storms as ${n.ice_storm.rating}, while hurricanes produce the largest dollar figure. Contractor licensing in New York is handled locally, by New York City and several counties near it.`,
  body: (h) => `
<h2>Hurricanes downstate, ice and snow upstate</h2>
<p>New York's numbers in the ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) reflect a state that spans the Atlantic coast and the snow belt. Hurricanes carry the largest expected annual loss to buildings, about ${mil(n.hurricane.buildingLossUsd)}, rated ${n.hurricane.rating}. Tornadoes follow at ${mil(n.tornado.buildingLossUsd)}, strong wind at ${mil(n.strong_wind.buildingLossUsd)}, rated ${n.strong_wind.rating}, and ice storms at ${mil(n.ice_storm.buildingLossUsd)}. The winter weather score is ${n.winter_weather.rating}, even if its dollar amount is smaller. Hail is ${n.hail.rating} and wildfire ${n.wildfire.rating}.</p>
<p>The mix matters when choosing materials and details. Coastal homes care about wind uplift and edge fastening, while houses farther north care about ice dam protection at the eaves and ventilation that keeps the roof deck cold. A good bid names both where they apply.</p>
<h2>Licensing depends on where you live</h2>
<p>According to the ${h.ext(lic.url, 'New York State Attorney General')}, home improvement contractors must be licensed in New York City and in Suffolk, Nassau, Westchester, Putnam and Rockland counties. Outside those places, check with your town or county for any local registration. In the listed areas, ask for the license number with the written estimate and confirm it with the issuing office before paying anything.</p>
<h3>From Long Island to the Southern Tier</h3>
<p>New York roofers average ${h.usd(w.mean, 2)}, between New Jersey at ${h.usd(nj.mean, 2)} and Pennsylvania at ${h.usd(pa.mean, 2)}; across the eastern border, Vermont pays ${h.usd(vt.mean, 2)}. The Pennsylvania estimate on this site is ${h.usd(paR.typical)}, lower because only the labor share differs between the two states. A single statewide wage cannot reflect the difference between a metro crew and a rural one, so treat the New York range as a midpoint and expect city quotes to sit higher.</p>
<p>House size moves the figure the most. On ${big.bin!.label}, the New York estimate is ${h.usd(big.typical)}, with the middle half of jobs between ${h.usd(big.low)} and ${h.usd(big.high)}; on ${small.bin!.label}, about ${h.usd(small.typical)}. Attached and semi-detached houses, common in the cities, fall outside the survey's one-family detached base, so their prices may differ.</p>
<p>Before signing, ask the contractor to spell out the dumpster or hauling plan, since narrow lots and street parking rules in denser New York neighborhoods can add a line. A written start date and a payment schedule tied to completed stages protect you if the crew is pulled to storm work elsewhere.</p>`,
  faqs: [
    { q: 'How much does a new roof cost in New York State?', a: `A typical professional roof replacement in New York costs about ${K.usd(r.typical)}, with half of jobs between ${K.usd(r.low)} and ${K.usd(r.high)}. The range combines Middle Atlantic prices from the American Housing Survey with the New York roofer wage from BLS. Metro quotes, steep pitches and decking repairs tend to land in the upper part of the range.` },
    { q: 'Do roofing contractors need a license in New York?', a: `The New York Attorney General states that home improvement contractors must be licensed in New York City and in Suffolk, Nassau, Westchester, Putnam and Rockland counties. Licensing is handled by those local governments, so requirements differ by address. Ask your town or county whether any registration applies where you live.` },
    { q: 'What weather causes the most roof losses in New York?', a: `In FEMA's National Risk Index, hurricanes produce New York's largest expected annual losses to buildings, about ${mil(n.hurricane.buildingLossUsd)}. Winter weather is rated ${n.winter_weather.rating} and ice storms ${n.ice_storm.rating}, so ice dam protection at the eaves deserves a line in any bid, and wind fastening matters for homes exposed to coastal storms.` },
  ],
  related: ['roof-replacement-cost', 'roof:new-jersey', 'roof:pennsylvania', 'roof:connecticut', 'solar-panel-cost'],
  extraSources: [
    { name: 'New York State Attorney General, hiring a home improvement contractor', url: lic.url },
  ],
});
