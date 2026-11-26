// Guide: the written half of the site — the monthly routine, the reasoning
// behind the categories, and the handful of rules that keep this household's
// budget boring in the best way. Plain content, no controls to break.

import { HOUSEHOLD, ROUTINE } from '../data.js';
import { escapeHtml } from '../format.js';

export function renderGuide() {
  const steps = ROUTINE
    .map((r) => `<li><b>${escapeHtml(r.when)}.</b> ${escapeHtml(r.text)}</li>`)
    .join('');

  return `
  <section class="hero">
    <h1>How this household budgets</h1>
    <p class="lede">${escapeHtml(HOUSEHOLD.name)} — ${escapeHtml(HOUSEHOLD.members.toLowerCase())} — keeps one rule
    above all others: the budget is a plan we adjust together, never a report card. Here is the whole system,
    which fits on this page and takes about ten minutes a week.</p>
  </section>

  <section class="panel">
    <h2>The monthly routine</h2>
    <ol class="routine">${steps}</ol>
    <p class="note">${escapeHtml(HOUSEHOLD.paydayNote)} Everything on the
    <a href="#/bills">Bills page</a> is timed around those two dates.</p>
  </section>

  <section class="panel">
    <h2>Five rules that do the heavy lifting</h2>
    <ol class="routine">
      <li><b>Pay the goals first.</b> Savings leave on payday, like a bill. Money that waits until the end of the month to be saved is money that gets spent.</li>
      <li><b>One bills account.</b> Every fixed cost leaves from a single account that is funded first. If that account is healthy, the month cannot go truly wrong.</li>
      <li><b>Categories match the shops, not the textbook.</b> Groceries are one category because there is one weekly shop; dining out is separate because it is the lever we actually pull.</li>
      <li><b>Over is information, not failure.</b> A category over plan means the plan was wrong or the month was unusual. Move money from an under-spent category, note why, adjust next month.</li>
      <li><b>Big bills get sinking funds.</b> Anything that arrives on a schedule — insurance, school year start, December — is saved for monthly, so it lands as a non-event.</li>
    </ol>
  </section>

  <section class="panel">
    <h2>Questions we get asked</h2>
    <h3 class="subhead">Why does the plan not add up to the income?</h3>
    <p>On purpose. The plan spends most of the income, sends a fixed transfer to the
    <a href="#/goals">goals</a>, and leaves a cushion unassigned. The cushion absorbs the month's surprises;
    whatever survives to the last day is swept into the emergency fund.</p>
    <h3 class="subhead">What happens in an expensive month?</h3>
    <p>The order is fixed: bills and needs are untouchable, wants shrink first, goal contributions shrink
    second, and the emergency fund is the last resort — that is what it is for. December runs this way
    every year, planned in the <a href="#/tools">sinking-fund planner</a>.</p>
    <h3 class="subhead">How do the two of us stay in sync?</h3>
    <p>One shared list — this site. Either of us can add a transaction or mark a bill paid, and the Sunday
    ten minutes is where disagreements get sorted while they are still small.</p>
    <h3 class="subhead">Where do I start with my own household?</h3>
    <p>Track one month without changing anything, then set planned amounts from what you saw — not from
    what you wish were true. The <a href="#/tools">50/30/20 splitter</a> gives a first shape; your own
    numbers give the honest one.</p>
  </section>`;
}
