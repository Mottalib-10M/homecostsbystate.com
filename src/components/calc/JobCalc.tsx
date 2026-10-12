/**
 * Price of a home job in a state, shown at once (no ZIP, no phone): AHS 2023 national quartiles of what
 * homeowners paid a professional, in August 2026 dollars, with the labor share moved by the state wage of
 * the trade (lib/engine/costs.ts). Roof: the AHS bin of the house size. Fence and deck add a material
 * take-off. First render = build defaults (RECETTE §17.5).
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { jobCost, type JobInput } from '../../lib/engine/costs';
import { cylinderCuFt } from '../../lib/engine/materials';
import { readParams, num as qn, str, updateURL } from '../../lib/url-state';
import { Card, StatePick, Result, Rows, Note, Actions, SplitBar, SPLIT_COLORS, usd, num, type Opt } from './parts';

export interface JobProp { input: JobInput; label: string; occTitle: string; natWage: number; wages: Record<string, number> }
interface Props {
  jobs: JobProp[]; states: Opt[]; state?: string; lock?: boolean; sqft?: boolean; methodHref?: string; idPrefix?: string;
  years: string; cpiTo: string; extra?: 'fence' | 'deck';
  fence?: { panelFt: number; holeIn: Record<string, number>; yields: Record<string, number> };
  deck?: { spansIn: Record<string, number>; spansText: Record<string, string> };
}
const US = 'us';

export default function JobCalc({ jobs, states, state = US, lock = false, sqft = false, methodHref = '/en/method/', idPrefix = 'job', years, cpiTo, extra, fence, deck }: Props) {
  const [slug, setSlug] = useState(state);
  const [area, setArea] = useState(1800);
  const [len, setLen] = useState(150);
  const [depth, setDepth] = useState(30);
  const [post, setPost] = useState('4x4');
  const [dw, setDw] = useState(12);
  const [dl, setDl] = useState(16);
  const [joist, setJoist] = useState('2x8');
  useEffect(() => {
    const u = readParams(window.location.search);
    if (!lock) { const s = str(u, 's', state); if (states.some((x) => x.value === s)) setSlug(s); }
    if (sqft) setArea(qn(u, 'a', 1800));
    if (extra === 'fence') { setLen(qn(u, 'l', 150)); setDepth(qn(u, 'd', 30)); setPost(str(u, 'p', '4x4') === '5x5' ? '5x5' : '4x4'); }
    if (extra === 'deck') { setDw(qn(u, 'w', 12)); setDl(qn(u, 'dl', 16)); setJoist(str(u, 'j', '2x8') === '2x10' ? '2x10' : '2x8'); }
  }, []);
  useEffect(() => { updateURL({ s: lock ? undefined : slug, a: sqft ? area : undefined, l: extra === 'fence' ? len : undefined, d: extra === 'fence' ? depth : undefined, p: extra === 'fence' ? post : undefined, w: extra === 'deck' ? dw : undefined, dl: extra === 'deck' ? dl : undefined, j: extra === 'deck' ? joist : undefined }); }, [slug, area, len, depth, post, dw, dl, joist]);
  const name = slug === US ? 'the United States' : states.find((s) => s.value === slug)?.label ?? slug;
  const results = useMemo(() => jobs.map((j) => ({ j, r: jobCost(j.input, slug, sqft ? area : undefined) })), [jobs, slug, area, sqft]);
  const main = results[0];
  const p = idPrefix;
  const wageLine = (j: JobProp) => {
    if (slug === US) return `${j.occTitle}: national mean ${usd(j.natWage, 2)} an hour.`;
    const w = j.wages[slug];
    if (!w) return `${j.occTitle}: no ${name} wage published by BLS, national figure used.`;
    const d = (w / j.natWage - 1) * 100;
    return `${j.occTitle} in ${name}: ${usd(w, 2)} an hour on average, ${num(Math.abs(d), 0)}% ${d >= 0 ? 'above' : 'below'} the national mean.`;
  };
  // Fence take-off: one post per panel plus one, a hole per post.
  const fenceOut = useMemo(() => {
    if (extra !== 'fence' || !fence) return null;
    const panels = len > 0 ? Math.ceil(len / fence.panelFt) : 0;
    const posts = panels > 0 ? panels + 1 : 0;
    const hole = cylinderCuFt(fence.holeIn[post] ?? 8, depth / 12);
    const perPost = hole; // whole hole volume, the post itself not deducted (rounds the order up)
    const bags = posts > 0 ? Math.ceil((perPost * posts) / fence.yields['80']) : 0;
    return { panels, posts, bags, perPost };
  }, [extra, fence, len, depth, post]);
  const deckOut = useMemo(() => {
    if (extra !== 'deck' || !deck) return null;
    const joists = dw > 0 ? Math.ceil((dw * 12) / 16) + 1 : 0;
    const spanIn = deck.spansIn[joist];
    return { area: Math.max(0, dw) * Math.max(0, dl), joists, ok: dl * 12 <= spanIn, spanText: deck.spansText[joist] };
  }, [extra, deck, dw, dl, joist]);
  return (
    <Card form={<>
      <StatePick id={`${p}-state`} value={slug} onChange={setSlug} states={states} lock={lock} help={lock ? 'Prices use this state’s trade wages.' : 'Only the labor part changes from state to state.'} className={extra ? 'sm:col-span-2' : ''} />
      {sqft && <NumberField id={`${p}-area`} label="Size of the house (living area)" value={area} onChange={setArea} unit="sq ft" max={20000} help="The Census survey groups roof jobs by house size." />}
      {extra === 'fence' && <>
        <NumberField id={`${p}-len`} label="Fence length" value={len} onChange={setLen} unit="ft" max={10000} />
        <NumberField id={`${p}-depth`} label="Post hole depth" value={depth} onChange={setDepth} unit="in" max={120} help="Down to your local frost line." />
        <SelectField id={`${p}-post`} label="Post size" value={post} onChange={setPost} options={[{ value: '4x4', label: '4 x 4 in' }, { value: '5x5', label: '5 x 5 in' }]} />
      </>}
      {extra === 'deck' && <>
        <NumberField id={`${p}-dw`} label="Deck width (along the house)" value={dw} onChange={setDw} unit="ft" max={200} />
        <NumberField id={`${p}-dl`} label="Deck depth (joist span)" value={dl} onChange={setDl} unit="ft" max={100} />
        <SelectField id={`${p}-joist`} label="Joist size (Southern pine, 16 in on center)" value={joist} onChange={setJoist} options={[{ value: '2x8', label: '2 x 8' }, { value: '2x10', label: '2 x 10' }]} />
      </>}
    </>}>
      <Result label={`${main.j.label} in ${name}, hired out`} figure={usd(main.r.typical)} sub={<>Most jobs between <strong>{usd(main.r.low)}</strong> and <strong>{usd(main.r.high)}</strong> (middle half of reported prices)</>}>
        {results.length > 1 && <Rows rows={results.map(({ j, r }) => [j.label, `${usd(r.low)} to ${usd(r.high)} · median ${usd(r.typical)}`] as [string, string])} />}
        <SplitBar parts={[{ label: 'Materials', value: main.r.parts.materials, color: SPLIT_COLORS.materials }, { label: 'Labor', value: main.r.parts.labor, color: SPLIT_COLORS.labor }, { label: 'Subcontracts, equipment, overhead, profit', value: main.r.parts.other, color: SPLIT_COLORS.other }]} />
        <Rows rows={[
          ...(main.r.bin ? [['House size group', main.r.bin.label] as [string, string]] : []),
          ['National median (homeowners’ reports)', usd(main.r.basis.median)],
          ['Regional level (Census division)', `${main.r.region >= 1 ? '+' : '−'}${num(Math.abs(main.r.region - 1) * 100, 1)}%`],
          ['State labor adjustment', (() => { const f = main.r.factor / main.r.region; return `${f >= 1 ? '+' : '−'}${num(Math.abs(f - 1) * 100, 1)}%`; })()],
          ['Typical price in ' + name, usd(main.r.typical), true],
        ]} />
        {fenceOut && <Rows rows={[[`Panels (${num(fence!.panelFt)} ft wide)`, num(fenceOut.panels)], ['Posts', num(fenceOut.posts)], ['80 lb concrete bags (full holes)', num(fenceOut.bags)]]} />}
        {deckOut && <Rows rows={[['Deck area', `${num(deckOut.area)} sq ft`], ['Joists at 16 in on center', num(deckOut.joists)], [`Maximum ${joist} span (DCA 6)`, deckOut.spanText], ['Span check', deckOut.ok ? 'Within the table' : 'Too long: add a beam or go up a size']]} />}
        <Note methodHref={methodHref}>{wageLine(main.j)} Range from homeowners who hired a professional ({years}, American Housing Survey 2023), in {cpiTo} dollars; permits, tear-off of unusual materials, structural repairs and local surcharges vary job to job.</Note>
        <Actions />
      </Result>
    </Card>
  );
}
