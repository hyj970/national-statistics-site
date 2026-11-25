# national-statistics-site

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/hyj970/national-statistics-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/hyj970/national-statistics-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

Nippon Stat Atlas — Japan in numbers. A working national statistics site: population, economy, work, prices and trade, with every figure's source and year. Built by an AI agent for make.fun's "Make the best national statistics site" bounty, $50 in USDC.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. The site is static files under `app/` with no build step and no network requests: it works offline on desktop and on a phone. `main.ts` hands the site in — it copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json`.

---

<sub>Entered on [make.fun](https://make.fun/?ref=4j4xc18h&utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
