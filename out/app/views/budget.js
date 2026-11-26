// Budget: the plan for the month, category by category. Planned amounts are
// editable right in the table (change a number, press Set) and every total
// on the site follows. The 50/30/20 strip compares the plan with the rule of
// thumb the Guide page explains.

import { categoriesWithTotals, setPlanned, splitByKind, totals } from '../store.js';
import { escapeHtml, money, percent } from '../format.js';
import { progressBar } from '../charts.js';

export function renderBudget(app) {
  const cats = categoriesWithTotals();
  const t = totals();
  const split = splitByKind();
  const t5020 = {
    needs: Math.round(t.income * 0.5),
    wants: Math.round(t.income * 0.3),
    save: Math.round(t.income * 0.2),
  };

  const rows = cats
    .map((c) => {
      const left = c.planned - c.spent;
      const tone = c.spent > c.planned ? 'over' : left < c.planned * 0.15 ? 'tight' : '';
      return `<tr>
        <td class="cat">${c.icon} ${escapeHtml(c.name)}<span class="kind">${c.kind}</span></td>
        <td class="num">${money(c.spent)}</td>
        <td class="num plan-cell">
          <input type="number" min="0" step="10" value="${c.planned}" data-plan="${c.id}" aria-label="Planned amount for ${escapeHtml(c.name)}">
        </td>
        <td class="num ${left < 0 ? 'neg' : ''}">${left < 0 ? `${money(-left)} over` : `${money(left)} left`}</td>
        <td class="bar-cell">${progressBar(c.planned ? c.spent / c.planned : 0, tone)}<span class="pct">${percent(c.spent, c.planned)}%</span></td>
      </tr>`;
    })
    .join('');

  app.innerHTML = `
  <section class="hero">
    <h1>The November plan</h1>
    <p class="lede">Every category has a plan, and the plan is allowed to change — out loud, on purpose.
    Edit any planned amount and the totals, the dashboard and the 50/30/20 strip all follow.</p>
  </section>

  <section class="panel">
    <h2>50 / 30 / 20 check</h2>
    <p class="note">The rule of thumb: about 50% of income on needs, 30% on wants, 20% to savings.
    Here is this household against it, using planned amounts:</p>
    <div class="split-strip">
      <div class="split needs" style="flex:${split.needsPlanned}"><b>Needs ${percent(split.needsPlanned, t.income)}%</b><span>${money(split.needsPlanned)} planned · guide ${money(t5020.needs)}</span></div>
      <div class="split wants" style="flex:${split.wantsPlanned}"><b>Wants ${percent(split.wantsPlanned, t.income)}%</b><span>${money(split.wantsPlanned)} planned · guide ${money(t5020.wants)}</span></div>
      <div class="split save" style="flex:${t.toGoals + Math.max(0, t.left)}"><b>Savings ${percent(t.toGoals + Math.max(0, t.left), t.income)}%</b><span>${money(t.toGoals)} to goals + ${money(Math.max(0, t.left))} left over · guide ${money(t5020.save)}</span></div>
    </div>
    <p class="note">Rent in this city pushes needs above 50%, so wants sit well under 30% to balance it. The rule is a compass, not a judge.</p>
  </section>

  <section class="panel">
    <table class="budget-table">
      <thead><tr><th>Category</th><th class="num">Spent</th><th class="num">Planned (editable)</th><th class="num">Remaining</th><th>Progress</th></tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr>
        <td>Total</td>
        <td class="num">${money(t.spent)}</td>
        <td class="num">${money(t.planned)}</td>
        <td class="num">${money(t.planned - t.spent)} left</td>
        <td>${progressBar(t.spent / t.planned)}<span class="pct">${percent(t.spent, t.planned)}%</span></td>
      </tr></tfoot>
    </table>
    <p class="note">Income is ${money(t.income)}; the plan spends ${money(t.planned)}, sends ${money(t.toGoals)} to goals,
    and keeps ${money(t.left)} as the month's cushion. <a href="#/tools">Try the 50/30/20 calculator with your own income →</a></p>
  </section>`;

  app.querySelectorAll('input[data-plan]').forEach((input) => {
    input.addEventListener('change', () => {
      setPlanned(input.dataset.plan, input.value);
      renderBudget(app);
    });
  });
}
