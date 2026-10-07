import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { T as Target, un as HeartHandshake, y as TrendingUp } from "./_libs/lucide-react.mjs";
import { C as statusTone, D as useRows, E as usePeople, b as nameOf, c as NewButton, f as Stat, g as d, h as WorkPage, i as Empty, l as Pill, m as Toolbar, o as Loading, p as StatRow, r as Card, t as Bar, u as RecordDialog, y as money } from "./_ssr/kit-CsnUfINY.mjs";
import { t as UserMention } from "./_ssr/UserMention-B7i_AS2Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.fund.pipeline-CVk1knR2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STAGES = [
	"qualifying",
	"conversation",
	"proposal",
	"committed",
	"closed"
];
var fields = [
	{
		key: "title",
		label: "Opportunity",
		type: "text",
		required: true,
		full: true
	},
	{
		key: "company",
		label: "Organization",
		type: "text"
	},
	{
		key: "contact_name",
		label: "Main contact",
		type: "text"
	},
	{
		key: "contact_email",
		label: "Contact email",
		type: "text"
	},
	{
		key: "stage",
		label: "Stage",
		type: "select",
		options: STAGES.map((v) => ({
			value: v,
			label: v
		}))
	},
	{
		key: "value",
		label: "Expected amount",
		type: "number"
	},
	{
		key: "probability",
		label: "Confidence %",
		type: "number"
	},
	{
		key: "expected_close",
		label: "Expected close",
		type: "date"
	},
	{
		key: "owner_id",
		label: "Relationship owner",
		type: "user"
	},
	{
		key: "notes",
		label: "Notes",
		type: "textarea",
		full: true
	}
];
/** Partnerships and institutional funding, staged like a relationship not a sale. */
function Pipeline() {
	const { rows, loading, insert, patch } = useRows("sales_deals", { order: {
		column: "expected_close",
		ascending: true
	} });
	const contacts = useRows("sales_contacts", {
		order: { column: "created_at" },
		limit: 50
	});
	const { people, byId } = usePeople();
	const [q, setQ] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const filtered = rows.filter((r) => `${r.title} ${r.company ?? ""} ${r.contact_name ?? ""}`.toLowerCase().includes(q.toLowerCase()));
	const total = rows.reduce((s, r) => s + Number(r.value || 0), 0);
	const weighted = rows.reduce((s, r) => s + Number(r.value || 0) * Number(r.probability || 0) / 100, 0);
	const committed = rows.filter((r) => ["committed", "closed"].includes((r.stage ?? "").toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		eyebrow: "Funding & partners",
		title: "Partnership pipeline",
		lede: "Institutional funders and agency partners by stage — expected value, confidence, and who owns the relationship.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "Add opportunity",
			onClick: () => setOpen(true)
		}),
		wide: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, {
				cols: 4,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Open opportunities",
						value: rows.length,
						icon: HeartHandshake
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Pipeline value",
						value: money(total),
						icon: Target
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Confidence-weighted",
						value: money(weighted),
						hint: "Value × probability",
						icon: TrendingUp,
						tone: "good"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Committed",
						value: committed.length,
						tone: "good"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toolbar, {
				q,
				setQ,
				placeholder: "Search partners, organizations…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-3",
				style: { gridTemplateColumns: `repeat(${STAGES.length}, minmax(200px, 1fr))` },
				children: STAGES.map((stage) => {
					const items = filtered.filter((r) => (r.stage ?? "qualifying").toLowerCase() === stage);
					const sum = items.reduce((s, r) => s + Number(r.value || 0), 0);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-muted/30",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
							className: "border-b border-border px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: stage
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold tabular-nums",
								children: money(sum)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 p-2",
							children: [items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "p-3 text-center text-xs text-muted-foreground",
								children: "Empty"
							}), items.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "rounded-md border border-border bg-card p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium leading-snug",
										children: r.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-0.5 text-[11px] text-muted-foreground",
										children: [
											r.company ?? "—",
											" · ",
											d(r.expected_close)
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm font-semibold tabular-nums",
										children: money(Number(r.value || 0))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											value: Number(r.probability || 0),
											max: 100
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex flex-wrap items-center gap-1.5",
										children: [r.owner_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
											userId: r.owner_id,
											name: nameOf(byId, r.owner_id),
											size: "xs"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: r.stage ?? "qualifying",
											onChange: (e) => patch(r.id, { stage: e.target.value }),
											className: "ml-auto rounded border border-border bg-background px-1.5 py-0.5 text-[11px]",
											children: STAGES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: s,
												children: s
											}, s))
										})]
									})
								]
							}, r.id))]
						})]
					}, stage);
				})
			}),
			loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mt-5",
				title: "Relationship contacts",
				hint: "People behind the pipeline",
				pad: false,
				children: contacts.rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No contacts recorded." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border",
					children: contacts.rows.slice(0, 12).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center gap-3 px-4 py-2.5 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-0 flex-1 truncate font-medium",
								children: c.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate text-xs text-muted-foreground",
								children: c.company ?? c.title ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate text-xs text-muted-foreground",
								children: c.email ?? ""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								tone: statusTone(c.status),
								children: c.status ?? "new"
							})
						]
					}, c.id))
				})
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "New opportunity",
				fields,
				people,
				initial: {
					stage: "qualifying",
					probability: 25
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
export { Pipeline as component };
