/** CSV / printable-PDF export helpers for incident and detection reporting. */

function esc(v: unknown) {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(columns: { key: string; label: string }[], rows: Record<string, any>[]) {
  const head = columns.map((c) => esc(c.label)).join(",");
  const body = rows.map((r) => columns.map((c) => esc(r[c.key])).join(",")).join("\n");
  return `${head}\n${body}`;
}

export function downloadCsv(filename: string, columns: { key: string; label: string }[], rows: Record<string, any>[]) {
  const blob = new Blob(["\uFEFF" + toCsv(columns, rows)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * Opens a clean, print-ready report window. The browser's "Save as PDF"
 * produces a compliance-ready document without shipping a PDF library.
 */
export function printReport(opts: {
  title: string;
  subtitle?: string;
  columns: { key: string; label: string }[];
  rows: Record<string, any>[];
  summary?: { label: string; value: string }[];
}) {
  const w = window.open("", "_blank", "width=1100,height=800");
  if (!w) return;
  const cells = (r: Record<string, any>) =>
    opts.columns.map((c) => `<td>${String(r[c.key] ?? "").replace(/[<>]/g, "")}</td>`).join("");
  w.document.write(`<!doctype html><meta charset="utf-8"><title>${opts.title}</title>
  <style>
    body{font:13px/1.5 system-ui,sans-serif;color:#0f172a;margin:32px}
    h1{font-size:19px;margin:0 0 4px} .sub{color:#64748b;font-size:12px;margin:0 0 20px}
    table{width:100%;border-collapse:collapse;font-size:11.5px}
    th{text-align:left;background:#f1f5f9;padding:6px 8px;border-bottom:1px solid #cbd5e1;text-transform:uppercase;letter-spacing:.05em;font-size:10px}
    td{padding:6px 8px;border-bottom:1px solid #e2e8f0;vertical-align:top}
    .kpis{display:flex;gap:24px;margin:0 0 20px;flex-wrap:wrap}
    .kpi{border:1px solid #e2e8f0;border-radius:8px;padding:8px 14px}
    .kpi b{display:block;font-size:16px} .kpi span{color:#64748b;font-size:10px;text-transform:uppercase;letter-spacing:.06em}
    @media print{body{margin:12mm}}
  </style>
  <h1>${opts.title}</h1>
  <p class="sub">${opts.subtitle ?? ""} · Generated ${new Date().toLocaleString()}</p>
  ${opts.summary?.length ? `<div class="kpis">${opts.summary.map((s) => `<div class="kpi"><span>${s.label}</span><b>${s.value}</b></div>`).join("")}</div>` : ""}
  <table><thead><tr>${opts.columns.map((c) => `<th>${c.label}</th>`).join("")}</tr></thead>
  <tbody>${opts.rows.map((r) => `<tr>${cells(r)}</tr>`).join("")}</tbody></table>`);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 350);
}
