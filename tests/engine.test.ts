/** Engine tests: geometry, manufacturer yields, state adjustment, energy and solar arithmetic (RECETTE §4, §17.4). */
import { describe, it, expect } from 'vitest';
import { slabCuFt, concrete, cylinderCuFt, looseVolume, tons, bagsOf, roomPaintArea, paintGallons, drywall, pitchFactor, roof, shapeArea } from '../src/lib/engine/materials';
import { laborShare, wageIndex, stateFactor, adjustRange, breakdown, sizeBin, jobCost, roundTo } from '../src/lib/engine/costs';
import { appliance, bill, ev, copFromHspf2, heatingCosts } from '../src/lib/engine/energy';
import { systemKw, panels, price, payback } from '../src/lib/engine/solar';
import { localMove } from '../src/lib/engine/moving';
import P from '../src/data/params-2026.json';
import WAGES from '../src/data/wages.json';
import AHS from '../src/data/ahs.json';
import SHARES from '../src/data/shares.json';
import ENERGY from '../src/data/energy.json';
import STATES from '../src/data/states.json';
import { jobInput, recsHeating, solarQuote, reportedToQuote } from '../src/lib/data';

describe('concrete (Quikrete yields)', () => {
  it('10 x 10 ft slab, 4 in thick = 33.3 cu ft = 1.23 cu yd', () => {
    const v = slabCuFt(10, 10, 4);
    expect(v).toBeCloseTo(33.333, 3);
    const c = concrete(v, 0, P.materials.concreteYieldCuFt);
    expect(c.cuYd).toBeCloseTo(1.2346, 3);
    expect(c.bags['80']).toBe(Math.ceil(33.3334 / 0.6)); // 56 bags of 80 lb at 0.60 cu ft each
    expect(c.bags['60']).toBe(75);
  });
  it('waste allowance raises the order, not the volume', () => {
    const c = concrete(27, 10, P.materials.concreteYieldCuFt);
    expect(c.cuYd).toBe(1); expect(c.cuYdWithWaste).toBeCloseTo(1.1, 6);
  });
  it('post hole 10 in x 2 ft', () => expect(cylinderCuFt(10, 2)).toBeCloseTo(Math.PI * (10 / 24) ** 2 * 2, 6));
  it('zero dimensions give zero bags, never NaN', () => expect(concrete(0, 5, P.materials.concreteYieldCuFt).bags['80']).toBe(0));
});

describe('loose materials', () => {
  it('Clemson: 1 cu yd covers 324 sq ft at 1 in', () => expect(looseVolume(P.materials.mulchSqFtPerCuYdAt1In, 1).cuYd).toBeCloseTo(1, 9));
  it('gravel 1 cu yd at 1.85 t', () => expect(tons(1, P.materials.aggregateTonsPerCuYd.denseBase)).toBe(1.85));
  it('bags round up', () => { expect(bagsOf(27, 2)).toBe(14); expect(bagsOf(0, 2)).toBe(0); });
});

describe('paint and drywall', () => {
  const room = roomPaintArea({ lengthFt: 12, widthFt: 12, heightFt: 8, doors: 1, windows: 2, doorSqFt: 20, windowSqFt: 15, ceiling: false });
  it('12 x 12 x 8 room: 384 sq ft of wall, 334 net', () => { expect(room.walls).toBe(384); expect(room.wallNet).toBe(334); });
  it('2 coats at 350 sq ft/gal', () => { const g = paintGallons(334, 2, 350); expect(g.exact).toBeCloseTo(1.9086, 3); expect(g.gallons).toBe(2); expect(g.quarts).toBe(8); });
  it('USG: 1,000 sq ft of board takes 370 ft of tape', () => {
    const d = drywall({ areaSqFt: 1000, sheetSqFt: 32, wastePct: 0, per1000: { tapeFt: 370, screws: 2.7, compoundGal: 10 } });
    expect(d.sheets).toBe(32); expect(d.boardSqFt).toBe(1024); expect(d.tapeFt).toBeCloseTo(378.88, 2);
  });
});

describe('roof geometry', () => {
  it('pitch factors', () => { expect(pitchFactor(0)).toBe(1); expect(pitchFactor(12)).toBeCloseTo(Math.SQRT2, 9); expect(pitchFactor(6)).toBeCloseTo(1.1180, 4); });
  it('2,000 sq ft footprint at 6/12, 10% waste, 3 bundles per square', () => {
    const r = roof({ footprintSqFt: 2000, rise: 6, wastePct: 10, bundlesPerSquare: 3 });
    expect(r.area).toBeCloseTo(2236.07, 1); expect(r.squares).toBeCloseTo(24.597, 2); expect(r.bundles).toBe(74);
  });
  it('shapes', () => { expect(shapeArea('rect', 10, 12)).toBe(120); expect(shapeArea('triangle', 10, 12)).toBe(60); expect(shapeArea('trapezoid', 10, 20, 5)).toBe(75); expect(shapeArea('circle', 10)).toBeCloseTo(78.54, 2); });
});

describe('state adjustment of job costs', () => {
  const s = (SHARES as Record<string, { materials: number; payroll: number; benefits: number }>)['238160'];
  it('roofing labor share from the Economic Census is payroll + benefits', () => expect(laborShare(s)).toBeCloseTo(s.payroll + s.benefits, 9));
  it('only the labor part moves', () => {
    const L = laborShare(s);
    expect(stateFactor(L, 1)).toBe(1);
    expect(stateFactor(L, 1.2)).toBeCloseTo(1 + 0.2 * L, 9);
    expect(stateFactor(L, 0.8)).toBeCloseTo(1 - 0.2 * L, 9);
  });
  it('wage index falls back to 1 when a state figure is missing', () => { expect(wageIndex(null, 30)).toBe(1); expect(wageIndex(33, 30)).toBeCloseTo(1.1, 9); });
  it('breakdown sums to the labor-adjusted total', () => {
    const b = breakdown(10000, s, 1.15); const L = laborShare(s);
    expect(b.materials + b.labor + b.other).toBeCloseTo(10000 * stateFactor(L, 1.15), 6);
  });
  it('ranges are rounded to $10', () => { expect(adjustRange({ p25: 1004, median: 1606, p75: 2349 }, 1, 10)).toEqual({ low: 1000, typical: 1610, high: 2350 }); expect(roundTo(1234.5, 50)).toBe(1250); });
  it('Texas: region from the AHS division, labor at the TX roofer wage over the division wage (OEWS May 2025)', () => {
    const W = WAGES.states as Record<string, Record<string, { mean: number; emp: number }>>;
    const wsc = STATES.filter((s) => s.division === 7).map((s) => W[s.slug].roofers).filter(Boolean);
    const divWage = wsc.reduce((a, r) => a + r.mean * r.emp, 0) / wsc.reduce((a, r) => a + r.emp, 0);
    const j = jobInput('roof'); expect(j.index.texas).toBeCloseTo(W.texas.roofers.mean / divWage, 3);
    const div = (AHS.jobs.roof.divisions as Record<string, { median: number; n: number }>)['7'];
    expect(j.region.texas).toBeCloseTo(div.median / AHS.jobs.roof.pro.median, 3);
    const r = jobCost(j, 'texas'); const L = laborShare(j.shares);
    expect(r.typical).toBe(roundTo(AHS.jobs.roof.pro.median * j.region.texas * (1 - L + L * j.index.texas)));
    expect(r.low).toBeLessThan(r.typical); expect(r.typical).toBeLessThan(r.high);
  });
  it('a division with fewer than 60 reported jobs keeps the national level', () => {
    const j = jobInput('fence'); const n = (AHS.jobs.fence.divisions as Record<string, { n: number }>)['6']?.n ?? 0;
    expect(n).toBeLessThan(60); expect(j.region.alabama).toBe(1);
  });
  it('national figure for "us" equals the CPI-adjusted AHS quartiles', () => {
    const r = jobCost(jobInput('waterHeater'), 'us');
    expect(r.typical).toBe(roundTo(AHS.jobs.waterHeater.pro.median)); expect(r.factor).toBe(1);
  });
  it('house size picks the AHS bin', () => {
    const bins = jobInput('roof').bySize!;
    expect(sizeBin(bins, 800).bin).toBe('lt1000'); expect(sizeBin(bins, 1800).bin).toBe('1500'); expect(sizeBin(bins, 5200).bin).toBe('4000');
  });
  it('every state has a roofer, plumber and HVAC index between 0.5 and 2', () => {
    for (const k of ['roof', 'waterHeater', 'centralAc']) { const j = jobInput(k); for (const st of STATES) { expect(j.index[st.slug]).toBeGreaterThan(0.5); expect(j.index[st.slug]).toBeLessThan(2); } }
  });
});

describe('AHS 2023 data sanity', () => {
  it('quartiles are ordered and samples are large', () => {
    for (const [k, v] of Object.entries(AHS.jobs as Record<string, { pro: { p25: number; median: number; p75: number; n: number } }>)) {
      expect(v.pro.p25, k).toBeLessThanOrEqual(v.pro.median); expect(v.pro.median, k).toBeLessThanOrEqual(v.pro.p75); expect(v.pro.n, k).toBeGreaterThanOrEqual(400);
    }
  });
  it('nominal roof median was $10,000; CPI raises it to August 2026 dollars', () => {
    expect(AHS.jobs.roof.proNominal.median).toBe(10000); expect(AHS.jobs.roof.pro.median).toBeGreaterThan(10000); expect(AHS.cpi.to).toBe('2026-08');
  });
});

describe('energy', () => {
  it('1,500 W for 4 h a day, 30 days, at 16 ¢', () => { const a = appliance(1500, 4, 30, 16); expect(a.kwhMonth).toBe(180); expect(a.month).toBeCloseTo(28.8, 9); expect(a.year).toBeCloseTo(345.6, 9); });
  it('bill = kWh × average price', () => expect(bill(863, 16.48).month).toBeCloseTo(142.22, 2));
  it('EV: 1,000 mi at 31 kWh/100 mi and 16 ¢ against 25 mpg at $3.50', () => {
    const r = ev({ milesPerMonth: 1000, kwhPer100mi: 31, lossPct: 0, centsPerKwh: 16, mpg: 25, gasPerGal: 3.5 });
    expect(r.kwhWall).toBe(310); expect(r.evMonth).toBeCloseTo(49.6, 9); expect(r.gasMonth).toBe(140); expect(r.savingYear).toBeCloseTo(1084.8, 6);
  });
  it('HSPF2 7.5 is a seasonal COP of 2.2', () => expect(copFromHspf2(7.5, P.btu.kwh)).toBeCloseTo(2.198, 3));
  it('heating: 40 MMBtu delivered', () => {
    const h = heatingCosts({ heatMMBtu: 40, afue: 0.8, hspf2: 7.5, btu: P.btu, prices: { gasPerMcf: 15, propanePerGal: 3, oilPerGal: 4, centsPerKwh: 16 } });
    expect(h.gas!.cost).toBeCloseTo((40e6 / 0.8 / 1036000) * 15, 6);
    expect(h.propane!.units).toBeCloseTo(40e6 / 0.8 / 91452, 6);
    expect(h.resistance.units).toBeCloseTo(40e6 / 3412, 6);
    expect(h.heatPump.cost).toBeLessThan(h.resistance.cost);
  });
  it('EIA prices are present for every state', () => { for (const st of STATES) expect((ENERGY.electricity.centsPerKwh as Record<string, number>)[st.slug], st.slug).toBeGreaterThan(5); });
  it('RECS fallback reaches a value for every state and fuel', () => { for (const st of STATES) for (const f of ['gas', 'propane', 'oil', 'electricity'] as const) expect(recsHeating(st.slug, f).value).toBeGreaterThan(0); });
});

describe('solar', () => {
  it('size and panels', () => { expect(systemKw(10000, 1250)).toBe(8); expect(panels(8, 425)).toBe(19); expect(panels(0, 425)).toBe(0); });
  it('price range uses the state quote and the NY reported/quote ratio', () => {
    const q = solarQuote('texas'); expect(q.scope).toBe('state'); expect(solarQuote('ohio').scope).toBe('us');
    const r = price(8, q.perW, reportedToQuote()); expect(r.low).toBeCloseTo(8000 * q.perW, 6); expect(r.high).toBeGreaterThan(r.low);
  });
  it('simple payback', () => { const p = payback({ cost: 20000, kw: 8, kwhPerKw: 1250, centsPerKwh: 16, exportShare: 0, exportCents: 0 }); expect(p.kwh).toBe(10000); expect(p.saving).toBe(1600); expect(p.years).toBe(12.5); });
  it('no saving means no payback', () => expect(payback({ cost: 1, kw: 0, kwhPerKw: 1, centsPerKwh: 1, exportShare: 0, exportCents: 0 }).years).toBe(Infinity));
});

describe('moving', () => {
  it('2 movers, 5 h + 1 h travel', () => {
    const m = localMove({ movers: 2, hours: 5, travelHours: 1, wage: { p25: 16, mean: 20, p75: 22 }, revenuePerPayroll: 4 });
    expect(m.crewHours).toBe(12); expect(m.typical).toBe(960); expect(m.low).toBe(768); expect(m.high).toBe(1056);
  });
});
