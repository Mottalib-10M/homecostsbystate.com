/** Gravel or mulch over an area: cubic yards, tons (gravel) or bags (mulch), optional price. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { looseVolume, tons, bagsOf } from '../../lib/engine/materials';
import { readParams, num as qn, str, updateURL } from '../../lib/url-state';
import { Card, Result, Rows, Note, Actions, usd, num } from './parts';

interface Props { mode: 'gravel' | 'mulch'; densities?: { denseBase: number; selectCrushed: number }; mulchDepth?: number[]; methodHref?: string; idPrefix?: string }
export default function LooseCalc({ mode, densities, mulchDepth = [2, 3], methodHref = '/en/method/', idPrefix = 'lo' }: Props) {
  const g = mode === 'gravel';
  const [l, setL] = useState(g ? 20 : 30); const [w, setW] = useState(g ? 10 : 4);
  const [depth, setDepth] = useState(g ? 4 : mulchDepth[1]);
  const [dens, setDens] = useState(densities?.denseBase ?? 1.85);
  const [bag, setBag] = useState('2');
  const [price, setPrice] = useState(0);
  useEffect(() => { const u = readParams(window.location.search); setL(qn(u, 'l', g ? 20 : 30)); setW(qn(u, 'w', g ? 10 : 4)); setDepth(qn(u, 'd', g ? 4 : mulchDepth[1])); setDens(qn(u, 't', densities?.denseBase ?? 1.85)); setBag(str(u, 'b', '2')); setPrice(qn(u, 'pr', 0)); }, []);
  useEffect(() => { updateURL({ l, w, d: depth, t: g ? dens : undefined, b: g ? undefined : bag, pr: price || undefined }); }, [l, w, depth, dens, bag, price]);
  const v = useMemo(() => looseVolume(l * w, depth), [l, w, depth]);
  const t = tons(v.cuYd, dens);
  const bags = bagsOf(v.cuFt, Number(bag));
  const p = idPrefix;
  return (
    <Card form={<>
      <NumberField id={`${p}-l`} label="Length of the area" value={l} onChange={setL} unit="ft" max={10000} decimals={1} />
      <NumberField id={`${p}-w`} label="Width of the area" value={w} onChange={setW} unit="ft" max={10000} decimals={1} />
      <NumberField id={`${p}-d`} label="Depth" value={depth} onChange={setDepth} unit="in" max={48} decimals={1} help={g ? 'Driveways and paths are often built in layers.' : `Extension services advise ${mulchDepth[0]} to ${mulchDepth[1]} inches.`} />
      {g
        ? <NumberField id={`${p}-t`} label="Weight per cubic yard" value={dens} onChange={setDens} unit="t/yd³" max={5} decimals={2} help={`${num(densities?.denseBase ?? 1.85, 2)} for compacted crushed base, ${num(densities?.selectCrushed ?? 1.75, 2)} for select crushed (state DOT figures).`} />
        : <SelectField id={`${p}-b`} label="Bag size on the label" value={bag} onChange={setBag} options={[{ value: '1.5', label: '1.5 cubic feet' }, { value: '2', label: '2 cubic feet' }, { value: '3', label: '3 cubic feet' }]} />}
      <NumberField id={`${p}-pr`} label={g ? 'Delivered price per ton (optional)' : 'Price per bag (optional)'} value={price} onChange={setPrice} unit="$" max={10000} decimals={2} />
    </>}>
      <Result label={g ? 'Gravel to order' : 'Mulch to buy'} figure={g ? `${num(t, 2)} tons` : `${num(v.cuYd, 2)} cu yd`} sub={<>{num(v.cuYd, 2)} cubic yards · {num(v.cuFt, 1)} cubic feet over {num(l * w)} square feet</>}>
        <Rows rows={g
          ? [['Volume', `${num(v.cuYd, 2)} cu yd`], ['Weight at ' + num(dens, 2) + ' t/yd³', `${num(t, 2)} tons`], ...(price > 0 ? [['Cost at your price', usd(t * price), true] as [string, string, boolean]] : [])]
          : [[`Bags of ${bag} cu ft`, num(bags)], ['Bulk, in cubic yards', num(v.cuYd, 2)], ...(price > 0 ? [['Cost in bags', usd(bags * price), true] as [string, string, boolean]] : [])]} />
        <Note methodHref={methodHref}>{g ? 'Loose gravel weighs less per cubic yard than compacted base; ask the yard which figure its scale uses.' : 'One cubic yard covers 324 square feet one inch deep. Keep mulch a few inches away from stems and trunks.'}</Note>
        <Actions />
      </Result>
    </Card>
  );
}
