/** Heat pump vs furnace: the same heat delivered by gas, propane, oil, a heat pump or resistance heat at state prices. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { heatingCosts, heatDelivered, type Btu } from '../../lib/engine/energy';
import { readParams, num as qn, str, updateURL } from '../../lib/url-state';
import { Card, StatePick, Result, Rows, Note, Actions, usd, num, type Opt } from './parts';

export interface StateHeat { cents: number; gas: number | null; propane: number | null; oil: number | null; recs: Record<'gas' | 'propane' | 'oil' | 'electricity', number>; recsLevel: Record<string, string> }
interface Props { states: Opt[]; byState: Record<string, StateHeat>; state?: string; lock?: boolean; btu: Btu; afue: number; hspf2: number; periods: { electricity: string; fuels: string }; methodHref?: string; idPrefix?: string }
const UNIT = { gas: 'therms', propane: 'gal', oil: 'gal', electricity: 'kWh' } as const;
// RECS reports site MMBtu; convert to the unit people see on their bills.
const toUnits = (fuel: keyof typeof UNIT, mmbtu: number, btu: Btu) => fuel === 'gas' ? mmbtu * 10 : fuel === 'propane' ? (mmbtu * 1e6) / btu.propaneGal : fuel === 'oil' ? (mmbtu * 1e6) / btu.oilGal : (mmbtu * 1e6) / btu.kwh;
const toMMBtu = (fuel: keyof typeof UNIT, units: number, btu: Btu) => fuel === 'gas' ? units / 10 : fuel === 'propane' ? (units * btu.propaneGal) / 1e6 : fuel === 'oil' ? (units * btu.oilGal) / 1e6 : (units * btu.kwh) / 1e6;

export default function HeatingCalc({ states, byState, state = 'ohio', lock = false, btu, afue: afue0, hspf2: hspf0, periods, methodHref = '/en/method/', idPrefix = 'ht' }: Props) {
  const [slug, setSlug] = useState(state);
  const [fuel, setFuel] = useState<keyof typeof UNIT>('gas');
  const [use, setUse] = useState(Math.round(toUnits('gas', byState[state].recs.gas, btu)));
  const [eff, setEff] = useState(afue0 * 100);
  const [hspf, setHspf] = useState(hspf0);
  useEffect(() => {
    const u = readParams(window.location.search);
    let s = state; if (!lock) { const q = str(u, 's', state); if (byState[q]) { s = q; setSlug(q); } }
    const f = str(u, 'f', 'gas') as keyof typeof UNIT; const ff = UNIT[f] ? f : 'gas'; setFuel(ff);
    setUse(qn(u, 'u', Math.round(toUnits(ff, byState[s].recs[ff], btu)))); setEff(qn(u, 'ef', ff === 'electricity' ? 100 : afue0 * 100)); setHspf(qn(u, 'hp', hspf0));
  }, []);
  useEffect(() => { updateURL({ s: lock ? undefined : slug, f: fuel, u: use, ef: eff, hp: hspf }); }, [slug, fuel, use, eff, hspf]);
  const pick = (s: string) => { setSlug(s); setUse(Math.round(toUnits(fuel, byState[s].recs[fuel], btu))); };
  const pickFuel = (f: string) => { const ff = f as keyof typeof UNIT; setFuel(ff); setUse(Math.round(toUnits(ff, byState[slug].recs[ff], btu))); setEff(ff === 'electricity' ? 100 : afue0 * 100); };
  const S = byState[slug];
  const name = states.find((x) => x.value === slug)?.label ?? slug;
  const heat = heatDelivered(toMMBtu(fuel, use, btu), Math.min(eff, 100) / 100);
  const h = useMemo(() => heatingCosts({ heatMMBtu: heat, afue: afue0, hspf2: hspf, btu, prices: { gasPerMcf: S.gas, propanePerGal: S.propane, oilPerGal: S.oil, centsPerKwh: S.cents } }), [heat, hspf, S, afue0, btu]);
  const current = fuel === 'gas' ? h.gas : fuel === 'propane' ? h.propane : fuel === 'oil' ? h.oil : h.resistance;
  const rows: Array<[string, string, boolean?]> = [];
  if (h.gas) rows.push([`Gas furnace, ${num(afue0 * 100)}% AFUE`, `${usd(h.gas.cost)} (${num(h.gas.units)} therms)`]);
  if (h.propane) rows.push([`Propane furnace, ${num(afue0 * 100)}% AFUE`, `${usd(h.propane.cost)} (${num(h.propane.units)} gal)`]);
  if (h.oil) rows.push([`Oil furnace, ${num(afue0 * 100)}% AFUE`, `${usd(h.oil.cost)} (${num(h.oil.units)} gal)`]);
  rows.push([`Heat pump, HSPF2 ${num(hspf, 1)}`, `${usd(h.heatPump.cost)} (${num(h.heatPump.units)} kWh)`, true]);
  rows.push(['Electric resistance (baseboard, strip heat)', `${usd(h.resistance.cost)} (${num(h.resistance.units)} kWh)`]);
  const p = idPrefix;
  const diff = current ? current.cost - h.heatPump.cost : 0;
  return (
    <Card form={<>
      <StatePick id={`${p}-state`} value={slug} onChange={pick} states={states} lock={lock} />
      <SelectField id={`${p}-f`} label="How you heat today" value={fuel} onChange={pickFuel} options={[{ value: 'gas', label: 'Natural gas' }, { value: 'propane', label: 'Propane' }, { value: 'oil', label: 'Heating oil' }, { value: 'electricity', label: 'Electric resistance' }]} />
      <NumberField id={`${p}-u`} label={`Heating use per year (${UNIT[fuel]})`} value={use} onChange={setUse} unit={UNIT[fuel]} max={1000000} help={`Default: average for space heating in the ${S.recsLevel[fuel]} (EIA RECS 2020). Use your bills if you can.`} />
      <NumberField id={`${p}-ef`} label="Efficiency of your current system" value={eff} onChange={setEff} unit="%" max={100} help="AFUE on the furnace label; 100% for resistance heat." />
      <NumberField id={`${p}-hp`} label="Heat pump rating" value={hspf} onChange={setHspf} unit="HSPF2" max={20} decimals={1} help={`${num(hspf0, 1)} is the federal minimum for split systems.`} />
    </>}>
      <Result label={`Heating with a heat pump in ${name}`} figure={`${usd(h.heatPump.cost)} a year`} sub={current ? <>{diff >= 0 ? `${usd(diff)} less` : `${usd(-diff)} more`} than your current system ({usd(current.cost)})</> : undefined}>
        <Rows rows={rows as Array<[string, string, boolean]>} />
        <Note methodHref={methodHref}>Same heat ({num(heat, 1)} million Btu a year) delivered by each system at {name} prices: electricity {num(S.cents, 2)}¢/kWh ({periods.electricity}), fuels averaged over {periods.fuels} (EIA). HSPF2 ÷ 3.412 gives a seasonal COP of {num((hspf * 1000) / btu.kwh, 2)}; in very cold weather a heat pump’s output and efficiency drop.</Note>
        <Actions />
      </Result>
    </Card>
  );
}
