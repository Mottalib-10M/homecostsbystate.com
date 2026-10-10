/** Concrete for a slab, footing or round holes: cubic yards, bags by size (Quikrete yields), order with overage. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { slabCuFt, cylinderCuFt, concrete } from '../../lib/engine/materials';
import { readParams, num as qn, str, updateURL } from '../../lib/url-state';
import { Card, Result, Rows, Note, Actions, usd, num } from './parts';

interface Props { yields: Record<string, number>; overage: number[]; truck: number[]; methodHref?: string; idPrefix?: string }
export default function ConcreteCalc({ yields, overage, truck, methodHref = '/en/method/', idPrefix = 'cc' }: Props) {
  const [shape, setShape] = useState('slab');
  const [l, setL] = useState(10); const [w, setW] = useState(10); const [t, setT] = useState(4);
  const [dia, setDia] = useState(10); const [dep, setDep] = useState(36); const [count, setCount] = useState(1);
  const [waste, setWaste] = useState(overage[0]);
  const [bagPrice, setBagPrice] = useState(0); const [yardPrice, setYardPrice] = useState(0);
  useEffect(() => { const u = readParams(window.location.search); setShape(str(u, 'sh', 'slab') === 'round' ? 'round' : 'slab'); setL(qn(u, 'l', 10)); setW(qn(u, 'w', 10)); setT(qn(u, 't', 4)); setDia(qn(u, 'di', 10)); setDep(qn(u, 'de', 36)); setCount(qn(u, 'n', 1)); setWaste(qn(u, 'wa', overage[0])); setBagPrice(qn(u, 'bp', 0)); setYardPrice(qn(u, 'yp', 0)); }, []);
  useEffect(() => { updateURL({ sh: shape, l, w, t, di: dia, de: dep, n: count, wa: waste, bp: bagPrice || undefined, yp: yardPrice || undefined }); }, [shape, l, w, t, dia, dep, count, waste, bagPrice, yardPrice]);
  const cuFt = shape === 'slab' ? slabCuFt(l, w, t) * Math.max(1, count) : cylinderCuFt(dia, dep / 12) * Math.max(0, count);
  const r = useMemo(() => concrete(cuFt, waste, yields), [cuFt, waste, yields]);
  const p = idPrefix;
  return (
    <Card form={<>
      <SelectField id={`${p}-shape`} label="What are you pouring?" value={shape} onChange={setShape} options={[{ value: 'slab', label: 'Slab, patio, footing or wall' }, { value: 'round', label: 'Round holes or columns (posts, piers)' }]} />
      <NumberField id={`${p}-count`} label={shape === 'slab' ? 'How many identical pours' : 'Number of holes'} value={count} onChange={setCount} unit="" max={1000} />
      {shape === 'slab' ? <>
        <NumberField id={`${p}-l`} label="Length" value={l} onChange={setL} unit="ft" max={1000} decimals={1} />
        <NumberField id={`${p}-w`} label="Width" value={w} onChange={setW} unit="ft" max={1000} decimals={1} />
        <NumberField id={`${p}-t`} label="Thickness" value={t} onChange={setT} unit="in" max={60} decimals={1} />
      </> : <>
        <NumberField id={`${p}-dia`} label="Hole diameter" value={dia} onChange={setDia} unit="in" max={120} decimals={1} />
        <NumberField id={`${p}-dep`} label="Hole depth" value={dep} onChange={setDep} unit="in" max={240} />
      </>}
      <NumberField id={`${p}-waste`} label="Extra to order" value={waste} onChange={setWaste} unit="%" max={50} help={`Ready-mix producers advise ${overage[0]}% to ${overage[1]}% over the plan volume.`} />
      <NumberField id={`${p}-bp`} label="Price of an 80 lb bag (optional)" value={bagPrice} onChange={setBagPrice} unit="$" max={1000} decimals={2} help="From your store’s shelf tag." />
      <NumberField id={`${p}-yp`} label="Ready-mix price per cubic yard (optional)" value={yardPrice} onChange={setYardPrice} unit="$" max={5000} help="Quoted by your local plant, delivery included or not." />
    </>}>
      <Result label="Concrete to order" figure={`${num(r.cuYdWithWaste, 2)} cu yd`} sub={<>{num(r.cuYd, 2)} cubic yards in the forms ({num(r.cuFt, 1)} cubic feet) plus {num(waste, 0)}%</>}>
        <Rows rows={[
          ['80 lb bags', num(r.bags['80'])], ['60 lb bags', num(r.bags['60'])], ['50 lb bags', num(r.bags['50'])], ['40 lb bags', num(r.bags['40'])],
          ...(bagPrice > 0 ? [['Cost in 80 lb bags', usd(r.bags['80'] * bagPrice), true] as [string, string, boolean]] : []),
          ...(yardPrice > 0 ? [['Cost in ready-mix', usd(r.cuYdWithWaste * yardPrice), true] as [string, string, boolean]] : []),
        ]} />
        <Note methodHref={methodHref}>Bag counts use the manufacturer’s yields (an 80 lb bag makes {num(yields['80'], 2)} cubic feet). Past about one cubic yard, a ready-mix truck usually beats bags; trucks carry {truck[0]} to {truck[1]} cubic yards.</Note>
        <Actions />
      </Result>
    </Card>
  );
}
