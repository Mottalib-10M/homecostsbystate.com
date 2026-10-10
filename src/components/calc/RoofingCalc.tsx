/** Roofing materials: roof area from footprint and pitch, squares, shingle bundles, underlayment, starter and ridge. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { roof, pitchFactor } from '../../lib/engine/materials';
import { readParams, num as qn, str, updateURL } from '../../lib/url-state';
import { Card, Result, Rows, Note, Actions, usd, num } from './parts';

interface Props { bundles: Record<string, number>; rollSquares: number; starterFt: number; ridgeFt: number; methodHref?: string; idPrefix?: string }
const PITCHES = Array.from({ length: 13 }, (_, i) => ({ value: String(i), label: i === 0 ? 'Flat (0/12)' : `${i}/12` }));
export default function RoofingCalc({ bundles, rollSquares, starterFt, ridgeFt, methodHref = '/en/method/', idPrefix = 'rf' }: Props) {
  const [fp, setFp] = useState(2000); const [rise, setRise] = useState('6'); const [type, setType] = useState('architectural');
  const [waste, setWaste] = useState(10); const [eaves, setEaves] = useState(180); const [ridge, setRidge] = useState(50); const [price, setPrice] = useState(0);
  useEffect(() => { const u = readParams(window.location.search); setFp(qn(u, 'f', 2000)); const r = str(u, 'r', '6'); setRise(PITCHES.some((x) => x.value === r) ? r : '6'); const t = str(u, 'ty', 'architectural'); setType(bundles[t] ? t : 'architectural'); setWaste(qn(u, 'wa', 10)); setEaves(qn(u, 'e', 180)); setRidge(qn(u, 'ri', 50)); setPrice(qn(u, 'pr', 0)); }, []);
  useEffect(() => { updateURL({ f: fp, r: rise, ty: type, wa: waste, e: eaves, ri: ridge, pr: price || undefined }); }, [fp, rise, type, waste, eaves, ridge, price]);
  const r = useMemo(() => roof({ footprintSqFt: fp, rise: Number(rise), wastePct: waste, bundlesPerSquare: bundles[type] }), [fp, rise, waste, type, bundles]);
  const rolls = r.squares > 0 ? Math.ceil(r.squares / rollSquares) : 0;
  const starter = eaves > 0 ? Math.ceil(eaves / starterFt) : 0;
  const ridgeCartons = ridge > 0 ? Math.ceil(ridge / ridgeFt) : 0;
  const p = idPrefix;
  const labels: Record<string, string> = { architectural: 'Architectural (laminated)', threeTab: '3-tab', premium: 'Premium heavyweight' };
  return (
    <Card form={<>
      <NumberField id={`${p}-f`} label="Roof footprint, overhangs included" value={fp} onChange={setFp} unit="sq ft" max={50000} help="Length × width of the roof seen from above." />
      <SelectField id={`${p}-r`} label="Roof pitch (rise per 12 in of run)" value={rise} onChange={setRise} options={PITCHES} />
      <SelectField id={`${p}-ty`} label="Shingle type" value={type} onChange={setType} options={Object.keys(bundles).map((k) => ({ value: k, label: `${labels[k] ?? k}: ${bundles[k]} bundles per square` }))} />
      <NumberField id={`${p}-wa`} label="Allowance for cuts, hips and valleys" value={waste} onChange={setWaste} unit="%" max={50} help="Your own allowance; complex roofs need more." />
      <NumberField id={`${p}-e`} label="Eaves and rakes (starter course)" value={eaves} onChange={setEaves} unit="ft" max={5000} />
      <NumberField id={`${p}-ri`} label="Hips and ridges" value={ridge} onChange={setRidge} unit="ft" max={5000} />
      <NumberField id={`${p}-pr`} label="Price per bundle (optional)" value={price} onChange={setPrice} unit="$" max={1000} decimals={2} />
    </>}>
      <Result label="Shingle bundles" figure={num(r.bundles)} sub={<>{num(r.squares, 1)} squares to cover ({num(r.area)} sq ft of roof surface, pitch factor {num(pitchFactor(Number(rise)), 3)})</>}>
        <Rows rows={[['Roof surface', `${num(r.area)} sq ft`], ['With your allowance', `${num(r.withWaste)} sq ft`], ['Synthetic underlayment rolls', num(rolls)], ['Starter strip bundles', num(starter)], ['Hip and ridge cartons', num(ridgeCartons)], ...(price > 0 ? [['Shingles at your price', usd(r.bundles * price), true] as [string, string, boolean]] : [])]} />
        <Note methodHref={methodHref}>Bundles per square, starter ({num(starterFt)} ft a bundle), ridge ({num(ridgeFt)} ft a carton) and underlayment ({num(rollSquares)} squares a roll) follow one manufacturer’s published figures; check the wrapper of the product you buy.</Note>
        <Actions />
      </Result>
    </Card>
  );
}
