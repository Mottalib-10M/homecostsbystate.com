/** Mini: yearly electricity of a heat pump for a heat load, at a price per kWh (engine: copFromHspf2). */
import type { MiniSpec } from '../mini-types';
import { copFromHspf2 } from '../engine/energy';
import { usd, num, parseArg } from './_kit';

interface Arg { place: string; cents: number; heatMMBtu: number; hspf2: number; btuPerKwh: number }
export default function hpRunning(arg?: string): MiniSpec {
  const a = parseArg<Arg>(arg, { place: 'the United States', cents: 18, heatMMBtu: 36, hspf2: 7.5, btuPerKwh: 3412 });
  return {
    title: 'Heat pump: yearly heating electricity',
    cta: 'Compare with gas, propane and oil',
    inputs: [
      { id: 'h', label: 'Heat the house needs per year', def: a.heatMMBtu, unit: 'MMBtu', max: 500, decimals: 1 },
      { id: 's', label: 'Heat pump rating', def: a.hspf2, unit: 'HSPF2', max: 20, decimals: 1 },
      { id: 'c', label: 'Electricity price', def: a.cents, unit: '¢/kWh', max: 200, decimals: 2 },
    ],
    run: (v) => {
      const cop = copFromHspf2(v.s, a.btuPerKwh);
      const kwh = cop > 0 ? (v.h * 1e6) / a.btuPerKwh / cop : 0;
      return {
        head: ['Heating electricity per year', usd((kwh * v.c) / 100)],
        rows: [['Seasonal COP', num(cop, 2)], ['kWh per year', num(kwh)], ['Per winter month (of 5)', usd((kwh * v.c) / 100 / 5)]],
        note: `Default heat load: the average space-heating use of gas-heated homes (EIA RECS 2020) at 80% efficiency; price: ${a.place} average.`,
      };
    },
  };
}
