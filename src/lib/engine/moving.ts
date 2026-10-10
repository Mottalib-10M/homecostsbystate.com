/**
 * Local move priced by the hour: crew × hours × billed rate per mover-hour + travel time.
 * Billed rate = state mean hourly wage of hand movers (BLS OEWS 53-7062) × revenue earned per dollar of
 * payroll by household moving companies (Economic Census 2022, NAICS 484210). Low/high use the 25th and
 * 75th percentile wages.
 */
export function localMove(o: { movers: number; hours: number; travelHours: number; wage: { p25: number; mean: number; p75: number }; revenuePerPayroll: number }) {
  const h = Math.max(0, o.hours) + Math.max(0, o.travelHours);
  const crewHours = Math.max(0, o.movers) * h;
  const rate = (w: number) => w * o.revenuePerPayroll;
  return { crewHours, ratePerMoverHour: rate(o.wage.mean), low: crewHours * rate(o.wage.p25), typical: crewHours * rate(o.wage.mean), high: crewHours * rate(o.wage.p75) };
}
