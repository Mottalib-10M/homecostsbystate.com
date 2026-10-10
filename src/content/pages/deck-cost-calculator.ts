import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const r = K.job('deckPatio');
const a = K.ahs('deckPatio');
const sh = K.shares('deckPatio');
const cw = K.natWage('carpenters');
const M = K.P.materials;
const cpiMonth = K.month(K.ahsMeta.cpi.to);
const joists = (widthFt: number) => Math.ceil((widthFt * 12) / 16) + 1;
const ranked = K.states.map((s) => ({ s, r: K.job('deckPatio', s.slug) })).sort((x, y) => x.r.typical - y.r.typical);

export default definePage({
  id: 'deck-cost-calculator',
  group: 'costs',
  order: 60,
  slug: 'deck-cost-calculator',
  nav: 'Deck cost calculator',
  card: 'Price of a deck, porch or patio job by state, plus joists',
  title: 'Deck Cost Calculator 2026: Price by State, Joists and Span',
  description: `Deck cost calculator 2026: ${K.usd(r.typical)} typical for a professional deck, porch or patio job, ${K.usd(r.low)} to ${K.usd(r.high)} for most, by state, with joist count and span.`,
  h1: 'Deck cost calculator',
  intro: 'The price owners paid for decks, porches and patios in your state, with a joist count and span check for your size.',
  resume: `Adding a deck, porch, patio or terrace through a professional cost ${K.usd(r.typical)} at the national median, with half of the jobs between ${K.usd(r.low)} and ${K.usd(r.high)}, according to the ${K.num(a.pro.n)} such projects reported in the 2023 American Housing Survey and converted to ${cpiMonth} dollars. The range is wide because the survey groups a small ground-level patio with a raised two-level deck, and it records neither size nor material. The calculator keeps that honest range as the price, then adds the framing check that matters for a wood deck: how many joists your width needs at 16 inches on center, and whether your depth fits the maximum span the American Wood Council publishes for Southern pine 2x8 (${M.deckJoistSpanSP16['2x8']}) and 2x10 (${M.deckJoistSpanSP16['2x10']}) joists. Owners who built their own reported a median of ${K.usd(a.diy!.median)}.`,
  tool: 'deck',
  body: (h) => `
<h2>What the survey price covers</h2>
<p>The ${h.src('census_ahs', 'American Housing Survey')} category is "added porch, deck, patio or terrace". A $3,000 concrete patio and a $30,000 composite deck with stairs and railings both sit in it, which is why the middle half of the prices spans ${h.usd(r.high - r.low)}. Use the typical figure as the price of an ordinary project and the high end as a realistic budget for a raised wood deck of some size. The calculator moves the labor share with the wage of carpenters in your state; BLS measured a national mean of ${h.usd(cw.mean, 2)} an hour for carpenters in ${h.wageRef.reference}.</p>
<p>Framing contractors, the closest industry in the ${h.src('census_ec', '2022 Economic Census')}, spent ${h.pct(sh.materials)} of the value of their work on materials, ${h.pct(sh.payroll + sh.benefits)} on payroll and benefits, and ${h.pct(sh.subcontracted)} on subcontracted work. Lumber price swings therefore show up in deck quotes faster than in roof or HVAC quotes.</p>
<h2>Joists and spans for a wood deck</h2>
<p>The ${h.src('awc_dca6', 'American Wood Council DCA 6')} prescriptive guide is the reference most building departments accept for simple decks. For Southern pine joists at 16 inches on center, it allows a span of up to ${M.deckJoistSpanSP16['2x8']} for 2x8s and ${M.deckJoistSpanSP16['2x10']} for 2x10s, with joists spaced at 12, 16 or 24 inches and overhangs limited to a quarter of the span. Footings must reach at least ${h.num(M.deckFootingMinBelowGradeIn)} inches below grade or below the frost line, whichever is deeper. The ${h.src('sfpa_deck', 'Southern Forest Products Association')} adds that 5/4 decking boards and 2x6s can span up to 24 inches, with 16 inches recommended for 5/4 boards.</p>
${h.table(['Deck width along the house', 'Joists at 16 in on center'], [8, 10, 12, 16, 20, 24].map((w) => [`${w} ft`, h.num(joists(w))]), 'One joist every 16 inches plus the last one at the end; rim joists and blocking come on top.', ['l', 'r'])}
<p>Other species (hem-fir, Douglas fir, spruce-pine-fir) have shorter allowable spans in the same tables, and a ledger board attached to the house has its own fastening rules. A permit drawing usually asks for exactly these items: joist size and spacing, beam size, post and footing sizes, ledger attachment and guard height.</p>
<h3>Wood, composite or concrete</h3>
<p>The survey cannot tell materials apart, so treat comparisons with care. Pressure-treated pine framing is common under both wood and composite decking; the decking and railing choice moves the price most. A ground-level concrete or paver patio avoids the framing altogether, and the ${h.a('concrete-calculator', 'concrete calculator')} gives the yards or bags for a slab.</p>
<h2>Comparing deck quotes</h2>
<p>Get the deck area, height above grade, framing lumber species and size, decking and railing products, stair count, footing count and depth, and whether the permit and drawings are included. With state estimates ranging from ${h.usd(ranked[0].r.typical)} in ${ranked[0].s.name} to ${h.usd(ranked[ranked.length - 1].r.typical)} in ${ranked[ranked.length - 1].s.name} for the typical project, a quote outside the range for your state deserves a line-by-line conversation.</p>
<p>Timing changes the bill too. Deck builders are busiest from spring to early summer, and a project booked for late fall or winter, where the ground allows footings to be poured, may find more open calendars. Material choices made late, such as switching from pressure-treated to composite decking after the quote, are the most common reason a final invoice drifts away from the estimate, so settle the products before signing.</p>`,
  faqs: [
    { q: 'How much does a deck cost to build in 2026?', a: `Professional deck, porch and patio projects had a median of ${K.usd(r.typical)} in the 2023 American Housing Survey, in ${cpiMonth} dollars, with half between ${K.usd(r.low)} and ${K.usd(r.high)}. The survey mixes small patios with large raised decks, so a sizable composite deck with railings and stairs often lands near or above the upper end.` },
    { q: 'How far can a 2x8 deck joist span?', a: `The American Wood Council's DCA 6 guide allows Southern pine 2x8 joists at 16 inches on center to span up to ${M.deckJoistSpanSP16['2x8']}, and 2x10s up to ${M.deckJoistSpanSP16['2x10']}. Other species span less. The overhang past the beam is limited to one quarter of the joist span, and your building department may require its own tables.` },
    { q: 'How many joists does a 12 foot wide deck need?', a: `At 16 inches on center, a 12-foot width takes ${K.num(joists(12))} joists: 144 inches divided by 16 gives nine spaces, so ten joists including both ends. Rim joists, blocking and any doubled joists under stairs or a hot tub are extra. At 12 inches on center the count rises, which some composite decking makers require.` },
    { q: 'Do I need a permit to build a deck?', a: `Most building departments require one for a deck attached to the house or raised above a set height, and they commonly accept the American Wood Council's DCA 6 prescriptive guide as the basis of the drawings. Rules differ by city and county, so call your building department before buying lumber; a permit is cheaper than tearing out a failed inspection.` },
  ],
  related: ['fence-cost-calculator', 'concrete-calculator', 'square-footage-calculator', 'roof-replacement-cost'],
  sources: ['census_ahs', 'bls_oews', 'census_ec', 'awc_dca6', 'sfpa_deck', 'bls_cpi'],
});
