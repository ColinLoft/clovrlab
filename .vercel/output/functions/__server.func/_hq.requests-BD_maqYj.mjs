import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { K as Send, Vr as ArrowLeftRight, cr as CircleCheck, in as Inbox } from "./_libs/lucide-react.mjs";
import { c as TEAMS } from "./_ssr/router-E4663KdI.mjs";
import { C as statusTone, D as useRows, E as usePeople, T as useMe, b as nameOf, c as NewButton, d as Select, f as Stat, g as d, h as WorkPage, i as Empty, l as Pill, n as Btn, o as Loading, p as StatRow, r as Card, u as RecordDialog, w as titleCase } from "./_ssr/kit-CJyOYuhv.mjs";
import { r as useCurrentApp } from "./_ssr/app-context-JK8H7_Nj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.requests-BD_maqYj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var teamLabel = (v) => TEAMS.find((t) => t.value === v)?.label ?? titleCase(v);
function RequestsPage() {
	const { app } = useCurrentApp();
	const team = app?.slug ?? "hq";
	const { rows, loading, insert, patch } = useRows("team_requests", { order: { column: "created_at" } });
	const { people, byId } = usePeople();
	const me = useMe();
	const [tab, setTab] = (0, import_react.useState)("inbox");
	const [status, setStatus] = (0, import_react.useState)("open");
	const [creating, setCreating] = (0, import_react.useState)(false);
	const fields = [
		{
			key: "to_team",
			label: "Send to team",
			type: "select",
			required: true,
			options: TEAMS
		},
		{
			key: "subject",
			label: "Subject",
			type: "text",
			required: true,
			full: true
		},
		{
			key: "details",
			label: "What do you need?",
			type: "textarea",
			full: true
		},
		{
			key: "priority",
			label: "Priority",
			type: "select",
			options: [
				"low",
				"normal",
				"high",
				"urgent"
			].map((v) => ({
				value: v,
				label: titleCase(v)
			}))
		},
		{
			key: "due_date",
			label: "Needed by",
			type: "date"
		},
		{
			key: "assignee_id",
			label: "Suggested owner",
			type: "user"
		}
	];
	const scoped = (0, import_react.useMemo)(() => {
		let list = rows;
		if (tab === "inbox") list = list.filter((r) => r.to_team === team);
		if (tab === "sent") list = list.filter((r) => r.from_team === team);
		if (status !== "all") list = list.filter((r) => status === "open" ? r.status !== "closed" && r.status !== "declined" : r.status === status);
		return list;
	}, [
		rows,
		tab,
		team,
		status
	]);
	const inboxOpen = rows.filter((r) => r.to_team === team && r.status !== "closed").length;
	const sentOpen = rows.filter((r) => r.from_team === team && r.status !== "closed").length;
	const overdue = rows.filter((r) => r.to_team === team && r.due_date && r.due_date < (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) && r.status !== "closed").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		wide: true,
		eyebrow: "Between teams",
		title: "Team requests",
		lede: "The chain of command between workspaces. Ops asks Engineering for a fix, Engineering asks Manufacturing for parts, everyone keeps leadership in the loop.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "New request",
			onClick: () => setCreating(true)
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, {
				cols: 3,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "In your inbox",
						value: inboxOpen,
						icon: Inbox,
						tone: inboxOpen ? "warn" : "good"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Waiting on others",
						value: sentOpen,
						icon: Send
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Past due",
						value: overdue,
						icon: CircleCheck,
						tone: overdue ? "risk" : "good"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex rounded-md border border-border bg-card p-0.5",
					children: [
						"inbox",
						"sent",
						"all"
					].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setTab(t),
						className: `rounded px-3 py-1.5 text-sm capitalize ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`,
						children: t
					}, t))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
					value: status,
					onChange: setStatus,
					options: [
						{
							value: "open",
							label: "Open"
						},
						{
							value: "in_progress",
							label: "In progress"
						},
						{
							value: "closed",
							label: "Closed"
						},
						{
							value: "declined",
							label: "Declined"
						},
						{
							value: "all",
							label: "Everything"
						}
					]
				})]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-2",
				children: [scoped.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Nothing here. Requests you raise or receive show up in this list." }) }), scoped.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
					className: "rounded-lg border border-border bg-card p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeftRight, { className: "h-3.5 w-3.5 text-muted-foreground" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: [
												teamLabel(r.from_team),
												" → ",
												teamLabel(r.to_team)
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
											tone: r.priority === "urgent" ? "risk" : r.priority === "high" ? "warn" : "muted",
											children: titleCase(r.priority)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
											tone: statusTone(r.status),
											children: titleCase(r.status)
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-1.5 text-sm font-semibold",
									children: r.subject
								}),
								r.details && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 whitespace-pre-wrap text-sm text-muted-foreground",
									children: r.details
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1.5 text-[11px] text-muted-foreground",
									children: [
										"Raised by ",
										nameOf(byId, r.requested_by),
										" · owner ",
										nameOf(byId, r.assignee_id),
										r.due_date ? ` · needed by ${d(r.due_date)}` : ""
									]
								}),
								r.resolution && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 rounded bg-muted/50 p-2 text-xs",
									children: ["Resolution: ", r.resolution]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-shrink-0 flex-wrap gap-1.5",
							children: [
								r.to_team === team && r.status === "open" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
									onClick: () => patch(r.id, {
										status: "in_progress",
										assignee_id: r.assignee_id ?? me
									}),
									children: "Accept"
								}),
								r.to_team === team && r.status !== "closed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
									variant: "primary",
									onClick: async () => {
										const resolution = prompt("How was this resolved?");
										if (resolution === null) return;
										patch(r.id, {
											status: "closed",
											resolution
										});
									},
									children: "Close out"
								}),
								r.to_team === team && r.status !== "declined" && r.status !== "closed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
									variant: "danger",
									onClick: () => patch(r.id, { status: "declined" }),
									children: "Decline"
								})
							]
						})]
					})
				}, r.id))]
			}),
			creating && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "Raise a request with another team",
				fields,
				people,
				initial: { priority: "normal" },
				onCancel: () => setCreating(false),
				onSave: async (v) => {
					await insert({
						...v,
						from_team: team,
						status: "open",
						requested_by: me
					});
					setCreating(false);
				}
			})
		]
	});
}
//#endregion
export { RequestsPage as component };
