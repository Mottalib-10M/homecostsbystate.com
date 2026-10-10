/** Square footage of up to four areas of simple shapes, with an optional price per square foot. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { shapeArea, type Shape } from '../../lib/engine/materials';
import { readParams, num as qn, str, updateURL } from '../../lib/url-state';
import { Card, Result, Rows, Note, Actions, usd, num } from './parts';

const SHAPES: Array<{ value: Shape; label: string; dims: string[] }> = [
  { value: 'rect', label: 'Rectangle or square', dims: ['Length (ft)', 'Width (ft)'] },
  { value: 'triangle', label: 'Triangle', dims: ['Base (ft)', 'Height (ft)'] },
  { value: 'circle', label: 'Circle', dims: ['Diameter (ft)'] },
  { value: 'trapezoid', label: 'Trapezoid', dims: ['Side a (ft)', 'Side b (ft)', 'Height (ft)'] },
];
interface Area { shape: Shape; a: number; b: number; c: number }
const DEF: Area[] = [{ shape: 'rect', a: 12, b: 14, c: 0 }, { shape: 'rect', a: 0, b: 0, c: 0 }];

export default function SqftCalc({ methodHref = '/en/method/', idPrefix = 'sq' }: { methodHref?: string; idPrefix?: string }) {
  const [areas, setAreas] = useState<Area[]>(DEF);
  const [price, setPrice] = useState(0);
  useEffect(() => {
    const u = readParams(window.location.search);
    setAreas(DEF.map((d, i) => ({ shape: (str(u, `s${i}`, d.shape) as Shape), a: qn(u, `a${i}`, d.a), b: qn(u, `b${i}`, d.b), c: qn(u, `c${i}`, d.c) })));
    setPrice(qn(u, 'pr', 0));
  }, []);
  useEffect(() => { const o: Record<string, string | number | undefined> = { pr: price || undefined }; areas.forEach((x, i) => { o[`s${i}`] = x.shape; o[`a${i}`] = x.a; o[`b${i}`] = x.b; o[`c${i}`] = x.c; }); updateURL(o); }, [areas, price]);
  const set = (i: number, k: keyof Area) => (v: number | string) => setAreas((xs) => xs.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  const each = useMemo(() => areas.map((x) => shapeArea(x.shape, x.a, x.b, x.c)), [areas]);
  const total = each.reduce((s, v) => s + v, 0);
  const p = idPrefix;
  return (
    <Card form={<>
      {areas.map((x, i) => {
        const sh = SHAPES.find((s) => s.value === x.shape)!;
        const keys: Array<keyof Area> = ['a', 'b', 'c'];
        return [
          <SelectField key={`s${i}`} id={`${p}-s${i}`} label={`Area ${i + 1}: shape`} value={x.shape} onChange={(v) => set(i, 'shape')(v)} options={SHAPES.map(({ value, label }) => ({ value, label }))} />,
          ...sh.dims.map((d, k) => <NumberField key={`${i}${k}`} id={`${p}-${i}${keys[k]}`} label={`Area ${i + 1}: ${d.toLowerCase()}`} value={x[keys[k]] as number} onChange={(v) => set(i, keys[k])(v)} unit="ft" max={10000} decimals={2} />),
        ];
      })}
      <NumberField id={`${p}-price`} label="Price per square foot (optional)" value={price} onChange={setPrice} unit="$" max={10000} decimals={2} help="Flooring, sod or paint quote, to total the job." />
    </>}>
      <Result label="Total area" figure={`${num(total, 1)} sq ft`} sub={<>{num(total / 9, 2)} square yards · {num(total * 0.09290304, 2)} square meters</>}>
        <Rows rows={[...each.map((v, i) => [`Area ${i + 1}`, `${num(v, 1)} sq ft`] as [string, string]), ...(price > 0 ? [['Cost at your price', usd(total * price), true] as [string, string, boolean]] : [])]} />
        <Note methodHref={methodHref}>One square yard is 9 square feet; one square meter is 10.764 square feet. For an L-shaped room, split it into two rectangles.</Note>
        <Actions />
      </Result>
    </Card>
  );
}
