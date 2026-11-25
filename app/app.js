// Nippon Stat Atlas — routing, rendering and controls. Every control on the site
// works: tables sort, the prefecture list filters, charts switch type, and the
// year range trims a series. All data comes from data.js; nothing is fetched.

import { META, INDICATORS, SERIES, AGE_STRUCTURE, PREFECTURES, EXPORT_MIX, SOURCES } from "./data.js";
import { barChart, lineChart, shareBars } from "./charts.js";

const root = document.getElementById("app");

// ---- small helpers ---------------------------------------------------------

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function sourceLine(source) {
  return `<p class="source">Source: ${esc(source)}</p>`;
}

function indicatorCard(ind) {
  return `<article class="card">
    <h3>${esc(ind.label)}</h3>
    <p class="big">${esc(ind.value)}</p>
    <p class="delta">${esc(ind.delta)}</p>
    <p class="meta">${esc(ind.year)} · ${esc(ind.source)}</p>
  </article>`;
}

// Trim a series to its last `count` years (year-range control).
function trimSeries(series, count) {
  return {
    ...series,
    years: series.years.slice(-count),
    values: series.values.slice(-count),
  };
}

// ---- chart block with a working type toggle ---------------------------------

function chartBlock(key, title, blurb) {
  const series = SERIES[key];
  const block = el(`<section class="chart-block">
    <div class="chart-head">
      <div><h3>${esc(title)}</h3><p>${esc(blurb)}</p></div>
      <div class="controls" role="group" aria-label="Chart controls">
        <button data-type="bar" type="button">Bars</button>
        <button data-type="line" class="active" type="button">Line</button>
        <label>Years
          <select class="years">
            <option value="10">All</option>
            <option value="6" selected>Last 6</option>
            <option value="3">Last 3</option>
          </select>
        </label>
      </div>
    </div>
    <div class="chart"></div>
    ${sourceLine(series.source)}
  </section>`);
  const chartSlot = block.querySelector(".chart");
  const render = () => {
    const type = block.querySelector("button.active").dataset.type;
    const count = Number(block.querySelector(".years").value);
    const view = trimSeries(series, count);
    chartSlot.innerHTML = type === "bar" ? barChart(view) : lineChart(view);
  };
  block.querySelectorAll("button[data-type]").forEach((btn) => {
    btn.addEventListener("click", () => {
      block.querySelectorAll("button[data-type]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      render();
    });
  });
  block.querySelector(".years").addEventListener("change", render);
  render();
  return block;
}

// ---- pages -----------------------------------------------------------------

function pageOverview() {
  const page = el(`<div>
    <section class="hero">
      <p class="eyebrow">National statistics · ${esc(META.country)}</p>
      <h2>Japan in numbers</h2>
      <p class="lede">Population, the economy, work, prices and trade — the figures people
      look up, with the source and year on every one. Updated ${esc(META.updated)}.</p>
    </section>
    <section class="grid" aria-label="Key indicators"></section>
    <div id="overview-charts"></div>
    <section class="note">
      <h3>How to read this site</h3>
      <p>Every figure names its source and year. Charts show the last six years by
      default; use the controls to switch between bars and lines or to see the full
      series. The prefecture table on the Population page sorts and filters.</p>
    </section>
  </div>`);
  const grid = page.querySelector(".grid");
  INDICATORS.slice(0, 8).forEach((ind) => grid.appendChild(el(indicatorCard(ind))));
  const charts = page.querySelector("#overview-charts");
  charts.appendChild(chartBlock("population", "Population is shrinking", "Total population, 2019–2024. Japan loses about half a million people a year."));
  charts.appendChild(chartBlock("gdp", "GDP in dollars fell with the yen", "Nominal GDP in US dollars, 2019–2024. In yen terms the economy kept growing."));
  return page;
}

function pagePopulation() {
  const page = el(`<div>
    <section class="hero slim">
      <p class="eyebrow">Population</p>
      <h2>An older, smaller Japan</h2>
      <p class="lede">One in three residents is now 65 or older, and the population has
      fallen every year since 2011. The tables below sort and filter.</p>
    </section>
    <section class="chart-block">
      <h3>${esc(AGE_STRUCTURE.title)}</h3>
      <div class="chart">${shareBars(AGE_STRUCTURE.groups)}</div>
      ${sourceLine(AGE_STRUCTURE.source)}
    </section>
    <div id="pop-chart"></div>
    <section class="chart-block">
      <h3>Where people live</h3>
      <p>Population by prefecture, 2024 (millions). Click a column heading to sort;
      type in the box to filter the list.</p>
      <label class="filter">Filter prefectures
        <input type="search" id="pref-filter" placeholder="e.g. Osaka" autocomplete="off">
      </label>
      <table id="pref-table">
        <thead><tr>
          <th><button type="button" data-key="name">Prefecture</button></th>
          <th><button type="button" data-key="population">Population (m)</button></th>
          <th><button type="button" data-key="capital">Capital</button></th>
          <th><button type="button" data-key="density">Density / km²</button></th>
        </tr></thead>
        <tbody></tbody>
      </table>
      <p class="source">Source: Statistics Bureau of Japan, Population Estimates 2024. Density is people per square kilometre.</p>
    </section>
  </div>`);
  page.querySelector("#pop-chart").appendChild(chartBlock("population", "Population, 2015–2024", "Total population in millions. The 2020 figure is the census count."));
  const tbody = page.querySelector("#pref-table tbody");
  const state = { key: "population", dir: -1, query: "" };
  const drawRows = () => {
    const rows = PREFECTURES
      .filter((p) => p.name.toLowerCase().includes(state.query))
      .sort((a, b) => {
        const av = a[state.key], bv = b[state.key];
        return (av < bv ? -1 : av > bv ? 1 : 0) * state.dir;
      });
    tbody.innerHTML = rows.length
      ? rows.map((p) => `<tr><td>${esc(p.name)}</td><td>${p.population.toFixed(1)}</td><td>${esc(p.capital)}</td><td>${p.density.toLocaleString("en-US")}</td></tr>`).join("")
      : `<tr><td colspan="4">No prefecture matches “${esc(state.query)}”.</td></tr>`;
  };
  page.querySelectorAll("#pref-table th button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.key;
      state.dir = state.key === key ? -state.dir : (key === "name" || key === "capital" ? 1 : -1);
      state.key = key;
      drawRows();
    });
  });
  page.querySelector("#pref-filter").addEventListener("input", (e) => {
    state.query = e.target.value.trim().toLowerCase();
    drawRows();
  });
  drawRows();
  return page;
}

function pageEconomy() {
  const page = el(`<div>
    <section class="hero slim">
      <p class="eyebrow">Economy</p>
      <h2>Big, indebted, and hiring</h2>
      <p class="lede">The world's fourth-largest economy, a public debt pile of 236% of GDP,
      and an unemployment rate of 2.5% — one of the lowest in the G7.</p>
    </section>
    <section class="grid" aria-label="Economy indicators"></section>
    <div id="econ-charts"></div>
    <section class="chart-block">
      <h3>${esc(EXPORT_MIX.title)}</h3>
      <p>What Japan sells to the world. Vehicles and machinery together are two-fifths of goods exports.</p>
      <div class="chart">${shareBars(EXPORT_MIX.items)}</div>
      ${sourceLine(EXPORT_MIX.source)}
    </section>
  </div>`);
  const grid = page.querySelector(".grid");
  ["gdp", "gdp-per-capita", "debt", "exports"].forEach((id) => {
    grid.appendChild(el(indicatorCard(INDICATORS.find((i) => i.id === id))));
  });
  const charts = page.querySelector("#econ-charts");
  charts.appendChild(chartBlock("gdp", "Nominal GDP, 2019–2024", "US$ trillion. The yen's slide cut the dollar figure even as yen GDP grew."));
  charts.appendChild(chartBlock("unemployment", "Unemployment, 2019–2024", "Percent of the labour force. It never rose above 3% in this period."));
  charts.appendChild(chartBlock("cpi", "Inflation returns", "Annual average CPI change. Two decades of near-zero prices ended in 2022."));
  return page;
}

function pageAbout() {
  const page = el(`<div>
    <section class="hero slim">
      <p class="eyebrow">About the data</p>
      <h2>Sources, not slogans</h2>
      <p class="lede">Every figure on this site names the body that published it and the year
      it covers. Figures are rounded for readability; the source publications hold
      the exact values.</p>
    </section>
    <section class="chart-block">
      <h3>Where the numbers come from</h3>
      <table>
        <thead><tr><th>Publisher</th><th>What we take from it</th><th>Year</th></tr></thead>
        <tbody>${SOURCES.map((s) => `<tr><td>${esc(s.name)}</td><td>${esc(s.what)}</td><td>${esc(s.year)}</td></tr>`).join("")}</tbody>
      </table>
    </section>
    <section class="chart-block">
      <h3>Method notes</h3>
      <ul>
        <li>Population is the Statistics Bureau's 1 October estimate; 2020 is the census count.</li>
        <li>GDP is nominal, in US dollars at market exchange rates — so the yen's moves show up in it.</li>
        <li>Prefecture density divides the 2024 population estimate by the prefecture's land area.</li>
        <li>Visitor arrivals count foreign nationals entering Japan, excluding crew.</li>
      </ul>
    </section>
    <section class="chart-block">
      <h3>About this site</h3>
      <p>Nippon Stat Atlas is an independent, original statistics site. It is not
      affiliated with the Statistics Bureau of Japan or any government body. All
      text, design and charts are original; figures are public statistics, cited
      with their publisher and year.</p>
    </section>
  </div>`);
  return page;
}

// ---- router ----------------------------------------------------------------

const ROUTES = [
  { hash: "#/", label: "Overview", render: pageOverview },
  { hash: "#/population", label: "Population", render: pagePopulation },
  { hash: "#/economy", label: "Economy", render: pageEconomy },
  { hash: "#/about", label: "About the data", render: pageAbout },
];

function render() {
  const route = ROUTES.find((r) => r.hash === location.hash) || ROUTES[0];
  document.querySelectorAll("nav a").forEach((a) => {
    a.classList.toggle("current", a.getAttribute("href") === route.hash);
    if (a.getAttribute("href") === route.hash) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  root.replaceChildren(route.render());
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", render);
render();
