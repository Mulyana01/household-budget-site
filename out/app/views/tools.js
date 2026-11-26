// Tools: three working calculators the household actually uses.
//  1. The 50/30/20 splitter — type an income, see the guide split, and how
//     this household's own plan compares.
//  2. The emergency-fund builder — months of essential spending → a target,
//     set against what the fund already holds.
//  3. The sinking-fund planner — a future bill, a date, and the monthly
//     amount that makes it boring.

import { goalsWithProgress, splitByKind, totals } from '../store.js';
import { money, moneyExact, percent } from '../format.js';

export function renderTools(app) {
  const t = totals();
  const split = splitByKind();
  const emergency = goalsWithProgress().find((g) => g.id === 'emergency');
  const essentials = split.needsPlanned; // a month of needs = a month of essentials

  app.innerHTML = `
  <section class="hero">
    <h1>Budget tools</h1>
    <p class="lede">Three small calculators, no sign-up and no spreadsheet. Every number starts from this
    household's real figures — change them and watch the answers move.</p>
  </section>

  <section class="panel tool">
    <h2>1 · The 50/30/20 splitter</h2>
    <p class="note">Enter a monthly take-home income. The classic split is 50% needs, 30% wants, 20% savings.</p>
    <label class="tool-input">Monthly income $ <input type="number" id="t5020-income" value="${t.income}" min="0" step="10"></label>
    <div class="tool-out" id="t5020-out"></div>
  </section>

  <section class="panel tool">
    <h2>2 · Emergency-fund builder</h2>
    <p class="note">An emergency fund is months of <em>essential</em> spending — this household's needs plan is
    ${money(essentials)} a month. Slide to choose how many months feel safe.</p>
    <label class="tool-input">Months of cover: <b id="ef-months-label">6</b>
      <input type="range" id="ef-months" min="1" max="12" step="1" value="6">
    </label>
    <div class="tool-out" id="ef-out"></div>
  </section>

  <section class="panel tool">
    <h2>3 · Sinking-fund planner</h2>
    <p class="note">A big, predictable bill is only a shock if nobody saved for it. Name the cost and the
    months until it lands; this is the monthly amount that makes it boring.</p>
    <div class="tool-row">
      <label class="tool-input">The bill $ <input type="number" id="sf-amount" value="396" min="0" step="1"></label>
      <label class="tool-input">Months to save <input type="number" id="sf-months" value="3" min="1" max="60" step="1"></label>
    </div>
    <div class="tool-out" id="sf-out"></div>
    <table class="mini-table">
      <thead><tr><th>Common sinking funds here</th><th class="num">Cost</th><th class="num">Monthly</th></tr></thead>
      <tbody>
        <tr><td>Car insurance (quarterly)</td><td class="num">$396</td><td class="num">$132</td></tr>
        <tr><td>Car service &amp; tyres (yearly)</td><td class="num">$600</td><td class="num">$50</td></tr>
        <tr><td>Birthdays &amp; December gifts</td><td class="num">$480</td><td class="num">$40</td></tr>
        <tr><td>School year start (uniforms, fees)</td><td class="num">$540</td><td class="num">$45</td></tr>
      </tbody>
    </table>
  </section>`;

  const splitOut = () => {
    const income = Number(app.querySelector('#t5020-income').value) || 0;
    const needs = income * 0.5, wants = income * 0.3, save = income * 0.2;
    app.querySelector('#t5020-out').innerHTML = `
      <div class="split-strip">
        <div class="split needs" style="flex:50"><b>Needs 50%</b><span>${moneyExact(needs)}</span></div>
        <div class="split wants" style="flex:30"><b>Wants 30%</b><span>${moneyExact(wants)}</span></div>
        <div class="split save" style="flex:20"><b>Savings 20%</b><span>${moneyExact(save)}</span></div>
      </div>
      <p class="note">This household, on ${money(t.income)}: needs are planned at ${money(split.needsPlanned)}
      (${percent(split.needsPlanned, t.income)}% — rent runs hot), wants at ${money(split.wantsPlanned)}
      (${percent(split.wantsPlanned, t.income)}%), and savings take the rest. <a href="#/budget">See the plan →</a></p>`;
  };

  const efOut = () => {
    const months = Number(app.querySelector('#ef-months').value);
    app.querySelector('#ef-months-label').textContent = months;
    const target = essentials * months;
    const have = emergency.saved;
    const gap = Math.max(0, target - have);
    const monthsToGo = gap > 0 ? Math.ceil(gap / emergency.monthly) : 0;
    app.querySelector('#ef-out').innerHTML = `
      <p class="tool-big">Target: ${money(target)}</p>
      <p class="note">The fund holds ${money(have)} today, so the gap is ${money(gap)}.
      At ${money(emergency.monthly)} a month that closes in about ${monthsToGo} month${monthsToGo === 1 ? '' : 's'}.
      Financial advisers usually suggest 3–6 months; a two-income household with stable jobs can aim at the lower end.</p>`;
  };

  const sfOut = () => {
    const amount = Number(app.querySelector('#sf-amount').value) || 0;
    const months = Math.max(1, Number(app.querySelector('#sf-months').value) || 1);
    app.querySelector('#sf-out').innerHTML = `
      <p class="tool-big">Set aside ${moneyExact(amount / months)} a month</p>
      <p class="note">Starting this month, that reaches ${money(amount)} in ${months} month${months === 1 ? '' : 's'} — with a little
      breathing room if you round up to ${money(Math.ceil(amount / months / 5) * 5)}.</p>`;
  };

  app.querySelector('#t5020-income').addEventListener('input', splitOut);
  app.querySelector('#ef-months').addEventListener('input', efOut);
  app.querySelector('#sf-amount').addEventListener('input', sfOut);
  app.querySelector('#sf-months').addEventListener('input', sfOut);
  splitOut();
  efOut();
  sfOut();
}
