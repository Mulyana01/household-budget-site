// HearthLedger's state: the seed data from data.js plus whatever the family
// changes while using the site — extra transactions, edited plan amounts,
// bills marked paid, goal contributions. Changes persist in localStorage so
// the site behaves like the household's real notebook; a "reset" in the
// footer wipes them back to the printed November figures.

import { BILLS, CATEGORIES, GOALS, INCOME, TRANSACTIONS } from './data.js';

const KEY = 'hearthledger-v1';

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? {};
  } catch {
    return {};
  }
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Private mode or a full disk: the site still works for this visit.
  }
}

const state = load();
state.addedTransactions ??= [];
state.removedIds ??= [];
state.planned ??= {};
state.paidBillIds ??= [];
state.unpaidBillIds ??= [];
state.goalBoost ??= {};

export function resetAll() {
  localStorage.removeItem(KEY);
  location.reload();
}

// --- transactions -----------------------------------------------------------

export function allTransactions() {
  const seeded = TRANSACTIONS.map((t, i) => ({ ...t, id: `seed-${i}` }));
  return [...seeded, ...state.addedTransactions]
    .filter((t) => !state.removedIds.includes(t.id))
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

export function addTransaction({ date, label, category, amount }) {
  state.addedTransactions.push({
    id: `added-${Date.now()}`,
    date, label, category, amount: Number(amount),
  });
  save();
}

export function removeTransaction(id) {
  if (id.startsWith('added-')) {
    state.addedTransactions = state.addedTransactions.filter((t) => t.id !== id);
  } else {
    state.removedIds.push(id);
  }
  save();
}

// --- derived totals ---------------------------------------------------------

export function spentByCategory() {
  const totals = {};
  for (const t of allTransactions()) {
    if (t.transfer) continue; // the savings transfer is not "spending"
    totals[t.category] = (totals[t.category] ?? 0) + t.amount;
  }
  return totals;
}

export function categoriesWithTotals() {
  const spent = spentByCategory();
  return CATEGORIES.map((c) => ({
    ...c,
    planned: state.planned[c.id] ?? c.planned,
    spent: spent[c.id] ?? 0,
  }));
}

export function setPlanned(categoryId, amount) {
  state.planned[categoryId] = Math.max(0, Math.round(Number(amount) || 0));
  save();
}

export function totals() {
  const cats = categoriesWithTotals();
  const income = INCOME.reduce((s, i) => s + i.amount, 0);
  const spent = cats.reduce((s, c) => s + c.spent, 0);
  const planned = cats.reduce((s, c) => s + c.planned, 0);
  const toGoals = allTransactions()
    .filter((t) => t.transfer)
    .reduce((s, t) => s + t.amount, 0);
  return { income, spent, planned, toGoals, left: income - spent - toGoals };
}

export function splitByKind() {
  const cats = categoriesWithTotals();
  const needs = cats.filter((c) => c.kind === 'needs');
  const wants = cats.filter((c) => c.kind === 'wants');
  const sum = (list, key) => list.reduce((s, c) => s + c[key], 0);
  return {
    needsSpent: sum(needs, 'spent'), needsPlanned: sum(needs, 'planned'),
    wantsSpent: sum(wants, 'spent'), wantsPlanned: sum(wants, 'planned'),
  };
}

// --- bills ------------------------------------------------------------------

export function billsWithStatus() {
  return BILLS.map((b) => {
    let paid = b.paidDay != null;
    if (state.paidBillIds.includes(b.id)) paid = true;
    if (state.unpaidBillIds.includes(b.id)) paid = false;
    return { ...b, paid };
  });
}

export function toggleBill(id) {
  const bill = billsWithStatus().find((b) => b.id === id);
  if (!bill) return;
  if (bill.paid) {
    state.unpaidBillIds.push(id);
    state.paidBillIds = state.paidBillIds.filter((x) => x !== id);
  } else {
    state.paidBillIds.push(id);
    state.unpaidBillIds = state.unpaidBillIds.filter((x) => x !== id);
  }
  save();
}

// --- goals ------------------------------------------------------------------

export function goalsWithProgress() {
  return GOALS.map((g) => {
    const saved = g.saved + (state.goalBoost[g.id] ?? 0);
    return { ...g, saved, remaining: Math.max(0, g.target - saved) };
  });
}

export function contribute(goalId, amount) {
  const n = Math.max(0, Number(amount) || 0);
  state.goalBoost[goalId] = (state.goalBoost[goalId] ?? 0) + n;
  save();
}
