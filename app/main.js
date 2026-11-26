// HearthLedger's router: one page per hash route, each view loaded on demand
// so the first paint only fetches what the dashboard needs.
//
//   #/              dashboard        #/goals        savings goals
//   #/budget        the plan         #/tools        calculators
//   #/transactions  the ledger       #/guide        how we budget
//   #/bills         bills & reminders
//
// window.__shotReady is false while a view renders and true once it is on
// screen, so a screenshot script knows when to capture.

const app = document.getElementById('app');
const navLinks = document.querySelectorAll('nav a[data-route]');

const ROUTES = {
  '/': { title: 'Dashboard', load: () => import('./views/dashboard.js'), render: (m) => m.renderDashboard() },
  '/budget': { title: 'Budget', load: () => import('./views/budget.js'), render: (m, el) => m.renderBudget(el) },
  '/transactions': { title: 'Transactions', load: () => import('./views/transactions.js'), render: (m, el) => m.renderTransactions(el) },
  '/bills': { title: 'Bills & reminders', load: () => import('./views/bills.js'), render: (m, el) => m.renderBills(el) },
  '/goals': { title: 'Savings goals', load: () => import('./views/goals.js'), render: (m, el) => m.renderGoals(el) },
  '/tools': { title: 'Budget tools', load: () => import('./views/tools.js'), render: (m, el) => m.renderTools(el) },
  '/guide': { title: 'Guide', load: () => import('./views/guide.js'), render: (m) => m.renderGuide() },
};

async function render() {
  window.__shotReady = false;
  const path = location.hash.replace(/^#/, '') || '/';
  const route = ROUTES[path] ?? ROUTES['/'];
  document.title = `${route.title} · HearthLedger`;
  navLinks.forEach((a) => a.classList.toggle('active', a.dataset.route === path));
  const mod = await route.load();
  const html = route.render(mod, app);
  if (typeof html === 'string') app.innerHTML = html;
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();
