/** Paint for a room: wall area net of doors and windows, coats, coverage from the manufacturers' data sheets. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import Toggle from '../ui/Toggle';
import { roomPaintArea, paintGallons } from '../../lib/engine/materials';
import { readParams, num as qn, str, updateURL } from '../../lib/url-state';
import { Card, Result, Rows, Note, Actions, usd, num } from './parts';

interface Props { coverage: number; coats: number; methodHref?: string; idPrefix?: string }
export default function PaintCalc({ coverage: cov0, coats: coats0, methodHref = '/en/method/', idPrefix = 'pa' }: Props) {
  const [l, setL] = useState(12); const [w, setW] = useState(12); const [h, setH] = useState(8);
  const [doors, setDoors] = useState(1); const [windows, setWindows] = useState(2);
  const [coats, setCoats] = useState(coats0); const [cov, setCov] = useState(cov0);
  const [ceiling, setCeiling] = useState('0'); const [price, setPrice] = useState(0);
  useEffect(() => { const u = readParams(window.location.search); setL(qn(u, 'l', 12)); setW(qn(u, 'w', 12)); setH(qn(u, 'h', 8)); setDoors(qn(u, 'do', 1)); setWindows(qn(u, 'wi', 2)); setCoats(qn(u, 'co', coats0)); setCov(qn(u, 'cv', cov0)); setCeiling(str(u, 'ce', '0') === '1' ? '1' : '0'); setPrice(qn(u, 'pr', 0)); }, []);
  useEffect(() => { updateURL({ l, w, h, do: doors, wi: windows, co: coats, cv: cov, ce: ceiling, pr: price || undefined }); }, [l, w, h, doors, windows, coats, cov, ceiling, price]);
  const a = useMemo(() => roomPaintArea({ lengthFt: l, widthFt: w, heightFt: h, doors, windows, doorSqFt: 21, windowSqFt: 15, ceiling: ceiling === '1' }), [l, w, h, doors, windows, ceiling]);
  const g = paintGallons(a.total, coats, cov);
  const p = idPrefix;
  return (
    <Card form={<>
      <NumberField id={`${p}-l`} label="Room length" value={l} onChange={setL} unit="ft" max={500} decimals={1} />
      <NumberField id={`${p}-w`} label="Room width" value={w} onChange={setW} unit="ft" max={500} decimals={1} />
      <NumberField id={`${p}-h`} label="Wall height" value={h} onChange={setH} unit="ft" max={60} decimals={1} />
      <Toggle id={`${p}-ce`} label="Paint the ceiling too?" value={ceiling} onChange={setCeiling} options={[{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }]} />
      <NumberField id={`${p}-do`} label="Doors (3 x 7 ft each, deducted)" value={doors} onChange={setDoors} unit="" max={50} />
      <NumberField id={`${p}-wi`} label="Windows (3 x 5 ft each, deducted)" value={windows} onChange={setWindows} unit="" max={50} />
      <NumberField id={`${p}-co`} label="Coats" value={coats} onChange={setCoats} unit="" max={5} />
      <NumberField id={`${p}-cv`} label="Coverage on the can" value={cov} onChange={setCov} unit="ft²/gal" max={1000} help="Data sheets give 300 to 450 sq ft per gallon." />
      <NumberField id={`${p}-pr`} label="Price per gallon (optional)" value={price} onChange={setPrice} unit="$" max={1000} decimals={2} />
    </>}>
      <Result label="Paint to buy" figure={`${num(g.gallons)} gal`} sub={<>{num(g.exact, 2)} gallons exactly, or {num(g.quarts)} quarts</>}>
        <Rows rows={[['Wall area', `${num(a.walls)} sq ft`], ['Doors and windows deducted', `${num(a.openings)} sq ft`], ...(a.ceiling ? [['Ceiling', `${num(a.ceiling)} sq ft`] as [string, string]] : []), ['Area to paint, per coat', `${num(a.total)} sq ft`], ...(price > 0 ? [['Cost at your price', usd(g.gallons * price), true] as [string, string, boolean]] : [])]} />
        <Note methodHref={methodHref}>Manufacturers recommend two coats on bare drywall or for full color; one coat may do over the same color. Textured or porous walls take more.</Note>
        <Actions />
      </Result>
    </Card>
  );
}
