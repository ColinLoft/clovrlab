import{u as e}from"./index-CsAhAJU3.js";var t=e(`printer`,[[`path`,{d:`M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2`,key:`143wyd`}],[`path`,{d:`M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6`,key:`1itne7`}],[`rect`,{x:`6`,y:`14`,width:`12`,height:`8`,rx:`1`,key:`1ue0tg`}]]);function n(e){let t=e==null?``:String(e);return/[",\n]/.test(t)?`"${t.replace(/"/g,`""`)}"`:t}function r(e,t){return`${e.map(e=>n(e.label)).join(`,`)}\n${t.map(t=>e.map(e=>n(t[e.key])).join(`,`)).join(`
`)}`}function i(e,t,n){let i=new Blob([`﻿`+r(t,n)],{type:`text/csv;charset=utf-8;`}),a=URL.createObjectURL(i),o=document.createElement(`a`);o.href=a,o.download=e.endsWith(`.csv`)?e:`${e}.csv`,o.click(),setTimeout(()=>URL.revokeObjectURL(a),2e3)}function a(e){let t=window.open(``,`_blank`,`width=1100,height=800`);if(!t)return;let n=t=>e.columns.map(e=>`<td>${String(t[e.key]??``).replace(/[<>]/g,``)}</td>`).join(``);t.document.write(`<!doctype html><meta charset="utf-8"><title>${e.title}</title>
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
  <h1>${e.title}</h1>
  <p class="sub">${e.subtitle??``} · Generated ${new Date().toLocaleString()}</p>
  ${e.summary?.length?`<div class="kpis">${e.summary.map(e=>`<div class="kpi"><span>${e.label}</span><b>${e.value}</b></div>`).join(``)}</div>`:``}
  <table><thead><tr>${e.columns.map(e=>`<th>${e.label}</th>`).join(``)}</tr></thead>
  <tbody>${e.rows.map(e=>`<tr>${n(e)}</tr>`).join(``)}</tbody></table>`),t.document.close(),t.focus(),setTimeout(()=>t.print(),350)}export{a as n,t as r,i as t};