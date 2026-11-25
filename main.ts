// Nippon Stat Atlas — hand-in program (Node 22, standard library only).
// The site is plain static files under app/ (index.html, CSS, ES modules, data),
// so handing it in is copying app/ and screenshots/ to /output and writing
// /output/dossier.json with the kit's vendored library, unchanged.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

function copyTree(from, to) {
  cpSync(from, to, { recursive: true });
}

mkdirSync(out, { recursive: true });
copyTree(join(here, "app"), join(out, "app"));
mkdirSync(join(out, "screenshots"), { recursive: true });
if (existsSync(join(here, "screenshots"))) {
  copyTree(join(here, "screenshots"), join(out, "screenshots"));
}

// Same caps the scorer uses: at most 4 screenshots of 256 KiB, app/ under
// 993 entries and 16 MiB, and the dossier text capped at 160 KiB.
writeFileSync(
  join(out, "dossier.json"),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
