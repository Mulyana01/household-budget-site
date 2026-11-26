// Dashboard: the month at a glance. Summary cards up top, then where the
// money went (donut + weekly bars), what is still to pay, and how the goals
// are doing — each panel links to the page that manages it.

import { HOUSEHOLD, INCOME } from '../data.js';
import { billsWithStatus, categoriesWithTotals, goalsWithProgress, allTransactions, totals } from '../store.js';
import { escapeHtml, money, percent, prettyDate } from '../format.js';
import { bars, colorFor, donut, progressBar } from '../charts.js';

export function renderDashboard() {
  const t = totals();
  const cats = categoriesWithTotals().filter((c) => c.spent > 0);
  const slices = cats.map((c, i) => ({ label: c.name, value: c.spent, color: colorFor(i) }));
  const legend = cats
    .map((c, i) => `<li><span class="dot" style="background:${colorFor(i)}"></span>${c.icon} ${escapeHtml(c.name)}<b>${money(c.spent)}</b></li>`)
    .join('');

  const byWeek = [0, 0, 0, 0];
  for (const tx of allTransactions()) {
    if (tx.transfer) continue;
    const day = Number(tx.date.slice(8, 10));
    byWeek[Math.min(3, Math.floor((day - 1) / 7))] += tx.amount;
  }
  const weekBars = bars(
    byWeek.map((v, i) => ({ label: `Week ${i + 1}`, value: v })),
    money,
  );

  const due = billsWithStatus().filter((b) => !b.paid);
  const dueTotal = due.reduce((s, b) => s + b.amount, 0);
  const dueList = due
    .map((b) => `<li><span>${escapeHtml(b.name)}</span><b>${money(b.amount)}</b><em>due ${b.month ? `${b.month} ` : ''}${b.dueDay}${b.month ? '' : ' Nov'}</em></li>`)
    .join('');

  const goals = goalsWithProgress()
    .map((g) => `<li><span>${g.icon} ${escapeHtml(g.name)}</span>${progressBar(g.saved / g.target)}<b>${percent(g.saved, g.target)}%</b></li>`)
    .join('');

  const recent = allTransactions()
    .slice(-5)
    .reverse()
    .map((tx) => `<li><span>${prettyDate(tx.date)}</span>${escapeHtml(tx.label)}<b>${tx.transfer ? '→ ' : ''}${money(tx.amount)}</b></li>`)
    .join('');

  const incomeRows = INCOME
    .map((i) => `<li><span>${escapeHtml(i.source)}</span><b>${money(i.amount)}</b><em>Nov ${i.day}</em></li>`)
    .join('');

  const over = categoriesWithTotals().filter((c) => c.spent > c.planned);

  return `
  <section class="hero">
    <h1>${escapeHtml(HOUSEHOLD.monthLabel)} at a glance</h1>
    <p class="lede">${escapeHtml(HOUSEHOLD.members)}. Salary is in, the plan is set, and the month is
    ${percent(t.spent, t.planned)}% spent against plan with four days to go.</p>
    <div class="cards">
      <article class="card"><h2>Income</h2><p class="big">${money(t.income)}</p><p class="sub">from ${INCOME.length} sources</p></article>
      <article class="card"><h2>Spent so far</h2><p class="big">${money(t.spent)}</p><p class="sub">of ${money(t.planned)} planned</p></article>
      <article class="card accent"><h2>Sent to goals</h2><p class="big">${money(t.toGoals)}</p><p class="sub">moved out on payday, first</p></article>
      <article class="card accent"><h2>Left in checking</h2><p class="big">${money(t.left)}</p><p class="sub">covers the bills below, then sweeps to savings</p></article>
    </div>
    ${over.length ? `<p class="alert">⚠️ Over plan: ${over.map((c) => `${escapeHtml(c.name)} by ${money(c.spent - c.planned)}`).join(', ')}. The mid-month rule applies — move money on purpose, out loud, together.</p>` : ''}
  </section>

  <section class="grid-two">
    <article class="panel">
      <h2>Where the money went</h2>
      <div class="donut-wrap">${donut(slices, 'spent', money(t.spent))}<ul class="legend">${legend}</ul></div>
      <p class="more"><a href="#/budget">See the full budget →</a></p>
    </article>
    <article class="panel">
      <h2>Spending by week</h2>
      ${weekBars}
      <p class="note">Week 1 carries the rent, so it always towers. The shape to watch is weeks 2–4 staying level.</p>
      <h3 class="subhead">Income this month</h3>
      <ul class="rows">${incomeRows}</ul>
    </article>
  </section>

  <section class="grid-two">
    <article class="panel">
      <h2>Still to pay — ${money(dueTotal)}</h2>
      <ul class="rows bills">${dueList || '<li>Nothing outstanding. 🎉</li>'}</ul>
      <p class="more"><a href="#/bills">Open bills &amp; reminders →</a></p>
    </article>
    <article class="panel">
      <h2>Savings goals</h2>
      <ul class="goal-mini">${goals}</ul>
      <p class="more"><a href="#/goals">Open savings goals →</a></p>
    </article>
  </section>

  <section class="panel">
    <h2>Latest activity</h2>
    <ul class="rows">${recent}</ul>
    <p class="more"><a href="#/transactions">See every transaction →</a></p>
  </section>`;
}
