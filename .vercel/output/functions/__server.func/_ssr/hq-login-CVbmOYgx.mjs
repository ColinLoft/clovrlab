import { i as __toESM } from "../_runtime.mjs";
import { m as require_react } from "../_libs/@react-leaflet/core+[...].mjs";
import { S as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { n as supabase } from "./client-B7QlDyqv.mjs";
import { B as ShieldCheck, Br as ArrowLeft, Bt as Mail, Gt as LoaderCircle, zr as ArrowRight } from "../_libs/lucide-react.mjs";
import { n as startSignIn } from "./signin.functions-CLLF4UBX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hq-login-CVbmOYgx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var hq_team_default = "/assets/hq-team-Dh4UK1_J.jpg";
var field = "mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/10";
function HQLogin() {
	const navigate = useNavigate();
	const [step, setStep] = (0, import_react.useState)("email");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [greetName, setGreetName] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [notice, setNotice] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data } = await supabase.auth.getUser();
			if (data.user) navigate({ to: "/workspaces" });
		})();
	}, [navigate]);
	const submitEmail = async (e) => {
		e.preventDefault();
		setError(null);
		setBusy(true);
		try {
			const res = await startSignIn({ data: { email: email.trim().toLowerCase() } });
			setGreetName(res.name);
			setStep("password");
		} catch (err) {
			setError(err?.message ?? "Something went wrong.");
		} finally {
			setBusy(false);
		}
	};
	const submitPassword = async (e) => {
		e.preventDefault();
		setError(null);
		setBusy(true);
		try {
			const { error: signInError } = await supabase.auth.signInWithPassword({
				email: email.trim().toLowerCase(),
				password
			});
			if (signInError) throw signInError;
			await navigate({ to: "/workspaces" });
		} catch (err) {
			setError(err?.message?.includes("Invalid login credentials") ? "That email and password don't match." : err?.message ?? "Could not sign you in.");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-h-dvh grid-cols-1 bg-background text-foreground lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col px-6 py-10 sm:px-12 lg:px-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-[13px] font-bold text-primary-foreground",
						children: "CL"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "leading-tight",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold tracking-tight",
							children: "Clovr HQ"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground",
							children: "Internal operations"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-7",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-semibold uppercase tracking-[0.22em] text-primary",
									children: step === "email" ? "Welcome back" : "Secure sign in"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-3 text-[2rem] font-semibold leading-[1.1] tracking-tight",
									children: step === "email" ? "Sign in to the mission." : greetName ? `Hi ${greetName.split(" ")[0]}, enter your password.` : "Enter your password."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm leading-relaxed text-muted-foreground",
									children: step === "email" ? "Every detection, flight and decision runs through this workspace — and through the people signing into it. Yours matters." : "Use your Clovr HQ credentials to continue to your workspaces."
								})
							]
						}),
						step === "email" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: submitEmail,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-medium uppercase tracking-wider text-muted-foreground",
									children: "Work email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										"aria-label": "Work email",
										type: "email",
										required: true,
										autoFocus: true,
										autoComplete: "email",
										value: email,
										onChange: (e) => setEmail(e.target.value),
										placeholder: "you@clovrlab.com",
										className: `${field} pl-10`
									})]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feedback, {
									error,
									notice
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Submit, {
									busy,
									label: "Continue"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-center text-xs text-muted-foreground",
									children: [
										"New here?",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: "/welcome",
											className: "font-medium text-primary hover:underline",
											children: "Start onboarding"
										})
									]
								})
							]
						}),
						step === "password" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: submitPassword,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-muted/40 px-3.5 py-2.5 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Signing in as "
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: email
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												setStep("email");
												setError(null);
												setPassword("");
											},
											className: "ml-2 text-xs text-primary hover:underline",
											children: "Change"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-medium uppercase tracking-wider text-muted-foreground",
									children: "Password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									"aria-label": "Password",
									type: "password",
									required: true,
									autoFocus: true,
									minLength: 8,
									autoComplete: "current-password",
									value: password,
									onChange: (e) => setPassword(e.target.value),
									className: field
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feedback, {
									error,
									notice
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Submit, {
									busy,
									label: "Sign in"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setStep("email");
										setError(null);
									},
									className: "flex w-full items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), " Back"]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-[11px] text-muted-foreground",
					children: "Private company system. Access is logged and restricted to Clovr Labs staff."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative hidden overflow-hidden lg:block",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: hq_team_default,
					alt: "The Clovr Labs team in the workshop with a prototype aircraft",
					width: 1280,
					height: 1600,
					className: "absolute inset-0 h-full w-full object-cover"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-background/90 via-background/25 to-transparent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-x-0 bottom-0 p-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border/60 bg-card/80 p-6 shadow-xl backdrop-blur",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold uppercase tracking-[0.22em] text-primary",
								children: "Why you're here"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-lg font-semibold leading-snug",
								children: "A small team is why a fire gets seen in minutes instead of hours."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted-foreground",
								children: "Sensors, aircraft and the people watching them only work together because someone here keeps them moving. That's the job you're signing into."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 flex items-center gap-2 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-primary" }), "Access is protected by your individual Clovr HQ credentials."]
							})
						]
					})
				})
			]
		})]
	});
}
function Feedback({ error, notice }) {
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive",
		children: error
	});
	if (notice) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl border border-primary/30 bg-primary/5 px-3.5 py-2.5 text-sm text-foreground",
		children: notice
	});
	return null;
}
function Submit({ busy, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "submit",
		disabled: busy,
		className: "flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50",
		children: [
			busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : null,
			busy ? "Please wait…" : label,
			!busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
		]
	});
}
//#endregion
export { HQLogin as component };
