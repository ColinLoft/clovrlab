import { i as __toESM } from "../_runtime.mjs";
import { r as supabase } from "./client-PsXr_elE.mjs";
import { m as require_react } from "../_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { Gt as LoaderCircle, n as X, q as Search, st as Plus } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kit-CJyOYuhv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Workbench kit — the shared primitives every team workspace is built from.
* Pages compose these into their own layout; nothing here forces a single
* "generic list page" look.
*/
var db = supabase;
function useRows(table, opts = {}) {
	const { select = "*", order, shape, limit = 500 } = opts;
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	const reload = (0, import_react.useCallback)(async () => {
		let q = db.from(table).select(select);
		if (order) q = q.order(order.column, {
			ascending: order.ascending ?? false,
			nullsFirst: false
		});
		if (shape) q = shape(q);
		const { data, error } = await q.limit(limit);
		if (error) setError(error.message);
		setRows(data ?? []);
		setLoading(false);
	}, [table, select]);
	(0, import_react.useEffect)(() => {
		setLoading(true);
		reload();
	}, [reload]);
	return {
		rows,
		loading,
		error,
		reload,
		insert: (0, import_react.useCallback)(async (values) => {
			const { data, error } = await db.from(table).insert(values).select().single();
			if (error) {
				alert(error.message);
				return null;
			}
			await reload();
			return data;
		}, [table, reload]),
		patch: (0, import_react.useCallback)(async (id, values) => {
			setRows((prev) => prev.map((r) => r.id === id ? {
				...r,
				...values
			} : r));
			const { error } = await db.from(table).update(values).eq("id", id);
			if (error) {
				alert(error.message);
				reload();
			}
		}, [table, reload]),
		remove: (0, import_react.useCallback)(async (id) => {
			if (!confirm("Delete this record?")) return;
			setRows((prev) => prev.filter((r) => r.id !== id));
			const { error } = await db.from(table).delete().eq("id", id);
			if (error) {
				alert(error.message);
				reload();
			}
		}, [table, reload]),
		setRows
	};
}
function usePeople() {
	const [people, setPeople] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data } = await db.from("profiles").select("id, full_name, email, title").order("full_name");
			setPeople(data ?? []);
		})();
	}, []);
	return {
		people,
		byId: (0, import_react.useMemo)(() => new Map(people.map((p) => [p.id, p])), [people])
	};
}
function useMe() {
	const [me, setMe] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		supabase.auth.getUser().then(({ data }) => setMe(data.user?.id ?? null));
	}, []);
	return me;
}
/** Raise a cross-team hand-off so the owning team sees the work in their inbox. */
async function raiseRequest(input) {
	const { data: u } = await supabase.auth.getUser();
	const { error } = await db.from("team_requests").insert({
		...input,
		requested_by: u.user?.id ?? null
	});
	if (error) {
		alert(error.message);
		return false;
	}
	return true;
}
var money = (n) => n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `$${(n / 1e3).toFixed(1)}K` : `$${Math.round(n || 0)}`;
var pct = (a, b) => b > 0 ? Math.round(a / b * 100) : 0;
var dt = (v) => v ? new Date(v).toLocaleString(void 0, {
	month: "short",
	day: "numeric",
	hour: "numeric",
	minute: "2-digit"
}) : "—";
var d = (v) => v ? (/* @__PURE__ */ new Date(v + (v.length === 10 ? "T00:00:00" : ""))).toLocaleDateString(void 0, {
	month: "short",
	day: "numeric"
}) : "—";
var nameOf = (byId, id) => id && (byId.get(id)?.full_name || byId.get(id)?.email) || "Unassigned";
var titleCase = (s) => s ? s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "—";
function WorkPage({ eyebrow, title, lede, actions, children, wide = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: `mx-auto w-full ${wide ? "max-w-[1700px]" : "max-w-[1400px]"} px-5 py-6 sm:px-7`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex flex-col gap-3 border-b border-border pb-5 md:flex-row md:items-end md:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-semibold uppercase tracking-[0.2em] text-primary",
					children: eyebrow
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1.5 text-2xl font-semibold tracking-tight sm:text-3xl",
					children: title
				}),
				lede && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground",
					children: lede
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: actions
			})]
		}), children]
	});
}
function Stat({ label, value, hint, tone = "default", icon: Icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-card p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium uppercase tracking-wider text-muted-foreground",
					children: label
				}), Icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5 text-muted-foreground" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: `mt-2 text-2xl font-semibold tabular-nums ${tone === "risk" ? "text-destructive" : tone === "warn" ? "text-amber-500" : tone === "good" ? "text-emerald-500" : "text-foreground"}`,
				children: value
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: hint
			})
		]
	});
}
var COLS = {
	2: "lg:grid-cols-2",
	3: "lg:grid-cols-3",
	4: "lg:grid-cols-4",
	5: "lg:grid-cols-5",
	6: "lg:grid-cols-6"
};
function StatRow({ children, cols = 4 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: `mt-5 grid gap-3 sm:grid-cols-2 ${COLS[cols] ?? COLS[4]}`,
		children
	});
}
function Card({ title, hint, action, children, className = "", pad = true }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: `rounded-lg border border-border bg-card ${className}`,
		children: [(title || action) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center justify-between gap-3 border-b border-border px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold",
				children: title
			}), hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: hint
			})] }), action]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: pad ? "p-4" : "",
			children
		})]
	});
}
function Empty({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "py-8 text-center text-sm text-muted-foreground",
		children
	});
}
function Loading() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Loading…"]
	});
}
var TONE = {
	good: "bg-emerald-500/12 text-emerald-500 border-emerald-500/25",
	warn: "bg-amber-500/12 text-amber-500 border-amber-500/25",
	risk: "bg-destructive/12 text-destructive border-destructive/25",
	info: "bg-primary/12 text-primary border-primary/25",
	muted: "bg-muted text-muted-foreground border-border"
};
function Pill({ children, tone = "muted" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize ${TONE[tone]}`,
		children
	});
}
function statusTone(status) {
	const s = (status ?? "").toLowerCase();
	if (/(critical|grounded|blocked|overdue|failed|rejected|denied|escalated|confirmed)/.test(s)) return "risk";
	if (/(warn|at_risk|pending|review|waiting|requested|in_review|maintenance|unconfirmed|new)/.test(s)) return "warn";
	if (/(done|complete|closed|approved|resolved|on_track|available|active|released|authorized|paid|won)/.test(s)) return "good";
	if (/(in_progress|flying|planned|building|open|discovery)/.test(s)) return "info";
	return "muted";
}
function Bar({ value, max = 100, tone = "primary" }) {
	const w = Math.min(100, Math.max(2, pct(value, max || 1)));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-1.5 w-full overflow-hidden rounded-full bg-muted",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `h-full rounded-full ${tone === "risk" ? "bg-destructive" : tone === "good" ? "bg-emerald-500" : "bg-primary"} transition-all`,
			style: { width: `${w}%` }
		})
	});
}
function Toolbar({ q, setQ, placeholder = "Search…", children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-5 flex flex-wrap items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-[220px] flex-1 items-center gap-2 rounded-md border border-border bg-card px-3 py-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: q,
				onChange: (e) => setQ(e.target.value),
				placeholder,
				className: "w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
			})]
		}), children]
	});
}
function Select({ value, onChange, options, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		value,
		onChange: (e) => onChange(e.target.value),
		className: `rounded-md border border-border bg-card px-2.5 py-2 text-sm outline-none focus:border-primary ${className}`,
		children: options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: o.value,
			children: o.label
		}, o.value))
	});
}
function Btn({ children, onClick, variant = "default", type = "button", disabled, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		onClick,
		disabled,
		className: `inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition disabled:opacity-50 ${variant === "primary" ? "bg-primary text-primary-foreground hover:opacity-90" : variant === "danger" ? "border border-destructive/40 text-destructive hover:bg-destructive/10" : variant === "ghost" ? "text-muted-foreground hover:text-foreground" : "border border-border bg-card hover:bg-accent"} ${className}`,
		children
	});
}
function Kanban({ columns, rows, statusKey, onMove, render, onOpen }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-5 grid gap-3",
		style: { gridTemplateColumns: `repeat(${columns.length}, minmax(220px, 1fr))` },
		children: columns.map((c) => {
			const items = rows.filter((r) => String(r[statusKey] ?? "").toLowerCase() === c.key);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-muted/30",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center justify-between border-b border-border px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
						children: c.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded bg-card px-1.5 text-[11px] tabular-nums text-muted-foreground",
						children: items.length
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 p-2",
					children: [items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-1 py-4 text-center text-xs text-muted-foreground",
						children: "Empty"
					}), items.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "group rounded-md border border-border bg-card p-3 text-sm shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "w-full text-left",
							onClick: () => onOpen?.(r),
							children: render(r)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 hidden gap-1 group-hover:flex",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: String(r[statusKey] ?? ""),
								onChange: (e) => onMove(r, e.target.value),
								className: "w-full rounded border border-border bg-background px-1.5 py-1 text-[11px]",
								children: columns.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: o.key,
									children: ["Move to ", o.label]
								}, o.key))
							})
						})]
					}, r.id))]
				})]
			}, c.key);
		})
	});
}
function RecordForm({ fields, value, people, onChange }) {
	const set = (k, v) => onChange({
		...value,
		[k]: v
	});
	const input = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-3 sm:grid-cols-2",
		children: fields.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: `block text-sm ${f.full ? "sm:col-span-2" : ""}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "mb-1 block text-xs font-medium text-muted-foreground",
				children: [f.label, f.required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-destructive",
					children: " *"
				})]
			}), f.type === "textarea" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				rows: 3,
				className: input,
				placeholder: f.placeholder,
				value: value[f.key] ?? "",
				onChange: (e) => set(f.key, e.target.value)
			}) : f.type === "select" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: input,
				value: value[f.key] ?? "",
				onChange: (e) => set(f.key, e.target.value),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "Select…"
				}), (f.options ?? []).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: o.value,
					children: o.label
				}, o.value))]
			}) : f.type === "user" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: input,
				value: value[f.key] ?? "",
				onChange: (e) => set(f.key, e.target.value || null),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "Unassigned"
				}), (people ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: p.id,
					children: p.full_name || p.email
				}, p.id))]
			}) : f.type === "bool" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "checkbox",
				className: "h-4 w-4 accent-[var(--primary)]",
				checked: !!value[f.key],
				onChange: (e) => set(f.key, e.target.checked)
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: f.type === "datetime" ? "datetime-local" : f.type,
				className: input,
				placeholder: f.placeholder,
				value: value[f.key] ?? "",
				onChange: (e) => set(f.key, f.type === "number" ? e.target.value === "" ? null : Number(e.target.value) : e.target.value)
			})]
		}, f.key))
	});
}
function Modal({ title, onClose, children, footer, wide }) {
	(0, import_react.useEffect)(() => {
		const h = (e) => e.key === "Escape" && onClose();
		window.addEventListener("keydown", h);
		return () => window.removeEventListener("keydown", h);
	}, [onClose]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/70 p-4 backdrop-blur-sm",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `mt-12 w-full ${wide ? "max-w-3xl" : "max-w-xl"} rounded-lg border border-border bg-card shadow-xl`,
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center justify-between border-b border-border px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "text-muted-foreground hover:text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-4",
					children
				}),
				footer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
					className: "flex justify-end gap-2 border-t border-border px-4 py-3",
					children: footer
				})
			]
		})
	});
}
/** Create/edit dialog driven by a field list. */
function RecordDialog({ title, fields, initial = {}, people, onCancel, onSave }) {
	const [value, setValue] = (0, import_react.useState)(initial);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const save = async () => {
		for (const f of fields) if (f.required && !value[f.key]) return alert(`${f.label} is required`);
		setBusy(true);
		await onSave(value);
		setBusy(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
		title,
		onClose: onCancel,
		wide: true,
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
			onClick: onCancel,
			children: "Cancel"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
			variant: "primary",
			onClick: save,
			disabled: busy,
			children: busy ? "Saving…" : "Save"
		})] }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordForm, {
			fields,
			value,
			people,
			onChange: setValue
		})
	});
}
function NewButton({ label, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
		variant: "primary",
		onClick,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), label]
	});
}
//#endregion
export { statusTone as C, useRows as D, usePeople as E, raiseRequest as S, useMe as T, db as _, Kanban as a, nameOf as b, NewButton as c, Select as d, Stat as f, d as g, WorkPage as h, Empty as i, Pill as l, Toolbar as m, Btn as n, Loading as o, StatRow as p, Card as r, Modal as s, Bar as t, RecordDialog as u, dt as v, titleCase as w, pct as x, money as y };
