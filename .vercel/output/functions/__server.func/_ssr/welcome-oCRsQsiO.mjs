import { i as __toESM } from "../_runtime.mjs";
import { m as require_react } from "../_libs/@react-leaflet/core+[...].mjs";
import { S as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { n as supabase } from "./client-B5YVWdzA.mjs";
import { $t as LayoutDashboard, B as ShieldCheck, Br as ArrowLeft, Bt as Mail, Dn as FolderOpen, Gt as LoaderCircle, Mt as MessagesSquare, Xn as Compass, er as ClipboardCheck, h as Upload, jr as Bell, mr as Check, nn as KeyRound, on as ImagePlus, zr as ArrowRight } from "../_libs/lucide-react.mjs";
import { t as checkOnboardingEmail } from "./signin.functions-CG8VksoC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/welcome-oCRsQsiO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STEPS = [
	{
		key: "email",
		title: "Verify your email",
		blurb: "Enter the work email you were added with so we can confirm your invite.",
		icon: Mail
	},
	{
		key: "code",
		title: "Security code",
		blurb: "We email you a 6-digit code. Enter it to prove the inbox is yours.",
		icon: ShieldCheck
	},
	{
		key: "password",
		title: "Create a password",
		blurb: "Choose a strong password you'll use to sign in to HQ from now on.",
		icon: KeyRound
	},
	{
		key: "photo",
		title: "Profile photo",
		blurb: "Teammates see this on messages, meetings and records across HQ.",
		icon: ImagePlus
	},
	{
		key: "tasks",
		title: "Onboarding tasks",
		blurb: "Your first-week checklist, assigned automatically by department.",
		icon: ClipboardCheck
	},
	{
		key: "tour",
		title: "Tour the workspace",
		blurb: "A quick pass over the tools you'll use every day.",
		icon: Compass
	}
];
var input = "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20";
function Welcome() {
	const navigate = useNavigate();
	const [step, setStep] = (0, import_react.useState)("email");
	const [email, setEmail] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [notice, setNotice] = (0, import_react.useState)(null);
	const idx = STEPS.findIndex((s) => s.key === step);
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data } = await supabase.auth.getUser();
			if (!data.user) return;
			setEmail(data.user.email ?? "");
			const { data: p } = await supabase.from("profiles").select("onboarding_completed_at").eq("id", data.user.id).maybeSingle();
			if (p?.onboarding_completed_at) navigate({ to: "/dashboard" });
			else setStep((s) => s === "email" ? "password" : s);
		})();
	}, []);
	const go = (k) => {
		setError(null);
		setNotice(null);
		setStep(k);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh bg-surface px-4 py-6 text-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mb-4 flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-[11px] font-black text-primary-foreground",
						children: "CL"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-semibold",
						children: "Clovr Labs HQ"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "New hire setup"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepRail, { idx }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-2xl border border-border bg-card p-6 sm:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-semibold uppercase tracking-[0.2em] text-primary",
							children: idx === STEPS.length - 1 ? "Last step" : `Step ${idx + 1} of ${STEPS.length}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 text-3xl font-semibold tracking-tight",
							children: STEPS[idx].title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-xl text-sm text-muted-foreground",
							children: STEPS[idx].blurb
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banner, {
							tone: "error",
							children: error
						}),
						notice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banner, {
							tone: "ok",
							children: notice
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6",
							children: [
								step === "email" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmailStep, {
									email,
									setEmail,
									busy,
									setBusy,
									setError,
									setNotice,
									onSent: () => go("code")
								}),
								step === "code" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeStep, {
									email,
									busy,
									setBusy,
									setError,
									setNotice,
									onVerified: () => go("password"),
									onBack: () => go("email")
								}),
								step === "password" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordStep, {
									busy,
									setBusy,
									setError,
									onDone: () => go("photo")
								}),
								step === "photo" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoStep, {
									busy,
									setBusy,
									setError,
									onDone: () => go("tasks")
								}),
								step === "tasks" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TasksStep, {
									onDone: () => go("tour"),
									onBack: () => go("photo")
								}),
								step === "tour" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TourStep, {
									onFinish: async () => {
										const { data } = await supabase.auth.getUser();
										if (data.user) await supabase.from("profiles").update({
											onboarding_completed_at: (/* @__PURE__ */ new Date()).toISOString(),
											onboarding_step: 6
										}).eq("id", data.user.id);
										try {
											localStorage.setItem("hq.tour.pending", "1");
										} catch {}
										navigate({ to: "/dashboard" });
									},
									onBack: () => go("tasks")
								})
							]
						})
					]
				})]
			})]
		})
	});
}
function StepRail({ idx }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "rounded-2xl border border-border bg-gradient-to-b from-primary/[0.07] to-transparent p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-5 text-xs text-muted-foreground",
			children: "Get started by setting up your HQ account."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "relative space-y-6",
			children: STEPS.map((s, i) => {
				const done = i < idx;
				const active = i === idx;
				const Icon = s.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "relative flex gap-3",
					children: [
						i < STEPS.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute left-[15px] top-9 h-[calc(100%+0.5rem)] w-px ${done ? "bg-primary" : "bg-border"}` }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border ${done ? "border-primary bg-primary text-primary-foreground" : active ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground"}`,
							children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: `text-sm font-semibold ${active || done ? "text-foreground" : "text-muted-foreground"}`,
								children: s.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-xs leading-relaxed text-muted-foreground",
								children: s.blurb
							})]
						})
					]
				}, s.key);
			})
		})]
	});
}
function Banner({ tone, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `mt-5 rounded-lg border px-3 py-2 text-sm ${tone === "error" ? "border-destructive/30 bg-destructive/5 text-destructive" : "border-primary/30 bg-primary/5 text-primary"}`,
		children
	});
}
function Actions({ onBack, onNext, nextLabel, busy, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8 flex items-center justify-between",
		children: [onBack ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: onBack,
			className: "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Back"]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: onNext,
			disabled: busy || disabled,
			className: "flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50",
			children: [
				busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
				nextLabel,
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
			]
		})]
	});
}
function EmailStep({ email, setEmail, busy, setBusy, setError, setNotice, onSent }) {
	const send = async () => {
		const value = email.trim().toLowerCase();
		if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
			setError("Enter a valid email address.");
			return;
		}
		setError(null);
		setBusy(true);
		try {
			if (!(await checkOnboardingEmail({ data: { email: value } })).ok) {
				setError("That email hasn't been added to the team directory yet. Ask your manager to add you, then try again.");
				return;
			}
			const { error: otpErr } = await supabase.auth.signInWithOtp({
				email: value,
				options: {
					shouldCreateUser: true,
					emailRedirectTo: `${window.location.origin}/welcome`
				}
			});
			if (otpErr) throw otpErr;
			setNotice(`We sent a 6-digit code to ${value}.`);
			onSent();
		} catch (e) {
			setError(e?.message ?? "Could not send the code.");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "block text-xs font-medium uppercase tracking-wider text-muted-foreground",
				children: "Work email"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				"aria-label": "Work email",
				type: "email",
				autoComplete: "email",
				value: email,
				onChange: (e) => setEmail(e.target.value),
				placeholder: "you@clovrlab.com",
				className: `${input} mt-1.5`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: "Use the address your admin added in the team directory."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Actions, {
				onNext: send,
				nextLabel: "Send code",
				busy
			})
		]
	});
}
function CodeStep({ email, busy, setBusy, setError, setNotice, onVerified, onBack }) {
	const [digits, setDigits] = (0, import_react.useState)(Array(6).fill(""));
	const refs = (0, import_react.useRef)([]);
	const code = digits.join("");
	const setAt = (i, v) => {
		const clean = v.replace(/\D/g, "");
		if (!clean) {
			setDigits((d) => d.map((x, k) => k === i ? "" : x));
			return;
		}
		setDigits((d) => {
			const next = [...d];
			clean.split("").forEach((c, k) => {
				if (i + k < 6) next[i + k] = c;
			});
			return next;
		});
		const jump = Math.min(i + clean.length, 5);
		refs.current[jump]?.focus();
	};
	const verify = async () => {
		if (code.length !== 6) {
			setError("Enter all six digits.");
			return;
		}
		setError(null);
		setBusy(true);
		try {
			const { error } = await supabase.auth.verifyOtp({
				email,
				token: code,
				type: "email"
			});
			if (error) throw error;
			onVerified();
		} catch (e) {
			setError(e?.message?.includes("expired") ? "That code expired. Send a new one." : e?.message ?? "Invalid code.");
		} finally {
			setBusy(false);
		}
	};
	const resend = async () => {
		setBusy(true);
		setError(null);
		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: { shouldCreateUser: true }
		});
		setBusy(false);
		if (error) setError(error.message);
		else setNotice("New code sent.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: ["Code sent to ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium text-foreground",
					children: email
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex gap-2",
				children: digits.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: (el) => {
						refs.current[i] = el;
					},
					"aria-label": `Digit ${i + 1}`,
					inputMode: "numeric",
					value: d,
					onChange: (e) => setAt(i, e.target.value),
					onKeyDown: (e) => {
						if (e.key === "Backspace" && !d && i > 0) refs.current[i - 1]?.focus();
					},
					className: "h-14 w-12 rounded-lg border border-border bg-background text-center text-xl font-semibold outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: resend,
				className: "mt-3 text-xs text-primary hover:underline",
				children: "Didn't get it? Resend code"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Actions, {
				onBack,
				onNext: verify,
				nextLabel: "Verify",
				busy,
				disabled: code.length !== 6
			})
		]
	});
}
function PasswordStep({ busy, setBusy, setError, onDone }) {
	const [pw, setPw] = (0, import_react.useState)("");
	const [pw2, setPw2] = (0, import_react.useState)("");
	const strength = (0, import_react.useMemo)(() => {
		let s = 0;
		if (pw.length >= 8) s++;
		if (pw.length >= 12) s++;
		if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
		if (/\d/.test(pw)) s++;
		if (/[^A-Za-z0-9]/.test(pw)) s++;
		return Math.min(s, 4);
	}, [pw]);
	const save = async () => {
		if (pw.length < 8) {
			setError("Password must be at least 8 characters.");
			return;
		}
		if (pw !== pw2) {
			setError("Passwords don't match.");
			return;
		}
		setError(null);
		setBusy(true);
		const { error } = await supabase.auth.updateUser({ password: pw });
		setBusy(false);
		if (error) setError(error.message);
		else onDone();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "block text-xs font-medium uppercase tracking-wider text-muted-foreground",
				children: "New password"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				"aria-label": "New password",
				type: "password",
				autoComplete: "new-password",
				value: pw,
				onChange: (e) => setPw(e.target.value),
				className: `${input} mt-1.5`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex gap-1",
				children: [
					0,
					1,
					2,
					3
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1 flex-1 rounded-full ${i < strength ? "bg-primary" : "bg-border"}` }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "mt-4 block text-xs font-medium uppercase tracking-wider text-muted-foreground",
				children: "Confirm password"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				"aria-label": "Confirm password",
				type: "password",
				autoComplete: "new-password",
				value: pw2,
				onChange: (e) => setPw2(e.target.value),
				className: `${input} mt-1.5`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: "At least 8 characters. Mix cases, numbers and a symbol for a stronger score."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Actions, {
				onNext: save,
				nextLabel: "Save password",
				busy
			})
		]
	});
}
function PhotoStep({ busy, setBusy, setError, onDone }) {
	const [preview, setPreview] = (0, import_react.useState)(null);
	const [file, setFile] = (0, import_react.useState)(null);
	const fileRef = (0, import_react.useRef)(null);
	const pick = (f) => {
		if (!f) return;
		if (!f.type.startsWith("image/")) {
			setError("Choose an image file.");
			return;
		}
		if (f.size > 5242880) {
			setError("Image must be under 5 MB.");
			return;
		}
		setError(null);
		setFile(f);
		setPreview(URL.createObjectURL(f));
	};
	const save = async () => {
		const { data: u } = await supabase.auth.getUser();
		if (!u.user) {
			setError("Session expired — start again.");
			return;
		}
		if (!file) {
			onDone();
			return;
		}
		setBusy(true);
		try {
			const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
			const path = `${u.user.id}/avatar-${Date.now()}.${ext}`;
			const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, {
				upsert: true,
				contentType: file.type
			});
			if (upErr) throw upErr;
			const { data: signed, error: signErr } = await supabase.storage.from("avatars").createSignedUrl(path, 31536e3);
			if (signErr) throw signErr;
			await supabase.from("profiles").update({
				avatar_url: signed.signedUrl,
				onboarding_step: 3
			}).eq("id", u.user.id);
			onDone();
		} catch (e) {
			setError(e?.message ?? "Upload failed.");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-border bg-muted",
					children: preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: preview,
						alt: "Profile preview",
						className: "h-full w-full object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "h-7 w-7 text-muted-foreground" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => fileRef.current?.click(),
					className: "flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }),
						" ",
						preview ? "Choose another" : "Upload photo"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-muted-foreground",
					children: "JPG or PNG, up to 5 MB."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: fileRef,
					type: "file",
					accept: "image/*",
					className: "hidden",
					"aria-label": "Profile photo",
					onChange: (e) => pick(e.target.files?.[0] ?? null)
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Actions, {
			onNext: save,
			nextLabel: file ? "Save photo" : "Skip for now",
			busy
		})]
	});
}
function TasksStep({ onDone, onBack }) {
	const [tasks, setTasks] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data: u } = await supabase.auth.getUser();
			if (!u.user) {
				setLoading(false);
				return;
			}
			const { data } = await supabase.from("hr_onboarding").select("id, task, category, due_date, status").eq("assignee_id", u.user.id).order("due_date", { ascending: true });
			setTasks(data ?? []);
			setLoading(false);
		})();
	}, []);
	const toggle = async (t) => {
		const next = t.status === "done" ? "pending" : "done";
		setTasks((list) => list.map((x) => x.id === t.id ? {
			...x,
			status: next
		} : x));
		await supabase.from("hr_onboarding").update({ status: next }).eq("id", t.id);
	};
	const done = tasks.filter((t) => t.status === "done").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Loading your checklist…"
	}) : tasks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "No tasks assigned yet — your manager will add them shortly."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-1.5 flex-1 overflow-hidden rounded-full bg-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full rounded-full bg-primary transition-all",
					style: { width: `${done / tasks.length * 100}%` }
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-xs text-muted-foreground",
				children: [
					done,
					"/",
					tasks.length,
					" done"
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y divide-border overflow-hidden rounded-xl border border-border",
			children: tasks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => toggle(t),
				className: "flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/40",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border ${t.status === "done" ? "border-primary bg-primary text-primary-foreground" : "border-border"}`,
						children: t.status === "done" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `flex-1 text-sm ${t.status === "done" ? "text-muted-foreground line-through" : ""}`,
						children: t.task
					}),
					t.category && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded bg-muted px-2 py-0.5 text-[11px] text-muted-foreground",
						children: t.category
					}),
					t.due_date && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] text-muted-foreground",
						children: new Date(t.due_date).toLocaleDateString()
					})
				]
			}) }, t.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-xs text-muted-foreground",
			children: "You can finish the rest later — they stay on your People → Onboarding list."
		})
	] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Actions, {
		onBack,
		onNext: onDone,
		nextLabel: "Continue"
	})] });
}
var SLIDES = [
	{
		icon: LayoutDashboard,
		title: "Your dashboard",
		body: "Everything assigned to you — tasks, meetings and alerts — lands here first each morning."
	},
	{
		icon: MessagesSquare,
		title: "Channels, DMs & phone",
		body: "Team channels for each division, direct messages for one-to-one, and in-app calling with automatic notes."
	},
	{
		icon: FolderOpen,
		title: "Drive & email",
		body: "Shared files live in Drive, and your work inbox is built right into HQ so nothing lives outside the workspace."
	},
	{
		icon: Bell,
		title: "Notifications",
		body: "Mentions, assignments and approvals show up in the bell — click any one to jump straight to the record."
	}
];
function TourStep({ onFinish, onBack }) {
	const [i, setI] = (0, import_react.useState)(0);
	const S = SLIDES[i];
	const Icon = S.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border bg-gradient-to-br from-primary/[0.08] to-transparent p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold",
					children: S.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-lg text-sm text-muted-foreground",
					children: S.body
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 flex items-center gap-2",
			children: SLIDES.map((_, k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				"aria-label": `Slide ${k + 1}`,
				onClick: () => setI(k),
				className: `h-1.5 rounded-full transition-all ${k === i ? "w-8 bg-primary" : "w-3 bg-border"}`
			}, k))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Actions, {
			onBack: i === 0 ? onBack : () => setI(i - 1),
			onNext: () => i < SLIDES.length - 1 ? setI(i + 1) : onFinish(),
			nextLabel: i < SLIDES.length - 1 ? "Next" : "Enter HQ"
		})
	] });
}
//#endregion
export { Welcome as component };
