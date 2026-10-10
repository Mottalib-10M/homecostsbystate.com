import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const slug = 'minnesota';
const r = K.job('roof', slug);
const us = K.job('roof');
const w = K.wage(slug, 'roofers')!;
const nat = K.natWage('roofers');
const f = K.facts(slug);
const lic = f.licensing!;
const code = f.code!;
const big = K.job('roof', slug, 3000);
const small = K.job('roof', slug, 1200);
const all = K.states.map((s) => s.slug);
const lossRank = (hz: string) => [...all].sort((a, b) => (K.facts(b).nri[hz]?.buildingLossUsd ?? 0) - (K.facts(a).nri[hz]?.buildingLossUsd ?? 0)).indexOf(slug) + 1;
const ord = (n: number) => { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`; };
const mil = (x: number | null) => `${K.usd(Math.round((x ?? 0) / 1e6))} million`;
const above = Math.round((w.mean / nat.mean - 1) * 100);
const overDiv = Math.round((r.index - 1) * 100);
const lift = K.usd(r.typical - us.typical * r.region);
const codeYear = code.summary.match(/^(\d{4}) Minnesota/)?.[1];
const effective = code.summary.match(/effective ([A-Z][a-z]+ \d+, \d{4})/)?.[1];
const ia = K.wage('iowa', 'roofers')!;
const wi = K.wage('wisconsin', 'roofers')!;
const nd = K.wage('north-dakota', 'roofers')!;

export default defineState({
  slug,
  title: 'Roof Replacement Cost Minnesota 2026: Prices, Roofer License',
  description: `Minnesota roof replacement in 2026: about ${K.usd(r.typical)} typical, ${K.usd(r.low)} to ${K.usd(r.high)} for most jobs, with the DLI roofer license and FEMA wind and hail loss data.`,
  intro: `Minnesota licenses residential roofers on their own, and its roofers earn more than anywhere else in the Plains.`,
  resume: `A professional roof replacement in Minnesota costs about ${K.usd(r.typical)} in 2026, with half of jobs between ${K.usd(r.low)} and ${K.usd(r.high)}, slightly above the national median of ${K.usd(us.typical)}. The West North Central division reported prices at the national level in the 2023 American Housing Survey, so the premium comes from pay. BLS measured a mean of ${K.usd(w.mean, 2)} an hour for Minnesota roofers in ${K.wageRef.reference}, ${above}% above the national ${K.usd(nat.mean, 2)} and ${overDiv}% above the division average, far ahead of Iowa, the Dakotas and Nebraska. That adds about ${lift} to a typical job. A house of ${small.bin!.label} is estimated near ${K.usd(small.typical)}, one of ${big.bin!.label} near ${K.usd(big.typical)}. Minnesota is one of the few states with a license written for residential roofing, issued by the Department of Labor and Industry. Weather adds pressure: FEMA's National Risk Index rates expected annual strong wind losses to Minnesota buildings ${f.nri.strong_wind.rating}, puts hail near ${mil(f.nri.hail.buildingLossUsd)} a year, and rates winter weather ${f.nri.winter_weather.rating}.`,
  body: (h) => `
<h2>A residential roofer license with a qualifying person</h2>
<p>Minnesota's Department of Labor and Industry (DLI) issues a residential roofing contractor license, often called the roofer license, to companies. Each licensed company must designate a qualifying person who passes the exam and keeps up with continuing education. DLI also offers a certificate of exemption for some businesses. For a homeowner, the license is a check worth making: look the company up on the DLI site, note the license number on the contract, and confirm that the business named on the bid is the one holding it.</p>
<h2>Wind, hail and winter across Minnesota</h2>
<p>The ${h.src('fema_nri_states', 'FEMA National Risk Index')} (${h.nriVersion}) estimates expected annual losses to Minnesota buildings of about ${mil(f.nri.strong_wind.buildingLossUsd)} from strong wind, the ${ord(lossRank('strong_wind'))} largest figure in the country and rated ${f.nri.strong_wind.rating}, ${mil(f.nri.hail.buildingLossUsd)} from hail, ranked ${ord(lossRank('hail'))}, and ${mil(f.nri.tornado.buildingLossUsd)} from tornadoes. Winter weather is rated ${f.nri.winter_weather.rating}. A Minnesota roof can therefore come off after a summer storm claim or after years of ice at the eaves, so ask how far up the slope each bid runs the ice barrier and how it handles attic ventilation, since those two lines govern how the new roof copes with long freezes.</p>
<p>The ${h.ext(code.url, `${codeYear} Minnesota Residential Code`)}, part of the ${codeYear} Minnesota State Building Code, took effect on ${effective} as a statewide minimum standard. Municipalities enforce it only where they have adopted it by local ordinance, so whether a reroof needs a permit depends on the city or township.</p>
${h.mini('wageGap', { state: 'Minnesota', job: 'Roof replacement', median: us.typical * r.region, L: r.L, index: r.index })}
<h3>Minnesota pay against the Plains</h3>
<p>Minnesota roofers average ${h.usd(w.mean, 2)} an hour, against ${h.usd(ia.mean, 2)} in Iowa, ${h.usd(nd.mean, 2)} in North Dakota and ${h.usd(wi.mean, 2)} in Wisconsin next door. For a house of ${big.bin!.label}, the estimate is ${h.usd(big.typical)}, and half of comparable jobs fall between ${h.usd(big.low)} and ${h.usd(big.high)}. A bid far above that band should explain itself line by line: extra layers, replaced decking, a steep pitch or a premium shingle.</p>`,
  faqs: [
    { q: 'How much does a roof replacement cost in Minnesota in 2026?', a: `About ${K.usd(r.typical)} for a professional job, with half of Minnesota replacements between ${K.usd(r.low)} and ${K.usd(r.high)}. The West North Central price level from the 2023 American Housing Survey sits at the national median; the Minnesota roofer wage of ${K.usd(w.mean, 2)} an hour, the highest in that division, adds a few hundred dollars.` },
    { q: 'Do roofers need a state license in Minnesota?', a: `Minnesota's Department of Labor and Industry issues a residential roofing contractor license to companies, each of which must designate a qualifying person who passes the exam and completes continuing education. DLI also offers a certificate of exemption. Look the company up on the DLI website and put the license number on your contract.` },
    { q: 'Which building code applies to roofs in Minnesota?', a: `The ${codeYear} Minnesota Residential Code, part of the ${codeYear} Minnesota State Building Code, took effect on ${effective} as a statewide minimum. Municipalities enforce it only if they have adopted it by local ordinance, so permit and inspection rules for a Minnesota reroof depend on your city or township.` },
  ],
  related: ['roof-replacement-cost', 'roof:wisconsin', 'roof:iowa', 'roof:north-dakota', 'roofing-calculator'],
  extraSources: [
    { name: 'Minnesota DLI: residential roofer license', url: lic.url },
    { name: 'Minnesota DLI: 2020 Minnesota State Building Codes', url: code.url },
  ],
});
