import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { x as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { r as createServerFn } from "./_ssr/server-D_zSarl9.mjs";
import { Br as ArrowLeft, Gt as LoaderCircle, K as Send, Or as Bot, Ut as Lock, dn as Hash, nt as RefreshCw, p as UserPlus, st as Plus } from "./_libs/lucide-react.mjs";
import { t as createSsrRpc } from "./_ssr/createSsrRpc-CPmNrwFg.mjs";
import { t as requireSupabaseAuth } from "./_ssr/auth-middleware-CDjNu8j6.mjs";
import { t as useRouteAccess } from "./_ssr/route-access-BIUVO0kB.mjs";
import { t as useServerFn } from "./_ssr/useServerFn-CrZF2pjq.mjs";
import { i as stringType, n as booleanType, r as objectType, t as arrayType } from "./_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.admin.slack-CdMHZ5fY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Bot identity + channel/member inventory for the Enterprise Systems console. */
var slackOverview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("10491c1e3808233c57588073064c1425647cdee168955cc918438ed81947f3f6"));
var slackCreateChannel = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	name: stringType().min(1).max(80),
	isPrivate: booleanType().default(false),
	purpose: stringType().max(250).optional(),
	invite: arrayType(stringType().min(1)).max(200).default([])
}).parse(d)).handler(createSsrRpc("d8df867b2dc621a57a9fd30655b6128701d9a992f0e5f922451f3da9c5605e88"));
var slackInviteMembers = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	channel: stringType().min(1),
	users: arrayType(stringType().min(1)).min(1).max(200)
}).parse(d)).handler(createSsrRpc("bbbd9596772dd1245e9e6f66c363d626ed40df3d6ae42158bb7eba86462ff445"));
/** Recent messages posted by the bot in a channel — used for bot activity monitoring. */
var slackBotActivity = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ channel: stringType().min(1) }).parse(d)).handler(createSsrRpc("ac22ec0510c3163aae2876461488c16ebdf94dd6297a299dbd39c4507df8284b"));
var slackPostMessage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	channel: stringType().min(1),
	text: stringType().min(1).max(3e3)
}).parse(d)).handler(createSsrRpc("bc134d808093432146df2b7296279c612aeeb71806cb6f1a87d4c251efdf8eda"));
function SlackAdmin() {
	const access = useRouteAccess();
	const load = useServerFn(slackOverview);
	const createChannel = useServerFn(slackCreateChannel);
	const invite = useServerFn(slackInviteMembers);
	const activity = useServerFn(slackBotActivity);
	const post = useServerFn(slackPostMessage);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [configured, setConfigured] = (0, import_react.useState)(false);
	const [bot, setBot] = (0, import_react.useState)(null);
	const [channels, setChannels] = (0, import_react.useState)([]);
	const [members, setMembers] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)(null);
	const [notice, setNotice] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [purpose, setPurpose] = (0, import_react.useState)("");
	const [isPrivate, setIsPrivate] = (0, import_react.useState)(false);
	const [selected, setSelected] = (0, import_react.useState)([]);
	const [active, setActive] = (0, import_react.useState)(null);
	const [feed, setFeed] = (0, import_react.useState)(null);
	const [message, setMessage] = (0, import_react.useState)("");
	const refresh = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await load({ data: void 0 });
			setConfigured(res.configured);
			setBot(res.bot);
			setChannels(res.channels ?? []);
			setMembers(res.members ?? []);
		} catch (err) {
			setError(err?.message ?? "Could not reach Slack.");
		} finally {
			setLoading(false);
		}
	}, [load]);
	(0, import_react.useEffect)(() => {
		if (access.isAdmin) refresh();
	}, [access.isAdmin, refresh]);
	const openChannel = async (channel) => {
		setActive(channel);
		setFeed(null);
		try {
			setFeed(await activity({ data: { channel: channel.id } }));
		} catch (err) {
			setError(err?.message ?? "Could not load channel activity.");
		}
	};
	const submitCreate = async (e) => {
		e.preventDefault();
		setBusy(true);
		setError(null);
		setNotice(null);
		try {
			const res = await createChannel({ data: {
				name,
				isPrivate,
				purpose: purpose || void 0,
				invite: selected
			} });
			setNotice(`Created #${res.name}${selected.length ? ` and invited ${selected.length} member(s)` : ""}.`);
			setName("");
			setPurpose("");
			setSelected([]);
			await refresh();
		} catch (err) {
			setError(err?.message ?? "Could not create the channel.");
		} finally {
			setBusy(false);
		}
	};
	const inviteToActive = async () => {
		if (!active || selected.length === 0) return;
		setBusy(true);
		setError(null);
		try {
			await invite({ data: {
				channel: active.id,
				users: selected
			} });
			setNotice(`Invited ${selected.length} member(s) to #${active.name}.`);
			setSelected([]);
			await refresh();
		} catch (err) {
			setError(err?.message ?? "Could not invite members.");
		} finally {
			setBusy(false);
		}
	};
	const sendTest = async () => {
		if (!active || !message.trim()) return;
		setBusy(true);
		try {
			await post({ data: {
				channel: active.id,
				text: message.trim()
			} });
			setMessage("");
			setNotice(`Bot posted to #${active.name}.`);
			await openChannel(active);
		} catch (err) {
			setError(err?.message ?? "Could not post the message.");
		} finally {
			setBusy(false);
		}
	};
	if (access.loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-sm text-muted-foreground",
		children: "Checking systems access…"
	});
	if (!access.isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-sm text-muted-foreground",
		children: "Slack administration is restricted to administrators."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-7xl px-6 py-7",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin/it",
				className: "inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), " Enterprise Systems"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mt-3 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase text-primary",
						children: "Slack administration"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 text-3xl font-semibold",
						children: "Workspace bot control"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-2xl text-sm leading-6 text-muted-foreground",
						children: "Create channels, invite teammates, and watch what the Clovr bot is posting — all through the workspace bot connection."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => void refresh(),
					className: "inline-flex items-center gap-2 border border-border px-3 py-2 text-xs font-medium hover:border-primary/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-3.5 w-3.5 ${loading ? "animate-spin" : ""}` }), " Refresh"]
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive",
				children: error
			}),
			notice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 border border-primary/40 bg-primary/10 px-4 py-3 text-sm",
				children: notice
			}),
			!loading && !configured && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 border border-border bg-card p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-5 w-5 text-primary" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-4 text-sm font-semibold",
						children: "Slack bot not connected"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-xl text-sm leading-6 text-muted-foreground",
						children: "This console is wired and ready. Approve the Slack connection request in chat so the workspace bot token is available to the server, then refresh this page — channels, members and bot activity appear automatically."
					})
				]
			}),
			configured && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 grid gap-3 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-5 w-5 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-5 text-sm font-semibold",
								children: bot?.user ?? "Bot"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: ["Workspace: ", bot?.team ?? "—"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, { className: "h-5 w-5 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 text-2xl font-semibold",
								children: channels.length
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Channels visible to the bot"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-5 w-5 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 text-2xl font-semibold",
								children: members.length
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Workspace members"
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 grid gap-5 lg:grid-cols-[380px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: submitCreate,
						className: "border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-semibold",
								children: "Create a channel"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: name,
								onChange: (e) => setName(e.target.value),
								required: true,
								placeholder: "incident-response",
								className: "mt-4 w-full border border-border bg-background px-3 py-2 text-sm"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: purpose,
								onChange: (e) => setPurpose(e.target.value),
								placeholder: "Purpose (optional)",
								className: "mt-2 w-full border border-border bg-background px-3 py-2 text-sm"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-3 flex items-center gap-2 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: isPrivate,
									onChange: (e) => setIsPrivate(e.target.checked)
								}), " Private channel"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: busy,
								className: "mt-4 inline-flex w-full items-center justify-center gap-2 bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60",
								children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Create channel"]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-border bg-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-border px-5 py-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-sm font-semibold",
								children: ["Members ", selected.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-primary",
									children: [
										"(",
										selected.length,
										" selected)"
									]
								})]
							}), active && selected.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => void inviteToActive(),
								disabled: busy,
								className: "text-xs font-medium text-primary",
								children: ["Invite to #", active.name]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-h-72 overflow-y-auto divide-y divide-border",
							children: members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex cursor-pointer items-center gap-3 px-5 py-2.5 text-sm hover:bg-muted/40",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: selected.includes(m.id),
										onChange: (e) => setSelected((s) => e.target.checked ? [...s, m.id] : s.filter((x) => x !== m.id))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "min-w-0 flex-1 truncate",
										children: m.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate text-xs text-muted-foreground",
										children: m.email ?? ""
									})
								]
							}, m.id))
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-5 xl:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-border bg-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-b border-border px-5 py-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-semibold",
								children: "Channels"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-h-[520px] overflow-y-auto divide-y divide-border",
							children: channels.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => void openChannel(c),
								className: `flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-muted/40 ${active?.id === c.id ? "bg-muted/60" : ""}`,
								children: [
									c.isPrivate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4 text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, { className: "h-4 w-4 text-muted-foreground" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate text-sm font-medium",
											children: c.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "block truncate text-xs text-muted-foreground",
											children: [
												c.members,
												" members",
												c.topic ? ` · ${c.topic}` : ""
											]
										})]
									}),
									!c.botIsMember && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] uppercase text-muted-foreground",
										children: "bot out"
									})
								]
							}, c.id))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-border bg-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "border-b border-border px-5 py-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "text-sm font-semibold",
									children: ["Bot activity", active ? ` · #${active.name}` : ""]
								})
							}),
							!active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "p-8 text-center text-sm text-muted-foreground",
								children: "Select a channel to inspect bot activity."
							}),
							active && !feed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "p-8 text-center text-sm text-muted-foreground",
								children: "Loading activity…"
							}),
							active && feed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-px border-b border-border bg-border text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-card py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xl font-semibold",
											children: feed.botMessages
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground",
											children: "Bot messages"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-card py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xl font-semibold",
											children: feed.total
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground",
											children: "Recent messages"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "max-h-80 overflow-y-auto divide-y divide-border",
									children: feed.messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "px-5 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] uppercase tracking-wide text-muted-foreground",
											children: [
												m.byBot ? "bot" : m.user,
												" · ",
												(/* @__PURE__ */ new Date(Number(m.ts) * 1e3)).toLocaleString()
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 line-clamp-3 text-sm",
											children: m.text || "(no text)"
										})]
									}, m.ts))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2 border-t border-border p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: message,
										onChange: (e) => setMessage(e.target.value),
										placeholder: "Post as the bot…",
										className: "flex-1 border border-border bg-background px-3 py-2 text-sm"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => void sendTest(),
										disabled: busy,
										className: "inline-flex items-center gap-2 bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
									})]
								})
							] })
						]
					})]
				})]
			})] })
		]
	});
}
//#endregion
export { SlackAdmin as component };
