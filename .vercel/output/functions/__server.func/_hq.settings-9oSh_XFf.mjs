import { i as __toESM } from "./_runtime.mjs";
import { r as supabase } from "./_ssr/client-PsXr_elE.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { Ht as LogOut, St as Palette, U as Settings, d as User, jr as Bell, vn as Globe, z as Shield } from "./_libs/lucide-react.mjs";
import { a as loadPrefs, c as useHQTheme, r as cachedPrefs, s as savePrefs, t as applyPrefs } from "./_ssr/prefs-B5T6gU0T.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.settings-9oSh_XFf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const [section, setSection] = (0, import_react.useState)("profile");
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [roles, setRoles] = (0, import_react.useState)([]);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)(null);
	const [prefs, setPrefs] = (0, import_react.useState)(() => cachedPrefs());
	const [prefMsg, setPrefMsg] = (0, import_react.useState)(null);
	const { theme, setTheme } = useHQTheme();
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data: u } = await supabase.auth.getUser();
			if (!u.user) return;
			const { data: p } = await supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle();
			setProfile(p ?? {
				id: u.user.id,
				email: u.user.email
			});
			const { data: r } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
			setRoles((r ?? []).map((x) => x.role));
		})();
	}, []);
	(0, import_react.useEffect)(() => {
		loadPrefs().then((p) => {
			setPrefs(p);
			applyPrefs(p);
		}).catch(() => {});
	}, []);
	const updatePref = (k, v) => {
		const next = {
			...prefs,
			[k]: v
		};
		setPrefs(next);
		applyPrefs(next);
		setPrefMsg("Saving…");
		savePrefs(next).then(() => setPrefMsg("Saved to your account")).catch((e) => setPrefMsg(e.message)).finally(() => setTimeout(() => setPrefMsg(null), 2500));
	};
	const saveProfile = async () => {
		if (!profile) return;
		setSaving(true);
		setMsg(null);
		const { error } = await supabase.from("profiles").update({
			full_name: profile.full_name,
			title: profile.title,
			department: profile.department,
			phone: profile.phone,
			avatar_url: profile.avatar_url
		}).eq("id", profile.id);
		setSaving(false);
		setMsg(error ? error.message : "Saved.");
		setTimeout(() => setMsg(null), 2500);
	};
	const signOut = async () => {
		await supabase.auth.signOut();
		window.location.href = "/hq-login";
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-6xl px-6 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-8 flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-5 w-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground",
				children: "Account"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-semibold tracking-tight",
				children: "Settings"
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 md:grid-cols-[220px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "space-y-1",
				children: [[
					{
						id: "profile",
						label: "Profile",
						icon: User
					},
					{
						id: "appearance",
						label: "Appearance",
						icon: Palette
					},
					{
						id: "notifications",
						label: "Notifications",
						icon: Bell
					},
					{
						id: "preferences",
						label: "Preferences",
						icon: Globe
					},
					{
						id: "security",
						label: "Security",
						icon: Shield
					}
				].map((s) => {
					const Icon = s.icon;
					const active = section === s.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setSection(s.id),
						className: `flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }), s.label]
					}, s.id);
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: signOut,
					className: "mt-4 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), " Sign out"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					prefMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground",
						children: prefMsg
					}),
					section === "profile" && profile && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						title: "Your profile",
						description: `Signed in as ${profile.email}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Full name",
										value: profile.full_name ?? "",
										onChange: (v) => setProfile({
											...profile,
											full_name: v
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Title",
										value: profile.title ?? "",
										onChange: (v) => setProfile({
											...profile,
											title: v
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Department",
										value: profile.department ?? "",
										onChange: (v) => setProfile({
											...profile,
											department: v
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Phone",
										value: profile.phone ?? "",
										onChange: (v) => setProfile({
											...profile,
											phone: v
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "sm:col-span-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Avatar URL",
											value: profile.avatar_url ?? "",
											onChange: (v) => setProfile({
												...profile,
												avatar_url: v
											})
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: saveProfile,
									disabled: saving,
									className: "rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50",
									children: saving ? "Saving…" : "Save changes"
								}), msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: msg
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 border-t border-border pt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Your roles"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 flex flex-wrap gap-2",
									children: roles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm text-muted-foreground",
										children: "No roles assigned."
									}) : roles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary",
										children: r
									}, r))
								})]
							})
						]
					}),
					section === "appearance" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						title: "Appearance",
						description: "Customize how HQ looks on this device.",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectRow, {
								label: "Theme",
								hint: "Dashboard defaults to dark. Choose light for a bright workspace.",
								value: theme,
								onChange: (v) => setTheme(v),
								options: [
									{
										value: "dark",
										label: "Dark"
									},
									{
										value: "light",
										label: "Light"
									},
									{
										value: "system",
										label: "Match system"
									}
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectRow, {
								label: "Density",
								hint: "Compact reduces padding across tables and cards.",
								value: prefs.density,
								onChange: (v) => updatePref("density", v),
								options: [{
									value: "comfortable",
									label: "Comfortable"
								}, {
									value: "compact",
									label: "Compact"
								}]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectRow, {
								label: "Accent color",
								value: prefs.accent,
								onChange: (v) => updatePref("accent", v),
								options: [
									{
										value: "orange",
										label: "Clovr Orange"
									},
									{
										value: "blue",
										label: "Blue"
									},
									{
										value: "green",
										label: "Green"
									},
									{
										value: "violet",
										label: "Violet"
									}
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
								label: "Collapse sidebar by default",
								hint: "Hide labels on the sidebar to save space.",
								value: prefs.sidebarCollapsed,
								onChange: (v) => updatePref("sidebarCollapsed", v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
								label: "Show keyboard shortcut hints",
								value: prefs.showKeyboardHints,
								onChange: (v) => updatePref("showKeyboardHints", v)
							})
						]
					}),
					section === "notifications" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						title: "Notifications",
						description: "Control what reaches you and how.",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
								label: "Email notifications",
								value: prefs.notifyEmail,
								onChange: (v) => updatePref("notifyEmail", v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
								label: "Desktop notifications",
								value: prefs.notifyDesktop,
								onChange: (v) => updatePref("notifyDesktop", v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
								label: "Mentions & replies",
								value: prefs.notifyMentions,
								onChange: (v) => updatePref("notifyMentions", v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
								label: "Company announcements",
								value: prefs.notifyAnnouncements,
								onChange: (v) => updatePref("notifyAnnouncements", v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
								label: "Notification sound",
								value: prefs.soundOn,
								onChange: (v) => updatePref("soundOn", v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
								label: "Pager alarm",
								hint: "Loud repeating siren for urgent pages, even overnight.",
								value: prefs.pagerSound,
								onChange: (v) => updatePref("pagerSound", v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectRow, {
								label: "Email digest",
								value: prefs.notifyDigest,
								onChange: (v) => updatePref("notifyDigest", v),
								options: [
									{
										value: "off",
										label: "Off"
									},
									{
										value: "daily",
										label: "Daily summary"
									},
									{
										value: "weekly",
										label: "Weekly summary"
									}
								]
							})
						]
					}),
					section === "preferences" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						title: "Preferences",
						description: "Localization and workspace defaults.",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectRow, {
								label: "Language",
								value: prefs.language,
								onChange: (v) => updatePref("language", v),
								options: [
									{
										value: "en",
										label: "English"
									},
									{
										value: "es",
										label: "Español"
									},
									{
										value: "fr",
										label: "Français"
									},
									{
										value: "de",
										label: "Deutsch"
									}
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectRow, {
								label: "Timezone",
								value: prefs.timezone,
								onChange: (v) => updatePref("timezone", v),
								options: [
									{
										value: "America/New_York",
										label: "Eastern (New York)"
									},
									{
										value: "America/Chicago",
										label: "Central (Chicago)"
									},
									{
										value: "America/Denver",
										label: "Mountain (Denver)"
									},
									{
										value: "America/Los_Angeles",
										label: "Pacific (Los Angeles)"
									},
									{
										value: "Europe/London",
										label: "London"
									},
									{
										value: "Europe/Berlin",
										label: "Berlin"
									},
									{
										value: "Asia/Tokyo",
										label: "Tokyo"
									}
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectRow, {
								label: "Time format",
								value: prefs.timeFormat,
								onChange: (v) => updatePref("timeFormat", v),
								options: [{
									value: "12h",
									label: "12-hour"
								}, {
									value: "24h",
									label: "24-hour"
								}]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectRow, {
								label: "Week starts on",
								value: prefs.weekStart,
								onChange: (v) => updatePref("weekStart", v),
								options: [{
									value: "sunday",
									label: "Sunday"
								}, {
									value: "monday",
									label: "Monday"
								}]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
								label: "Beta features",
								hint: "Enable in-progress modules and experiments.",
								value: prefs.betaFeatures,
								onChange: (v) => updatePref("betaFeatures", v)
							})
						]
					}),
					section === "security" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						title: "Security",
						description: "Manage authentication for your account.",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-border p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: "Password"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "Send yourself a reset link over email."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: async () => {
										if (!profile?.email) return;
										const { error } = await supabase.auth.resetPasswordForEmail(profile.email);
										setMsg(error ? error.message : "Password reset email sent.");
										setTimeout(() => setMsg(null), 3e3);
									},
									className: "mt-3 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted",
									children: "Send reset email"
								}),
								msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs text-muted-foreground",
									children: msg
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 rounded-lg border border-border p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: "Active session"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "Sign out of this device."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: signOut,
									className: "mt-3 rounded-lg border border-destructive/50 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10",
									children: "Sign out"
								})
							]
						})]
					})
				]
			})]
		})]
	});
}
function Card({ title, description, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold",
				children: title
			}),
			description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 space-y-4",
				children
			})
		]
	});
}
function Field({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value,
			onChange: (e) => onChange(e.target.value),
			className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
		})]
	});
}
function ToggleRow({ label, hint, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start justify-between gap-4 border-t border-border/60 pt-4 first:border-0 first:pt-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium",
			children: label
		}), hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-0.5 text-xs text-muted-foreground",
			children: hint
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			role: "switch",
			"aria-checked": value,
			onClick: () => onChange(!value),
			className: `relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${value ? "bg-primary" : "bg-muted"}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}` })
		})]
	});
}
function SelectRow({ label, hint, value, onChange, options }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-4 border-t border-border/60 pt-4 first:border-0 first:pt-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium",
			children: label
		}), hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-0.5 text-xs text-muted-foreground",
			children: hint
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
			value,
			onChange: (e) => onChange(e.target.value),
			className: "rounded-lg border border-border bg-background px-3 py-1.5 text-sm",
			children: options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: o.value,
				children: o.label
			}, o.value))
		})]
	});
}
//#endregion
export { SettingsPage as component };
