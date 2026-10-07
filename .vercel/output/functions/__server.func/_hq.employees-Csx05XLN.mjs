import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { r as createServerFn } from "./_ssr/server-DjCj4rPg.mjs";
import { n as supabase } from "./_ssr/client-B5YVWdzA.mjs";
import { Bt as Mail, Fr as Ban, Tr as Building2, er as ClipboardCheck, m as UserCheck, mr as Check, n as X, q as Search, sn as IdCard, st as Plus, u as Users, x as Trash2 } from "./_libs/lucide-react.mjs";
import { t as createSsrRpc } from "./_ssr/createSsrRpc-CkcSjSkU.mjs";
import { t as requireSupabaseAuth } from "./_ssr/auth-middleware-DJmRtREQ.mjs";
import { t as EscapeKey } from "./_ssr/EscapeKey-s0O3wTFo.mjs";
import { t as UserMention } from "./_ssr/UserMention-B7i_AS2Q.mjs";
import { t as useServerFn } from "./_ssr/useServerFn-CrZF2pjq.mjs";
import { i as stringType, r as objectType } from "./_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.employees-Csx05XLN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var inviteSchema = objectType({
	email: stringType().email(),
	full_name: stringType().optional().nullable(),
	department: stringType().optional().nullable(),
	role: stringType()
});
/**
* Admin-only: insert an invite row (which the DB signup trigger honors) and send
* a Supabase auth invite email so the recipient can accept in one click.
*/
var sendInvite = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => inviteSchema.parse(data)).handler(createSsrRpc("776ceea5b5ea6fa0dec74d45aafd1098a9888305334c1dcffbb8f712e874191e"));
var SYS_ROLES = [
	"employee",
	"manager",
	"hr",
	"engineering",
	"manufacturing",
	"sales",
	"finance",
	"marketing",
	"support",
	"it",
	"admin",
	"super_admin"
];
var DEPARTMENTS = [
	"Engineering",
	"Manufacturing",
	"Sales",
	"Marketing",
	"Finance",
	"HR",
	"IT",
	"Support",
	"Operations",
	"Executive"
];
function PeoplePage() {
	const [tab, setTab] = (0, import_react.useState)("directory");
	const [me, setMe] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data } = await supabase.auth.getUser();
			if (!data.user) return;
			const { data: rs } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
			const roles = (rs ?? []).map((r) => r.role);
			setMe({
				id: data.user.id,
				isAdmin: roles.includes("super_admin") || roles.includes("admin")
			});
		})();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-7xl px-6 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdCard, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground",
					children: "HR & Administration"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-semibold tracking-tight",
					children: "People"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 flex flex-wrap gap-1 border-b border-border",
				children: [
					[
						"directory",
						"Directory",
						Users
					],
					[
						"invites",
						"Invites & Roles",
						Mail
					],
					[
						"suspensions",
						"Suspensions",
						Ban
					],
					[
						"onboarding",
						"Onboarding",
						ClipboardCheck
					]
				].map(([k, label, Icon]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setTab(k),
					className: `flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition border-b-2 -mb-px ${tab === k ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }),
						" ",
						label
					]
				}, k))
			}),
			tab === "directory" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Directory, { me }),
			tab === "invites" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InvitesRoles, { me }),
			tab === "suspensions" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Suspensions, { me }),
			tab === "onboarding" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OnboardingTab, {})
		]
	});
}
function useProfiles() {
	const [profiles, setProfiles] = (0, import_react.useState)([]);
	const reload = async () => {
		const { data } = await supabase.from("profiles").select("id, email, full_name, department, title").order("full_name");
		setProfiles(data ?? []);
	};
	(0, import_react.useEffect)(() => {
		reload();
	}, []);
	return {
		profiles,
		reload
	};
}
function Directory({ me }) {
	const { profiles, reload: reloadProfiles } = useProfiles();
	const [employees, setEmployees] = (0, import_react.useState)([]);
	const [q, setQ] = (0, import_react.useState)("");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [copied, setCopied] = (0, import_react.useState)(null);
	const reload = async () => {
		const { data } = await supabase.from("hr_employees").select("*").order("full_name");
		setEmployees(data ?? []);
	};
	(0, import_react.useEffect)(() => {
		reload();
	}, []);
	const filtered = (0, import_react.useMemo)(() => {
		const s = q.toLowerCase();
		if (!s) return employees;
		return employees.filter((e) => [
			e.full_name,
			e.email,
			e.title,
			e.department
		].some((v) => (v ?? "").toLowerCase().includes(s)));
	}, [employees, q]);
	const active = employees.filter((e) => e.status === "active").length;
	const depts = new Set(employees.map((e) => e.department).filter(Boolean)).size;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					icon: Users,
					label: "Total",
					value: employees.length
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					icon: UserCheck,
					label: "Active",
					value: active
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					icon: Building2,
					label: "Departments",
					value: depts
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					icon: Users,
					label: "Full-time",
					value: employees.filter((e) => e.employment_type === "full_time").length
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search people…",
					className: "w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setEditing({
					id: "",
					user_id: null,
					full_name: "",
					email: "",
					department: "",
					title: "",
					status: "active",
					start_date: null,
					manager_id: null,
					employment_type: "full_time"
				}),
				className: "flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add person"]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-3 text-xs text-muted-foreground",
			children: [
				"Adding someone with an email automatically opens their onboarding — they verify the email with a code, set a password, add a photo and work through their checklist at ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium text-foreground",
					children: "/welcome"
				}),
				"."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-hidden rounded-xl border border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-left",
							children: "Name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-left",
							children: "Title"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-left",
							children: "Dept"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-left",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-left",
							children: "Manager"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-2" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filtered.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border hover:bg-muted/20",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2 font-medium",
							children: e.user_id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
								userId: e.user_id,
								name: e.full_name
							}) : e.full_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2",
							children: e.title ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2",
							children: e.department ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { value: e.status })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2",
							children: e.manager_id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
								userId: e.manager_id,
								name: profiles.find((p) => p.id === e.manager_id)?.full_name ?? "—"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "—"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2 text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-end gap-3",
								children: [!e.user_id && e.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										navigator.clipboard?.writeText(`${window.location.origin}/welcome`);
										setCopied(e.id);
										setTimeout(() => setCopied(null), 1800);
									},
									className: "text-xs text-muted-foreground hover:text-primary",
									children: copied === e.id ? "Link copied" : "Copy onboarding link"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setEditing(e),
									className: "text-xs text-primary hover:underline",
									children: "Edit"
								})]
							})
						})
					]
				}, e.id)), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 6,
					className: "p-8 text-center text-sm text-muted-foreground",
					children: "No people yet."
				}) })] })]
			})
		}),
		editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeEditor, {
			employee: editing,
			profiles,
			onClose: () => setEditing(null),
			onSaved: () => {
				reload();
				reloadProfiles();
				setEditing(null);
			}
		})
	] });
}
function EmployeeEditor({ employee, profiles, onClose, onSaved }) {
	const [form, setForm] = (0, import_react.useState)(employee);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const update = (patch) => setForm((f) => ({
		...f,
		...patch
	}));
	const save = async () => {
		setSaving(true);
		const payload = {
			full_name: form.full_name,
			email: form.email || null,
			department: form.department || null,
			title: form.title || null,
			status: form.status,
			start_date: form.start_date || null,
			manager_id: form.manager_id || null,
			employment_type: form.employment_type || null,
			user_id: form.user_id || null
		};
		if (form.id) {
			await supabase.from("hr_employees").update(payload).eq("id", form.id);
			if (form.user_id) await supabase.from("profiles").update({
				full_name: form.full_name,
				department: form.department,
				title: form.title
			}).eq("id", form.user_id);
		} else await supabase.from("hr_employees").insert(payload);
		setSaving(false);
		onSaved();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
		onClick: onClose,
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Employee details",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EscapeKey, { onEscape: onClose }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			className: "w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-2xl",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-semibold",
						children: form.id ? "Edit person" : "Add person"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded p-1 hover:bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Full name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								"aria-label": "Full name",
								value: form.full_name,
								onChange: (e) => update({ full_name: e.target.value }),
								className: inputCls
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Email",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								"aria-label": "Email",
								value: form.email ?? "",
								onChange: (e) => update({ email: e.target.value }),
								className: inputCls
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Title",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								"aria-label": "Title",
								value: form.title ?? "",
								onChange: (e) => update({ title: e.target.value }),
								className: inputCls
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Department",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								"aria-label": "Department",
								value: form.department ?? "",
								onChange: (e) => update({ department: e.target.value }),
								className: inputCls,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "—"
								}), DEPARTMENTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: d,
									children: d
								}, d))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Status",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								"aria-label": "Status",
								value: form.status,
								onChange: (e) => update({ status: e.target.value }),
								className: inputCls,
								children: [
									"active",
									"on_leave",
									"terminated"
								].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: s,
									children: s
								}, s))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Employment type",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								"aria-label": "Employment type",
								value: form.employment_type ?? "",
								onChange: (e) => update({ employment_type: e.target.value }),
								className: inputCls,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "full_time",
										children: "Full-time"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "part_time",
										children: "Part-time"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "contract",
										children: "Contract"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "intern",
										children: "Intern"
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Start date",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								"aria-label": "Start date",
								type: "date",
								value: form.start_date ?? "",
								onChange: (e) => update({ start_date: e.target.value }),
								className: inputCls
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Manager",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								"aria-label": "Manager",
								value: form.manager_id ?? "",
								onChange: (e) => update({ manager_id: e.target.value || null }),
								className: inputCls,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "—"
								}), profiles.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: p.id,
									children: p.full_name || p.email
								}, p.id))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Linked HQ user (optional)",
							full: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								"aria-label": "Linked HQ user (optional)",
								value: form.user_id ?? "",
								onChange: (e) => update({ user_id: e.target.value || null }),
								className: inputCls,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Not linked"
								}), profiles.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: p.id,
									children: p.full_name || p.email
								}, p.id))]
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded-lg border border-border px-4 py-2 text-sm",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: save,
						disabled: saving,
						className: "rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50",
						children: saving ? "Saving…" : "Save"
					})]
				})
			]
		})]
	});
}
function InvitesRoles({ me }) {
	const [invites, setInvites] = (0, import_react.useState)([]);
	const [profiles, setProfiles] = (0, import_react.useState)([]);
	const [sysRoles, setSysRoles] = (0, import_react.useState)([]);
	const [customRoles, setCustomRoles] = (0, import_react.useState)([]);
	const [customAssign, setCustomAssign] = (0, import_react.useState)([]);
	const [showInvite, setShowInvite] = (0, import_react.useState)(false);
	const [inv, setInv] = (0, import_react.useState)({
		email: "",
		role: "employee",
		department: "",
		full_name: ""
	});
	const [msg, setMsg] = (0, import_react.useState)(null);
	const [editUser, setEditUser] = (0, import_react.useState)(null);
	const reload = async () => {
		const [i, p, r, cr, ca] = await Promise.all([
			supabase.from("invites").select("*").order("created_at", { ascending: false }),
			supabase.from("profiles").select("id, email, full_name, department, title").order("full_name"),
			supabase.from("user_roles").select("user_id, role"),
			supabase.from("custom_roles").select("id, name, color").order("position", { ascending: false }),
			supabase.from("user_custom_roles").select("user_id, role_id")
		]);
		setInvites(i.data ?? []);
		setProfiles(p.data ?? []);
		setSysRoles(r.data ?? []);
		setCustomRoles(cr.data ?? []);
		setCustomAssign(ca.data ?? []);
	};
	(0, import_react.useEffect)(() => {
		reload();
	}, []);
	const invite = useServerFn(sendInvite);
	const [sending, setSending] = (0, import_react.useState)(false);
	const sendInvite$1 = async () => {
		if (!inv.email.trim()) return;
		setMsg(null);
		setSending(true);
		try {
			const res = await invite({ data: {
				email: inv.email.trim().toLowerCase(),
				role: inv.role,
				department: inv.department || null,
				full_name: inv.full_name || null
			} });
			if (res?.warning) setMsg(`Invite saved. Email: ${res.warning}`);
			setInv({
				email: "",
				role: "employee",
				department: "",
				full_name: ""
			});
			setShowInvite(false);
			reload();
		} catch (e) {
			setMsg(e?.message ?? "Failed to send invite");
		} finally {
			setSending(false);
		}
	};
	const revoke = async (id) => {
		await supabase.from("invites").delete().eq("id", id);
		reload();
	};
	const rolesOf = (uid) => sysRoles.filter((r) => r.user_id === uid).map((r) => r.role);
	const customsOf = (uid) => customAssign.filter((c) => c.user_id === uid).map((c) => customRoles.find((r) => r.id === c.role_id)).filter(Boolean);
	const toggleRole = async (uid, role) => {
		if (rolesOf(uid).includes(role)) await supabase.from("user_roles").delete().eq("user_id", uid).eq("role", role);
		else await supabase.from("user_roles").insert({
			user_id: uid,
			role
		});
		reload();
	};
	const toggleCustom = async (uid, role_id) => {
		if (customAssign.some((c) => c.user_id === uid && c.role_id === role_id)) await supabase.from("user_custom_roles").delete().eq("user_id", uid).eq("role_id", role_id);
		else await supabase.from("user_custom_roles").insert({
			user_id: uid,
			role_id
		});
		reload();
	};
	const pending = invites.filter((i) => !i.accepted_at);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold",
				children: "Team access"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Invite new members, and manage each person's system + custom roles."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setShowInvite(true),
				className: "flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4" }), " Invite user"]
			})]
		}),
		pending.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
				children: "Pending invites"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-xl border border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2 text-left",
								children: "Email"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2 text-left",
								children: "Role"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2 text-left",
								children: "Dept"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2 text-left",
								children: "Expires"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-2" })
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: pending.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2",
								children: i.email
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded bg-primary/10 px-2 py-0.5 text-xs text-primary",
									children: i.role
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2",
								children: i.department ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2 text-muted-foreground",
								children: new Date(i.expires_at).toLocaleDateString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => revoke(i.id),
									className: "text-xs text-destructive hover:underline",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "inline h-3 w-3" }), " Revoke"]
								})
							})
						]
					}, i.id)) })]
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
			className: "mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
			children: [
				"Active users (",
				profiles.length,
				")"
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-hidden rounded-xl border border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-left",
							children: "Name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-left",
							children: "Dept"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-left",
							children: "System roles"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-left",
							children: "Custom roles"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-2" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: profiles.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border align-top",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
								userId: u.id,
								name: u.full_name ?? u.email ?? "—"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-muted-foreground",
							children: u.department ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1",
								children: rolesOf(u.id).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded bg-primary/10 px-2 py-0.5 text-xs text-primary",
									children: r
								}, r))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-1",
								children: [customsOf(u.id).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded px-2 py-0.5 text-xs",
									style: {
										backgroundColor: `${r.color}20`,
										color: r.color
									},
									children: r.name
								}, r.id)), customsOf(u.id).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: "—"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setEditUser(u.id),
								className: "text-xs text-primary hover:underline",
								children: "Edit roles"
							})
						})
					]
				}, u.id)) })]
			})
		})] }),
		showInvite && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
			onClick: () => setShowInvite(false),
			role: "dialog",
			"aria-modal": "true",
			"aria-label": "Invite user",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EscapeKey, { onEscape: () => setShowInvite(false) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				role: "dialog",
				"aria-modal": "true",
				className: "w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl",
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold",
							children: "Invite a new user"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowInvite(false),
							className: "rounded p-1 hover:bg-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								"aria-label": "email@company.com",
								placeholder: "email@company.com",
								value: inv.email,
								onChange: (e) => setInv({
									...inv,
									email: e.target.value
								}),
								className: inputCls
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								"aria-label": "Full name (optional)",
								placeholder: "Full name (optional)",
								value: inv.full_name,
								onChange: (e) => setInv({
									...inv,
									full_name: e.target.value
								}),
								className: inputCls
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: inv.department,
								onChange: (e) => setInv({
									...inv,
									department: e.target.value
								}),
								className: inputCls,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Department…"
								}), DEPARTMENTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: d,
									children: d
								}, d))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: inv.role,
								onChange: (e) => setInv({
									...inv,
									role: e.target.value
								}),
								className: inputCls,
								children: SYS_ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: r,
									children: r
								}, r))
							})
						]
					}),
					msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-destructive",
						children: msg
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowInvite(false),
							className: "rounded-lg border border-border px-4 py-2 text-sm",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: sendInvite$1,
							disabled: sending,
							className: "rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50",
							children: sending ? "Sending…" : "Send invite & email"
						})]
					})
				]
			})]
		}),
		editUser && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
			onClick: () => setEditUser(null),
			role: "dialog",
			"aria-modal": "true",
			"aria-label": "Edit user",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EscapeKey, { onEscape: () => setEditUser(null) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				role: "dialog",
				"aria-modal": "true",
				className: "w-full max-w-lg rounded-xl border border-border bg-card p-5 shadow-2xl",
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold",
							children: "Edit roles"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setEditUser(null),
							className: "rounded p-1 hover:bg-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 text-xs font-semibold uppercase text-muted-foreground",
							children: "System roles"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: SYS_ROLES.map((r) => {
								const has = rolesOf(editUser).includes(r);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => toggleRole(editUser, r),
									className: `rounded-full border px-3 py-1 text-xs ${has ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`,
									children: [has && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-1 inline h-3 w-3" }), r]
								}, r);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs font-semibold uppercase text-muted-foreground",
						children: "Custom roles"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: customRoles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Create custom roles in Admin → Roles."
						}) : customRoles.map((r) => {
							const has = customAssign.some((c) => c.user_id === editUser && c.role_id === r.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => toggleCustom(editUser, r.id),
								className: `rounded-full border px-3 py-1 text-xs ${has ? "" : "text-muted-foreground"}`,
								style: has ? {
									borderColor: r.color,
									backgroundColor: `${r.color}20`,
									color: r.color
								} : {},
								children: [has && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-1 inline h-3 w-3" }), r.name]
							}, r.id);
						})
					})] })
				]
			})]
		})
	] });
}
function Suspensions({ me }) {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [profiles, setProfiles] = (0, import_react.useState)([]);
	const [form, setForm] = (0, import_react.useState)({
		user_id: "",
		reason: "",
		ends_at: ""
	});
	const [msg, setMsg] = (0, import_react.useState)(null);
	const reload = async () => {
		const [s, p] = await Promise.all([supabase.from("hr_suspensions").select("*").order("created_at", { ascending: false }), supabase.from("profiles").select("id, email, full_name, department, title")]);
		setRows(s.data ?? []);
		setProfiles(p.data ?? []);
	};
	(0, import_react.useEffect)(() => {
		reload();
	}, []);
	const suspend = async () => {
		if (!form.user_id) {
			setMsg("Select a user");
			return;
		}
		setMsg(null);
		await supabase.from("hr_suspensions").insert({
			user_id: form.user_id,
			reason: form.reason || null,
			ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
			created_by: me?.id,
			active: true
		});
		setForm({
			user_id: "",
			reason: "",
			ends_at: ""
		});
		reload();
	};
	const lift = async (id) => {
		await supabase.from("hr_suspensions").update({
			active: false,
			ends_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", id);
		reload();
	};
	const active = rows.filter((r) => r.active && (!r.ends_at || new Date(r.ends_at) > /* @__PURE__ */ new Date()));
	const history = rows.filter((r) => !active.includes(r));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 rounded-xl border border-border bg-card p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground",
					children: "Suspend a user"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-3 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: form.user_id,
							onChange: (e) => setForm({
								...form,
								user_id: e.target.value
							}),
							className: inputCls,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Select person…"
							}), profiles.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: p.id,
								children: p.full_name || p.email
							}, p.id))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "datetime-local",
							value: form.ends_at,
							onChange: (e) => setForm({
								...form,
								ends_at: e.target.value
							}),
							placeholder: "End date (optional)",
							className: inputCls
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: form.reason,
							onChange: (e) => setForm({
								...form,
								reason: e.target.value
							}),
							placeholder: "Reason",
							className: inputCls
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: suspend,
							className: "flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "h-4 w-4" }), " Suspend"]
						}),
						msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-destructive",
							children: msg
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "ml-auto text-xs text-muted-foreground",
							children: "Leave end date blank for indefinite."
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
			className: "mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
			children: [
				"Active suspensions (",
				active.length,
				")"
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuspensionTable, {
			rows: active,
			profiles,
			onLift: lift
		}),
		history.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "mb-2 mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
			children: "History"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuspensionTable, {
			rows: history,
			profiles
		})] })
	] });
}
function SuspensionTable({ rows, profiles, onLift }) {
	if (rows.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground",
		children: "None."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden rounded-xl border border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-2 text-left",
						children: "User"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-2 text-left",
						children: "Started"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-2 text-left",
						children: "Ends"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-2 text-left",
						children: "Reason"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-2" })
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r) => {
				const p = profiles.find((pp) => pp.id === r.user_id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
								userId: r.user_id,
								name: p?.full_name ?? p?.email ?? r.user_id
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2 text-muted-foreground",
							children: new Date(r.starts_at).toLocaleString()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2 text-muted-foreground",
							children: r.ends_at ? new Date(r.ends_at).toLocaleString() : "indefinite"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2",
							children: r.reason ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2 text-right",
							children: onLift && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => onLift(r.id),
								className: "text-xs text-primary hover:underline",
								children: "Lift"
							})
						})
					]
				}, r.id);
			}) })]
		})
	});
}
function OnboardingTab() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [employees, setEmployees] = (0, import_react.useState)([]);
	const reload = async () => {
		const [o, e] = await Promise.all([supabase.from("hr_onboarding").select("*").order("due_date", { ascending: true }), supabase.from("hr_employees").select("id, full_name, department, user_id")]);
		setRows(o.data ?? []);
		setEmployees(e.data ?? []);
	};
	(0, import_react.useEffect)(() => {
		reload();
	}, []);
	const setStatus = async (id, status) => {
		await supabase.from("hr_onboarding").update({ status }).eq("id", id);
		reload();
	};
	const grouped = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		for (const r of rows) {
			const key = r.employee_id ?? "unassigned";
			if (!m.has(key)) m.set(key, []);
			m.get(key).push(r);
		}
		return m;
	}, [rows]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 flex items-center gap-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [
					"Tasks are auto-created from department templates when a user accepts their invite. Manage templates in ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "text-primary hover:underline",
						href: "/admin/company?tab=onboarding",
						children: "Admin → Onboarding"
					}),
					"."
				]
			})
		}),
		employees.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground",
			children: "No employees."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: employees.map((emp) => {
				const tasks = grouped.get(emp.id) ?? [];
				if (tasks.length === 0) return null;
				const done = tasks.filter((t) => t.status === "done").length;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: emp.user_id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
								userId: emp.user_id,
								name: emp.full_name
							}) : emp.full_name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								emp.department ?? "—",
								" · ",
								done,
								"/",
								tasks.length,
								" complete"
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-2 w-32 overflow-hidden rounded-full bg-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-primary",
								style: { width: `${done / tasks.length * 100}%` }
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-1",
						children: tasks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: t.status === "done",
									onChange: (e) => setStatus(t.id, e.target.checked ? "done" : "pending")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `flex-1 text-sm ${t.status === "done" ? "text-muted-foreground line-through" : ""}`,
									children: t.task
								}),
								t.category && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded bg-muted/40 px-2 py-0.5 text-[10px] text-muted-foreground",
									children: t.category
								}),
								t.due_date && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: new Date(t.due_date).toLocaleDateString()
								})
							]
						}, t.id))
					})]
				}, emp.id);
			})
		})
	] });
}
var inputCls = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
function Field({ label, children, full }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: `flex flex-col gap-1 ${full ? "col-span-2" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs font-medium text-muted-foreground",
			children: label
		}), children]
	});
}
function Kpi({ icon: Icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" }),
				" ",
				label
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-2xl font-semibold tracking-tight",
			children: value
		})]
	});
}
function StatusPill({ value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${{
			active: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
			on_leave: "border-amber-500/20 bg-amber-500/10 text-amber-600",
			terminated: "border-destructive/20 bg-destructive/10 text-destructive"
		}[value] ?? "border-border bg-muted/40 text-muted-foreground"}`,
		children: value
	});
}
//#endregion
export { PeoplePage as component };
