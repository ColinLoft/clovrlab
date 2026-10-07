import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { n as supabase } from "./_ssr/client-B7QlDyqv.mjs";
import { E as Tag, O as StickyNote, j as Square, kt as Mic, n as X, q as Search, st as Plus, u as Users, x as Trash2 } from "./_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.meeting-notes-CP9HMeva.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function toLocalInput(iso) {
	const d = new Date(iso);
	const p = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}
function MeetingNotesPage() {
	const [me, setMe] = (0, import_react.useState)(null);
	const [notes, setNotes] = (0, import_react.useState)([]);
	const [profiles, setProfiles] = (0, import_react.useState)({});
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [tagFilter, setTagFilter] = (0, import_react.useState)(null);
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)({});
	const load = async () => {
		const { data: u } = await supabase.auth.getUser();
		setMe(u.user?.id ?? null);
		const { data } = await supabase.from("meeting_notes").select("*").order("meeting_date", {
			ascending: false,
			nullsFirst: false
		}).order("created_at", { ascending: false });
		const list = data ?? [];
		setNotes(list);
		const ids = Array.from(new Set(list.map((n) => n.author_id)));
		if (ids.length) {
			const { data: p } = await supabase.from("profiles").select("id, full_name, email").in("id", ids);
			const map = {};
			(p ?? []).forEach((row) => {
				map[row.id] = row;
			});
			setProfiles(map);
		}
	};
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const allTags = (0, import_react.useMemo)(() => {
		const s = /* @__PURE__ */ new Set();
		notes.forEach((n) => n.tags.forEach((t) => s.add(t)));
		return Array.from(s).sort();
	}, [notes]);
	const filtered = (0, import_react.useMemo)(() => notes.filter((n) => {
		if (tagFilter && !n.tags.includes(tagFilter)) return false;
		if (search) {
			const q = search.toLowerCase();
			return `${n.title} ${n.body ?? ""} ${n.tags.join(" ")} ${n.attendees.join(" ")}`.toLowerCase().includes(q);
		}
		return true;
	}), [
		notes,
		search,
		tagFilter
	]);
	const startNew = () => {
		setDraft({
			title: "",
			body: "",
			meeting_date: (/* @__PURE__ */ new Date()).toISOString(),
			tags: [],
			attendees: []
		});
		setSelected(null);
		setEditing(true);
	};
	const startEdit = (n) => {
		setDraft({ ...n });
		setEditing(true);
	};
	const save = async () => {
		if (!me || !draft.title?.trim()) return;
		const payload = {
			title: draft.title.trim(),
			body: draft.body?.trim() || null,
			meeting_date: draft.meeting_date || null,
			tags: draft.tags ?? [],
			attendees: draft.attendees ?? []
		};
		if (draft.id) {
			const { data, error } = await supabase.from("meeting_notes").update(payload).eq("id", draft.id).select().single();
			if (error) {
				alert(error.message);
				return;
			}
			setNotes((prev) => prev.map((n) => n.id === draft.id ? data : n));
			setSelected(data);
		} else {
			const { data, error } = await supabase.from("meeting_notes").insert({
				...payload,
				author_id: me
			}).select().single();
			if (error) {
				alert(error.message);
				return;
			}
			setNotes((prev) => [data, ...prev]);
			setSelected(data);
		}
		setEditing(false);
	};
	const remove = async (n) => {
		if (!confirm("Delete this note?")) return;
		await supabase.from("meeting_notes").delete().eq("id", n.id);
		setNotes((prev) => prev.filter((x) => x.id !== n.id));
		if (selected?.id === n.id) setSelected(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex h-full w-full max-w-7xl gap-4 px-4 py-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "flex w-80 shrink-0 flex-col rounded-xl border border-border bg-card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StickyNote, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-semibold uppercase tracking-wider",
								children: "Notes"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: startNew,
							className: "flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-xs text-primary-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" }), " New"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: search,
							onChange: (e) => setSearch(e.target.value),
							placeholder: "Search notes…",
							className: "w-full rounded-md border border-border bg-background pl-7 pr-2 py-1.5 text-xs outline-none focus:border-primary"
						})]
					}),
					allTags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setTagFilter(null),
							className: `rounded-full border px-2 py-0.5 text-[10px] ${tagFilter === null ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"}`,
							children: "All"
						}), allTags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setTagFilter(t === tagFilter ? null : t),
							className: `rounded-full border px-2 py-0.5 text-[10px] ${tagFilter === t ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"}`,
							children: t
						}, t))]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-y-auto",
				children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "p-4 text-xs text-muted-foreground",
					children: "No notes yet."
				}) : filtered.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						setSelected(n);
						setEditing(false);
					},
					className: `block w-full border-b border-border/50 p-4 text-left transition hover:bg-muted/50 ${selected?.id === n.id ? "bg-primary/10" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "line-clamp-1 text-sm font-semibold",
							children: n.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 line-clamp-2 text-xs text-muted-foreground",
							children: n.body || "No content"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-center gap-2 text-[10px] text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: n.meeting_date ? new Date(n.meeting_date).toLocaleDateString() : new Date(n.created_at).toLocaleDateString() }), n.tags.slice(0, 2).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded bg-muted px-1.5 py-0.5",
								children: t
							}, t))]
						})
					]
				}, n.id))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "flex flex-1 flex-col rounded-xl border border-border bg-card",
			children: !selected && !editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 flex-col items-center justify-center text-center text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StickyNote, { className: "mb-3 h-10 w-10 text-muted-foreground/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Select a note or create a new one." })]
			}) : editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoteEditor, {
				draft,
				setDraft,
				onSave: save,
				onCancel: () => {
					setEditing(false);
					if (!draft.id) setSelected(null);
				}
			}) : selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-start justify-between gap-4 border-b border-border p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-semibold",
							children: selected.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground",
							children: [
								selected.meeting_date && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["📅 ", new Date(selected.meeting_date).toLocaleString([], {
									dateStyle: "medium",
									timeStyle: "short"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["by ", profiles[selected.author_id]?.full_name || profiles[selected.author_id]?.email || "Unknown"] }),
								selected.attendees.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3 w-3" }),
										" ",
										selected.attendees.join(", ")
									]
								})
							]
						}),
						selected.tags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-1",
							children: selected.tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-2.5 w-2.5" }), t]
							}, t))
						})
					] }), selected.author_id === me && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => startEdit(selected),
							className: "rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-muted",
							children: "Edit"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							"aria-label": "Delete",
							onClick: () => remove(selected),
							className: "rounded-lg border border-destructive/30 p-1.5 text-destructive hover:bg-destructive/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-y-auto p-6",
					children: selected.body ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "whitespace-pre-wrap font-sans text-sm leading-relaxed",
						children: selected.body
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm italic text-muted-foreground",
						children: "No content yet."
					})
				})]
			}) : null
		})]
	});
}
function NoteEditor({ draft, setDraft, onSave, onCancel }) {
	const [tagInput, setTagInput] = (0, import_react.useState)("");
	const [attInput, setAttInput] = (0, import_react.useState)("");
	const addTag = () => {
		const t = tagInput.trim();
		if (!t) return;
		setDraft({
			...draft,
			tags: Array.from(/* @__PURE__ */ new Set([...draft.tags ?? [], t]))
		});
		setTagInput("");
	};
	const addAtt = () => {
		const t = attInput.trim();
		if (!t) return;
		setDraft({
			...draft,
			attendees: Array.from(/* @__PURE__ */ new Set([...draft.attendees ?? [], t]))
		});
		setAttInput("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center justify-between border-b border-border p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-semibold",
				children: draft.id ? "Edit note" : "New note"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onCancel,
					className: "rounded-lg border border-border px-3 py-1.5 text-xs",
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onSave,
					className: "rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground",
					children: "Save"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 space-y-4 overflow-y-auto p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					"aria-label": "Meeting title",
					autoFocus: true,
					placeholder: "Meeting title",
					value: draft.title ?? "",
					onChange: (e) => setDraft({
						...draft,
						title: e.target.value
					}),
					className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-lg font-semibold outline-none focus:border-primary"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-xs uppercase tracking-wider text-muted-foreground",
						children: "Meeting date & time"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						"aria-label": "Meeting date & time",
						type: "datetime-local",
						value: draft.meeting_date ? toLocalInput(draft.meeting_date) : "",
						onChange: (e) => setDraft({
							...draft,
							meeting_date: e.target.value ? new Date(e.target.value).toISOString() : null
						}),
						className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
					})] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-xs uppercase tracking-wider text-muted-foreground",
						children: "Attendees"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 flex flex-wrap gap-1",
						children: (draft.attendees ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs",
							children: [a, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setDraft({
									...draft,
									attendees: (draft.attendees ?? []).filter((x) => x !== a)
								}),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
							})]
						}, a))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: attInput,
							onChange: (e) => setAttInput(e.target.value),
							onKeyDown: (e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									addAtt();
								}
							},
							placeholder: "Add attendee name…",
							className: "flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: addAtt,
							className: "rounded-lg border border-border px-3 text-sm hover:bg-muted",
							children: "Add"
						})]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-xs uppercase tracking-wider text-muted-foreground",
						children: "Tags"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 flex flex-wrap gap-1",
						children: (draft.tags ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary",
							children: [t, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setDraft({
									...draft,
									tags: (draft.tags ?? []).filter((x) => x !== t)
								}),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
							})]
						}, t))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: tagInput,
							onChange: (e) => setTagInput(e.target.value),
							onKeyDown: (e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									addTag();
								}
							},
							placeholder: "Add tag…",
							className: "flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: addTag,
							className: "rounded-lg border border-border px-3 text-sm hover:bg-muted",
							children: "Add"
						})]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs uppercase tracking-wider text-muted-foreground",
						children: "Notes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TranscribeButton, { onText: (t) => setDraft({
						...draft,
						body: `${draft.body ?? ""}${draft.body ? "\n" : ""}${t}`
					}) })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					"aria-label": "Notes",
					value: draft.body ?? "",
					onChange: (e) => setDraft({
						...draft,
						body: e.target.value
					}),
					rows: 16,
					placeholder: `# Agenda\n- \n\n# Decisions\n- \n\n# Action items\n- [ ] `,
					className: "w-full resize-none rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-primary"
				})] })
			]
		})]
	});
}
function TranscribeButton({ onText }) {
	const [rec, setRec] = (0, import_react.useState)(false);
	const recRef = (0, import_react.useRef)(null);
	const toggle = () => {
		const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
		if (!SR) {
			alert("Live transcription isn't supported in this browser. Try Chrome or Edge.");
			return;
		}
		if (rec) {
			try {
				recRef.current?.stop();
			} catch {}
			recRef.current = null;
			setRec(false);
			return;
		}
		const r = new SR();
		r.continuous = true;
		r.interimResults = false;
		r.lang = "en-US";
		r.onresult = (e) => {
			for (let i = e.resultIndex; i < e.results.length; i++) if (e.results[i].isFinal) {
				const text = e.results[i][0].transcript.trim();
				if (text) onText(text);
			}
		};
		r.onend = () => {
			if (recRef.current === r) try {
				r.start();
			} catch {}
		};
		r.onerror = () => {};
		recRef.current = r;
		try {
			r.start();
			setRec(true);
		} catch (err) {
			alert(err.message);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: toggle,
		className: `flex items-center gap-1 rounded-lg border px-2 py-1 text-xs transition ${rec ? "border-destructive bg-destructive/10 text-destructive" : "border-border hover:bg-muted"}`,
		children: rec ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "h-3 w-3" }), " Stop"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-3 w-3" }), " Record & transcribe"] })
	});
}
//#endregion
export { MeetingNotesPage as component };
