// HearthLedger seed data: the Hartley household's November 2026 budget.
//
// Everything the site shows is derived from these tables, so the figures
// always agree with each other: a category's "spent" total is the sum of its
// transactions, the dashboard's totals are sums over the categories, and the
// tools read the same numbers. Amounts are whole US dollars.

export const HOUSEHOLD = {
  name: 'The Hartley Household',
  members: 'Two adults, two kids, one very patient cat',
  monthLabel: 'November 2026',
  monthShort: 'Nov 2026',
  paydayNote: 'Salary lands on the 1st, freelance invoices around the 15th.',
};

// Money coming in this month, by source.
export const INCOME = [
  { source: 'Salary — Alex (school district)', amount: 3900, day: 1 },
  { source: 'Freelance design — Sam', amount: 950, day: 15 },
  { source: 'Bank interest & cashback', amount: 40, day: 20 },
];

// Budget categories. `kind` is the 50/30/20 bucket the category belongs to:
// needs (must pay), wants (nice to have). Savings are tracked on the Goals
// page instead of as a category, so they never get "spent" by accident.
export const CATEGORIES = [
  { id: 'housing',   name: 'Housing',            icon: '🏠', kind: 'needs', planned: 1450 },
  { id: 'utilities', name: 'Utilities & bills',  icon: '💡', kind: 'needs', planned: 280 },
  { id: 'groceries', name: 'Groceries',          icon: '🛒', kind: 'needs', planned: 700 },
  { id: 'transport', name: 'Transport',          icon: '🚌', kind: 'needs', planned: 360 },
  { id: 'health',    name: 'Health & pharmacy',  icon: '🩺', kind: 'needs', planned: 180 },
  { id: 'kids',      name: 'Kids & school',      icon: '🎒', kind: 'needs', planned: 260 },
  { id: 'home',      name: 'Home & household',   icon: '🧺', kind: 'needs', planned: 150 },
  { id: 'dining',    name: 'Dining out',         icon: '🍜', kind: 'wants', planned: 200 },
  { id: 'fun',       name: 'Fun & streaming',    icon: '🎬', kind: 'wants', planned: 130 },
  { id: 'personal',  name: 'Personal care',      icon: '💈', kind: 'wants', planned: 120 },
  { id: 'giving',    name: 'Giving',             icon: '🤲', kind: 'wants', planned: 75 },
];

// Every spend this month, newest last. The category totals on the Budget and
// Dashboard pages are summed from this list, never typed in twice.
export const TRANSACTIONS = [
  { date: '2026-11-01', label: 'Rent — Maple Street apartment', category: 'housing', amount: 1450 },
  { date: '2026-11-01', label: 'Transfer to savings goals', category: 'savings', amount: 600, transfer: true },
  { date: '2026-11-02', label: 'GreenMart weekly shop', category: 'groceries', amount: 168 },
  { date: '2026-11-02', label: 'Community food bank donation', category: 'giving', amount: 50 },
  { date: '2026-11-03', label: 'City Power & Light', category: 'utilities', amount: 96 },
  { date: '2026-11-04', label: 'Fuel — family car', category: 'transport', amount: 52 },
  { date: '2026-11-05', label: 'School lunches (both kids)', category: 'kids', amount: 85 },
  { date: '2026-11-06', label: 'Noodle Bar with friends', category: 'dining', amount: 46 },
  { date: '2026-11-06', label: 'Haircut — Alex', category: 'personal', amount: 35 },
  { date: '2026-11-07', label: 'Pharmacy — prescriptions', category: 'health', amount: 34 },
  { date: '2026-11-08', label: 'Cleaning supplies & detergent', category: 'home', amount: 28 },
  { date: '2026-11-09', label: 'GreenMart weekly shop', category: 'groceries', amount: 152 },
  { date: '2026-11-09', label: 'Water & sewer bill', category: 'utilities', amount: 54 },
  { date: '2026-11-10', label: 'Streamly subscription', category: 'fun', amount: 15 },
  { date: '2026-11-11', label: 'Fuel — family car', category: 'transport', amount: 48 },
  { date: '2026-11-12', label: 'Soccer club fee — Mia', category: 'kids', amount: 60 },
  { date: '2026-11-13', label: 'Cinema tickets (family of four)', category: 'fun', amount: 32 },
  { date: '2026-11-14', label: 'Fiber internet', category: 'utilities', amount: 60 },
  { date: '2026-11-15', label: 'Pizza night at home', category: 'dining', amount: 38 },
  { date: '2026-11-16', label: 'GreenMart weekly shop', category: 'groceries', amount: 171 },
  { date: '2026-11-16', label: 'Toiletries & sunscreen', category: 'personal', amount: 27 },
  { date: '2026-11-17', label: 'Light bulbs & batteries', category: 'home', amount: 19 },
  { date: '2026-11-18', label: 'Transit passes (both adults)', category: 'transport', amount: 70 },
  { date: '2026-11-19', label: 'Dentist copay — Sam', category: 'health', amount: 60 },
  { date: '2026-11-20', label: 'School books & supplies', category: 'kids', amount: 47 },
  { date: '2026-11-21', label: 'Mobile phones (2 lines)', category: 'utilities', amount: 58 },
  { date: '2026-11-21', label: 'Board game — family night', category: 'fun', amount: 45 },
  { date: '2026-11-22', label: 'Coffee & bakery stop', category: 'dining', amount: 24 },
  { date: '2026-11-23', label: 'GreenMart weekly shop', category: 'groceries', amount: 158 },
  { date: '2026-11-24', label: 'Laundromat & dry cleaning', category: 'home', amount: 22 },
  { date: '2026-11-25', label: 'Car service & oil change', category: 'transport', amount: 120 },
];

// Recurring bills. `paidDay` is set when this month's bill is already paid;
// otherwise `dueDay` is when it falls due. The Bills page totals both sides.
export const BILLS = [
  { id: 'rent',     name: 'Rent — Maple Street apartment', amount: 1450, dueDay: 1,  paidDay: 1,  autopay: false, note: 'Paid on the 1st, straight after salary lands.' },
  { id: 'power',    name: 'City Power & Light',            amount: 96,   dueDay: 3,  paidDay: 3,  autopay: true,  note: 'Autopay from the bills account.' },
  { id: 'water',    name: 'Water & sewer',                 amount: 54,   dueDay: 9,  paidDay: 9,  autopay: true,  note: 'Autopay.' },
  { id: 'internet', name: 'Fiber internet',                amount: 60,   dueDay: 14, paidDay: 14, autopay: true,  note: 'Autopay.' },
  { id: 'mobile',   name: 'Mobile phones (2 lines)',       amount: 58,   dueDay: 21, paidDay: 21, autopay: true,  note: 'Autopay.' },
  { id: 'streamly', name: 'Streamly subscription',         amount: 15,   dueDay: 30, paidDay: null, autopay: true, note: 'Renews on the 30th — the fun budget covers it.' },
  { id: 'powerdec', name: 'City Power & Light (December estimate)', amount: 104, dueDay: 28, paidDay: null, autopay: false, note: 'Winter estimate, a little higher than November. Pay by the 28th.' },
  { id: 'insurance', name: 'Car insurance (quarterly)',    amount: 396,  dueDay: 15, paidDay: null, autopay: false, note: 'December quarterly premium. The sinking fund below covers it.', month: 'December' },
];

// Savings goals. `saved` includes this month's contribution already.
export const GOALS = [
  { id: 'emergency', name: 'Emergency fund', icon: '🛟', target: 12000, saved: 8450, monthly: 350, note: 'Roughly three and a half months of essentials — the family safety net, filled before anything fun gets upgraded.' },
  { id: 'holiday',   name: 'Family holiday — June 2027', icon: '🏖️', target: 2400, saved: 1350, monthly: 150, note: 'A week at the coast, trains and a small rental. Booked early, paid in full before we go.' },
  { id: 'laptop',    name: 'New laptop for Sam', icon: '💻', target: 1100, saved: 720, monthly: 100, note: 'The current one is five years old and sounds like a small aircraft.' },
  { id: 'education', name: 'Kids’ education fund', icon: '🎓', target: 5000, saved: 1980, monthly: 125, note: 'A slow, steady pot for courses and, one day, university.' },
  { id: 'insurance-fund', name: 'Car insurance sinking fund', icon: '🚗', target: 396, saved: 264, monthly: 132, note: 'Puts aside a third of the quarterly premium each month so December never stings.' },
];

// The monthly routine the Guide page walks through, one line per step.
export const ROUTINE = [
  { when: 'On payday (the 1st)', text: 'Move the savings transfer out first — $600 to the goals — before any spending starts. What is left is what the month has to live on.' },
  { when: 'Every Sunday, 10 minutes', text: 'Open the Transactions page, add anything the week produced, and glance at the Budget bars. No judgement, just a look.' },
  { when: 'Mid-month (the 15th)', text: 'Check the bills still to come against the bank balance. If a category is over, move money from one that is under — on purpose, out loud, together.' },
  { when: 'The last day', text: 'Sweep whatever is left in checking into the emergency fund, reset the plan for next month, and note the one thing to do better.' },
];
