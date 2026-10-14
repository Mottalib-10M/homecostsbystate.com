/**
 * Home page board: pick a state, every job's price range appears at once (no ZIP, no phone, no form to send).
 * Rows link to the full calculators. First render = United States figures (RECETTE §17.5).
 */
import { useEffect, useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import { jobCost, type JobInput } from '../../lib/engine/costs';
import { readParams, str, updateURL } from '../../lib/url-state';
import { usd, num, type Opt } from './parts';

interface Row { input: JobInput; label: string; href: string; unit: string }
interface Props { rows: Row[]; states: Opt[]; solar: Record<string, { low: number; high: number }>; solarHref: string; solarLabel: string; elec: Record<string, number>; elecHref: string; methodHref: string; years: string; cpiTo: string }
export default function HomeBoard({ rows, states, solar, solarHref, solarLabel, elec, elecHref, methodHref, years, cpiTo }: Props) {
  const [slug, setSlug] = useState('us');
  useEffect(() => { const s = str(readParams(window.location.search), 's', 'us'); if (states.some((x) => x.value === s)) setSlug(s); }, []);
  useEffect(() => { updateURL({ s: slug === 'us' ? undefined : slug }); }, [slug]);
  const out = useMemo(() => rows.map((r) => ({ r, c: jobCost(r.input, slug) })), [rows, slug]);
  const name = slug === 'us' ? 'United States' : states.find((s) => s.value === slug)?.label ?? slug;
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid content-start gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <SelectField id="board-state" label="Your state" value={slug} onChange={setSlug} options={states} help="Prices change at once; nothing is sent anywhere." />
      </form>
      <div aria-live="polite" className="mt-5 overflow-x-auto">
        <table className="journal w-full text-sm">
          <caption className="mb-2 text-left text-sm text-navy-700">Hired out in {name}: the median and the middle half of reported prices</caption>
          <thead><tr><th scope="col" className="px-2 py-2 text-left">Job</th><th scope="col" className="px-2 py-2 text-right">Typical</th><th scope="col" className="px-2 py-2 text-right">Most jobs</th></tr></thead>
          <tbody>
            {out.map(({ r, c }) => <tr key={r.label}><td className="border-b border-navy-100 px-2 py-2"><a className="font-medium text-accent-700 underline-offset-2 hover:underline" href={r.href}>{r.label}</a><span className="block text-xs text-navy-600">{r.unit}</span></td><td className="tabular-nums border-b border-navy-100 px-2 py-2 text-right font-semibold">{usd(c.typical)}</td><td className="tabular-nums border-b border-navy-100 px-2 py-2 text-right">{usd(c.low)} to {usd(c.high)}</td></tr>)}
            <tr><td className="border-b border-navy-100 px-2 py-2"><a className="font-medium text-accent-700 underline-offset-2 hover:underline" href={solarHref}>Solar panels</a><span className="block text-xs text-navy-600">{solarLabel}</span></td><td className="border-b border-navy-100 px-2 py-2 text-right text-navy-700">quote to reported</td><td className="tabular-nums border-b border-navy-100 px-2 py-2 text-right">{usd(solar[slug].low)} to {usd(solar[slug].high)}</td></tr>
            <tr><td className="px-2 py-2"><a className="font-medium text-accent-700 underline-offset-2 hover:underline" href={elecHref}>Electricity</a><span className="block text-xs text-navy-600">residential average price</span></td><td className="tabular-nums px-2 py-2 text-right font-semibold">{num(elec[slug], 2)}¢/kWh</td><td className="px-2 py-2" /></tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-navy-700">Job prices: what homeowners who hired a professional reported ({years}, American Housing Survey 2023), in {cpiTo} dollars, with the labor share moved to {name} wages (BLS, May 2025). <a className="underline" href={methodHref}>How this is calculated</a>.</p>
    </div>
  );
}
