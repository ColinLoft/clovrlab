import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { B as ShieldCheck, Q as Rocket, Sr as CalendarClock, wt as PackageCheck } from "./_libs/lucide-react.mjs";
import { C as statusTone, D as useRows, E as usePeople, S as raiseRequest, b as nameOf, c as NewButton, f as Stat, g as d, h as WorkPage, i as Empty, l as Pill, n as Btn, o as Loading, p as StatRow, r as Card, t as Bar, u as RecordDialog, w as titleCase, x as pct } from "./_ssr/kit-CsnUfINY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.product.releases-7lFM5Qb2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReleasesPage() {
	const releases = useRows("prod_releases", { order: {
		column: "target_date",
		ascending: true
	} });
	const features = useRows("prod_features", { order: { column: "created_at" } });
	const { people, byId } = usePeople();
	const [creating, setCreating] = (0, import_react.useState)(false);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const current = releases.rows.find((r) => r.id === selected) ?? releases.rows[0] ?? null;
	const fields = [
		{
			key: "name",
			label: "Release name",
			type: "text",
			required: true
		},
		{
			key: "version",
			label: "Version",
			type: "text",
			placeholder: "v2.4.0"
		},
		{
			key: "target_date",
			label: "Target date",
			type: "date"
		},
		{
			key: "status",
			label: "Status",
			type: "select",
			options: [
				"planned",
				"in_progress",
				"in_test",
				"released",
				"held"
			].map((v) => ({
				value: v,
				label: titleCase(v)
			}))
		},
		{
			key: "owner_id",
			label: "Release manager",
			type: "user"
		},
		{
			key: "notes",
			label: "Release notes",
			type: "textarea",
			full: true
		}
	];
	const inRelease = features.rows.filter((f) => f.release_id === current?.id);
	const done = inRelease.filter((f) => f.status === "shipped").length;
	const requestFieldValidation = async () => {
		if (!current) return;
		if (await raiseRequest({
			from_team: "product",
			to_team: "ops",
			subject: `Field validation — ${current.name}`,
			details: "Please fly this build in a controlled sortie and report anything unexpected before general release.",
			entity_type: "prod_releases",
			entity_id: current.id,
			priority: "high"
		})) alert("Mission Operations asked to validate in the field.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		wide: true,
		eyebrow: "Product · Delivery",
		title: "Release trains",
		lede: "Every build that reaches an aircraft or an operator console leaves from here, with a named release manager and a field validation flight behind it.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "Plan release",
			onClick: () => setCreating(true)
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Planned",
					value: releases.rows.filter((r) => r.status === "planned").length,
					icon: CalendarClock
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "In test",
					value: releases.rows.filter((r) => r.status === "in_test").length,
					icon: ShieldCheck,
					tone: "warn"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Released",
					value: releases.rows.filter((r) => r.status === "released").length,
					icon: PackageCheck,
					tone: "good"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Held",
					value: releases.rows.filter((r) => r.status === "held").length,
					icon: Rocket,
					tone: "risk"
				})
			] }),
			releases.loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-4 xl:grid-cols-[minmax(260px,340px)_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					pad: false,
					title: "Releases",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-h-[70vh] divide-y divide-border overflow-y-auto",
						children: [releases.rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No releases planned." }), releases.rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSelected(r.id),
							className: `w-full px-4 py-3 text-left transition hover:bg-accent ${current?.id === r.id ? "bg-accent" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate text-sm font-medium",
									children: r.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
									tone: statusTone(r.status),
									children: titleCase(r.status)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-0.5 font-mono text-[11px] text-muted-foreground",
								children: [
									r.version || "—",
									" · ",
									d(r.target_date)
								]
							})]
						}, r.id))]
					})
				}), current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						title: current.name,
						hint: `${current.version || "unversioned"} · manager ${nameOf(byId, current.owner_id)} · target ${d(current.target_date)}`,
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
								onClick: requestFieldValidation,
								children: "Request field validation"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
								variant: "primary",
								onClick: () => releases.patch(current.id, { status: "released" }),
								children: "Mark released"
							})]
						}),
						children: [current.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "whitespace-pre-wrap text-sm text-muted-foreground",
							children: current.notes
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Scope complete" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									done,
									"/",
									inRelease.length
								] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									value: pct(done, inRelease.length),
									tone: "good"
								})
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Scope in this release",
						pad: false,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "divide-y divide-border",
							children: [inRelease.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No features assigned to this release yet." }), inRelease.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2 px-4 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm",
										children: f.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground",
										children: nameOf(byId, f.owner_id)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
									tone: statusTone(f.status),
									children: titleCase(f.status)
								})]
							}, f.id))]
						})
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Plan a release to begin." }) })]
			}),
			creating && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "Plan a release",
				fields,
				people,
				initial: { status: "planned" },
				onCancel: () => setCreating(false),
				onSave: async (v) => {
					await releases.insert(v);
					setCreating(false);
				}
			})
		]
	});
}
//#endregion
export { ReleasesPage as component };
