import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { jn as FileText, k as Star, kr as BookOpen } from "./_libs/lucide-react.mjs";
import { D as useRows, E as usePeople, b as nameOf, c as NewButton, h as WorkPage, i as Empty, m as Toolbar, n as Btn, o as Loading, r as Card, u as RecordDialog, v as dt, w as titleCase } from "./_ssr/kit-CsnUfINY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.eng.library-lC4Dq3R0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORIES = [
	"spec",
	"analysis",
	"test_report",
	"procedure",
	"decision",
	"reference"
];
var fields = (projects) => [
	{
		key: "title",
		label: "Title",
		type: "text",
		required: true,
		full: true,
		placeholder: "Battery thermal runaway test report"
	},
	{
		key: "category",
		label: "Category",
		type: "select",
		options: CATEGORIES.map((c) => ({
			value: c,
			label: titleCase(c)
		}))
	},
	{
		key: "project_id",
		label: "Program",
		type: "select",
		options: projects.map((p) => ({
			value: p.id,
			label: p.name
		}))
	},
	{
		key: "author_id",
		label: "Author",
		type: "user"
	},
	{
		key: "starred",
		label: "Pin to top",
		type: "bool"
	},
	{
		key: "content",
		label: "Document",
		type: "textarea",
		full: true,
		placeholder: "Findings, method, conclusions…"
	}
];
function LibraryPage() {
	const { rows, loading, insert, patch, remove } = useRows("eng_docs", { order: {
		column: "updated_at",
		ascending: false
	} });
	const { rows: projects } = useRows("eng_projects", { select: "id, name" });
	const { people, byId } = usePeople();
	const [q, setQ] = (0, import_react.useState)("");
	const [cat, setCat] = (0, import_react.useState)("all");
	const [creating, setCreating] = (0, import_react.useState)(false);
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const projectName = (id) => projects.find((p) => p.id === id)?.name ?? "Unassigned program";
	const shown = (0, import_react.useMemo)(() => {
		const term = q.trim().toLowerCase();
		return rows.filter((r) => cat === "all" || r.category === cat).filter((r) => !term || `${r.title} ${r.content ?? ""}`.toLowerCase().includes(term)).sort((a, b) => Number(!!b.starred) - Number(!!a.starred));
	}, [
		rows,
		q,
		cat
	]);
	const open = shown.find((r) => r.id === openId) ?? shown[0] ?? null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		wide: true,
		eyebrow: "Engineering",
		title: "Engineering library",
		lede: "Specs, analyses and test reports the team writes as it builds. Pin the documents everyone keeps reaching for.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "New document",
			onClick: () => setCreating(true)
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toolbar, {
				q,
				setQ,
				placeholder: "Search titles and contents…",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					children: ["all", ...CATEGORIES].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setCat(c),
						className: `rounded-full border px-3 py-1.5 text-xs font-medium transition ${cat === c ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:text-foreground"}`,
						children: c === "all" ? "All" : titleCase(c)
					}, c))
				})
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-4 lg:grid-cols-[340px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					pad: false,
					title: `${shown.length} document${shown.length === 1 ? "" : "s"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-h-[640px] divide-y divide-border overflow-y-auto",
						children: [shown.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Nothing matches." }), shown.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setOpenId(r.id),
							className: `flex w-full items-start gap-2 px-4 py-3 text-left transition hover:bg-muted ${open?.id === r.id ? "bg-primary/5" : ""}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block truncate text-sm font-medium",
										children: r.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "block truncate text-[11px] text-muted-foreground",
										children: [
											titleCase(r.category),
											" · ",
											projectName(r.project_id)
										]
									})]
								}),
								r.starred && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" })
							]
						}, r.id))]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					pad: false,
					children: !open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Write the first document — it becomes the team's shared memory." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] uppercase tracking-wider text-muted-foreground",
								children: [
									titleCase(open.category),
									" · ",
									projectName(open.project_id)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 text-lg font-semibold",
								children: open.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: [
									nameOf(byId, open.author_id),
									" · updated ",
									dt(open.updated_at)
								]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
								onClick: () => patch(open.id, { starred: !open.starred }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `h-3.5 w-3.5 ${open.starred ? "fill-amber-400 text-amber-400" : ""}` }), open.starred ? "Pinned" : "Pin"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
								variant: "danger",
								onClick: () => {
									remove(open.id);
									setOpenId(null);
								},
								children: "Delete"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-5 py-5",
						children: open.content ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "whitespace-pre-wrap text-sm leading-7 text-foreground/90",
							children: open.content
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "This document is empty."
						})
					})] })
				})]
			}),
			creating && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "New engineering document",
				fields: fields(projects),
				initial: { category: "spec" },
				people,
				onCancel: () => setCreating(false),
				onSave: async (v) => {
					const row = await insert(v);
					setCreating(false);
					if (row) setOpenId(row.id);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 flex items-center gap-1.5 text-[11px] text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-3 w-3" }), " Documents are visible to everyone in the Engineering workspace."]
			})
		]
	});
}
//#endregion
export { LibraryPage as component };
