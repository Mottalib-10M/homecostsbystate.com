import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'indiana';
const r = K.job('roof', slug);
const us = K.job('roof');
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const f = K.facts(slug);
const code = f.code!;
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const all = K.states.map((s) => s.slug);
const torRank = [...all].sort((a, b) => (K.facts(b).nri.tornado?.buildingLossUsd ?? 0) - (K.facts(a).nri.tornado?.buildingLossUsd ?? 0)).indexOf(slug) + 1;
const ord = (n: number) => { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`; };
const mil = (x: number | null) => `${K.usd(Math.round((x ?? 0) / 1e6))} million`;
const above = Math.round((w.mean / nat.mean - 1) * 100);
const il = K.wage('illinois', 'roofers')!;
const oh = K.wage('ohio', 'roofers')!;
const ilJob = K.job('roof', 'illinois');
const codeYear = code.summary.match(/^(\d{4}) Indiana/)?.[1];
const irc = code.summary.match(/based on the (\d{4}) International/)?.[1];
const eff = code.summary.match(/effective (\d+\/\d+\/\d{4})/)?.[1];
const effDay = eff ? K.day(`${eff.split('/')[2]}-${eff.split('/')[0].padStart(2, '0')}-${eff.split('/')[1].padStart(2, '0')}`) : eff;

export default defineState({
  slug,
  title: 'Roof Replacement Cost Indiana 2026: Prices, Code and Storms',
  description: `Indiana roof replacement in 2026 runs about ${K.usd(r.typical)}, most jobs ${K.usd(r.low)} to ${K.usd(r.high)}, under the Illinois estimate. Tornado losses and the ${codeYear} residential code.`,
  intro: `Indiana roofers earn above the national mean but far less than in Illinois, which keeps Indiana roofs a few hundred dollars cheaper.`,
  resume: `Indiana homeowners pay about ${K.usd(r.typical)} for a professional roof replacement in 2026, and half of jobs fall between ${K.usd(r.low)} and ${K.usd(r.high)}, just under the national median of ${K.usd(us.typical)}. The East North Central division reported prices at the national level in the 2023 American Housing Survey. Indiana roofers earned a mean of ${K.usd(w.mean, 2)} an hour in ${K.wageRef.reference}, ${above}% above the national ${K.usd(nat.mean, 2)}, but the division's average is pulled up by Illinois at ${K.usd(il.mean, 2)}, so the wage step trims the Indiana estimate rather than raising it. The Illinois figure, by contrast, is ${K.usd(ilJob.typical)}. A home of ${small.bin!.label} comes out near ${K.usd(small.typical)}, one of ${big.bin!.label} near ${K.usd(big.typical)}. On the hazard side, FEMA's National Risk Index ranks Indiana ${ord(torRank)} in the country for expected annual tornado losses to buildings, about ${mil(f.nri.tornado.buildingLossUsd)} a year. One- and two-family homes follow the ${codeYear} Indiana Residential Code, enforced by local government.`,
  body: (h) => `
<h2>Indiana ranks ${ord(torRank)} for tornado losses to buildings</h2>
<p>The ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) estimates expected annual tornado losses to Indiana buildings at about ${mil(f.nri.tornado.buildingLossUsd)}, rated ${f.nri.tornado.rating}. Strong wind is rated ${f.nri.strong_wind.rating} at ${mil(f.nri.strong_wind.buildingLossUsd)}, and hail ${f.nri.hail.rating} at ${mil(f.nri.hail.buildingLossUsd)}. Winter weather is rated ${f.nri.winter_weather.rating}. For an Indiana household, that means a reroof can arrive on short notice after a spring storm, often through an insurance claim, and storm weeks are when crews are scarce and bids firm up. If you can, have a local roofer inspect the roof before storm season and keep the written report: an adjuster who sees documented condition from before the event has less room to call damage old wear, and you will already know which contractor you trust when the phones start ringing.</p>
<h2>The residential code and who enforces it</h2>
<p>The ${h.ext(code.url, `${codeYear} Indiana Residential Code`)} is based on the ${irc} International Residential Code and has been in effect since ${effDay}. For one- and two-family dwellings, enforcement rests with local government, so whether a reroof needs a permit and an inspection depends on your city or county. Ask the contractor who files any permit and whether its cost is inside the quote.</p>
<h3>Why the state line with Illinois matters</h3>
<p>Indiana's ${h.usd(w.mean, 2)} hourly mean sits well below the Illinois figure of ${h.usd(il.mean, 2)} and above Ohio's ${h.usd(oh.mean, 2)}. Since only the labor share follows wages, the Indiana estimate lands a few hundred dollars under Illinois's ${h.usd(ilJob.typical)} rather than thousands. For a house of ${big.bin!.label}, expect about ${h.usd(big.typical)}, with half of comparable jobs between ${h.usd(big.low)} and ${h.usd(big.high)}. Quotes that run well past the top of that band usually include decking replacement, a second layer to tear off, or upgraded underlayment; get each item priced on its own line so you can decide what to keep.</p>`,
  faqs: [
    { q: 'What does it cost to replace a roof in Indiana in 2026?', a: `About ${K.usd(r.typical)} for a professional job, with half of Indiana replacements between ${K.usd(r.low)} and ${K.usd(r.high)}. That uses the East North Central price level from the 2023 American Housing Survey, adjusted to an Indiana roofer wage of ${K.usd(w.mean, 2)} an hour, which sits below the division average set largely by Illinois.` },
    { q: 'Which residential code applies to roofs in Indiana?', a: `The ${codeYear} Indiana Residential Code, based on the ${irc} International Residential Code, has been in effect since ${effDay}, according to the state fire prevention and building safety commission. Local government enforces it for one- and two-family homes, so permit and inspection rules for a reroof vary by city or county.` },
    { q: 'Is a new roof cheaper in Indiana than in Illinois?', a: `Yes, by a few hundred dollars on a typical job: about ${K.usd(r.typical)} in Indiana against ${K.usd(ilJob.typical)} in Illinois. Both states share the same division price level, but Illinois roofers earn ${K.usd(il.mean, 2)} an hour against ${K.usd(w.mean, 2)} in Indiana. Labor is only part of the bill, so the gap stays modest.` },
  ],
  related: ['roof-replacement-cost', 'roof:illinois', 'roof:ohio', 'roof:kentucky', 'roof:michigan'],
  extraSources: [{ name: 'Indiana Fire Prevention and Building Safety Commission: rules and codes', url: code.url }],
});
