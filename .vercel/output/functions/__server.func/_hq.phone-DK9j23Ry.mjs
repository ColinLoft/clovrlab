import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { n as supabase } from "./_ssr/client-B5YVWdzA.mjs";
import { At as MicOff, O as StickyNote, ft as Phone, ht as PhoneIncoming, kt as Mic, mt as PhoneOff, pt as PhoneOutgoing, q as Search } from "./_libs/lucide-react.mjs";
import { n as formatDuration, o as usePhone } from "./_ssr/phone-BVB7nyHS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.phone-DK9j23Ry.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function initials(n) {
	return n.split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}
function PhonePage() {
	const { active, history, startCall, endCall, toggleMute, updateNotes, autoNotesEnabled, setAutoNotesEnabled } = usePhone();
	const [profiles, setProfiles] = (0, import_react.useState)([]);
	const [q, setQ] = (0, import_react.useState)("");
	const [, tick] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data: u } = await supabase.auth.getUser();
			if (!u.user) return;
			const { data } = await supabase.from("profiles").select("id, full_name, email, department").neq("id", u.user.id).order("full_name");
			setProfiles(data ?? []);
		})();
	}, []);
	(0, import_react.useEffect)(() => {
		if (!active || active.status !== "active") return;
		const t = setInterval(() => tick((x) => x + 1), 1e3);
		return () => clearInterval(t);
	}, [active]);
	const filtered = (0, import_react.useMemo)(() => profiles.filter((p) => {
		return (p.full_name || p.email || "").toLowerCase().includes(q.toLowerCase()) || (p.department ?? "").toLowerCase().includes(q.toLowerCase());
	}), [profiles, q]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex h-full w-full max-w-7xl gap-4 px-4 py-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "flex w-72 shrink-0 flex-col rounded-xl border border-border bg-card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold uppercase tracking-wider",
						children: "Contacts"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search…",
						className: "w-full rounded-md border border-border bg-background pl-7 pr-2 py-1.5 text-xs outline-none focus:border-primary"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 overflow-y-auto",
				children: [filtered.map((p) => {
					const name = p.full_name || p.email || "Unknown";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 border-b border-border/50 px-4 py-2.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary",
								children: initials(name)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-medium",
									children: name
								}), p.department && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs text-muted-foreground",
									children: p.department
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => startCall(p.id, name),
								disabled: !!active,
								className: "flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm transition hover:bg-emerald-600 disabled:opacity-40",
								"aria-label": `Call ${name}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3.5 w-3.5" })
							})
						]
					}, p.id);
				}), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "p-4 text-xs text-muted-foreground",
					children: "No contacts"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "flex flex-1 flex-col gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-border bg-card p-6",
					children: active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary",
										children: initials(active.peerName)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-card bg-emerald-500" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-lg font-semibold",
									children: active.peerName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs uppercase tracking-wider text-muted-foreground",
									children: [active.status === "ringing" ? "Ringing…" : active.status === "active" ? `On call · ${formatDuration(active.startedAt, null)}` : "Ended", active.kind === "channel" && " · Channel"]
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: toggleMute,
									className: `flex h-10 w-10 items-center justify-center rounded-full border ${active.muted ? "bg-muted" : "border-border hover:bg-muted"}`,
									"aria-label": "Toggle mute",
									children: active.muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: endCall,
									className: "flex h-10 items-center gap-2 rounded-full bg-red-500 px-4 text-sm font-medium text-white hover:bg-red-600",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneOff, { className: "h-4 w-4" }), " End call"]
								})]
							})]
						}), autoNotesEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1.5 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StickyNote, { className: "h-3 w-3" }), " Auto-notes"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-muted-foreground",
								children: "Saved to Meeting Notes when call ends"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: active.notes,
							onChange: (e) => updateNotes(e.target.value),
							placeholder: "Jot notes during the call — action items, decisions, follow-ups…",
							className: "h-28 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
						})] })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center py-10 text-center text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "mb-3 h-10 w-10 text-muted-foreground/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: "No active call. Select a contact to start."
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setAutoNotesEnabled(!autoNotesEnabled),
					"aria-pressed": autoNotesEnabled,
					className: `inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${autoNotesEnabled ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:bg-muted"}`,
					title: "When on, transcribed speech is captured to call notes and saved to Meeting Notes when the call ends.",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StickyNote, { className: "h-3.5 w-3.5" }),
						"Auto-notes ",
						autoNotesEnabled ? "on" : "off",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `ml-1 relative h-3.5 w-6 rounded-full transition ${autoNotesEnabled ? "bg-primary" : "bg-muted-foreground/30"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute top-0.5 h-2.5 w-2.5 rounded-full bg-white shadow transition ${autoNotesEnabled ? "left-3" : "left-0.5"}` })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 overflow-hidden rounded-xl border border-border bg-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-b border-border px-5 py-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold",
							children: "Recent calls"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-h-full divide-y divide-border/60 overflow-y-auto",
						children: [history.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "p-6 text-center text-xs text-muted-foreground",
							children: "No call history yet."
						}), history.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-5 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `flex h-8 w-8 items-center justify-center rounded-full ${c.direction === "outbound" ? "bg-emerald-500/10 text-emerald-600" : "bg-blue-500/10 text-blue-600"}`,
										children: c.direction === "outbound" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneOutgoing, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneIncoming, { className: "h-3.5 w-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm font-medium",
											children: c.peerName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: [
												new Date(c.startedAt).toLocaleString(),
												" · ",
												formatDuration(c.startedAt, c.endedAt)
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => startCall(c.peerId, c.peerName, c.kind),
										disabled: !!active,
										className: "rounded-full bg-emerald-500 p-1.5 text-white hover:bg-emerald-600 disabled:opacity-40",
										"aria-label": "Call back",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3 w-3" })
									})
								]
							}), c.notes?.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "ml-11 mt-2 whitespace-pre-wrap rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground",
								children: c.notes
							})]
						}, c.id))]
					})]
				})
			]
		})]
	});
}
//#endregion
export { PhonePage as component };
