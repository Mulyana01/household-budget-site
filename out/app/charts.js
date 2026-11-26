// Tiny inline-SVG charts, drawn as strings so views can drop them straight
// into the page. No library, no canvas, no network: just circles and bars.

const PALETTE = ['#2e7d5b', '#e07840', '#3d6fb4', '#c9a227', '#8a5fb0', '#4aa3a2', '#b84a6e', '#6b8e4e', '#d1603d', '#5b7fa6', '#97a03c'];

export function colorFor(index) {
  return PALETTE[index % PALETTE.length];
}

// A donut of { label, value, color } slices with the total in the middle.
export function donut(slices, totalLabel, totalValue) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const R = 84, C = 2 * Math.PI * R;
  let offset = 0;
  const arcs = slices
    .map((s) => {
      const frac = s.value / total;
      const dash = Math.max(0, frac * C - 3);
      const el = `<circle cx="110" cy="110" r="${R}" fill="none" stroke="${s.color}" stroke-width="30"
        stroke-dasharray="${dash} ${C - dash}" stroke-dashoffset="${-offset}" transform="rotate(-90 110 110)">
        <title>${s.label}: ${s.value}</title></circle>`;
      offset += frac * C;
      return el;
    })
    .join('');
  return `<svg class="donut" viewBox="0 0 220 220" role="img" aria-label="Spending by category">
    ${arcs}
    <text x="110" y="104" text-anchor="middle" class="donut-total">${totalValue}</text>
    <text x="110" y="126" text-anchor="middle" class="donut-label">${totalLabel}</text>
  </svg>`;
}

// Vertical bars for { label, value } pairs, tallest bar scaled to the top.
export function bars(points, formatValue) {
  const max = Math.max(...points.map((p) => p.value), 1);
  const W = 320, H = 150, base = 118, bw = 44;
  const gap = (W - points.length * bw) / (points.length + 1);
  const els = points
    .map((p, i) => {
      const h = Math.max(3, Math.round((p.value / max) * 92));
      const x = gap + i * (bw + gap);
      const y = base - h;
      return `<rect x="${x}" y="${y}" width="${bw}" height="${h}" rx="6" fill="${colorFor(i)}">
          <title>${p.label}: ${formatValue(p.value)}</title></rect>
        <text x="${x + bw / 2}" y="${y - 6}" text-anchor="middle" class="bar-value">${formatValue(p.value)}</text>
        <text x="${x + bw / 2}" y="${base + 18}" text-anchor="middle" class="bar-label">${p.label}</text>`;
    })
    .join('');
  return `<svg class="bars" viewBox="0 0 ${W} ${H}" role="img" aria-label="Spending by week">${els}</svg>`;
}

// A slim progress bar used by budget rows, goal cards and bill summaries.
export function progressBar(frac, tone = '') {
  const pct = Math.max(0, Math.min(100, Math.round(frac * 100)));
  return `<div class="bar-track ${tone}"><div class="bar-fill" style="width:${pct}%"></div></div>`;
}
