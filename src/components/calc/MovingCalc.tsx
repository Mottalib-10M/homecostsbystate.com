/** Local move priced by the hour from the state wage of movers and the revenue moving companies earn per dollar of payroll. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import { localMove } from '../../lib/engine/moving';
import { readParams, num as qn, str, updateURL } from '../../lib/url-state';
import { Card, StatePick, Result, Rows, Note, Actions, usd, num, type Opt } from './parts';

interface Props { states: Opt[]; wages: Record<string, { p25: number; mean: number; p75: number }>; ratio: number; state?: string; lock?: boolean; methodHref?: string; idPrefix?: string }
export default function MovingCalc({ states, wages, ratio, state = 'texas', lock = false, methodHref = '/en/method/', idPrefix = 'mv' }: Props) {
  const [slug, setSlug] = useState(state);
  const [movers, setMovers] = useState(2); const [hours, setHours] = useState(6); const [travel, setTravel] = useState(1);
  useEffect(() => { const u = readParams(window.location.search); if (!lock) { const q = str(u, 's', state); if (wages[q]) setSlug(q); } setMovers(qn(u, 'm', 2)); setHours(qn(u, 'h', 6)); setTravel(qn(u, 't', 1)); }, []);
  useEffect(() => { updateURL({ s: lock ? undefined : slug, m: movers, h: hours, t: travel }); }, [slug, movers, hours, travel]);
  const W = wages[slug] ?? wages[state];
  const r = useMemo(() => localMove({ movers, hours, travelHours: travel, wage: W, revenuePerPayroll: ratio }), [movers, hours, travel, W, ratio]);
  const name = states.find((x) => x.value === slug)?.label ?? slug;
  const p = idPrefix;
  return (
    <Card form={<>
      <StatePick id={`${p}-state`} value={slug} onChange={setSlug} states={states} lock={lock} />
      <NumberField id={`${p}-m`} label="Movers in the crew" value={movers} onChange={setMovers} unit="" max={20} />
      <NumberField id={`${p}-h`} label="Hours of loading and unloading" value={hours} onChange={setHours} unit="h" max={100} decimals={1} help="Your estimate, or the hours on the mover’s written estimate." />
      <NumberField id={`${p}-t`} label="Driving time billed" value={travel} onChange={setTravel} unit="h" max={48} decimals={1} />
    </>}>
      <Result label={`Local move in ${name}`} figure={usd(r.typical)} sub={<>Range {usd(r.low)} to {usd(r.high)} for {num(r.crewHours, 1)} mover-hours</>}>
        <Rows rows={[['Mover wage in ' + name + ' (BLS mean)', `${usd(W.mean, 2)}/h`], ['Revenue per $1 of payroll (moving companies)', usd(ratio, 2)], ['Implied price per mover-hour', `${usd(r.ratePerMoverHour)}/h`], ['Crew of ' + num(movers) + ', per hour', `${usd(r.ratePerMoverHour * movers)}/h`, true]]} />
        <Note methodHref={methodHref}>The hourly price is built from what moving companies earn for each dollar of wages they pay (2022 Economic Census), so it carries the truck, fuel, insurance and overhead on average. Long-distance moves are priced by weight and miles instead.</Note>
        <Actions />
      </Result>
    </Card>
  );
}
