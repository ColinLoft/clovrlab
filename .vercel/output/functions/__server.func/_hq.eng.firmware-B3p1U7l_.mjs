import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { Ar as Binary, xn as GitBranch } from "./_libs/lucide-react.mjs";
import { C as statusTone, D as useRows, E as usePeople, b as nameOf, c as NewButton, f as Stat, h as WorkPage, i as Empty, l as Pill, o as Loading, p as StatRow, r as Card, u as RecordDialog, v as dt } from "./_ssr/kit-L_nfYwfF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.eng.firmware-B3p1U7l_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Firmware() {
	const projects = useRows("eng_projects", { order: {
		column: "name",
		ascending: true
	} });
	const repos = useRows("eng_firmware_repos", { order: {
		column: "name",
		ascending: true
	} });
	const { people, byId } = usePeople();
	const [open, setOpen] = (0, import_react.useState)(false);
	const fields = (0, import_react.useMemo)(() => [
		{
			key: "name",
			label: "Repository",
			type: "text",
			required: true
		},
		{
			key: "project_id",
			label: "Program",
			type: "select",
			options: projects.rows.map((p) => ({
				value: p.id,
				label: p.name
			}))
		},
		{
			key: "language",
			label: "Language",
			type: "text",
			placeholder: "C++, Rust, Python"
		},
		{
			key: "status",
			label: "Status",
			type: "select",
			options: [
				"active",
				"in_review",
				"frozen",
				"archived"
			].map((v) => ({
				value: v,
				label: v
			}))
		},
		{
			key: "latest_version",
			label: "Latest version",
			type: "text",
			placeholder: "v1.4.2"
		},
		{
			key: "owner_id",
			label: "Maintainer",
			type: "user"
		},
		{
			key: "repo_url",
			label: "Repository URL",
			type: "text",
			full: true
		},
		{
			key: "description",
			label: "What it does",
			type: "textarea",
			full: true
		}
	], [projects.rows]);
	const frozen = repos.rows.filter((r) => r.status === "frozen");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		eyebrow: "Engineering",
		title: "Firmware & autonomy",
		lede: "Flight software, detection models, and ground tooling — what version is flying and who maintains it.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "Register repo",
			onClick: () => setOpen(true)
		}),
		wide: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Repositories",
					value: repos.rows.length,
					icon: Binary
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Active",
					value: repos.rows.filter((r) => r.status === "active").length,
					tone: "good",
					icon: GitBranch
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Frozen for flight",
					value: frozen.length,
					tone: "warn",
					hint: "No changes without an ECO"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Unmaintained",
					value: repos.rows.filter((r) => !r.owner_id).length,
					tone: repos.rows.some((r) => !r.owner_id) ? "risk" : "good"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3",
				children: repos.loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : repos.rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No repositories registered." }) : repos.rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-medium",
								children: r.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									r.language || "—",
									" · ",
									r.latest_version || "unversioned"
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
							tone: statusTone(r.status),
							children: r.status || "active"
						})]
					}),
					r.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted-foreground",
						children: r.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs text-muted-foreground",
						children: ["Maintainer: ", nameOf(byId, r.owner_id)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-[11px] text-muted-foreground",
						children: ["Updated ", dt(r.updated_at ?? r.created_at)]
					}),
					r.repo_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: r.repo_url,
						target: "_blank",
						rel: "noreferrer",
						className: "mt-3 inline-block text-xs font-medium text-primary hover:underline",
						children: "Open repository"
					})
				] }, r.id))
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "Register repository",
				fields,
				people,
				initial: { status: "active" },
				onCancel: () => setOpen(false),
				onSave: async (v) => {
					await repos.insert(v);
					setOpen(false);
				}
			})
		]
	});
}
//#endregion
export { Firmware as component };
