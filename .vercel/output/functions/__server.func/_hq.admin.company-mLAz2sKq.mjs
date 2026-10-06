import { i as __toESM } from "./_runtime.mjs";
import { r as supabase } from "./_ssr/client-PsXr_elE.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { Bt as Mail, Gt as LoaderCircle, Hr as ArrowDown, Lr as ArrowUp, U as Settings, Z as Save, en as Layers, er as ClipboardCheck, in as Inbox, mr as Check, n as X, nn as KeyRound, nt as RefreshCw, st as Plus, u as Users, wr as Building, x as Trash2, z as Shield } from "./_libs/lucide-react.mjs";
import { n as navGroups } from "./_ssr/nav-config-BQNdxmMi.mjs";
import { t as EscapeKey } from "./_ssr/EscapeKey-s0O3wTFo.mjs";
import { t as useServerFn } from "./_ssr/useServerFn-CrZF2pjq.mjs";
import { a as testMailAccount, n as saveMailAccount, t as deleteMailAccount } from "./_ssr/mail-accounts.functions-BY4tKMnY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.admin.company-mLAz2sKq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMPTY = {
	label: "",
	email_address: "",
	display_name: "",
	imap_host: "",
	imap_port: 993,
	smtp_host: "",
	smtp_port: 465,
	username: "",
	password: "",
	is_shared: true,
	active: true,
	assigned_user_id: null
};
function MailboxesAdmin() {
	const [accounts, setAccounts] = (0, import_react.useState)([]);
	const [people, setPeople] = (0, import_react.useState)([]);
	const [form, setForm] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [message, setMessage] = (0, import_react.useState)(null);
	const save = useServerFn(saveMailAccount);
	const remove = useServerFn(deleteMailAccount);
	const test = useServerFn(testMailAccount);
	const load = async () => {
		const { data } = await supabase.from("email_accounts").select("*").order("label");
		setAccounts(data ?? []);
	};
	(0, import_react.useEffect)(() => {
		load();
		(async () => {
			const { data } = await supabase.from("profiles").select("id, full_name, email").order("full_name");
			setPeople(data ?? []);
		})();
	}, []);
	const submit = async (e) => {
		e.preventDefault();
		if (!form) return;
		setBusy(true);
		setMessage(null);
		try {
			await save({ data: form });
			setForm(null);
			await load();
			setMessage({
				kind: "ok",
				text: "Mailbox saved."
			});
		} catch (err) {
			setMessage({
				kind: "err",
				text: err instanceof Error ? err.message : "Could not save mailbox."
			});
		} finally {
			setBusy(false);
		}
	};
	const runTest = async (id) => {
		setBusy(true);
		setMessage(null);
		try {
			const res = await test({ data: { accountId: id } });
			setMessage({
				kind: "ok",
				text: res.message
			});
		} catch (err) {
			setMessage({
				kind: "err",
				text: err instanceof Error ? err.message : "Connection failed."
			});
		} finally {
			setBusy(false);
		}
	};
	const input = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-border bg-card p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold",
						children: "Company mailboxes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Connect real IMAP/SMTP mailboxes (Namecheap Private Email, Google Workspace app passwords, or any provider). Shared mailboxes are visible to all staff; assigned mailboxes only to their owner."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setForm({ ...EMPTY }),
						className: "inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add mailbox"]
					})]
				}),
				message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `mb-4 rounded-md px-3 py-2 text-sm ${message.kind === "ok" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`,
					children: message.text
				}),
				accounts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-12 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "h-6 w-6 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No mailboxes connected yet."
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-border",
					children: accounts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "truncate text-sm font-medium",
										children: [
											a.label,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-normal text-muted-foreground",
												children: ["— ", a.email_address]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-0.5 text-xs text-muted-foreground",
										children: [
											"IMAP ",
											a.imap_host,
											":",
											a.imap_port,
											" · SMTP ",
											a.smtp_host,
											":",
											a.smtp_port,
											" ·",
											" ",
											a.is_shared ? "Shared" : "Assigned",
											" · ",
											a.active ? "Active" : "Paused",
											a.last_sync_at ? ` · Synced ${new Date(a.last_sync_at).toLocaleString()}` : ""
										]
									}),
									a.last_sync_error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-0.5 text-xs text-destructive",
										children: ["Last error: ", a.last_sync_error]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => runTest(a.id),
								disabled: busy,
								className: "inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-50",
								children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " Test"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setForm({
									...a,
									password: ""
								}),
								className: "rounded-md border border-border px-2.5 py-1.5 text-xs font-medium hover:bg-muted",
								children: "Edit"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								"aria-label": `Delete ${a.label}`,
								onClick: async () => {
									if (!confirm(`Delete mailbox ${a.email_address}?`)) return;
									await remove({ data: { id: a.id } });
									load();
								},
								className: "rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})
						]
					}, a.id))
				})
			]
		}), form && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4",
			onClick: () => setForm(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				role: "dialog",
				"aria-modal": "true",
				"aria-label": "Mailbox settings",
				onSubmit: submit,
				onClick: (e) => e.stopPropagation(),
				className: "max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-semibold",
							children: form.id ? "Edit mailbox" : "Add mailbox"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Close",
							onClick: () => setForm(null),
							className: "rounded-md p-1.5 hover:bg-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1 block font-medium",
									children: "Label"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									className: input,
									value: form.label,
									onChange: (e) => setForm({
										...form,
										label: e.target.value
									}),
									placeholder: "Support inbox"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1 block font-medium",
									children: "Email address"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									type: "email",
									className: input,
									value: form.email_address,
									onChange: (e) => setForm({
										...form,
										email_address: e.target.value
									}),
									placeholder: "support@company.com"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1 block font-medium",
									children: "Display name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: input,
									value: form.display_name ?? "",
									onChange: (e) => setForm({
										...form,
										display_name: e.target.value
									}),
									placeholder: "Clovr Labs"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1 block font-medium",
									children: "Login username"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									className: input,
									value: form.username,
									onChange: (e) => setForm({
										...form,
										username: e.target.value
									}),
									placeholder: "support@company.com"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1 block font-medium",
									children: "IMAP host"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									className: input,
									value: form.imap_host,
									onChange: (e) => setForm({
										...form,
										imap_host: e.target.value
									}),
									placeholder: "mail.privateemail.com"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1 block font-medium",
									children: "IMAP port"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									type: "number",
									className: input,
									value: form.imap_port,
									onChange: (e) => setForm({
										...form,
										imap_port: Number(e.target.value)
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1 block font-medium",
									children: "SMTP host"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									className: input,
									value: form.smtp_host,
									onChange: (e) => setForm({
										...form,
										smtp_host: e.target.value
									}),
									placeholder: "mail.privateemail.com"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1 block font-medium",
									children: "SMTP port (SSL)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									type: "number",
									className: input,
									value: form.smtp_port,
									onChange: (e) => setForm({
										...form,
										smtp_port: Number(e.target.value)
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mb-1 block font-medium",
									children: ["Password ", form.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-normal text-muted-foreground",
										children: "(leave blank to keep current)"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									className: input,
									value: form.password ?? "",
									onChange: (e) => setForm({
										...form,
										password: e.target.value
									}),
									placeholder: "App password",
									autoComplete: "new-password"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1 block font-medium",
									children: "Assigned to"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: input,
									value: form.assigned_user_id ?? "",
									onChange: (e) => setForm({
										...form,
										assigned_user_id: e.target.value || null
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Nobody (shared team mailbox)"
									}), people.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: p.id,
										children: p.full_name || p.email
									}, p.id))]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: form.is_shared,
								onChange: (e) => setForm({
									...form,
									is_shared: e.target.checked
								})
							}), "Visible to all staff"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: form.active,
								onChange: (e) => setForm({
									...form,
									active: e.target.checked
								})
							}), "Active"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setForm(null),
							className: "rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: busy,
							className: "inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50",
							children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), " Save mailbox"]
						})]
					})
				]
			})
		})]
	});
}
var TAB_LIST = [
	[
		"general",
		"General",
		Settings
	],
	[
		"roles",
		"Roles",
		Shield
	],
	[
		"access",
		"Tab Access",
		Layers
	],
	[
		"overrides",
		"Overrides",
		KeyRound
	],
	[
		"onboarding",
		"Onboarding",
		ClipboardCheck
	],
	[
		"email",
		"Email",
		Mail
	],
	[
		"mailboxes",
		"Mailboxes",
		Inbox
	]
];
function CompanyPage() {
	const initial = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("tab") : null;
	const [tab, setTab] = (0, import_react.useState)(initial && TAB_LIST.some(([k]) => k === initial) ? initial : "general");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-7xl px-6 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground",
						children: "Administration"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-semibold tracking-tight",
						children: "Company Settings"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Company profile, roles, tab access, overrides, onboarding, and email — all in one place."
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 flex flex-wrap gap-1 border-b border-border",
				children: TAB_LIST.map(([k, label, Icon]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setTab(k),
					className: `flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px ${tab === k ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }),
						" ",
						label
					]
				}, k))
			}),
			tab === "general" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GeneralSettings, {}),
			tab === "roles" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RolesManager, {}),
			tab === "access" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RouteAccessMatrix, {}),
			tab === "overrides" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PermissionOverrides, {}),
			tab === "onboarding" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OnboardingTemplates, {}),
			tab === "email" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmailSettings, {}),
			tab === "mailboxes" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MailboxesAdmin, {})
		]
	});
}
function RouteAccessMatrix() {
	const [roles, setRoles] = (0, import_react.useState)([]);
	const [access, setAccess] = (0, import_react.useState)([]);
	const [selectedRole, setSelectedRole] = (0, import_react.useState)(null);
	const reload = async () => {
		const [r, a] = await Promise.all([supabase.from("custom_roles").select("id, name, color, permissions").order("position", { ascending: false }), supabase.from("role_route_access").select("role_id, route")]);
		setRoles(r.data ?? []);
		setAccess(a.data ?? []);
		if (!selectedRole && r.data && r.data.length) setSelectedRole(r.data[0].id);
	};
	(0, import_react.useEffect)(() => {
		reload();
	}, []);
	const currentAccess = (0, import_react.useMemo)(() => new Set(access.filter((a) => a.role_id === selectedRole).map((a) => a.route)), [access, selectedRole]);
	const toggle = async (route) => {
		if (!selectedRole) return;
		if (currentAccess.has(route)) {
			await supabase.from("role_route_access").delete().eq("role_id", selectedRole).eq("route", route);
			setAccess((prev) => prev.filter((a) => !(a.role_id === selectedRole && a.route === route)));
		} else {
			await supabase.from("role_route_access").insert({
				role_id: selectedRole,
				route
			});
			setAccess((prev) => [...prev, {
				role_id: selectedRole,
				route
			}]);
		}
	};
	const toggleGroup = async (routes, grant) => {
		if (!selectedRole) return;
		if (grant) {
			const toAdd = routes.filter((r) => !currentAccess.has(r));
			if (toAdd.length === 0) return;
			await supabase.from("role_route_access").insert(toAdd.map((r) => ({
				role_id: selectedRole,
				route: r
			})));
		} else await supabase.from("role_route_access").delete().eq("role_id", selectedRole).in("route", routes);
		reload();
	};
	const role = roles.find((r) => r.id === selectedRole);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 gap-6 lg:grid-cols-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "lg:col-span-1 rounded-xl border border-border bg-card p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
				children: "Roles"
			}), roles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "p-3 text-xs text-muted-foreground",
				children: [
					"Create a role in the ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Roles" }),
					" tab first."
				]
			}) : roles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setSelectedRole(r.id),
				className: `flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm ${selectedRole === r.id ? "bg-primary/10" : "hover:bg-muted"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "h-2.5 w-2.5 rounded-full",
						style: { backgroundColor: r.color }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: { color: r.color },
						children: r.name
					}),
					r.permissions?.admin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto rounded bg-primary/20 px-1.5 py-0.5 text-[9px] uppercase text-primary",
						children: "All"
					})
				]
			}, r.id))]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "lg:col-span-3",
			children: !role ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground",
				children: "Select a role to configure tab access."
			}) : role.permissions?.admin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-border bg-card p-6 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm",
					children: [
						"This role has ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Administrator" }),
						" permission — it has access to every tab automatically."
					]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						"Check the tabs members of ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							style: { color: role.color },
							children: role.name
						}),
						" can see. Core pages (Dashboard, Assistant) are always visible."
					]
				}), navGroups.map((g) => {
					const groupRoutes = g.items.map((i) => i.to);
					const allSelected = groupRoutes.every((r) => currentAccess.has(r));
					const someSelected = groupRoutes.some((r) => currentAccess.has(r));
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: g.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => toggleGroup(groupRoutes, !allSelected),
								className: "text-xs text-primary hover:underline",
								children: [allSelected ? "Clear all" : "Select all", someSelected && !allSelected ? ` (${groupRoutes.filter((r) => currentAccess.has(r)).length}/${groupRoutes.length})` : ""]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 gap-1 sm:grid-cols-2",
							children: g.items.map((i) => {
								const has = currentAccess.has(i.to);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => toggle(i.to),
									className: `flex items-center gap-2 rounded-md border px-2 py-1.5 text-left text-sm ${has ? "border-primary/40 bg-primary/5" : "border-border hover:bg-muted/30"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `flex h-4 w-4 items-center justify-center rounded border ${has ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"}`,
											children: has && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(i.icon, { className: "h-3.5 w-3.5 text-muted-foreground" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex-1",
											children: i.label
										})
									]
								}, i.to);
							})
						})]
					}, g.label);
				})]
			})
		})]
	});
}
var PERMISSIONS = [
	"manage_channels",
	"manage_roles",
	"manage_messages",
	"manage_users",
	"manage_billing",
	"manage_domains",
	"view_financials",
	"export_data",
	"admin"
];
function PermissionOverrides() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [profiles, setProfiles] = (0, import_react.useState)([]);
	const [form, setForm] = (0, import_react.useState)({
		user_id: "",
		permission: PERMISSIONS[0],
		granted: true,
		notes: ""
	});
	const reload = async () => {
		const [{ data: o }, { data: p }] = await Promise.all([supabase.from("admin_permission_overrides").select("id, user_id, permission, granted, notes, created_at").order("created_at", { ascending: false }), supabase.from("profiles").select("id, full_name, email").order("full_name")]);
		setRows(o ?? []);
		setProfiles(p ?? []);
		if (!form.user_id && p && p.length) setForm((f) => ({
			...f,
			user_id: p[0].id
		}));
	};
	(0, import_react.useEffect)(() => {
		reload();
	}, []);
	const add = async () => {
		if (!form.user_id || !form.permission) return;
		await supabase.from("admin_permission_overrides").insert({
			user_id: form.user_id,
			permission: form.permission,
			granted: form.granted,
			notes: form.notes || null
		});
		setForm({
			...form,
			notes: ""
		});
		reload();
	};
	const del = async (id) => {
		await supabase.from("admin_permission_overrides").delete().eq("id", id);
		reload();
	};
	const profileLabel = (id) => {
		const p = profiles.find((x) => x.id === id);
		return p?.full_name || p?.email || id.slice(0, 8);
	};
	const inputCls = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 text-sm text-muted-foreground",
			children: "Grant or deny a specific permission to a single user — overrides their role's default. Use sparingly."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 rounded-xl border border-border bg-card p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground",
					children: "Add override"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-3 sm:grid-cols-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: form.user_id,
							onChange: (e) => setForm({
								...form,
								user_id: e.target.value
							}),
							className: inputCls,
							children: profiles.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: p.id,
								children: p.full_name || p.email
							}, p.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: form.permission,
							onChange: (e) => setForm({
								...form,
								permission: e.target.value
							}),
							className: inputCls,
							children: PERMISSIONS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: p,
								children: p
							}, p))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: form.granted ? "grant" : "deny",
							onChange: (e) => setForm({
								...form,
								granted: e.target.value === "grant"
							}),
							className: inputCls,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "grant",
								children: "Grant"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "deny",
								children: "Deny"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							"aria-label": "Notes",
							placeholder: "Notes",
							value: form.notes,
							onChange: (e) => setForm({
								...form,
								notes: e.target.value
							}),
							className: `${inputCls} sm:col-span-2`
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: add,
						className: "flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add override"]
					})
				})
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
							children: "User"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-left",
							children: "Permission"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-left",
							children: "Effect"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-left",
							children: "Notes"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-2" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2",
							children: profileLabel(r.user_id)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2 font-mono text-xs",
							children: r.permission
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2",
							children: r.granted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-700",
								children: "Granted"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded bg-destructive/10 px-2 py-0.5 text-xs text-destructive",
								children: "Denied"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2 text-muted-foreground",
							children: r.notes
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2 text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								"aria-label": "Delete",
								onClick: () => del(r.id),
								className: "text-xs text-destructive hover:underline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "inline h-3 w-3" })
							})
						})
					]
				}, r.id)), rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 5,
					className: "p-8 text-center text-sm text-muted-foreground",
					children: "No overrides — role permissions apply as-is."
				}) })] })]
			})
		})
	] });
}
function EmailSettings() {
	const [s, setS] = (0, import_react.useState)({
		from_name: "",
		reply_to: "",
		sender_domain: "clovrlab.com",
		default_footer: "",
		track_opens: true,
		track_clicks: true
	});
	const [rowId, setRowId] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [saved, setSaved] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data } = await supabase.from("company_email_settings").select("*").limit(1).maybeSingle();
			if (data) {
				setRowId(data.id);
				setS({
					from_name: data.from_name ?? "",
					reply_to: data.reply_to ?? "",
					sender_domain: data.sender_domain ?? "clovrlab.com",
					default_footer: data.default_footer ?? "",
					track_opens: data.track_opens ?? true,
					track_clicks: data.track_clicks ?? true
				});
			}
		})();
	}, []);
	const save = async () => {
		setSaving(true);
		const { data: u } = await supabase.auth.getUser();
		const payload = {
			...s,
			updated_by: u.user?.id,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		};
		if (rowId) await supabase.from("company_email_settings").update(payload).eq("id", rowId);
		else {
			const { data } = await supabase.from("company_email_settings").insert(payload).select().single();
			if (data) setRowId(data.id);
		}
		setSaving(false);
		setSaved(true);
		setTimeout(() => setSaved(false), 2e3);
	};
	const Field = ({ label, children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "grid grid-cols-1 md:grid-cols-[220px_1fr] items-start gap-3 border-b border-border py-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-medium text-foreground/90",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children })]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-1 text-lg font-semibold",
				children: "Company email defaults"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-4 text-sm text-muted-foreground",
				children: "Applied to outbound email from shared mailboxes and system notifications."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Default from name",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					"aria-label": "Default from name",
					value: s.from_name,
					onChange: (e) => setS({
						...s,
						from_name: e.target.value
					}),
					placeholder: "Clovr Lab",
					className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Reply-to address",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					"aria-label": "Reply-to address",
					value: s.reply_to,
					onChange: (e) => setS({
						...s,
						reply_to: e.target.value
					}),
					placeholder: "hello@clovrlab.com",
					className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
				label: "Sender domain",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					"aria-label": "Sender domain",
					value: s.sender_domain,
					onChange: (e) => setS({
						...s,
						sender_domain: e.target.value
					}),
					className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Shared mailboxes (support@, sales@, etc.) send from this domain."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Default footer",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					"aria-label": "Default footer",
					value: s.default_footer,
					onChange: (e) => setS({
						...s,
						default_footer: e.target.value
					}),
					rows: 4,
					placeholder: "Appended to outbound company email.",
					className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Tracking",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: s.track_opens,
							onChange: (e) => setS({
								...s,
								track_opens: e.target.checked
							})
						}), " Track email opens"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: s.track_clicks,
							onChange: (e) => setS({
								...s,
								track_clicks: e.target.checked
							})
						}), " Track link clicks"]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center justify-end gap-3",
				children: [saved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-emerald-600",
					children: "Saved"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					disabled: saving,
					onClick: save,
					className: "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }),
						" ",
						saving ? "Saving…" : "Save"
					]
				})]
			})
		]
	});
}
var SETTING_FIELDS = [
	{
		group: "Company",
		key: "legal_name",
		label: "Legal company name",
		placeholder: "Clovr Lab, Inc."
	},
	{
		group: "Company",
		key: "display_name",
		label: "Display name",
		placeholder: "Clovr Lab"
	},
	{
		group: "Company",
		key: "ein",
		label: "EIN / tax ID"
	},
	{
		group: "Company",
		key: "website",
		label: "Website",
		placeholder: "https://clovrlab.com"
	},
	{
		group: "Company",
		key: "support_email",
		label: "Support email",
		placeholder: "support@clovrlab.com"
	},
	{
		group: "Company",
		key: "hq_address",
		label: "HQ address",
		type: "textarea"
	},
	{
		group: "Company",
		key: "phone",
		label: "Main phone",
		placeholder: "+1 555 555 5555"
	},
	{
		group: "Company",
		key: "fiscal_year_start",
		label: "Fiscal year start (MM-DD)",
		placeholder: "01-01"
	},
	{
		group: "Locale",
		key: "timezone",
		label: "Default timezone",
		type: "select",
		options: [
			"UTC",
			"America/New_York",
			"America/Chicago",
			"America/Denver",
			"America/Los_Angeles",
			"Europe/London",
			"Europe/Berlin",
			"Asia/Tokyo",
			"Asia/Singapore",
			"Australia/Sydney"
		]
	},
	{
		group: "Locale",
		key: "currency",
		label: "Default currency",
		type: "select",
		options: [
			"USD",
			"EUR",
			"GBP",
			"CAD",
			"AUD",
			"JPY"
		]
	},
	{
		group: "Locale",
		key: "week_starts_on",
		label: "Week starts on",
		type: "select",
		options: ["Sunday", "Monday"]
	},
	{
		group: "Locale",
		key: "date_format",
		label: "Date format",
		type: "select",
		options: [
			"MM/DD/YYYY",
			"DD/MM/YYYY",
			"YYYY-MM-DD"
		]
	},
	{
		group: "Locale",
		key: "measurement_system",
		label: "Measurement system",
		type: "select",
		options: ["metric", "imperial"]
	},
	{
		group: "Work",
		key: "work_hours_start",
		label: "Work day start",
		placeholder: "09:00"
	},
	{
		group: "Work",
		key: "work_hours_end",
		label: "Work day end",
		placeholder: "17:00"
	},
	{
		group: "Work",
		key: "work_days",
		label: "Working days",
		placeholder: "Mon,Tue,Wed,Thu,Fri"
	},
	{
		group: "Work",
		key: "pto_days_per_year",
		label: "Default PTO days / yr",
		type: "number",
		placeholder: "15"
	},
	{
		group: "Work",
		key: "sick_days_per_year",
		label: "Default sick days / yr",
		type: "number",
		placeholder: "10"
	},
	{
		group: "Work",
		key: "overtime_threshold_hours",
		label: "Overtime threshold (hrs/wk)",
		type: "number",
		placeholder: "40"
	},
	{
		group: "People",
		key: "default_role",
		label: "Default role for new hires",
		type: "select",
		options: [
			"employee",
			"manager",
			"engineering",
			"manufacturing",
			"sales",
			"finance",
			"marketing",
			"support",
			"it",
			"hr"
		]
	},
	{
		group: "People",
		key: "invite_expires_days",
		label: "Invite expiry (days)",
		type: "number",
		placeholder: "7"
	},
	{
		group: "People",
		key: "require_manager_approval",
		label: "Require manager approval for time off",
		type: "select",
		options: ["yes", "no"]
	},
	{
		group: "People",
		key: "auto_seed_onboarding",
		label: "Auto-seed onboarding on invite accept",
		type: "select",
		options: ["yes", "no"]
	},
	{
		group: "People",
		key: "org_directory_visibility",
		label: "Directory visibility",
		type: "select",
		options: [
			"everyone",
			"managers",
			"admins"
		]
	},
	{
		group: "Meetings",
		key: "default_meeting_length",
		label: "Default meeting length (min)",
		type: "number",
		placeholder: "30"
	},
	{
		group: "Meetings",
		key: "auto_log_meeting_time",
		label: "Auto-log meeting time",
		type: "select",
		options: ["yes", "no"]
	},
	{
		group: "Meetings",
		key: "meeting_reminder_minutes",
		label: "Meeting reminder (min before)",
		type: "number",
		placeholder: "10"
	},
	{
		group: "Meetings",
		key: "record_meetings_default",
		label: "Record meetings by default",
		type: "select",
		options: ["yes", "no"]
	},
	{
		group: "Security",
		key: "session_timeout_hours",
		label: "Session timeout (hours)",
		type: "number",
		placeholder: "24"
	},
	{
		group: "Security",
		key: "require_mfa",
		label: "Require MFA for admins",
		type: "select",
		options: ["yes", "no"]
	},
	{
		group: "Security",
		key: "password_min_length",
		label: "Minimum password length",
		type: "number",
		placeholder: "10"
	},
	{
		group: "Security",
		key: "allowed_email_domains",
		label: "Allowed sign-up domains (comma-sep)",
		placeholder: "clovrlab.com"
	},
	{
		group: "Security",
		key: "ip_allowlist",
		label: "IP allowlist (comma-sep, empty = any)",
		type: "textarea"
	},
	{
		group: "Notifications",
		key: "notify_new_hire",
		label: "Notify company on new hire",
		type: "select",
		options: ["yes", "no"]
	},
	{
		group: "Notifications",
		key: "notify_dm_email",
		label: "Send DM email digest when offline",
		type: "select",
		options: ["yes", "no"]
	},
	{
		group: "Notifications",
		key: "daily_digest_time",
		label: "Daily digest time",
		placeholder: "08:00"
	}
];
var DEFAULTS = {
	timezone: "America/New_York",
	currency: "USD",
	week_starts_on: "Monday",
	date_format: "MM/DD/YYYY",
	measurement_system: "metric",
	work_hours_start: "09:00",
	work_hours_end: "17:00",
	work_days: "Mon,Tue,Wed,Thu,Fri",
	pto_days_per_year: "15",
	sick_days_per_year: "10",
	overtime_threshold_hours: "40",
	default_role: "employee",
	invite_expires_days: "7",
	require_manager_approval: "yes",
	auto_seed_onboarding: "yes",
	org_directory_visibility: "everyone",
	default_meeting_length: "30",
	auto_log_meeting_time: "yes",
	meeting_reminder_minutes: "10",
	record_meetings_default: "no",
	session_timeout_hours: "24",
	require_mfa: "no",
	password_min_length: "10",
	allowed_email_domains: "clovrlab.com",
	fiscal_year_start: "01-01",
	notify_new_hire: "yes",
	notify_dm_email: "yes",
	daily_digest_time: "08:00"
};
function GeneralSettings() {
	const [values, setValues] = (0, import_react.useState)({});
	const [initial, setInitial] = (0, import_react.useState)({});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [savedAt, setSavedAt] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data } = await supabase.from("admin_settings").select("key, value").eq("category", "company");
			const loaded = {};
			for (const r of data ?? []) loaded[r.key] = r.value ?? "";
			const merged = {
				...DEFAULTS,
				...loaded
			};
			setValues(merged);
			setInitial(merged);
		})();
	}, []);
	const dirty = (0, import_react.useMemo)(() => Object.keys(values).some((k) => (values[k] ?? "") !== (initial[k] ?? "")), [values, initial]);
	const save = async () => {
		setSaving(true);
		const rows = SETTING_FIELDS.map((f) => ({
			category: "company",
			key: f.key,
			value: values[f.key] ?? ""
		})).filter((r) => (r.value ?? "").length > 0);
		await supabase.from("admin_settings").delete().eq("category", "company");
		if (rows.length) await supabase.from("admin_settings").insert(rows);
		setInitial({ ...values });
		setSaving(false);
		setSavedAt(Date.now());
		setTimeout(() => setSavedAt(null), 2500);
	};
	const groups = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		for (const f of SETTING_FIELDS) {
			if (!m.has(f.group)) m.set(f.group, []);
			m.get(f.group).push(f);
		}
		return m;
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 flex items-center justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "These settings power onboarding, meetings, invites, and time tracking across HQ."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [savedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-emerald-600",
				children: "Saved ✓"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: save,
				disabled: !dirty || saving,
				className: "flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }),
					" ",
					saving ? "Saving…" : "Save changes"
				]
			})]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-5",
		children: Array.from(groups.entries()).map(([g, fields]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-border bg-card p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground",
				children: g
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
				children: fields.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: `flex flex-col gap-1 ${f.type === "textarea" ? "sm:col-span-2" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium text-muted-foreground",
						children: f.label
					}), f.type === "textarea" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: values[f.key] ?? "",
						onChange: (e) => setValues({
							...values,
							[f.key]: e.target.value
						}),
						placeholder: f.placeholder,
						className: "min-h-[70px] rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
					}) : f.type === "select" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: values[f.key] ?? "",
						onChange: (e) => setValues({
							...values,
							[f.key]: e.target.value
						}),
						className: "rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "—"
						}), f.options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: o,
							children: o
						}, o))]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: f.type === "number" ? "number" : "text",
						value: values[f.key] ?? "",
						onChange: (e) => setValues({
							...values,
							[f.key]: e.target.value
						}),
						placeholder: f.placeholder,
						className: "rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
					})]
				}, f.key))
			})]
		}, g))
	})] });
}
var DEFAULT_COLOR = "#f97316";
function RolesManager() {
	const [roles, setRoles] = (0, import_react.useState)([]);
	const [profiles, setProfiles] = (0, import_react.useState)([]);
	const [assignments, setAssignments] = (0, import_react.useState)([]);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [creating, setCreating] = (0, import_react.useState)(false);
	const [draftName, setDraftName] = (0, import_react.useState)("");
	const [showAssign, setShowAssign] = (0, import_react.useState)(false);
	const [assignSearch, setAssignSearch] = (0, import_react.useState)("");
	const load = async () => {
		const [{ data: r }, { data: p }, { data: a }] = await Promise.all([
			supabase.from("custom_roles").select("*").order("position", { ascending: false }),
			supabase.from("profiles").select("id, full_name, email, department").order("full_name"),
			supabase.from("user_custom_roles").select("user_id, role_id")
		]);
		setRoles(r ?? []);
		setProfiles(p ?? []);
		setAssignments(a ?? []);
		if (!selected && r && r.length) setSelected(r[0].id);
	};
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const selectedRole = roles.find((r) => r.id === selected);
	const assigned = assignments.filter((a) => a.role_id === selected).map((a) => a.user_id);
	const createRole = async (e) => {
		e.preventDefault();
		if (!draftName.trim()) return;
		const maxPos = Math.max(0, ...roles.map((r) => r.position));
		const { data } = await supabase.from("custom_roles").insert({
			name: draftName.trim(),
			color: DEFAULT_COLOR,
			position: maxPos + 1,
			permissions: {
				manage_channels: false,
				manage_roles: false,
				manage_messages: false,
				admin: false
			}
		}).select().single();
		if (data) {
			setRoles((prev) => [data, ...prev]);
			setSelected(data.id);
		}
		setDraftName("");
		setCreating(false);
	};
	const updateRole = async (patch) => {
		if (!selectedRole) return;
		const next = {
			...selectedRole,
			...patch
		};
		setRoles((prev) => prev.map((r) => r.id === selectedRole.id ? next : r));
		await supabase.from("custom_roles").update(patch).eq("id", selectedRole.id);
	};
	const togglePerm = (k) => {
		if (!selectedRole) return;
		updateRole({ permissions: {
			...selectedRole.permissions,
			[k]: !selectedRole.permissions[k]
		} });
	};
	const deleteRole = async () => {
		if (!selectedRole) return;
		if (!confirm(`Delete role "${selectedRole.name}"? Members will lose it.`)) return;
		await supabase.from("custom_roles").delete().eq("id", selectedRole.id);
		setRoles((prev) => prev.filter((r) => r.id !== selectedRole.id));
		setSelected(roles.find((r) => r.id !== selectedRole.id)?.id ?? null);
	};
	const move = async (dir) => {
		if (!selectedRole) return;
		const sorted = [...roles].sort((a, b) => b.position - a.position);
		const swap = sorted[sorted.findIndex((r) => r.id === selectedRole.id) + dir];
		if (!swap) return;
		const p1 = selectedRole.position, p2 = swap.position;
		setRoles((prev) => prev.map((r) => r.id === selectedRole.id ? {
			...r,
			position: p2
		} : r.id === swap.id ? {
			...r,
			position: p1
		} : r));
		await supabase.from("custom_roles").update({ position: p2 }).eq("id", selectedRole.id);
		await supabase.from("custom_roles").update({ position: p1 }).eq("id", swap.id);
	};
	const toggleAssign = async (userId) => {
		if (!selectedRole) return;
		if (assignments.some((a) => a.user_id === userId && a.role_id === selectedRole.id)) {
			await supabase.from("user_custom_roles").delete().eq("user_id", userId).eq("role_id", selectedRole.id);
			setAssignments((prev) => prev.filter((a) => !(a.user_id === userId && a.role_id === selectedRole.id)));
		} else {
			await supabase.from("user_custom_roles").insert({
				user_id: userId,
				role_id: selectedRole.id
			});
			setAssignments((prev) => [...prev, {
				user_id: userId,
				role_id: selectedRole.id
			}]);
		}
	};
	const rolesSorted = [...roles].sort((a, b) => b.position - a.position);
	const assignedProfiles = profiles.filter((p) => assigned.includes(p.id));
	const availableProfiles = profiles.filter((p) => {
		if (assigned.includes(p.id)) return false;
		const q = assignSearch.toLowerCase();
		if (!q) return true;
		return (p.full_name ?? "").toLowerCase().includes(q) || (p.email ?? "").toLowerCase().includes(q);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "flex w-64 shrink-0 flex-col rounded-xl border border-border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold uppercase tracking-wider",
							children: "Roles"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setCreating(true),
						className: "rounded p-1 hover:bg-muted",
						"aria-label": "New role",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-h-[70vh] flex-1 overflow-y-auto p-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 px-2 text-[10px] text-muted-foreground",
							children: "Higher = higher hierarchy"
						}),
						rolesSorted.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSelected(r.id),
							className: `flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition hover:bg-muted ${selected === r.id ? "bg-primary/10" : ""}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-3 w-3 shrink-0 rounded-full",
									style: { backgroundColor: r.color }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									style: { color: r.color },
									children: r.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-auto text-[10px] text-muted-foreground",
									children: assignments.filter((a) => a.role_id === r.id).length
								})
							]
						}, r.id)),
						rolesSorted.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-2 text-xs text-muted-foreground",
								children: "No roles yet."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setCreating(true),
								className: "w-full rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground",
								children: "Create your first role"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "flex-1 rounded-xl border border-border bg-card",
				children: !selectedRole ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-full items-center justify-center p-10 text-sm text-muted-foreground",
					children: "Select or create a role."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-6 flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: selectedRole.name,
									onChange: (e) => updateRole({ name: e.target.value }),
									className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-lg font-semibold outline-none focus:border-primary",
									style: { color: selectedRole.color }
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "color",
										value: selectedRole.color,
										onChange: (e) => updateRole({ color: e.target.value }),
										className: "h-8 w-12 cursor-pointer rounded border border-border bg-transparent"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: selectedRole.color
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => move(-1),
										className: "rounded border border-border p-1.5 hover:bg-muted",
										"aria-label": "Move up",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "h-3.5 w-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => move(1),
										className: "rounded border border-border p-1.5 hover:bg-muted",
										"aria-label": "Move down",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "h-3.5 w-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: deleteRole,
										className: "rounded border border-destructive/30 p-1.5 text-destructive hover:bg-destructive/10",
										"aria-label": "Delete",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground",
									children: "Permissions"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2",
									children: [
										[
											"admin",
											"Administrator",
											"Full access — bypasses every permission check"
										],
										[
											"manage_roles",
											"Manage roles",
											"Create, edit, delete, assign roles"
										],
										[
											"manage_channels",
											"Manage channels",
											"Create and delete channels + categories"
										],
										[
											"manage_messages",
											"Manage messages",
											"Delete any message in channels"
										]
									].map(([k, label, desc]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 hover:bg-muted/30",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: selectedRole.permissions[k],
											onChange: () => togglePerm(k),
											className: "mt-0.5"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-medium",
											children: label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: desc
										})] })]
									}, k))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 text-xs text-muted-foreground",
									children: [
										"Configure which tabs this role can access in the ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Tab Access" }),
										" tab above."
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground",
								children: [
									"Members (",
									assignedProfiles.length,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setShowAssign(true),
								className: "flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3 w-3" }), " Add members"]
							})]
						}), assignedProfiles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground",
							children: "No members yet."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-1",
							children: assignedProfiles.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between rounded-lg border border-border px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm",
									children: p.full_name || p.email
								}), p.department && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: p.department
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									"aria-label": "Delete",
									onClick: () => toggleAssign(p.id),
									className: "rounded p-1 text-muted-foreground hover:text-destructive",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
								})]
							}, p.id))
						})] })
					]
				})
			}),
			creating && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
				onClick: () => setCreating(false),
				role: "dialog",
				"aria-modal": "true",
				"aria-label": "Create",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EscapeKey, { onEscape: () => setCreating(false) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: createRole,
					className: "w-full max-w-sm rounded-xl border border-border bg-card p-5 shadow-2xl",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold",
								children: "New role"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setCreating(false),
								className: "rounded p-1 hover:bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							autoFocus: true,
							required: true,
							value: draftName,
							onChange: (e) => setDraftName(e.target.value),
							placeholder: "e.g. Engineering",
							className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setCreating(false),
								className: "rounded-lg border border-border px-4 py-2 text-sm",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								className: "rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
								children: "Create"
							})]
						})
					]
				})]
			}),
			showAssign && selectedRole && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
				onClick: () => setShowAssign(false),
				role: "dialog",
				"aria-modal": "true",
				"aria-label": "Assign",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EscapeKey, { onEscape: () => setShowAssign(false) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					role: "dialog",
					"aria-modal": "true",
					className: "flex w-full max-w-md flex-col rounded-xl border border-border bg-card shadow-2xl",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-border p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-semibold",
								children: ["Add members to ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: { color: selectedRole.color },
									children: selectedRole.name
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setShowAssign(false),
								className: "rounded p-1 hover:bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: assignSearch,
								onChange: (e) => setAssignSearch(e.target.value),
								placeholder: "Search teammates…",
								className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-h-80 overflow-y-auto px-3 pb-3",
							children: availableProfiles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "p-4 text-center text-xs text-muted-foreground",
								children: "No matches."
							}) : availableProfiles.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => toggleAssign(p.id),
								className: "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm",
									children: p.full_name || p.email
								}), p.department && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: p.department
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-primary opacity-0" })]
							}, p.id))
						})
					]
				})]
			})
		]
	});
}
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
function OnboardingTemplates() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [form, setForm] = (0, import_react.useState)({
		department: "",
		task: "",
		category: "",
		days_offset: 0,
		sort_order: 0
	});
	const reload = async () => {
		const { data } = await supabase.from("hr_onboarding_templates").select("*").order("department", { nullsFirst: true }).order("sort_order");
		setRows(data ?? []);
	};
	(0, import_react.useEffect)(() => {
		reload();
	}, []);
	const add = async () => {
		if (!form.task) return;
		await supabase.from("hr_onboarding_templates").insert({
			department: form.department || null,
			task: form.task,
			category: form.category || null,
			days_offset: Number(form.days_offset ?? 0),
			sort_order: Number(form.sort_order ?? 0)
		});
		setForm({
			department: "",
			task: "",
			category: "",
			days_offset: 0,
			sort_order: 0
		});
		reload();
	};
	const del = async (id) => {
		await supabase.from("hr_onboarding_templates").delete().eq("id", id);
		reload();
	};
	const update = async (id, patch) => {
		await supabase.from("hr_onboarding_templates").update(patch).eq("id", id);
		reload();
	};
	const inputCls = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-4 text-sm text-muted-foreground",
			children: [
				"Tasks defined here are auto-created for every new hire when they accept an invite. Use ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Global" }),
				" for company-wide tasks (sign policy, IT setup) and ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Department" }),
				" for role-specific tasks."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 rounded-xl border border-border bg-card p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground",
					children: "Add template task"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-3 sm:grid-cols-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: form.department ?? "",
							onChange: (e) => setForm({
								...form,
								department: e.target.value
							}),
							className: inputCls,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Global (all)"
							}), DEPARTMENTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: d,
								children: d
							}, d))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							"aria-label": "Task",
							placeholder: "Task",
							value: form.task ?? "",
							onChange: (e) => setForm({
								...form,
								task: e.target.value
							}),
							className: `${inputCls} sm:col-span-2`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							"aria-label": "Category",
							placeholder: "Category",
							value: form.category ?? "",
							onChange: (e) => setForm({
								...form,
								category: e.target.value
							}),
							className: inputCls
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							"aria-label": "Days",
							type: "number",
							placeholder: "Days",
							value: form.days_offset ?? 0,
							onChange: (e) => setForm({
								...form,
								days_offset: Number(e.target.value)
							}),
							className: inputCls
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: add,
						className: "flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add task"]
					})
				})
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
							children: "Department"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-left",
							children: "Task"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-left",
							children: "Category"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-left",
							children: "Days after start"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-2" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2",
							children: r.department ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Global"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								defaultValue: r.task,
								onBlur: (e) => e.target.value !== r.task && update(r.id, { task: e.target.value }),
								className: "w-full bg-transparent"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								defaultValue: r.category ?? "",
								onBlur: (e) => update(r.id, { category: e.target.value || null }),
								className: "w-full bg-transparent"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								defaultValue: r.days_offset,
								onBlur: (e) => update(r.id, { days_offset: Number(e.target.value) }),
								className: "w-16 bg-transparent"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2 text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								"aria-label": "Delete",
								onClick: () => del(r.id),
								className: "text-xs text-destructive hover:underline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "inline h-3 w-3" })
							})
						})
					]
				}, r.id)), rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 5,
					className: "p-8 text-center text-sm text-muted-foreground",
					children: "No templates yet — add company-wide onboarding tasks above."
				}) })] })]
			})
		})
	] });
}
//#endregion
export { CompanyPage as component };
