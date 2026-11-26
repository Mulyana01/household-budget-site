// HearthLedger's hand-in program (Node 22, standard library only).
//
// The site itself is the app/ folder beside this file: plain static files a
// browser opens at app/index.html — ES modules and CSS, no build step, and
// nothing it runs, styles or shows is fetched over the network. This program
// is only the courier: it copies app/ and screenshots/ into the output
// directory and writes dossier.json there with the vendored make.fun library
// (vendor/makefun-frontend.ts, left exactly as the kit issued it — the scorer
// requires the dossier to be byte for byte what its own copy writes).
//
// Run it the way the kit prescribes:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// (MAKEFUN_OUTPUT_DIR stands in for the grader's /output.)
//
// Preview the site first with `node serve.ts`, then open
// http://localhost:8080 — and look at it at a phone size too.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The caps below are the scorer's own (reference/gate.json): at most 4
// screenshots of at most 256 KiB each, at most 993 files and 16 MiB in app/.
// text_max_bytes is the one that shapes the dossier's bytes.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);

console.log(`HearthLedger handed in to ${out} (app/, screenshots/, dossier.json)`);
