/** Electricity, EV charging and heating costs (pure functions; prices and heat contents come from the data files). */
export interface Btu { kwh: number; gasCuFt: number; propaneGal: number; oilGal: number }

/** Monthly and yearly cost of an appliance: watts × hours a day × days a month at a price in cents per kWh. */
export function appliance(watts: number, hoursPerDay: number, daysPerMonth: number, centsPerKwh: number) {
  const kwhMonth = (Math.max(0, watts) * Math.max(0, hoursPerDay) * Math.max(0, daysPerMonth)) / 1000;
  const month = (kwhMonth * Math.max(0, centsPerKwh)) / 100;
  return { kwhMonth, month, year: month * 12, perHour: (Math.max(0, watts) / 1000) * centsPerKwh / 100 };
}

/** Bill at the state's average price (EIA average price = revenue ÷ sales, so fixed charges are spread in it). */
export function bill(kwhMonth: number, centsPerKwh: number) {
  const month = (Math.max(0, kwhMonth) * Math.max(0, centsPerKwh)) / 100;
  return { month, year: month * 12 };
}

/** EV charging cost against gasoline for the same miles. Charging loss in percent of energy drawn from the wall. */
export function ev(o: { milesPerMonth: number; kwhPer100mi: number; lossPct: number; centsPerKwh: number; mpg: number; gasPerGal: number }) {
  const kwhBattery = (Math.max(0, o.milesPerMonth) * Math.max(0, o.kwhPer100mi)) / 100;
  const kwhWall = kwhBattery / (1 - Math.min(Math.max(0, o.lossPct), 90) / 100);
  const evMonth = (kwhWall * Math.max(0, o.centsPerKwh)) / 100;
  const gasMonth = o.mpg > 0 ? (Math.max(0, o.milesPerMonth) / o.mpg) * Math.max(0, o.gasPerGal) : 0;
  return { kwhWall, evMonth, evYear: evMonth * 12, gasMonth, gasYear: gasMonth * 12, savingYear: (gasMonth - evMonth) * 12, centsPerMile: o.milesPerMonth > 0 ? (evMonth * 100) / o.milesPerMonth : 0 };
}

export type Fuel = 'gas' | 'propane' | 'oil' | 'electric';
/** Seasonal COP of a heat pump from its HSPF2 rating (Btu of heat per watt-hour): COP = HSPF2 ÷ 3.412. */
export const copFromHspf2 = (hspf2: number, btuPerKwh: number) => (hspf2 * 1000) / btuPerKwh;

/** MMBtu of heat delivered to the home by a year of fuel use (site MMBtu × efficiency). */
export const heatDelivered = (siteMMBtu: number, efficiency: number) => Math.max(0, siteMMBtu) * Math.max(0, efficiency);

/** Annual cost of delivering a heat load with each system at the state's prices. */
export function heatingCosts(o: {
  heatMMBtu: number; afue: number; hspf2: number; btu: Btu;
  prices: { gasPerMcf: number | null; propanePerGal: number | null; oilPerGal: number | null; centsPerKwh: number };
}) {
  const H = Math.max(0, o.heatMMBtu) * 1e6;
  const eff = Math.min(Math.max(o.afue, 0.01), 1);
  const cop = copFromHspf2(o.hspf2, o.btu.kwh);
  const gasMcf = H / eff / (o.btu.gasCuFt * 1000);
  const propaneGal = H / eff / o.btu.propaneGal;
  const oilGal = H / eff / o.btu.oilGal;
  const hpKwh = H / o.btu.kwh / cop;
  const resistKwh = H / o.btu.kwh;
  const c = o.prices.centsPerKwh / 100;
  return {
    cop,
    gas: o.prices.gasPerMcf != null ? { units: gasMcf * 10.36, unit: 'therms', cost: gasMcf * o.prices.gasPerMcf } : null,
    propane: o.prices.propanePerGal != null ? { units: propaneGal, unit: 'gallons', cost: propaneGal * o.prices.propanePerGal } : null,
    oil: o.prices.oilPerGal != null ? { units: oilGal, unit: 'gallons', cost: oilGal * o.prices.oilPerGal } : null,
    heatPump: { units: hpKwh, unit: 'kWh', cost: hpKwh * c },
    resistance: { units: resistKwh, unit: 'kWh', cost: resistKwh * c },
  };
}
