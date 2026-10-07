import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { Zn as Coins, tt as Repeat, un as HeartHandshake } from "./_libs/lucide-react.mjs";
import { D as useRows, f as Stat, g as d, h as WorkPage, i as Empty, o as Loading, p as StatRow, r as Card, t as Bar, w as titleCase, y as money } from "./_ssr/kit-L_nfYwfF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.fund.campaigns-CGKgXjSJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Giving rolled up the way fundraisers actually think: by campaign, by month, by who gave twice. */
function CampaignsPage() {
	const { rows, loading } = useRows("fund_donations", { order: {
		column: "received_on",
		ascending: false
	} });
	const { rows: donors } = useRows("fund_donors", { select: "id, name, tier" });
	const total = rows.reduce((n, r) => n + Number(r.amount || 0), 0);
	const campaigns = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const r of rows) {
			const key = r.campaign || "Unattributed";
			const c = map.get(key) ?? {
				name: key,
				amount: 0,
				gifts: 0,
				donors: /* @__PURE__ */ new Set()
			};
			c.amount += Number(r.amount || 0);
			c.gifts += 1;
			if (r.donor_id) c.donors.add(r.donor_id);
			map.set(key, c);
		}
		return [...map.values()].sort((a, b) => b.amount - a.amount);
	}, [rows]);
	const months = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const r of rows) {
			if (!r.received_on) continue;
			const key = String(r.received_on).slice(0, 7);
			map.set(key, (map.get(key) ?? 0) + Number(r.amount || 0));
		}
		return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-12);
	}, [rows]);
	const repeat = (0, import_react.useMemo)(() => {
		const counts = /* @__PURE__ */ new Map();
		for (const r of rows) if (r.donor_id) counts.set(r.donor_id, (counts.get(r.donor_id) ?? 0) + 1);
		return [...counts.values()].filter((n) => n > 1).length;
	}, [rows]);
	const restrictedTotal = rows.filter((r) => r.restriction && r.restriction !== "unrestricted").reduce((n, r) => n + Number(r.amount || 0), 0);
	const maxMonth = Math.max(1, ...months.map(([, v]) => v));
	const donorName = (id) => donors.find((x) => x.id === id)?.name ?? "Anonymous";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		wide: true,
		eyebrow: "Funding & Partners",
		title: "Campaign performance",
		lede: "Where the money came from, which appeals earned it, and how much of it is already spoken for.",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, {
			cols: 4,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Total raised",
					value: money(total),
					icon: Coins,
					tone: "good"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Gifts recorded",
					value: rows.length,
					icon: HeartHandshake
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Repeat donors",
					value: repeat,
					icon: Repeat
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Restricted",
					value: money(restrictedTotal),
					hint: `${rows.length ? Math.round(restrictedTotal / (total || 1) * 100) : 0}% of giving`,
					tone: restrictedTotal > total * .6 ? "warn" : "default"
				})
			]
		}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mt-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No gifts logged yet. Record giving in the Gift Ledger and it rolls up here." })
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 grid gap-4 xl:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "By campaign",
					hint: "Sorted by dollars raised",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-4",
						children: campaigns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: titleCase(c.name)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums",
									children: money(c.amount)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									value: c.amount,
									max: campaigns[0].amount
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: [
									c.gifts,
									" gift",
									c.gifts === 1 ? "" : "s",
									" · ",
									c.donors.size,
									" donor",
									c.donors.size === 1 ? "" : "s",
									" ·",
									" ",
									"avg ",
									money(Math.round(c.amount / c.gifts))
								]
							})
						] }, c.name))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Last twelve months",
					hint: "Monthly totals",
					children: months.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No dated gifts." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-52 items-end gap-2",
						children: months.map(([m, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-1 flex-col items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] tabular-nums text-muted-foreground",
									children: [Math.round(v / 1e3), "k"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-full rounded-t bg-primary/70 transition-all",
									style: { height: `${Math.max(4, v / maxMonth * 100)}%` },
									title: `${m}: ${money(v)}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground",
									children: m.slice(5)
								})
							]
						}, m))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "xl:col-span-2",
					pad: false,
					title: "Recent gifts",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-h-80 divide-y divide-border overflow-y-auto",
						children: rows.slice(0, 40).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "min-w-[180px] flex-1 truncate font-medium",
									children: donorName(r.donor_id)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground",
									children: [
										titleCase(r.campaign),
										" · ",
										titleCase(r.method)
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: d(r.received_on)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums font-semibold",
									children: money(Number(r.amount || 0))
								})
							]
						}, r.id))
					})
				})
			]
		})]
	});
}
//#endregion
export { CampaignsPage as component };
