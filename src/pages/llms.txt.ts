/** llms.txt (RECETTE §21), generated at build from the page registry: always in sync with the site. */
import { PAGES, STATE_PAGES, stateId } from '../lib/pages';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS } from '../i18n/nav';
import { stateRef } from '../lib/data';
export function GET() {
  const lines = [
    `# ${SITE_NAMES.en}`,
    '',
    `> Home repair and improvement costs for each US state, shown without a ZIP code or phone number: roof replacement, water heater, central air, furnace, heat pump, fence, deck and local moves, plus concrete, gravel, mulch, paint, drywall and roofing quantity calculators and electricity, EV charging, heating and solar cost tools. Job prices are the 25th percentile, median and 75th percentile of professional jobs reported in the Census American Housing Survey 2023 (in August 2026 dollars), scaled to each state with the Census division level and the BLS May 2025 wage of the trade. Energy prices from EIA. Calculations run in the browser. Estimates, not quotes. Published by Radif Partners. Last updated ${LAST_UPDATED}.`,
    '',
    ...GROUPS.flatMap((g) => [`## ${g.label}`, ...PAGES.filter((p) => p.group === g.id).map((p) => `- [${p.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.card}`), '']),
    '## Roof replacement cost by state',
    ...STATE_PAGES.map((s) => `- [${stateRef(s.slug).name}](${SITE_URL}${route(stateId(s.slug), 'en')}): ${s.intro}`),
    '',
    '## About',
    `- [How prices are built](${SITE_URL}${route('method', 'en')})`,
    `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
