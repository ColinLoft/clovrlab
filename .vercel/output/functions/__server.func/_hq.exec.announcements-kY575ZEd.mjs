import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { Bn as Eye, It as Megaphone, hr as CheckCheck } from "./_libs/lucide-react.mjs";
import { D as useRows, E as usePeople, _ as db, b as nameOf, c as NewButton, f as Stat, h as WorkPage, i as Empty, o as Loading, p as StatRow, r as Card, t as Bar, u as RecordDialog, v as dt, x as pct } from "./_ssr/kit-L_nfYwfF.mjs";
import { t as UserMention } from "./_ssr/UserMention-D5WbdqmL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.exec.announcements-kY575ZEd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var fields = [
	{
		key: "title",
		label: "Headline",
		type: "text",
		required: true,
		full: true
	},
	{
		key: "body",
		label: "Message",
		type: "textarea",
		required: true,
		full: true
	},
	{
		key: "published_at",
		label: "Publish at",
		type: "datetime"
	}
];
/** Leadership's broadcast channel — with read-through so nothing is assumed. */
function Announcements() {
	const { rows, loading, insert, remove } = useRows("announcements", { order: { column: "published_at" } });
	const { byId } = usePeople();
	const [acks, setAcks] = (0, import_react.useState)({});
	const [headcount, setHeadcount] = (0, import_react.useState)(0);
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		(async () => {
			const [{ data: a }, { count }] = await Promise.all([db.from("announcement_acks").select("announcement_id, viewed_at, acknowledged_at").limit(2e3), db.from("profiles").select("id", {
				count: "exact",
				head: true
			})]);
			const m = {};
			for (const r of a ?? []) {
				const e = m[r.announcement_id] ??= {
					viewed: 0,
					acked: 0
				};
				if (r.viewed_at) e.viewed++;
				if (r.acknowledged_at) e.acked++;
			}
			setAcks(m);
			setHeadcount(count ?? 0);
		})();
	}, [rows.length]);
	const totalAcked = Object.values(acks).reduce((s, v) => s + v.acked, 0);
	const totalViewed = Object.values(acks).reduce((s, v) => s + v.viewed, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		eyebrow: "Leadership",
		title: "Company announcements",
		lede: "Everything leadership has broadcast org-wide, and how much of the company actually read and acknowledged it.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "New announcement",
			onClick: () => setOpen(true)
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, {
				cols: 4,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Announcements",
						value: rows.length,
						icon: Megaphone
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Total reads",
						value: totalViewed,
						icon: Eye
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Acknowledgements",
						value: totalAcked,
						icon: CheckCheck,
						tone: "good"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Headcount reached",
						value: headcount,
						hint: "Profiles in the org"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 space-y-4",
				children: [
					loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) }),
					!loading && rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Nothing has been announced yet." }) }),
					rows.map((r) => {
						const a = acks[r.id] ?? {
							viewed: 0,
							acked: 0
						};
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "rounded-lg border border-border bg-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
								className: "flex flex-wrap items-center gap-3 border-b border-border px-4 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "min-w-0 flex-1 text-sm font-semibold",
										children: r.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: dt(r.published_at ?? r.created_at)
									}),
									r.author_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
										userId: r.author_id,
										name: nameOf(byId, r.author_id),
										size: "xs"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => remove(r.id),
										className: "text-[11px] text-muted-foreground hover:text-destructive",
										children: "delete"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "whitespace-pre-wrap text-sm leading-6 text-muted-foreground",
									children: r.body
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 grid gap-3 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-[11px] text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Read" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "tabular-nums",
											children: [
												a.viewed,
												"/",
												headcount,
												" · ",
												pct(a.viewed, headcount || 1),
												"%"
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											value: a.viewed,
											max: headcount || 1
										})
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-[11px] text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Acknowledged" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "tabular-nums",
											children: [
												a.acked,
												"/",
												headcount,
												" · ",
												pct(a.acked, headcount || 1),
												"%"
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											value: a.acked,
											max: headcount || 1,
											tone: "good"
										})
									})] })]
								})]
							})]
						}, r.id);
					})
				]
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "Publish an announcement",
				fields,
				initial: { published_at: (/* @__PURE__ */ new Date()).toISOString().slice(0, 16) },
				onCancel: () => setOpen(false),
				onSave: async (v) => {
					const { data: u } = await (await import("./_ssr/client-B7QlDyqv.mjs").then((n) => n.t).then((n) => n.t)).supabase.auth.getUser();
					await insert({
						...v,
						author_id: u.user?.id ?? null
					});
					setOpen(false);
				}
			})
		]
	});
}
//#endregion
export { Announcements as component };
