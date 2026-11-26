[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/Mulyana01/household-budget-site/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/Mulyana01/household-budget-site/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

# HearthLedger — a household budget site

**HearthLedger** is one household's whole budget in a single static site:
the Hartley family's November 2026, with real, internally consistent
figures — every total on every page is summed from the same ledger, so the
dashboard, the plan and the tools can never disagree.

It runs in a web browser from its own files, on a desktop and on a phone,
with **no network request and no build step**: open `app/index.html` and it
works.

## What's inside

- **Dashboard** — the month at a glance: income, spent, sent to goals and
  what's left; a spending donut, spending by week, bills still to pay and
  goal progress, each panel linking to the page that manages it.
- **Budget** — the plan category by category, with a 50/30/20 check strip.
  Planned amounts are editable in place; every total follows.
- **Transactions** — the full ledger, filterable by category. Add or remove
  an entry and the Budget and Dashboard totals update everywhere.
- **Bills & reminders** — every recurring bill, paid and still to come,
  with working paid/unpaid toggles.
- **Savings goals** — five goals with progress bars, finish-date maths and
  working contribution forms.
- **Budget tools** — three calculators: a 50/30/20 splitter, an
  emergency-fund builder, and a sinking-fund planner.
- **Guide** — the written system: the monthly routine, five rules, and the
  questions the household gets asked.

Changes you make (new transactions, edited plans, paid bills, goal
contributions) persist in the browser's local storage; the footer has a
reset that returns everything to the printed November figures.

## Layout of this repository

- `main.ts` — the hand-in program (Node 22, standard library only): copies
  `app/` and `screenshots/` to the output directory and writes
  `dossier.json` with the vendored library.
- `app/` — the site itself: `index.html`, one stylesheet, and small ES
  modules with one job each (`data.js` the figures, `store.js` the state
  and totals, `charts.js` the inline SVG, one file per view under `views/`,
  loaded on demand by the router in `main.js`).
- `serve.ts` — a tiny local server for previewing: `node serve.ts` serves
  `app/` at http://localhost:8080.
- `screenshots/` — four screenshots of the running site (see `shots.json`).
- `vendor/makefun-frontend.ts` — the make.fun library, copied from the
  bounty kit unchanged, as the kit requires.

Built for the make.fun bounty
[“Make the best household budget site”](https://make.fun/bounty/best-household-budget-site-20261126-1457).

## Run it

```sh
node serve.ts          # then open http://localhost:8080
```

## License

MIT — see `LICENSE`.
