/**
 * Mini: what a job costs in this state when the labor part follows the state wage of the trade.
 * arg = { state, national median, labor share L, wage index } computed by the page from the data.
 */
import type { MiniSpec } from '../mini-types';
import { usd, num, parseArg } from './_kit';

interface Arg { state: string; job: string; median: number; L: number; index: number }
export default function wageGap(arg?: string): MiniSpec {
  const a = parseArg<Arg>(arg, { state: 'United States', job: 'Roof replacement', median: 11000, L: 0.25, index: 1 });
  return {
    title: `${a.job}: change the labor rate`,
    cta: 'Open the full calculator',
    inputs: [
      { id: 'q', label: 'Quote you received', def: Math.round(a.median * (1 - a.L + a.L * a.index) / 10) * 10, unit: '$', max: 1000000 },
      { id: 'w', label: `Labor rate vs ${a.state} average`, def: 100, unit: '%', max: 300 },
    ],
    run: (v) => {
      const laborPart = v.q * (a.L * a.index) / (1 - a.L + a.L * a.index);
      const moved = v.q - laborPart + laborPart * (v.w / 100);
      return {
        head: ['Same job at that labor rate', usd(moved)],
        rows: [['Labor part of your quote', usd(laborPart)], ['Materials, equipment, overhead', usd(v.q - laborPart)], ['Labor share used', `${num(((a.L * a.index) / (1 - a.L + a.L * a.index)) * 100, 1)}%`]],
        note: 'Labor share from the 2022 Economic Census for this contractor type, moved by the state wage index.',
      };
    },
  };
}
