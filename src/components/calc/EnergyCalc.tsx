/**
 * Electricity calculators at the state's EIA price: one appliance, a monthly bill, or EV charging against
 * gasoline. First render = build defaults (RECETTE §17.5).
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { appliance, bill, ev } from '../../lib/engine/energy';
import { readParams, num as qn, str, updateURL } from '../../lib/url-state';
import { Card, StatePick, Result, Rows, Note, Actions, usd, num, type Opt } from './parts';

export interface StateEnergy { cents: number; kwhMonth: number; bill: number }
interface Props {
  mode: 'appliance' | 'bill' | 'ev'; states: Opt[]; byState: Record<string, StateEnergy>; state?: string; lock?: boolean;
  period: string; gasoline?: number; gasolineWeek?: string; evs?: Record<string, number>; evDefault?: string; methodHref?: string; idPrefix?: string;
}
export default function EnergyCalc({ mode, states, byState, state = 'texas', lock = false, period, gasoline = 3.5, gasolineWeek, evs = {}, evDefault, methodHref = '/en/method/', idPrefix = 'en' }: Props) {
  const [slug, setSlug] = useState(state);
  const S = byState[slug] ?? byState[state];
  const [cents, setCents] = useState(S.cents);
  const [watts, setWatts] = useState(1500); const [hours, setHours] = useState(4); const [days, setDays] = useState(30);
  const [kwh, setKwh] = useState(S.kwhMonth);
  const evNames = Object.keys(evs);
  const [car, setCar] = useState(evDefault ?? evNames[0] ?? '');
  const [eff, setEff] = useState(evs[evDefault ?? evNames[0]] ?? 30);
  const [miles, setMiles] = useState(1000); const [mpg, setMpg] = useState(25); const [gas, setGas] = useState(gasoline);
  useEffect(() => {
    const u = readParams(window.location.search);
    let s = slug; if (!lock) { s = str(u, 's', state); if (byState[s]) setSlug(s); else s = state; }
    setCents(qn(u, 'c', byState[s].cents));
    if (mode === 'appliance') { setWatts(qn(u, 'w', 1500)); setHours(qn(u, 'h', 4)); setDays(qn(u, 'd', 30)); }
    if (mode === 'bill') setKwh(qn(u, 'k', byState[s].kwhMonth));
    if (mode === 'ev') { const c = str(u, 'car', car); if (evs[c] != null) setCar(c); setEff(qn(u, 'e', evs[c] ?? eff)); setMiles(qn(u, 'm', 1000)); setMpg(qn(u, 'mpg', 25)); setGas(qn(u, 'g', gasoline)); }
  }, []);
  const pick = (s: string) => { setSlug(s); setCents(byState[s].cents); if (mode === 'bill') setKwh(byState[s].kwhMonth); };
  const pickCar = (c: string) => { setCar(c); if (evs[c] != null) setEff(evs[c]); };
  useEffect(() => { updateURL({ s: lock ? undefined : slug, c: cents, w: mode === 'appliance' ? watts : undefined, h: mode === 'appliance' ? hours : undefined, d: mode === 'appliance' ? days : undefined, k: mode === 'bill' ? kwh : undefined, car: mode === 'ev' ? car : undefined, e: mode === 'ev' ? eff : undefined, m: mode === 'ev' ? miles : undefined, mpg: mode === 'ev' ? mpg : undefined, g: mode === 'ev' ? gas : undefined }); }, [slug, cents, watts, hours, days, kwh, car, eff, miles, mpg, gas]);
  const name = states.find((x) => x.value === slug)?.label ?? slug;
  const a = useMemo(() => appliance(watts, hours, days, cents), [watts, hours, days, cents]);
  const b = useMemo(() => bill(kwh, cents), [kwh, cents]);
  const e = useMemo(() => ev({ milesPerMonth: miles, kwhPer100mi: eff, lossPct: 0, centsPerKwh: cents, mpg, gasPerGal: gas }), [miles, eff, cents, mpg, gas]);
  const p = idPrefix;
  const priceField = <NumberField id={`${p}-c`} label="Electricity price" value={cents} onChange={setCents} unit="¢/kWh" max={200} decimals={2} help={`${name} residential average, ${period} (EIA). Your bill’s rate may differ.`} />;
  return (
    <Card form={<>
      <StatePick id={`${p}-state`} value={slug} onChange={pick} states={states} lock={lock} />
      {priceField}
      {mode === 'appliance' && <>
        <NumberField id={`${p}-w`} label="Power of the appliance" value={watts} onChange={setWatts} unit="W" max={100000} help="On the rating plate or in the manual." />
        <NumberField id={`${p}-h`} label="Hours used per day" value={hours} onChange={setHours} unit="h" max={24} decimals={1} />
        <NumberField id={`${p}-d`} label="Days used per month" value={days} onChange={setDays} unit="days" max={31} />
      </>}
      {mode === 'bill' && <NumberField id={`${p}-k`} label="Electricity used per month" value={kwh} onChange={setKwh} unit="kWh" max={100000} help={`On your bill. ${name} homes averaged ${num(S.kwhMonth)} kWh a month in 2024.`} />}
      {mode === 'ev' && <>
        <SelectField id={`${p}-car`} label="Electric vehicle (EPA rating)" value={car} onChange={pickCar} options={evNames.map((n) => ({ value: n, label: `${n}: ${evs[n]} kWh/100 mi` }))} />
        <NumberField id={`${p}-e`} label="Consumption" value={eff} onChange={setEff} unit="kWh/100 mi" max={200} decimals={1} />
        <NumberField id={`${p}-m`} label="Miles driven per month" value={miles} onChange={setMiles} unit="mi" max={20000} />
        <NumberField id={`${p}-mpg`} label="Gas car it replaces" value={mpg} onChange={setMpg} unit="mpg" max={200} decimals={1} />
        <NumberField id={`${p}-g`} label="Gasoline price" value={gas} onChange={setGas} unit="$/gal" max={20} decimals={2} help={gasolineWeek ? `U.S. regular, week of ${gasolineWeek} (EIA).` : undefined} />
      </>}
    </>}>
      {mode === 'appliance' && <Result label={`Cost to run it in ${name}`} figure={`${usd(a.month, 2)} a month`} sub={<>{usd(a.year)} a year · {num(a.kwhMonth, 1)} kWh a month</>}>
        <Rows rows={[['Per hour of use', usd(a.perHour, 2)], ['Per day', usd(a.perHour * hours, 2)], ['Per month', usd(a.month, 2), true], ['Per year', usd(a.year)]]} />
        <Note methodHref={methodHref}>Watts × hours ÷ 1,000 = kWh, times the price. Appliances with a thermostat or compressor (heaters, fridges, AC) draw full power only part of the time, so real use is often lower.</Note>
        <Actions />
      </Result>}
      {mode === 'bill' && <Result label={`Electric bill in ${name}`} figure={`${usd(b.month)} a month`} sub={<>{usd(b.year)} a year for {num(kwh)} kWh a month</>}>
        <Rows rows={[['Your estimate', usd(b.month), true], [`Average ${name} bill in 2024 (EIA)`, usd(S.bill)], [`Average ${name} use in 2024`, `${num(S.kwhMonth)} kWh`], ['Difference with the 2024 average', `${b.month - S.bill >= 0 ? '+' : '−'}${usd(Math.abs(b.month - S.bill))}`]]} />
        <Note methodHref={methodHref}>EIA’s average price is total residential revenue divided by kWh sold, so fixed monthly charges are spread into it. Tiered or time-of-use rates change your own figure.</Note>
        <Actions />
      </Result>}
      {mode === 'ev' && <Result label={`Charging at home in ${name}`} figure={`${usd(e.evMonth)} a month`} sub={<>{num(e.centsPerMile, 1)}¢ a mile · gasoline would cost {usd(e.gasMonth)} a month</>}>
        <Rows rows={[['Electricity per month', `${num(e.kwhWall)} kWh`], ['Home charging per year', usd(e.evYear)], ['Gasoline per year', usd(e.gasYear)], ['Saving per year', usd(e.savingYear), true]]} />
        <Note methodHref={methodHref}>Uses the EPA consumption rating as published on fueleconomy.gov; cold weather, highway speed and fast charging raise the real cost. Public fast chargers price differently.</Note>
        <Actions />
      </Result>}
    </Card>
  );
}
