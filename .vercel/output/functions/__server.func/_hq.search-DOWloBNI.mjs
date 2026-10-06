import { i as __toESM } from "./_runtime.mjs";
import { r as supabase } from "./_ssr/client-PsXr_elE.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { C as useSearch, S as useNavigate, x as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { Gt as LoaderCircle, q as Search } from "./_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.search-DOWloBNI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SOURCES = [
	{
		table: "ops_detections",
		group: "Detections",
		cols: [
			"title",
			"location",
			"notes"
		],
		title: (r) => r.title ?? "Detection",
		subtitle: (r) => [r.status, r.location].filter(Boolean).join(" · "),
		link: () => ({ to: "/ops/detections" })
	},
	{
		table: "ops_flights",
		group: "Flights",
		cols: ["mission_name", "notes"],
		title: (r) => r.mission_name ?? "Flight",
		subtitle: (r) => [r.status, r.aircraft_id].filter(Boolean).join(" · "),
		link: () => ({ to: "/ops/flights" })
	},
	{
		table: "fleet_aircraft",
		group: "Fleet",
		cols: [
			"tail_number",
			"model",
			"notes"
		],
		title: (r) => r.tail_number ?? r.model,
		subtitle: (r) => [r.model, r.status].filter(Boolean).join(" · "),
		link: () => ({ to: "/ops/readiness" })
	},
	{
		table: "eng_tasks",
		group: "Tasks",
		cols: ["title", "description"],
		title: (r) => r.title,
		subtitle: (r) => [r.status, r.priority].filter(Boolean).join(" · "),
		link: () => ({ to: "/tasks" })
	},
	{
		table: "eng_issues",
		group: "Issues",
		cols: ["title", "description"],
		title: (r) => r.title,
		subtitle: (r) => [r.status, r.severity].filter(Boolean).join(" · "),
		link: () => ({ to: "/eng/issues" })
	},
	{
		table: "prod_features",
		group: "Features",
		cols: ["title", "description"],
		title: (r) => r.title,
		subtitle: (r) => [r.status, r.stage].filter(Boolean).join(" · "),
		link: () => ({ to: "/product/portfolio" })
	},
	{
		table: "profiles",
		group: "People",
		cols: [
			"full_name",
			"email",
			"department",
			"title"
		],
		title: (r) => r.full_name || r.email,
		subtitle: (r) => [r.title, r.department].filter(Boolean).join(" · "),
		link: () => ({ to: "/employees" })
	},
	{
		table: "fin_invoices",
		group: "Invoices",
		cols: [
			"invoice_number",
			"customer_name",
			"notes"
		],
		title: (r) => `${r.invoice_number ?? "Invoice"} · ${r.customer_name ?? ""}`,
		subtitle: (r) => `${r.status ?? ""} · $${Number(r.total || 0).toLocaleString()}`,
		link: () => ({ to: "/invoices" })
	}
];
function UniversalSearch() {
	const search = useSearch({ from: "/_hq/search" });
	const navigate = useNavigate();
	const [q, setQ] = (0, import_react.useState)(search.q ?? "");
	const [hits, setHits] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [ran, setRan] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setQ(search.q ?? "");
	}, [search.q]);
	(0, import_react.useEffect)(() => {
		const term = (search.q ?? "").trim();
		if (term.length < 2) {
			setHits([]);
			setRan(false);
			return;
		}
		let alive = true;
		setLoading(true);
		(async () => {
			const results = await Promise.all(SOURCES.map(async (s) => {
				const filter = s.cols.map((c) => `${c}.ilike.%${term}%`).join(",");
				const { data } = await supabase.from(s.table).select("*").or(filter).limit(8);
				return (data ?? []).map((r) => ({
					id: `${s.table}-${r.id}`,
					title: s.title(r) || "Untitled",
					subtitle: s.subtitle(r),
					group: s.group,
					...s.link ? s.link(r) : {}
				}));
			}));
			if (!alive) return;
			setHits(results.flat());
			setLoading(false);
			setRan(true);
		})();
		return () => {
			alive = false;
		};
	}, [search.q]);
	const groups = [...new Set(hits.map((h) => h.group))];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl space-y-6 p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] uppercase tracking-[0.18em] text-muted-foreground",
				children: "Core"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "flex items-center gap-2 text-xl font-semibold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-5 w-5 text-primary" }), " Universal search"]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					navigate({
						to: "/search",
						search: q.trim() ? { q: q.trim() } : {}
					});
				},
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					"aria-label": "Search everything",
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search clients, jobs, leads, estimates, people, documents…",
					className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					className: "rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground",
					children: "Search"
				})]
			}),
			loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-center py-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" })
			}),
			!loading && ran && hits.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "py-10 text-center text-sm text-muted-foreground",
				children: [
					"No matches for “",
					search.q,
					"”."
				]
			}),
			!loading && groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-b border-border px-4 py-2.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground",
						children: g
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border",
					children: hits.filter((h) => h.group === g).map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "px-4 py-2.5",
						children: h.to ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: h.to,
							params: h.params,
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-medium text-primary hover:underline",
								children: h.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-xs text-muted-foreground",
								children: h.subtitle
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-medium",
							children: h.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs text-muted-foreground",
							children: h.subtitle
						})] })
					}, h.id))
				})]
			}, g))
		]
	});
}
//#endregion
export { UniversalSearch as component };
