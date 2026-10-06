import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { Jn as Cpu, M as SquareCheckBig, kn as Flag, v as TriangleAlert } from "./_libs/lucide-react.mjs";
import { C as statusTone, D as useRows, E as usePeople, S as raiseRequest, b as nameOf, c as NewButton, f as Stat, g as d, h as WorkPage, i as Empty, l as Pill, n as Btn, o as Loading, p as StatRow, r as Card, t as Bar, u as RecordDialog, w as titleCase } from "./_ssr/kit-CJyOYuhv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.eng.programs-DihazeNm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProgramsPage() {
	const projects = useRows("eng_projects", { order: { column: "created_at" } });
	const milestones = useRows("eng_milestones", { order: {
		column: "due_date",
		ascending: true
	} });
	const tasks = useRows("eng_tasks", { order: {
		column: "due_date",
		ascending: true
	} });
	const issues = useRows("eng_issues", { order: { column: "created_at" } });
	const { people, byId } = usePeople();
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [creating, setCreating] = (0, import_react.useState)(false);
	const [newMilestone, setNewMilestone] = (0, import_react.useState)(false);
	const current = projects.rows.find((p) => p.id === selected) ?? projects.rows[0] ?? null;
	const projFields = [
		{
			key: "name",
			label: "Program name",
			type: "text",
			required: true
		},
		{
			key: "code",
			label: "Code",
			type: "text",
			placeholder: "ATH-2"
		},
		{
			key: "status",
			label: "Status",
			type: "select",
			options: [
				"planning",
				"active",
				"at_risk",
				"paused",
				"complete"
			].map((v) => ({
				value: v,
				label: titleCase(v)
			}))
		},
		{
			key: "lead_id",
			label: "Program lead",
			type: "user"
		},
		{
			key: "target_date",
			label: "Target date",
			type: "date"
		},
		{
			key: "progress",
			label: "Progress (%)",
			type: "number"
		},
		{
			key: "description",
			label: "Scope",
			type: "textarea",
			full: true
		}
	];
	const msFields = [
		{
			key: "title",
			label: "Milestone",
			type: "text",
			required: true
		},
		{
			key: "due_date",
			label: "Due",
			type: "date"
		},
		{
			key: "status",
			label: "Status",
			type: "select",
			options: [
				"planned",
				"in_progress",
				"at_risk",
				"complete"
			].map((v) => ({
				value: v,
				label: titleCase(v)
			}))
		},
		{
			key: "description",
			label: "Exit criteria",
			type: "textarea",
			full: true
		}
	];
	const active = projects.rows.filter((p) => p.status !== "complete");
	const atRisk = projects.rows.filter((p) => p.status === "at_risk").length;
	const openIssues = issues.rows.filter((i) => i.status !== "closed").length;
	const projMilestones = milestones.rows.filter((m) => m.project_id === current?.id);
	const projTasks = tasks.rows.filter((t) => t.project_id === current?.id && t.status !== "done");
	const projIssues = issues.rows.filter((i) => i.project_id === current?.id && i.status !== "closed");
	const handoffToMfg = async () => {
		if (!current) return;
		if (await raiseRequest({
			from_team: "eng",
			to_team: "mfg",
			subject: `Build release — ${current.name}`,
			details: "Design package is ready for production. Please confirm tooling and stock.",
			entity_type: "eng_projects",
			entity_id: current.id,
			priority: "high"
		})) alert("Handed off to Manufacturing.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		wide: true,
		eyebrow: "Engineering · Programs",
		title: "Program board",
		lede: "Aircraft, autonomy and sensor programs with milestone burn-down, live task load and the open issues blocking each gate.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "New program",
			onClick: () => setCreating(true)
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Active programs",
					value: active.length,
					icon: Cpu
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "At risk",
					value: atRisk,
					icon: TriangleAlert,
					tone: atRisk ? "risk" : "good"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Open milestones",
					value: milestones.rows.filter((m) => m.status !== "complete").length,
					icon: Flag
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Open issues",
					value: openIssues,
					icon: SquareCheckBig,
					tone: openIssues > 10 ? "warn" : "default"
				})
			] }),
			projects.loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-4 xl:grid-cols-[minmax(280px,360px)_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					pad: false,
					title: "Programs",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-h-[70vh] divide-y divide-border overflow-y-auto",
						children: [projects.rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No programs yet." }), projects.rows.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSelected(p.id),
							className: `w-full px-4 py-3 text-left transition hover:bg-accent ${current?.id === p.id ? "bg-accent" : ""}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate text-sm font-medium",
										children: p.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
										tone: statusTone(p.status),
										children: titleCase(p.status)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 font-mono text-[11px] text-muted-foreground",
									children: [
										p.code || "—",
										" · target ",
										d(p.target_date)
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, { value: Number(p.progress ?? 0) })
								})
							]
						}, p.id))]
					})
				}), current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						title: current.name,
						hint: `${titleCase(current.status)} · lead ${nameOf(byId, current.lead_id)} · target ${d(current.target_date)}`,
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
								onClick: () => setNewMilestone(true),
								children: "Add milestone"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
								variant: "primary",
								onClick: handoffToMfg,
								children: "Release to manufacturing"
							})]
						}),
						children: [current.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: current.description
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Program progress" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [Number(current.progress ?? 0), "%"] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, { value: Number(current.progress ?? 0) })
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 lg:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
								title: "Milestones",
								pad: false,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "divide-y divide-border",
									children: [projMilestones.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No milestones." }), projMilestones.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "px-4 py-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate text-sm",
												children: m.title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												value: m.status ?? "planned",
												onChange: (e) => milestones.patch(m.id, { status: e.target.value }),
												className: "rounded border border-border bg-background px-1.5 py-0.5 text-[11px] capitalize",
												children: [
													"planned",
													"in_progress",
													"at_risk",
													"complete"
												].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: s,
													children: titleCase(s)
												}, s))
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] text-muted-foreground",
											children: ["Due ", d(m.due_date)]
										})]
									}, m.id))]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
								title: "Task load",
								pad: false,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "divide-y divide-border",
									children: [projTasks.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No open tasks." }), projTasks.slice(0, 10).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2 px-4 py-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "truncate text-sm",
												children: t.title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[11px] text-muted-foreground",
												children: [
													nameOf(byId, t.assignee_id),
													" · due ",
													d(t.due_date)
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
											tone: statusTone(t.status),
											children: titleCase(t.status)
										})]
									}, t.id))]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
								title: "Blocking issues",
								pad: false,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "divide-y divide-border",
									children: [projIssues.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Nothing blocking." }), projIssues.slice(0, 10).map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2 px-4 py-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate text-sm",
											children: i.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
											tone: String(i.severity).toLowerCase() === "critical" ? "risk" : "warn",
											children: titleCase(i.severity)
										})]
									}, i.id))]
								})
							})
						]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Create a program to get started." }) })]
			}),
			creating && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "New program",
				fields: projFields,
				people,
				initial: {
					status: "planning",
					progress: 0
				},
				onCancel: () => setCreating(false),
				onSave: async (v) => {
					await projects.insert(v);
					setCreating(false);
				}
			}),
			newMilestone && current && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: `Milestone — ${current.name}`,
				fields: msFields,
				people,
				initial: { status: "planned" },
				onCancel: () => setNewMilestone(false),
				onSave: async (v) => {
					await milestones.insert({
						...v,
						project_id: current.id
					});
					setNewMilestone(false);
				}
			})
		]
	});
}
//#endregion
export { ProgramsPage as component };
