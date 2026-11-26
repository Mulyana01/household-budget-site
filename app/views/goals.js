// Savings goals: one card per goal with its progress, the monthly amount
// that keeps it on track, and a working "add a contribution" form — chip in
// a bonus or a swept-up leftover and the bar, the remaining amount and the
// finish date all move.

import { contribute, goalsWithProgress } from '../store.js';
import { escapeHtml, money, percent } from '../format.js';
import { progressBar } from '../charts.js';

function monthsLeft(goal) {
  if (goal.remaining <= 0) return 0;
  return Math.ceil(goal.remaining / goal.monthly);
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function finishLabel(goal) {
  const n = monthsLeft(goal);
  if (n === 0) return 'Fully funded 🎉';
  const idx = (10 + n) % 12; // November is month index 10; n months from now
  const year = 2026 + Math.floor((10 + n) / 12);
  return `On track for ${MONTH_NAMES[idx]} ${year} at ${money(goal.monthly)}/month`;
}

export function renderGoals(app) {
  const goals = goalsWithProgress();
  const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const totalMonthly = goals.reduce((s, g) => s + g.monthly, 0);

  const cards = goals
    .map((g) => `
    <article class="goal-card">
      <header><h3>${g.icon} ${escapeHtml(g.name)}</h3><span class="goal-pct">${percent(g.saved, g.target)}%</span></header>
      ${progressBar(g.saved / g.target)}
      <p class="goal-figures"><b>${money(g.saved)}</b> of ${money(g.target)} · ${money(g.remaining)} to go</p>
      <p class="note">${escapeHtml(g.note)}</p>
      <p class="goal-finish">${finishLabel(g)}</p>
      <form class="goal-form" data-goal="${g.id}">
        <label>Add $ <input type="number" name="amount" min="1" step="1" placeholder="25" required></label>
        <button type="submit">Contribute</button>
      </form>
    </article>`)
    .join('');

  app.innerHTML = `
  <section class="hero">
    <h1>Savings goals</h1>
    <p class="lede">${money(totalSaved)} saved toward ${money(totalTarget)} of goals, fed by ${money(totalMonthly)}
    a month of planned contributions inside the payday transfer. Extra contributions — a bonus, a sold bike,
    the month-end sweep — go in with the little forms on each card.</p>
  </section>
  <section class="goal-grid">${cards}</section>
  <section class="panel">
    <h2>The order matters</h2>
    <p>The emergency fund fills first: while it is below six months of essentials, half of every extra
    contribution goes there before any other goal sees a cent. The holiday and the laptop are deliberately
    slower — they are wants with dates, and the dates were chosen to fit the monthly amounts, not the
    other way round. The insurance sinking fund is the quiet hero: $132 a month turns a $396 December
    bill into a non-event.</p>
  </section>`;

  app.querySelectorAll('.goal-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      contribute(form.dataset.goal, new FormData(form).get('amount'));
      renderGoals(app);
    });
  });
}
