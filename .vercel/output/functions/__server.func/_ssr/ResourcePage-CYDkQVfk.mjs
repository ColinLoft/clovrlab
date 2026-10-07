import { i as __toESM } from "../_runtime.mjs";
import { m as require_react } from "../_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { n as supabase } from "./client-B7QlDyqv.mjs";
import { Gt as LoaderCircle, gt as Pencil, n as X, q as Search, st as Plus, x as Trash2 } from "../_libs/lucide-react.mjs";
import { t as EscapeKey } from "./EscapeKey-s0O3wTFo.mjs";
import { t as UserMention } from "./UserMention-D5WbdqmL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ResourcePage-CYDkQVfk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ResourcePage({ config }) {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [ctx, setCtx] = (0, import_react.useState)({
		profiles: [],
		projects: [],
		suppliers: [],
		workorders: [],
		accounts: []
	});
	const [q, setQ] = (0, import_react.useState)("");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [creating, setCreating] = (0, import_react.useState)(false);
	const needs = (0, import_react.useMemo)(() => {
		const s = new Set(config.fields.map((f) => f.type));
		return {
			profiles: s.has("user"),
			projects: s.has("project"),
			suppliers: s.has("supplier"),
			workorders: s.has("workorder"),
			accounts: s.has("account")
		};
	}, [config.fields]);
	const load = async () => {
		setLoading(true);
		const orderCol = config.orderBy?.column ?? "created_at";
		const ascending = config.orderBy?.ascending ?? false;
		let q = supabase.from(config.table).select("*").order(orderCol, { ascending });
		if (config.baseFilter) for (const [k, v] of Object.entries(config.baseFilter)) q = q.eq(k, v);
		const { data } = await q;
		setRows(data ?? []);
		const promises = [
			needs.profiles ? supabase.from("profiles").select("id, full_name, email").order("full_name") : Promise.resolve({ data: [] }),
			needs.projects ? supabase.from("eng_projects").select("id, name, code").order("name") : Promise.resolve({ data: [] }),
			needs.suppliers ? supabase.from("mfg_suppliers").select("id, name").order("name") : Promise.resolve({ data: [] }),
			needs.workorders ? supabase.from("mfg_work_orders").select("id, order_number, product_name").order("created_at", { ascending: false }) : Promise.resolve({ data: [] }),
			needs.accounts ? supabase.from("fin_accounts").select("id, name, code, type").order("code") : Promise.resolve({ data: [] })
		];
		const [p, pr, su, wo, ac] = await Promise.all(promises);
		setCtx({
			profiles: p.data ?? [],
			projects: pr.data ?? [],
			suppliers: su.data ?? [],
			workorders: wo.data ?? [],
			accounts: ac.data ?? []
		});
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		load();
	}, [config.table]);
	const remove = async (id) => {
		if (!confirm(`Delete this ${config.itemName}?`)) return;
		setRows((prev) => prev.filter((r) => r.id !== id));
		const { error } = await supabase.from(config.table).delete().eq("id", id);
		if (error) {
			alert(error.message);
			load();
		}
	};
	const filtered = (0, import_react.useMemo)(() => {
		if (!q.trim() || !config.searchable?.length) return rows;
		const s = q.toLowerCase();
		return rows.filter((r) => config.searchable.some((k) => String(r[k] ?? "").toLowerCase().includes(s)));
	}, [
		rows,
		q,
		config.searchable
	]);
	const kpis = config.kpis?.(rows) ?? [];
	const Icon = config.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-[1600px] px-8 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-7 flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground",
						children: config.eyebrow
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-semibold tracking-tight",
						children: config.title
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setCreating(true),
					className: "inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }),
						" New ",
						config.itemName
					]
				})]
			}),
			kpis.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-7 grid grid-cols-2 gap-4 md:grid-cols-4",
				children: kpis.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-5 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-wider text-muted-foreground",
								children: k.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(k.icon, { className: "h-4 w-4 text-muted-foreground" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-2xl font-semibold",
							children: k.value
						}),
						k.hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[11px] text-muted-foreground",
							children: k.hint
						})
					]
				}, k.label))
			}),
			config.searchable?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 relative max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: `Search ${config.itemName}s...`,
					className: "w-full rounded-md border border-border bg-background pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-12 text-center text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto h-6 w-6 animate-spin" })
				}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-12 text-center text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [
							"No ",
							config.itemName,
							"s yet."
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setCreating(true),
						className: "mt-3 text-sm text-primary hover:underline",
						children: "Create the first one"
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [config.columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: `px-5 py-3.5 font-medium ${c.className ?? ""}`,
								children: c.label
							}, c.key)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-5 py-3.5 w-24" })] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border hover:bg-muted/20",
							children: [config.columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: `px-5 py-3.5 ${c.className ?? ""}`,
								children: c.render ? c.render(r, ctx) : String(r[c.key] ?? "—")
							}, c.key)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-end gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setEditing(r),
										className: "rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground",
										"aria-label": "Edit",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => remove(r.id),
										className: "rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
										"aria-label": "Delete",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
									})]
								})
							})]
						}, r.id)) })]
					})
				})
			}),
			(creating || editing) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceDialog, {
				config,
				ctx,
				row: editing,
				onClose: () => {
					setCreating(false);
					setEditing(null);
				},
				onSaved: () => {
					setCreating(false);
					setEditing(null);
					load();
				}
			})
		]
	});
}
function ResourceDialog({ config, ctx, row, onClose, onSaved }) {
	const [form, setForm] = (0, import_react.useState)(() => {
		if (row) return { ...row };
		const base = {};
		for (const f of config.fields) if (f.type === "tags") base[f.key] = [];
		else if (f.type === "bool") base[f.key] = false;
		else base[f.key] = "";
		return {
			...base,
			...config.defaults ?? {},
			...config.baseFilter ?? {}
		};
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const isEdit = !!row;
	const set = (k, v) => setForm((prev) => ({
		...prev,
		[k]: v
	}));
	const submit = async () => {
		setSaving(true);
		const { data: { user } } = await supabase.auth.getUser();
		const payload = {};
		for (const f of config.fields) {
			let v = form[f.key];
			if (v === "" || v == null) {
				if (f.required) {
					alert(`${f.label} is required`);
					setSaving(false);
					return;
				}
				v = null;
			} else if (f.type === "number") v = Number(v);
			else if (f.type === "tags") v = Array.isArray(v) ? v : String(v).split(",").map((s) => s.trim()).filter(Boolean);
			payload[f.key] = v;
		}
		if (!isEdit && user && !config.noCreatedBy) payload.created_by = user.id;
		if (!isEdit && config.baseFilter) Object.assign(payload, config.baseFilter);
		let error = null;
		if (isEdit) ({error} = await supabase.from(config.table).update(payload).eq("id", row.id));
		else ({error} = await supabase.from(config.table).insert(payload));
		setSaving(false);
		if (error) {
			alert(error.message);
			return;
		}
		onSaved();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4",
		onClick: onClose,
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Record form",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EscapeKey, { onEscape: onClose }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			className: "w-full max-w-2xl rounded-xl border border-border bg-card shadow-2xl",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-lg font-semibold",
						children: [
							isEdit ? "Edit" : "New",
							" ",
							config.itemName
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded p-1 text-muted-foreground hover:bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-[70vh] overflow-y-auto p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 gap-4 md:grid-cols-2",
						children: config.fields.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: f.full || f.type === "textarea" ? "md:col-span-2" : "",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground",
								children: [f.label, f.required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-destructive",
									children: " *"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldInput, {
								field: f,
								value: form[f.key],
								onChange: (v) => set(f.key, v),
								ctx
							})]
						}, f.key))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-end gap-2 border-t border-border p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded-md border border-border px-3 py-2 text-sm hover:bg-muted",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: submit,
						disabled: saving,
						className: "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50",
						children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }), isEdit ? "Save changes" : `Create ${config.itemName}`]
					})]
				})
			]
		})]
	});
}
function FieldInput({ field, value, onChange, ctx }) {
	const base = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary";
	if (field.type === "textarea") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		rows: 4,
		value: value ?? "",
		onChange: (e) => onChange(e.target.value),
		placeholder: field.placeholder,
		className: base
	});
	if (field.type === "number") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type: "number",
		step: "any",
		value: value ?? "",
		onChange: (e) => onChange(e.target.value),
		placeholder: field.placeholder,
		className: base
	});
	if (field.type === "date") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type: "date",
		value: value ?? "",
		onChange: (e) => onChange(e.target.value),
		className: base
	});
	if (field.type === "bool") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex items-center gap-2 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "checkbox",
				checked: !!value,
				onChange: (e) => onChange(e.target.checked)
			}),
			" ",
			field.placeholder ?? "Enabled"
		]
	});
	if (field.type === "tags") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		value: (Array.isArray(value) ? value : []).join(", "),
		onChange: (e) => onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean)),
		placeholder: "tag1, tag2",
		className: base
	});
	if (field.type === "select") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
		value: value ?? "",
		onChange: (e) => onChange(e.target.value),
		className: base,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: "",
			children: "—"
		}), field.options?.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: o.value,
			children: o.label
		}, o.value))]
	});
	if (field.type === "user") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
		value: value ?? "",
		onChange: (e) => onChange(e.target.value),
		className: base,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: "",
			children: "Unassigned"
		}), ctx.profiles.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: p.id,
			children: p.full_name || p.email || p.id.slice(0, 8)
		}, p.id))]
	});
	if (field.type === "project") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
		value: value ?? "",
		onChange: (e) => onChange(e.target.value),
		className: base,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: "",
			children: "No project"
		}), ctx.projects.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: p.id,
			children: p.code ? `${p.code} · ${p.name}` : p.name
		}, p.id))]
	});
	if (field.type === "supplier") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
		value: value ?? "",
		onChange: (e) => onChange(e.target.value),
		className: base,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: "",
			children: "—"
		}), ctx.suppliers.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: p.id,
			children: p.name
		}, p.id))]
	});
	if (field.type === "workorder") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
		value: value ?? "",
		onChange: (e) => onChange(e.target.value),
		className: base,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: "",
			children: "—"
		}), ctx.workorders.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
			value: p.id,
			children: [
				p.order_number,
				" — ",
				p.product_name
			]
		}, p.id))]
	});
	if (field.type === "account") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
		value: value ?? "",
		onChange: (e) => onChange(e.target.value),
		className: base,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: "",
			children: "—"
		}), ctx.accounts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: a.id,
			children: a.code ? `${a.code} · ${a.name}` : a.name
		}, a.id))]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type: "text",
		value: value ?? "",
		onChange: (e) => onChange(e.target.value),
		placeholder: field.placeholder,
		className: base
	});
}
function StatusBadge({ value, palette }) {
	if (!value) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-muted-foreground",
		children: "—"
	});
	const cls = palette?.[value] ?? "border-border bg-muted/40 text-muted-foreground";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${cls}`,
		children: value.replace(/_/g, " ")
	});
}
function UserCell({ userId, profiles }) {
	if (!userId) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-muted-foreground text-xs",
		children: "Unassigned"
	});
	const p = profiles.find((x) => x.id === userId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
		userId,
		name: p?.full_name || p?.email || "User"
	});
}
function ProjectCell({ projectId, projects }) {
	if (!projectId) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-muted-foreground text-xs",
		children: "—"
	});
	const p = projects.find((x) => x.id === projectId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-sm",
		children: p?.code ?? p?.name ?? "—"
	});
}
function AccountCell({ accountId, accounts }) {
	if (!accountId) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-muted-foreground text-xs",
		children: "—"
	});
	const a = accounts.find((x) => x.id === accountId);
	if (!a) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-muted-foreground text-xs",
		children: "—"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-sm font-mono text-xs",
		children: a.code ? `${a.code} ${a.name}` : a.name
	});
}
function DateCell({ date }) {
	if (!date) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-muted-foreground text-xs",
		children: "—"
	});
	const d = new Date(date);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-sm text-muted-foreground",
		children: d.toLocaleDateString(void 0, {
			month: "short",
			day: "numeric",
			year: "numeric"
		})
	});
}
//#endregion
export { StatusBadge as a, ResourcePage as i, DateCell as n, UserCell as o, ProjectCell as r, AccountCell as t };
