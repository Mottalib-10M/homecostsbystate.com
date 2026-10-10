/** Residential solar: size, panel count, price range and simple payback (pure functions). */

/** kW of panels needed to produce a yearly consumption, at the state's kWh per kW per year (PVWatts). */
export const systemKw = (annualKwh: number, kwhPerKw: number) => (kwhPerKw > 0 ? Math.max(0, annualKwh) / kwhPerKw : 0);
/** Panel count for a system size and a panel rating in watts. */
export const panels = (kw: number, panelWatts: number) => (panelWatts > 0 && kw > 0 ? Math.ceil((kw * 1000) / panelWatts) : 0);

/**
 * Price range before incentives. Low = median competitive quote in the state (EnergySage marketplace,
 * second half of 2025, published by NLR); high = the same quote scaled by the gap New York measured in
 * 2025 between reported installed prices and quotes (NYSERDA median ÷ EnergySage NY median).
 */
export function price(kw: number, quotePerW: number, reportedToQuote: number) {
  const low = kw * 1000 * quotePerW;
  return { low, high: low * reportedToQuote, perWLow: quotePerW, perWHigh: quotePerW * reportedToQuote };
}

/** Simple payback: cost ÷ yearly bill saving, no degradation, no rate change, no financing cost. */
export function payback(o: { cost: number; kw: number; kwhPerKw: number; centsPerKwh: number; exportShare: number; exportCents: number }) {
  const kwh = Math.max(0, o.kw) * Math.max(0, o.kwhPerKw);
  const share = Math.min(Math.max(o.exportShare, 0), 100) / 100;
  const saving = (kwh * (1 - share) * o.centsPerKwh + kwh * share * o.exportCents) / 100;
  return { kwh, saving, years: saving > 0 ? o.cost / saving : Infinity };
}
