/**
 * Residential solar at state figures: price range (mode "cost"), size and panel count ("size"), simple
 * payback ("payback"). Output per kW from PVWatts for a city of the state; prices from the EnergySage
 * quotes published by NLR and the NYSERDA reported/quote gap (lib/engine/solar.ts).
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import { systemKw, panels, price, payback } from '../../lib/engine/solar';
import { readParams, num as qn, str, updateURL } from '../../lib/url-state';
import { Card, StatePick, Result, Rows, Note, Actions, usd, num, type Opt } from './parts';

export interface StateSolar { kwhPerKw: number; city: string; source: 'pvwatts' | 'nasa-power'; quote: number; quoteScope: 'state' | 'us'; cents: number; kwhMonth: number }
interface Props { mode: 'cost' | 'size' | 'payback'; states: Opt[]; byState: Record<string, StateSolar>; state?: string; lock?: boolean; ratio: number; panelW: number; medianKw: number; creditEnded: string; methodHref?: string; idPrefix?: string }
export default function SolarCalc({ mode, states, byState, state = 'texas', lock = false, ratio, panelW, medianKw, creditEnded, methodHref = '/en/method/', idPrefix = 'so' }: Props) {
  const [slug, setSlug] = useState(state);
  const S0 = byState[state];
  const [kw, setKw] = useState(medianKw);
  const [use, setUse] = useState(S0.kwhMonth);
  const [offset, setOffset] = useState(100);
  const [watts, setWatts] = useState(panelW);
  const [cost, setCost] = useState(Math.round(medianKw * 1000 * S0.quote));
  const [cents, setCents] = useState(S0.cents);
  const [exportShare, setExportShare] = useState(0);
  const [exportCents, setExportCents] = useState(S0.cents);
  useEffect(() => {
    const u = readParams(window.location.search);
    let s = state; if (!lock) { const q = str(u, 's', state); if (byState[q]) { s = q; setSlug(q); } }
    const B = byState[s];
    setKw(qn(u, 'kw', medianKw)); setUse(qn(u, 'u', B.kwhMonth)); setOffset(qn(u, 'o', 100)); setWatts(qn(u, 'pw', panelW));
    setCost(qn(u, 'cost', Math.round(qn(u, 'kw', medianKw) * 1000 * B.quote))); setCents(qn(u, 'c', B.cents)); setExportShare(qn(u, 'xs', 0)); setExportCents(qn(u, 'xc', B.cents));
  }, []);
  const pick = (s: string) => { const B = byState[s]; setSlug(s); setUse(B.kwhMonth); setCents(B.cents); setExportCents(B.cents); setCost(Math.round(kw * 1000 * B.quote)); };
  const pickKw = (v: number) => { setKw(v); setCost(Math.round(v * 1000 * byState[slug].quote)); };
  useEffect(() => { updateURL({ s: lock ? undefined : slug, kw, u: mode === 'size' ? use : undefined, o: mode === 'size' ? offset : undefined, pw: mode === 'size' ? watts : undefined, cost: mode === 'payback' ? cost : undefined, c: mode === 'payback' ? cents : undefined, xs: mode === 'payback' ? exportShare : undefined, xc: mode === 'payback' ? exportCents : undefined }); }, [slug, kw, use, offset, watts, cost, cents, exportShare, exportCents]);
  const S = byState[slug];
  const name = states.find((x) => x.value === slug)?.label ?? slug;
  const pr = useMemo(() => price(kw, S.quote, ratio), [kw, S, ratio]);
  const need = useMemo(() => systemKw(use * 12 * (offset / 100), S.kwhPerKw), [use, offset, S]);
  const n = panels(need, watts);
  const pb = useMemo(() => payback({ cost, kw, kwhPerKw: S.kwhPerKw, centsPerKwh: cents, exportShare, exportCents }), [cost, kw, S, cents, exportShare, exportCents]);
  const p = idPrefix;
  const quoteNote = S.quoteScope === 'state' ? `${name} median quote` : 'U.S. median quote (no state figure published)';
  return (
    <Card form={<>
      <StatePick id={`${p}-state`} value={slug} onChange={pick} states={states} lock={lock} help={`Sun data: ${S.city} (${S.source === 'pvwatts' ? 'PVWatts' : 'NASA POWER, scaled to PVWatts'}).`} />
      {mode !== 'size' && <NumberField id={`${p}-kw`} label="System size" value={kw} onChange={pickKw} unit="kW" max={100} decimals={1} help={`${num(medianKw, 1)} kW was the median home system installed in 2023 (Berkeley Lab).`} />}
      {mode === 'size' && <>
        <NumberField id={`${p}-u`} label="Electricity used per month" value={use} onChange={setUse} unit="kWh" max={20000} help={`${name} average in 2024: ${num(S.kwhMonth)} kWh (EIA).`} />
        <NumberField id={`${p}-o`} label="Share of your use to cover" value={offset} onChange={setOffset} unit="%" max={200} />
        <NumberField id={`${p}-pw`} label="Panel rating" value={watts} onChange={setWatts} unit="W" max={1000} help="Median panel in New York’s 2025 installations." />
      </>}
      {mode === 'payback' && <>
        <NumberField id={`${p}-cost`} label="Price you were quoted, before incentives" value={cost} onChange={setCost} unit="$" max={1000000} />
        <NumberField id={`${p}-c`} label="Electricity price" value={cents} onChange={setCents} unit="¢/kWh" max={200} decimals={2} help={`${name} residential average (EIA).`} />
        <NumberField id={`${p}-xs`} label="Share of output sent to the grid" value={exportShare} onChange={setExportShare} unit="%" max={100} help="0% if every kWh offsets your bill at full price." />
        <NumberField id={`${p}-xc`} label="Credit for exported power" value={exportCents} onChange={setExportCents} unit="¢/kWh" max={200} decimals={2} help="Set by your utility’s net metering or export rate." />
      </>}
    </>}>
      {mode === 'cost' && <Result label={`${num(kw, 1)} kW of solar panels in ${name}, before incentives`} figure={`${usd(pr.low)} to ${usd(pr.high)}`} sub={<>{usd(pr.perWLow, 2)} to {usd(pr.perWHigh, 2)} per watt</>}>
        <Rows rows={[[quoteNote, `${usd(S.quote, 2)}/W`], ['Reported installed price, same system', `${usd(pr.perWHigh, 2)}/W`], ['Output per year', `${num(kw * S.kwhPerKw)} kWh`], ['Federal 30% credit (25D)', `Ended ${creditEnded}`]]} />
        <Note methodHref={methodHref}>The low end is the median competitive quote; the high end adds the gap New York measured in 2025 between prices reported to NYSERDA and marketplace quotes (financing fees, extras).</Note>
        <Actions />
      </Result>}
      {mode === 'size' && <Result label={`Solar to cover ${num(offset)}% of your use in ${name}`} figure={`${num(need, 1)} kW`} sub={<>{num(n)} panels of {num(watts)} W · {num(need * S.kwhPerKw)} kWh a year</>}>
        <Rows rows={[['Use per year', `${num(use * 12)} kWh`], [`Output of 1 kW in ${S.city}`, `${num(S.kwhPerKw)} kWh a year`], ['System size', `${num(need, 2)} kW`, true], ['Panels', num(n)]]} />
        <Note methodHref={methodHref}>{S.source === 'pvwatts' ? 'PVWatts output for a south-facing roof at 20° tilt with 14% system losses' : 'NASA POWER sunshine on a south-facing tilted roof, converted with the performance ratio PVWatts gives in states computed both ways'}; shade, orientation and roof angle change it.</Note>
        <Actions />
      </Result>}
      {mode === 'payback' && <Result label={`Simple payback in ${name}`} figure={Number.isFinite(pb.years) ? `${num(pb.years, 1)} years` : 'No saving'} sub={<>{usd(pb.saving)} saved a year on {num(pb.kwh)} kWh produced</>}>
        <Rows rows={[['Output per year', `${num(pb.kwh)} kWh`], ['Value used at home', usd((pb.kwh * (1 - exportShare / 100) * cents) / 100)], ['Value exported', usd((pb.kwh * (exportShare / 100) * exportCents) / 100)], ['Bill saving per year', usd(pb.saving), true]]} />
        <Note methodHref={methodHref}>Simple payback: price ÷ yearly saving, with today’s electricity price, no panel aging, no loan interest and no rate changes. The federal 30% credit ended {creditEnded}.</Note>
        <Actions />
      </Result>}
    </Card>
  );
}
