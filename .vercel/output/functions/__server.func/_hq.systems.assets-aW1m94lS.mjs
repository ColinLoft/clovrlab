import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { B as ShieldCheck, Gr as AppWindow, en as Layers } from "./_libs/lucide-react.mjs";
import { C as statusTone, D as useRows, E as usePeople, b as nameOf, c as NewButton, d as Select, f as Stat, h as WorkPage, i as Empty, l as Pill, m as Toolbar, o as Loading, p as StatRow, r as Card, u as RecordDialog, w as titleCase } from "./_ssr/kit-L_nfYwfF.mjs";
import { t as UserMention } from "./_ssr/UserMention-D5WbdqmL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.systems.assets-aW1m94lS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var fields = [
	{
		key: "name",
		label: "Application",
		type: "text",
		required: true
	},
	{
		key: "kind",
		label: "Kind",
		type: "select",
		options: [
			"saas",
			"internal",
			"library",
			"device"
		].map((v) => ({
			value: v,
			label: v
		}))
	},
	{
		key: "environment",
		label: "Environment",
		type: "select",
		options: [
			"production",
			"staging",
			"internal"
		].map((v) => ({
			value: v,
			label: v
		}))
	},
	{
		key: "version",
		label: "Version",
		type: "text"
	},
	{
		key: "status",
		label: "Status",
		type: "select",
		options: [
			"active",
			"review",
			"deprecated"
		].map((v) => ({
			value: v,
			label: v
		}))
	},
	{
		key: "owner_id",
		label: "Owner",
		type: "user"
	},
	{
		key: "url",
		label: "URL",
		type: "text",
		full: true
	},
	{
		key: "description",
		label: "What it is used for",
		type: "textarea",
		full: true
	}
];
/** Everything IT is on the hook for keeping patched, licensed and owned. */
function SystemsAssets() {
	const { rows, loading, insert, patch, remove } = useRows("dev_software", { order: {
		column: "name",
		ascending: true
	} });
	const { people, byId } = usePeople();
	const [q, setQ] = (0, import_react.useState)("");
	const [env, setEnv] = (0, import_react.useState)("all");
	const [open, setOpen] = (0, import_react.useState)(false);
	const filtered = rows.filter((r) => (env === "all" || (r.environment ?? "") === env) && `${r.name} ${r.kind ?? ""} ${r.description ?? ""}`.toLowerCase().includes(q.toLowerCase()));
	const groups = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		for (const r of filtered) {
			const k = r.kind || "other";
			m.set(k, [...m.get(k) ?? [], r]);
		}
		return [...m.entries()].sort((a, b) => b[1].length - a[1].length);
	}, [filtered]);
	const unowned = rows.filter((r) => !r.owner_id);
	const deprecated = rows.filter((r) => (r.status ?? "").toLowerCase() === "deprecated");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		eyebrow: "Enterprise systems",
		title: "Application register",
		lede: "Every system the company runs on, who owns it, which environment it serves, and what should be retired.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "Register system",
			onClick: () => setOpen(true)
		}),
		wide: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, {
				cols: 4,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Registered systems",
						value: rows.length,
						icon: AppWindow
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Without an owner",
						value: unowned.length,
						tone: unowned.length ? "risk" : "good",
						icon: ShieldCheck
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Marked deprecated",
						value: deprecated.length,
						tone: deprecated.length ? "warn" : "good"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Categories",
						value: groups.length,
						icon: Layers
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toolbar, {
				q,
				setQ,
				placeholder: "Search systems…",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
					value: env,
					onChange: setEnv,
					options: [{
						value: "all",
						label: "All environments"
					}, ...[
						"production",
						"staging",
						"internal"
					].map((v) => ({
						value: v,
						label: v
					}))]
				})
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {})
			}) : groups.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Nothing registered yet." })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-4 lg:grid-cols-2",
				children: groups.map(([kind, items]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: titleCase(kind),
					hint: `${items.length} system${items.length === 1 ? "" : "s"}`,
					pad: false,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border",
						children: items.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "min-w-0 flex-1 truncate text-sm font-medium",
										children: r.name
									}),
									r.version && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-[11px] text-muted-foreground",
										children: ["v", r.version]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
										tone: statusTone(r.status),
										children: r.status ?? "active"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.environment ?? "internal" }),
									r.owner_id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
										userId: r.owner_id,
										name: nameOf(byId, r.owner_id),
										size: "xs"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-destructive",
										children: "No owner"
									}),
									r.url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: r.url,
										target: "_blank",
										rel: "noreferrer",
										className: "text-primary hover:underline",
										children: "open"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: r.status ?? "active",
										onChange: (e) => patch(r.id, { status: e.target.value }),
										className: "ml-auto rounded border border-border bg-background px-1.5 py-0.5 text-[11px]",
										children: [
											"active",
											"review",
											"deprecated"
										].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: s,
											children: s
										}, s))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => remove(r.id),
										className: "text-[11px] text-muted-foreground hover:text-destructive",
										children: "remove"
									})
								]
							})]
						}, r.id))
					})
				}, kind))
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "Register a system",
				fields,
				people,
				initial: {
					status: "active",
					kind: "saas",
					environment: "production"
				},
				onCancel: () => setOpen(false),
				onSave: async (v) => {
					await insert(v);
					setOpen(false);
				}
			})
		]
	});
}
//#endregion
export { SystemsAssets as component };
