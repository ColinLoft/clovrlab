import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { x as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { Tt as Network, u as Users } from "./_libs/lucide-react.mjs";
import { i as loadOrg, r as buildTree } from "./_ssr/org-DDqmU5f9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.teams.index-Bxg2PmhX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TeamsIndex() {
	const [units, setUnits] = (0, import_react.useState)([]);
	const [people, setPeople] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		loadOrg().then((d) => {
			setUnits(d.units);
			setPeople(d.people);
			setLoading(false);
		});
	}, []);
	const tree = (0, import_react.useMemo)(() => buildTree(units), [units]);
	const divisions = tree.get(null) ?? [];
	const count = (id) => {
		const kids = (tree.get(id) ?? []).map((u) => u.id);
		return people.filter((p) => p.org_unit_id === id || kids.includes(p.org_unit_id ?? "")).length;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-7xl px-6 py-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, { className: "h-5 w-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground",
					children: "Organization"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-semibold tracking-tight",
					children: "Teams"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Every division and team, with its own workspace, roles and members."
				})
			] })]
		}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Loading…"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
			children: divisions.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/teams/$slug",
						params: { slug: d.slug },
						className: "text-base font-semibold hover:text-primary",
						children: d.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3 w-3" }),
							count(d.id),
							" people"
						]
					}),
					d.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: d.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-1.5",
						children: (tree.get(d.id) ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/teams/$slug",
							params: { slug: t.slug },
							className: "rounded-full bg-muted px-2.5 py-1 text-[11px] hover:bg-primary/10 hover:text-primary",
							children: t.name
						}, t.id))
					})
				]
			}, d.id))
		})]
	});
}
//#endregion
export { TeamsIndex as component };
