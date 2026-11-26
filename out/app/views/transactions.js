// Transactions: the month's ledger. Filter by category, add a spend (or the
// savings transfer) with the form, or remove a row — the Budget and
// Dashboard totals are summed from this list, so they update everywhere.

import { CATEGORIES } from '../data.js';
import { addTransaction, allTransactions, removeTransaction } from '../store.js';
import { escapeHtml, money, prettyDate } from '../format.js';

let filter = 'all';

export function renderTransactions(app) {
  const all = allTransactions();
  const shown = filter === 'all' ? all : all.filter((t) => t.category === filter);
  const shownTotal = shown.filter((t) => !t.transfer).reduce((s, t) => s + t.amount, 0);

  const options = CATEGORIES
    .map((c) => `<option value="${c.id}" ${filter === c.id ? 'selected' : ''}>${c.icon} ${escapeHtml(c.name)}</option>`)
    .join('');

  const rows = shown
    .slice()
    .reverse()
    .map((t) => {
      const cat = CATEGORIES.find((c) => c.id === t.category);
      const name = t.transfer ? 'Savings transfer' : cat ? `${cat.icon} ${cat.name}` : t.category;
      return `<tr>
        <td>${prettyDate(t.date)}</td>
        <td>${escapeHtml(t.label)}</td>
        <td>${name}</td>
        <td class="num">${t.transfer ? '→ ' : ''}${money(t.amount)}</td>
        <td><button type="button" class="small danger" data-remove="${t.id}">Remove</button></td>
      </tr>`;
    })
    .join('');

  app.innerHTML = `
  <section class="hero">
    <h1>Transactions — November 2026</h1>
    <p class="lede">${all.length} entries this month. Everything on the Dashboard and Budget pages is summed
    from this list, so what you add or remove here shows up there immediately.</p>
  </section>

  <section class="panel">
    <form id="tx-form" class="tx-form">
      <label>Date <input type="date" name="date" value="2026-11-26" min="2026-11-01" max="2026-11-30" required></label>
      <label>What for <input type="text" name="label" placeholder="e.g. Market stall vegetables" required maxlength="60"></label>
      <label>Category
        <select name="category">${CATEGORIES.map((c) => `<option value="${c.id}">${c.icon} ${escapeHtml(c.name)}</option>`).join('')}</select>
      </label>
      <label>Amount ($) <input type="number" name="amount" min="1" step="1" placeholder="25" required></label>
      <button type="submit">Add transaction</button>
    </form>
  </section>

  <section class="panel">
    <div class="row-head">
      <h2>${filter === 'all' ? 'Every transaction' : 'Filtered list'}</h2>
      <label class="filter">Show
        <select id="tx-filter">
          <option value="all" ${filter === 'all' ? 'selected' : ''}>All categories</option>
          ${options}
        </select>
      </label>
    </div>
    <table class="tx-table">
      <thead><tr><th>Date</th><th>Description</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>
      <tbody>${rows || '<tr><td colspan="5">Nothing in this category yet this month.</td></tr>'}</tbody>
      <tfoot><tr><td colspan="3">Total shown (spending only)</td><td class="num">${money(shownTotal)}</td><td></td></tr></tfoot>
    </table>
  </section>`;

  app.querySelector('#tx-filter').addEventListener('change', (e) => {
    filter = e.target.value;
    renderTransactions(app);
  });

  app.querySelector('#tx-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    addTransaction({
      date: fd.get('date'),
      label: fd.get('label'),
      category: fd.get('category'),
      amount: fd.get('amount'),
    });
    renderTransactions(app);
  });

  app.querySelectorAll('[data-remove]').forEach((btn) => {
    btn.addEventListener('click', () => {
      removeTransaction(btn.dataset.remove);
      renderTransactions(app);
    });
  });
}
