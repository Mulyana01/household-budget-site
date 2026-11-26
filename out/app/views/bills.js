// Bills & reminders: every recurring payment, what already went out this
// month and what is still coming. Marking a bill paid moves it between the
// two lists and updates both totals — and the Dashboard's "still to pay".

import { billsWithStatus, toggleBill, totals } from '../store.js';
import { escapeHtml, money } from '../format.js';

function ordinal(day) {
  if (day >= 11 && day <= 13) return `${day}th`;
  return `${day}${{ 1: 'st', 2: 'nd', 3: 'rd' }[day % 10] ?? 'th'}`;
}

export function renderBills(app) {
  const bills = billsWithStatus();
  const t = totals();
  const paid = bills.filter((b) => b.paid);
  const due = bills.filter((b) => !b.paid);
  const paidTotal = paid.reduce((s, b) => s + b.amount, 0);
  const dueTotal = due.reduce((s, b) => s + b.amount, 0);

  const card = (b) => `
    <article class="bill ${b.paid ? 'is-paid' : ''}">
      <div class="bill-main">
        <h3>${escapeHtml(b.name)}</h3>
        <p class="bill-meta">${b.month ? `${b.month} · due the ${ordinal(b.dueDay)}` : `Due the ${ordinal(b.dueDay)}`} · ${b.autopay ? 'autopay' : 'pay by hand'}${b.paid ? ` · paid ${b.month ? '' : `Nov ${b.paidDay}`}` : ''}</p>
        <p class="note">${escapeHtml(b.note)}</p>
      </div>
      <div class="bill-side">
        <p class="bill-amount">${money(b.amount)}</p>
        <button type="button" data-toggle-bill="${b.id}">${b.paid ? 'Mark unpaid' : 'Mark paid'}</button>
      </div>
    </article>`;

  app.innerHTML = `
  <section class="hero">
    <h1>Bills &amp; reminders</h1>
    <p class="lede">The fixed costs, all in one place. Autopay handles most of them; the two paid by hand
    are the ones this page exists to never forget.</p>
    <div class="cards two">
      <article class="card"><h2>Paid this month</h2><p class="big">${money(paidTotal)}</p><p class="sub">${paid.length} bills settled</p></article>
      <article class="card accent"><h2>Still to come</h2><p class="big">${money(dueTotal)}</p><p class="sub">${due.length} bills outstanding — the checking cushion is ${money(t.left)}</p></article>
    </div>
  </section>

  <section class="panel">
    <h2>Still to pay</h2>
    ${due.length ? due.map(card).join('') : '<p>Nothing outstanding. 🎉</p>'}
  </section>

  <section class="panel">
    <h2>Paid in November</h2>
    ${paid.map(card).join('')}
  </section>

  <section class="panel">
    <h2>How the bills never bite</h2>
    <p>Rent, power, water, internet and phones all leave from one bills account that the salary tops up
    on the 1st, before anything else moves. Quarterly costs — like the $396 car insurance premium due in
    December — get a <a href="#/goals">sinking fund</a> that collects a third each month, so a big bill
    arrives already paid for. The only two bills paid by hand are the power estimate and the insurance
    premium itself, and both sit above with their dates in plain sight.</p>
  </section>`;

  app.querySelectorAll('[data-toggle-bill]').forEach((btn) => {
    btn.addEventListener('click', () => {
      toggleBill(btn.dataset.toggleBill);
      renderBills(app);
    });
  });
}
