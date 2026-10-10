/** Material quantities (pure geometry plus the manufacturer figures passed in from params-2026.json). */
export const CUFT_PER_CUYD = 27;

/** Volume in cubic feet of a slab, footing or wall: length and width in feet, thickness in inches. */
export const slabCuFt = (lengthFt: number, widthFt: number, thicknessIn: number) => Math.max(0, lengthFt) * Math.max(0, widthFt) * Math.max(0, thicknessIn) / 12;
/** Round column or post hole: diameter in inches, depth in feet. */
export const cylinderCuFt = (diameterIn: number, depthFt: number) => Math.PI * (Math.max(0, diameterIn) / 24) ** 2 * Math.max(0, depthFt);

export interface ConcreteOut { cuFt: number; cuYd: number; cuYdWithWaste: number; bags: Record<string, number> }
/** Bags needed for each bag size: yields in cubic feet per bag (Quikrete data sheet). */
export function concrete(cuFt: number, wastePct: number, yields: Record<string, number>): ConcreteOut {
  const withWaste = cuFt * (1 + Math.max(0, wastePct) / 100);
  const bags: Record<string, number> = {};
  for (const [size, y] of Object.entries(yields)) bags[size] = withWaste > 0 ? Math.ceil(withWaste / y) : 0;
  return { cuFt, cuYd: cuFt / CUFT_PER_CUYD, cuYdWithWaste: withWaste / CUFT_PER_CUYD, bags };
}

/** Loose material (gravel, sand, mulch, topsoil) over an area: depth in inches. */
export function looseVolume(areaSqFt: number, depthIn: number) {
  const cuFt = Math.max(0, areaSqFt) * Math.max(0, depthIn) / 12;
  return { cuFt, cuYd: cuFt / CUFT_PER_CUYD };
}
/** Tons from cubic yards and a unit weight in tons per cubic yard. */
export const tons = (cuYd: number, tonsPerCuYd: number) => cuYd * tonsPerCuYd;
/** Number of bags of a given volume (cubic feet per bag). */
export const bagsOf = (cuFt: number, bagCuFt: number) => (cuFt > 0 ? Math.ceil(cuFt / bagCuFt) : 0);

/** Wall area of a room minus openings; ceiling optional. */
export function roomPaintArea(o: { lengthFt: number; widthFt: number; heightFt: number; doors: number; windows: number; doorSqFt: number; windowSqFt: number; ceiling: boolean }) {
  const walls = 2 * (Math.max(0, o.lengthFt) + Math.max(0, o.widthFt)) * Math.max(0, o.heightFt);
  const openings = Math.max(0, o.doors) * o.doorSqFt + Math.max(0, o.windows) * o.windowSqFt;
  const wallNet = Math.max(0, walls - openings);
  const ceiling = o.ceiling ? Math.max(0, o.lengthFt) * Math.max(0, o.widthFt) : 0;
  return { walls, openings, wallNet, ceiling, total: wallNet + ceiling };
}
/** Gallons of paint: area × coats ÷ coverage (sq ft per gallon), rounded up to whole gallons and quarts. */
export function paintGallons(areaSqFt: number, coats: number, coverage: number) {
  const exact = coverage > 0 ? (Math.max(0, areaSqFt) * Math.max(0, coats)) / coverage : 0;
  const gallons = Math.ceil(exact);
  const quarts = Math.ceil(exact * 4);
  return { exact, gallons, quarts };
}

/** Drywall sheets for walls (and ceiling) of a room, with a waste allowance. */
export function drywall(o: { areaSqFt: number; sheetSqFt: number; wastePct: number; per1000: { compoundGal?: number; tapeFt?: number; screws?: number } }) {
  const a = Math.max(0, o.areaSqFt) * (1 + Math.max(0, o.wastePct) / 100);
  const sheets = a > 0 ? Math.ceil(a / o.sheetSqFt) : 0;
  const k = (sheets * o.sheetSqFt) / 1000;
  return {
    sheets, boardSqFt: sheets * o.sheetSqFt,
    compoundGal: o.per1000.compoundGal != null ? k * o.per1000.compoundGal : null,
    tapeFt: o.per1000.tapeFt != null ? k * o.per1000.tapeFt : null,
    screws: o.per1000.screws != null ? k * o.per1000.screws : null,
  };
}

/** Rafter length factor for a pitch of rise/12: sqrt(1 + (rise/12)^2). */
export const pitchFactor = (rise: number) => Math.sqrt(1 + (Math.max(0, rise) / 12) ** 2);
/** Roof area from the footprint (including overhangs) and the pitch; squares of 100 sq ft. */
export function roof(o: { footprintSqFt: number; rise: number; wastePct: number; bundlesPerSquare: number }) {
  const area = Math.max(0, o.footprintSqFt) * pitchFactor(o.rise);
  const withWaste = area * (1 + Math.max(0, o.wastePct) / 100);
  const squares = withWaste / 100;
  return { area, withWaste, squares, bundles: Math.ceil(squares * o.bundlesPerSquare) };
}

export type Shape = 'rect' | 'triangle' | 'circle' | 'trapezoid';
/** Area in square feet of a simple shape, dimensions in feet. */
export function shapeArea(shape: Shape, a: number, b = 0, c = 0): number {
  a = Math.max(0, a); b = Math.max(0, b); c = Math.max(0, c);
  if (shape === 'rect') return a * b;
  if (shape === 'triangle') return (a * b) / 2;
  if (shape === 'circle') return Math.PI * (a / 2) ** 2;
  return ((a + b) / 2) * c;
}
