/** Drywall for a room: sheets by size, screws, tape and joint compound per USG's figures for 1,000 sq ft. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { roomPaintArea, drywall } from '../../lib/engine/materials';
import { readParams, num as qn, str, updateURL } from '../../lib/url-state';
import { Card, Result, Rows, Note, Actions, usd, num } from './parts';

interface Props { sheets: Record<string, number>; per1000: { screwsLb: number; tapeFt: number; compoundGal: number }; methodHref?: string; idPrefix?: string }
export default function DrywallCalc({ sheets, per1000, methodHref = '/en/method/', idPrefix = 'dw' }: Props) {
  const [l, setL] = useState(12); const [w, setW] = useState(12); const [h, setH] = useState(8);
  const [ceiling, setCeiling] = useState('1'); const [size, setSize] = useState('4x8');
  const [doors, setDoors] = useState(1); const [windows, setWindows] = useState(1);
  const [waste, setWaste] = useState(10); const [price, setPrice] = useState(0);
  useEffect(() => { const u = readParams(window.location.search); setL(qn(u, 'l', 12)); setW(qn(u, 'w', 12)); setH(qn(u, 'h', 8)); setCeiling(str(u, 'ce', '1') === '0' ? '0' : '1'); const s = str(u, 'sz', '4x8'); setSize(sheets[s] ? s : '4x8'); setDoors(qn(u, 'do', 1)); setWindows(qn(u, 'wi', 1)); setWaste(qn(u, 'wa', 10)); setPrice(qn(u, 'pr', 0)); }, []);
  useEffect(() => { updateURL({ l, w, h, ce: ceiling, sz: size, do: doors, wi: windows, wa: waste, pr: price || undefined }); }, [l, w, h, ceiling, size, doors, windows, waste, price]);
  const a = useMemo(() => roomPaintArea({ lengthFt: l, widthFt: w, heightFt: h, doors, windows, doorSqFt: 21, windowSqFt: 15, ceiling: ceiling === '1' }), [l, w, h, doors, windows, ceiling]);
  const d = drywall({ areaSqFt: a.total, sheetSqFt: sheets[size], wastePct: waste, per1000: { screws: per1000.screwsLb, tapeFt: per1000.tapeFt, compoundLb: per1000.compoundGal } });
  const p = idPrefix;
  return (
    <Card form={<>
      <NumberField id={`${p}-l`} label="Room length" value={l} onChange={setL} unit="ft" max={500} decimals={1} />
      <NumberField id={`${p}-w`} label="Room width" value={w} onChange={setW} unit="ft" max={500} decimals={1} />
      <NumberField id={`${p}-h`} label="Wall height" value={h} onChange={setH} unit="ft" max={60} decimals={1} />
      <Toggle id={`${p}-ce`} label="Ceiling included?" value={ceiling} onChange={setCeiling} options={[{ value: '1', label: 'Yes' }, { value: '0', label: 'No' }]} />
      <SelectField id={`${p}-sz`} label="Sheet size" value={size} onChange={setSize} options={Object.keys(sheets).map((k) => ({ value: k, label: `${k.replace('x', ' x ')} ft (${sheets[k]} sq ft)` }))} />
      <NumberField id={`${p}-wa`} label="Allowance for cuts and waste" value={waste} onChange={setWaste} unit="%" max={50} help="Your own allowance; more for many corners and openings." />
      <NumberField id={`${p}-do`} label="Doors deducted" value={doors} onChange={setDoors} unit="" max={50} />
      <NumberField id={`${p}-wi`} label="Windows deducted" value={windows} onChange={setWindows} unit="" max={50} />
      <NumberField id={`${p}-pr`} label="Price per sheet (optional)" value={price} onChange={setPrice} unit="$" max={1000} decimals={2} />
    </>}>
      <Result label="Drywall sheets" figure={num(d.sheets)} sub={<>{size.replace('x', ' x ')} ft sheets for {num(a.total)} sq ft of walls{ceiling === '1' ? ' and ceiling' : ''}, plus {num(waste)}%</>}>
        <Rows rows={[['Board installed', `${num(d.boardSqFt)} sq ft`], ['Drywall screws', `${num(d.screws ?? 0, 1)} lb`], ['Joint tape', `${num(d.tapeFt ?? 0)} ft`], ['All-purpose joint compound', `${num(d.compoundLb ?? 0, 1)} gal`], ...(price > 0 ? [['Cost of the sheets', usd(d.sheets * price), true] as [string, string, boolean]] : [])]} />
        <Note methodHref={methodHref}>Screws, tape and compound scale USG’s figures for 1,000 sq ft of board ({num(per1000.screwsLb, 1)} lb, {num(per1000.tapeFt)} ft, {num(per1000.compoundGal)} gal) to the board you hang.</Note>
        <Actions />
      </Result>
    </Card>
  );
}
