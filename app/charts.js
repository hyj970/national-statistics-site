// Small SVG chart builders. No library: every chart is drawn from the numbers in
// data.js, so the site stays light and every figure on screen is traceable.

const INK = "#1d3557";
const ACCENT = "#c0392b";
const ACCENT_SOFT = "#e8a49c";
const GRID = "#dfe6ec";
const MUTED = "#5b6b7a";

function svgOpen(width, height, label) {
  // No xmlns attribute: inline SVG in an HTML document needs none, and this
  // keeps the source free of absolute URLs entirely.
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="${label}">`;
}

function niceMax(values) {
  const max = Math.max(...values);
  if (max <= 0) return 1;
  // Pick a round ceiling a little above the data: five steps of 1, 2, 2.5, 5 or 10.
  const raw = max / 5;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = [1, 2, 2.5, 5, 10].find((s) => s >= norm) ?? 10;
  return step * mag * 5;
}

// Vertical bars with a value label on each bar and the year under it.
export function barChart(series, { height = 220, barColor = ACCENT } = {}) {
  const width = 640;
  const padL = 44, padR = 12, padT = 26, padB = 30;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const min = Math.min(0, ...series.values);
  const max = niceMax(series.values);
  const range = max - min || 1;
  const n = series.values.length;
  const slot = plotW / n;
  const barW = Math.min(42, slot * 0.62);
  let out = svgOpen(width, height, `${series.title} bar chart`);
  out += `<line x1="${padL}" y1="${padT + plotH}" x2="${width - padR}" y2="${padT + plotH}" stroke="${GRID}" />`;
  for (let i = 0; i <= 4; i++) {
    const v = min + ((max - min) * i) / 4;
    const y = padT + plotH - ((v - min) / range) * plotH;
    out += `<line x1="${padL}" y1="${y}" x2="${width - padR}" y2="${y}" stroke="${GRID}" stroke-dasharray="3 4" />`;
    out += `<text x="${padL - 6}" y="${y + 4}" text-anchor="end" font-size="11" fill="${MUTED}">${v.toFixed(v < 10 ? 1 : 0)}</text>`;
  }
  series.values.forEach((v, i) => {
    const x = padL + slot * i + (slot - barW) / 2;
    const h = ((v - min) / range) * plotH;
    const y = padT + plotH - h;
    const last = i === n - 1;
    out += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${h.toFixed(1)}" rx="3" fill="${last ? ACCENT : ACCENT_SOFT}" />`;
    out += `<text x="${(x + barW / 2).toFixed(1)}" y="${(y - 6).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="600" fill="${INK}">${v}</text>`;
    out += `<text x="${(x + barW / 2).toFixed(1)}" y="${padT + plotH + 18}" text-anchor="middle" font-size="11" fill="${MUTED}">${series.years[i]}</text>`;
  });
  out += "</svg>";
  return out;
}

// A line chart with dots and value labels, for rates and short series.
// The axis hugs the data (padded, rounded to halves) so small changes read.
export function lineChart(series, { height = 220, decimals = 1 } = {}) {
  const width = 640;
  const padL = 44, padR = 18, padT = 26, padB = 30;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const min = Math.min(...series.values);
  const max = Math.max(...series.values);
  const pad = (max - min) * 0.15 || 0.5;
  const lo = Math.floor((min - pad) * 2) / 2;
  const hi = Math.ceil((max + pad) * 2) / 2;
  const range = hi - lo || 1;
  const n = series.values.length;
  const xAt = (i) => padL + (plotW * i) / (n - 1);
  const yAt = (v) => padT + plotH - ((v - lo) / range) * plotH;
  let out = svgOpen(width, height, `${series.title} line chart`);
  for (let i = 0; i <= 4; i++) {
    const v = lo + ((hi - lo) * i) / 4;
    const y = yAt(v);
    out += `<line x1="${padL}" y1="${y}" x2="${width - padR}" y2="${y}" stroke="${GRID}" stroke-dasharray="3 4" />`;
    out += `<text x="${padL - 6}" y="${y + 4}" text-anchor="end" font-size="11" fill="${MUTED}">${v.toFixed(decimals)}</text>`;
  }
  const points = series.values.map((v, i) => `${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`).join(" ");
  out += `<polyline points="${points}" fill="none" stroke="${ACCENT}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />`;
  series.values.forEach((v, i) => {
    out += `<circle cx="${xAt(i).toFixed(1)}" cy="${yAt(v).toFixed(1)}" r="4" fill="#fff" stroke="${ACCENT}" stroke-width="2.5" />`;
    out += `<text x="${xAt(i).toFixed(1)}" y="${(yAt(v) - 10).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="600" fill="${INK}">${v.toFixed(decimals)}</text>`;
    out += `<text x="${xAt(i).toFixed(1)}" y="${padT + plotH + 18}" text-anchor="middle" font-size="11" fill="${MUTED}">${series.years[i]}</text>`;
  });
  out += "</svg>";
  return out;
}

// Horizontal bars for shares (age structure, export mix).
export function shareBars(items) {
  const width = 640;
  const padL = 170, padR = 56, rowH = 34, padT = 8;
  const h = padT + items.length * rowH + 8;
  const plotW = width - padL - padR;
  const max = Math.max(...items.map((d) => d.value));
  let out = svgOpen(width, h, "share bar chart");
  items.forEach((d, i) => {
    const y = padT + i * rowH;
    const w = (d.value / max) * plotW;
    out += `<text x="${padL - 10}" y="${y + 20}" text-anchor="end" font-size="12" fill="${INK}">${d.label}</text>`;
    out += `<rect x="${padL}" y="${y + 6}" width="${w.toFixed(1)}" height="20" rx="3" fill="${i === 0 ? ACCENT : ACCENT_SOFT}" />`;
    out += `<text x="${(padL + w + 8).toFixed(1)}" y="${y + 21}" font-size="12" font-weight="600" fill="${INK}">${d.value}%</text>`;
  });
  out += "</svg>";
  return out;
}
