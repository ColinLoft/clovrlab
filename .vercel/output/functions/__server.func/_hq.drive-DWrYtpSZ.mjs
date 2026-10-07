import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { n as supabase } from "./_ssr/client-B5YVWdzA.mjs";
import { A as StarOff, An as File, Br as ArrowLeft, En as FolderPlus, Gt as LoaderCircle, H as Share2, In as FileImage, Kt as List, Nn as FilePlay, Rn as FileArchive, Tn as Folder, Wn as Download, _t as Pen, dr as ChevronRight, gn as Grid3x3, h as Upload, jn as FileText, k as Star, pn as HardDrive, q as Search, x as Trash2 } from "./_libs/lucide-react.mjs";
import { t as EscapeKey } from "./_ssr/EscapeKey-s0O3wTFo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.drive-DWrYtpSZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function fmtBytes(n) {
	if (!n) return "—";
	const u = [
		"B",
		"KB",
		"MB",
		"GB",
		"TB"
	];
	let i = 0;
	let v = n;
	while (v >= 1024 && i < u.length - 1) {
		v /= 1024;
		i++;
	}
	return `${v.toFixed(v < 10 && i > 0 ? 1 : 0)} ${u[i]}`;
}
function iconFor(item) {
	if (item.kind === "folder") return Folder;
	const m = item.mime_type || "";
	if (m.startsWith("image/")) return FileImage;
	if (m.startsWith("video/")) return FilePlay;
	if (m.includes("zip") || m.includes("archive")) return FileArchive;
	if (m.includes("text") || m.includes("pdf") || m.includes("document")) return FileText;
	return File;
}
function DrivePage() {
	const [me, setMe] = (0, import_react.useState)(null);
	const [view, setView] = (0, import_react.useState)("my");
	const [layout, setLayout] = (0, import_react.useState)("list");
	const [parentId, setParentId] = (0, import_react.useState)(null);
	const [breadcrumbs, setBreadcrumbs] = (0, import_react.useState)([]);
	const [items, setItems] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [search, setSearch] = (0, import_react.useState)("");
	const [selected, setSelected] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [uploading, setUploading] = (0, import_react.useState)([]);
	const [renaming, setRenaming] = (0, import_react.useState)(null);
	const [shareTarget, setShareTarget] = (0, import_react.useState)(null);
	const fileRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		supabase.auth.getUser().then(({ data }) => setMe(data.user?.id ?? null));
	}, []);
	const load = async () => {
		if (!me) return;
		setLoading(true);
		let q = supabase.from("drive_items").select("*").order("kind", { ascending: false }).order("name");
		if (view === "trash") q = q.not("trashed_at", "is", null);
		else {
			q = q.is("trashed_at", null);
			if (view === "starred") q = q.eq("starred", true);
			else if (view === "my") q = q.eq("owner_id", me).is("parent_id", parentId);
			else if (view === "shared") q = q.neq("owner_id", me);
		}
		const { data } = await q;
		setItems(data ?? []);
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		if (me) load();
	}, [
		me,
		view,
		parentId
	]);
	const filtered = (0, import_react.useMemo)(() => {
		if (!search.trim()) return items;
		const s = search.toLowerCase();
		return items.filter((i) => i.name.toLowerCase().includes(s));
	}, [items, search]);
	const openFolder = async (folder) => {
		setParentId(folder.id);
		setBreadcrumbs((prev) => [...prev, folder]);
		setSelected(/* @__PURE__ */ new Set());
	};
	const goUp = () => {
		const next = breadcrumbs.slice(0, -1);
		setBreadcrumbs(next);
		setParentId(next.length ? next[next.length - 1].id : null);
		setSelected(/* @__PURE__ */ new Set());
	};
	const goToCrumb = (idx) => {
		if (idx < 0) {
			setBreadcrumbs([]);
			setParentId(null);
		} else {
			const next = breadcrumbs.slice(0, idx + 1);
			setBreadcrumbs(next);
			setParentId(next[idx].id);
		}
		setSelected(/* @__PURE__ */ new Set());
	};
	const createFolder = async () => {
		if (!me) return;
		const name = prompt("Folder name?")?.trim();
		if (!name) return;
		const { error } = await supabase.from("drive_items").insert({
			owner_id: me,
			parent_id: parentId,
			kind: "folder",
			name
		});
		if (error) alert(error.message);
		else load();
	};
	const uploadFiles = async (files) => {
		if (!me || !files.length) return;
		for (const file of Array.from(files)) {
			if (file.size > 104857600) {
				alert(`${file.name} exceeds 100MB`);
				continue;
			}
			const id = crypto.randomUUID();
			const ext = file.name.includes(".") ? file.name.split(".").pop() : "";
			const path = `${me}/${id}${ext ? "." + ext : ""}`;
			setUploading((u) => [...u, {
				name: file.name,
				pct: 0
			}]);
			const { error: upErr } = await supabase.storage.from("drive").upload(path, file, { contentType: file.type });
			if (upErr) {
				alert(upErr.message);
				setUploading((u) => u.filter((x) => x.name !== file.name));
				continue;
			}
			const { error } = await supabase.from("drive_items").insert({
				owner_id: me,
				parent_id: parentId,
				kind: "file",
				name: file.name,
				mime_type: file.type,
				size_bytes: file.size,
				storage_path: path
			});
			if (error) alert(error.message);
			setUploading((u) => u.filter((x) => x.name !== file.name));
		}
		load();
	};
	const toggleStar = async (item) => {
		await supabase.from("drive_items").update({ starred: !item.starred }).eq("id", item.id);
		setItems((prev) => prev.map((i) => i.id === item.id ? {
			...i,
			starred: !i.starred
		} : i));
	};
	const trashItem = async (item) => {
		await supabase.from("drive_items").update({ trashed_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", item.id);
		load();
	};
	const restoreItem = async (item) => {
		await supabase.from("drive_items").update({ trashed_at: null }).eq("id", item.id);
		load();
	};
	const deleteForever = async (item) => {
		if (!confirm(`Delete "${item.name}" forever?`)) return;
		if (item.storage_path) await supabase.storage.from("drive").remove([item.storage_path]);
		await supabase.from("drive_items").delete().eq("id", item.id);
		load();
	};
	const doRename = async (name) => {
		if (!renaming || !name.trim()) {
			setRenaming(null);
			return;
		}
		await supabase.from("drive_items").update({ name: name.trim() }).eq("id", renaming.id);
		setRenaming(null);
		load();
	};
	const openFile = async (item) => {
		if (!item.storage_path) return;
		const { data } = await supabase.storage.from("drive").createSignedUrl(item.storage_path, 300);
		if (data?.signedUrl) window.open(data.signedUrl, "_blank", "noopener,noreferrer");
	};
	const downloadFile = async (item) => {
		if (!item.storage_path) return;
		const { data } = await supabase.storage.from("drive").createSignedUrl(item.storage_path, 300, { download: item.name });
		if (data?.signedUrl) window.open(data.signedUrl, "_blank");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "flex w-56 flex-col gap-1 border-r border-border bg-muted/20 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center gap-2 px-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardDrive, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground",
							children: "Core"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold",
							children: "Drive"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex flex-col gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => fileRef.current?.click(),
								className: "flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }), " Upload"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileRef,
								type: "file",
								multiple: true,
								className: "hidden",
								onChange: (e) => {
									if (e.target.files) uploadFiles(e.target.files);
									e.target.value = "";
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: createFolder,
								className: "flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm hover:bg-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderPlus, { className: "h-4 w-4" }), " New folder"]
							})
						]
					}),
					[
						"my",
						"starred",
						"shared",
						"trash"
					].map((v) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								setView(v);
								setParentId(null);
								setBreadcrumbs([]);
								setSelected(/* @__PURE__ */ new Set());
							},
							className: `flex items-center gap-2 rounded-lg px-3 py-1.5 text-left text-sm ${view === v ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(v === "my" ? HardDrive : v === "starred" ? Star : v === "shared" ? Share2 : Trash2, { className: "h-4 w-4" }),
								" ",
								v === "my" ? "My Drive" : v === "starred" ? "Starred" : v === "shared" ? "Shared with me" : "Trash"
							]
						}, v);
					}),
					uploading.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-1 rounded-lg border border-border bg-background p-2 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-muted-foreground",
							children: "Uploading"
						}), uploading.map((u, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: u.name
							})]
						}, i))]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center gap-3 border-b border-border px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 text-sm",
						children: [view === "my" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							breadcrumbs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: goUp,
								className: "mr-1 rounded p-1 hover:bg-muted",
								"aria-label": "Up",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => goToCrumb(-1),
								className: `rounded px-2 py-1 hover:bg-muted ${breadcrumbs.length === 0 ? "font-semibold" : "text-muted-foreground"}`,
								children: "My Drive"
							}),
							breadcrumbs.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => goToCrumb(i),
									className: `rounded px-2 py-1 hover:bg-muted ${i === breadcrumbs.length - 1 ? "font-semibold" : "text-muted-foreground"}`,
									children: b.name
								})]
							}, b.id))
						] }), view !== "my" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: view === "starred" ? "Starred" : view === "shared" ? "Shared with me" : "Trash"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: search,
								onChange: (e) => setSearch(e.target.value),
								placeholder: "Search in Drive",
								className: "w-64 rounded-lg border border-border bg-background py-1.5 pl-8 pr-3 text-sm outline-none focus:border-primary"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex overflow-hidden rounded-lg border border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setLayout("list"),
								className: `px-2 py-1.5 ${layout === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`,
								"aria-label": "List view",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setLayout("grid"),
								className: `px-2 py-1.5 ${layout === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`,
								"aria-label": "Grid view",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid3x3, { className: "h-4 w-4" })
							})]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-y-auto p-6",
					onDragOver: (e) => {
						e.preventDefault();
					},
					onDrop: (e) => {
						e.preventDefault();
						if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
					},
					children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-center py-16 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), " Loading…"]
					}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-dashed border-border p-12 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardDrive, { className: "mx-auto h-10 w-10 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm font-medium",
								children: "This folder is empty"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Drop files anywhere or click Upload to get started."
							})
						]
					}) : layout === "list" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-hidden rounded-xl border border-border bg-background",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "border-b border-border bg-muted/40 text-left text-xs text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "w-10 px-3 py-2" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2",
										children: "Name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2",
										children: "Modified"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2 text-right",
										children: "Size"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "w-32 px-3 py-2" })
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.map((it) => {
								const Icon = iconFor(it);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-border last:border-0 hover:bg-muted/30",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => toggleStar(it),
												className: "text-muted-foreground hover:text-amber-500",
												"aria-label": "Star",
												children: it.starred ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 fill-amber-400 text-amber-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarOff, { className: "h-4 w-4" })
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onDoubleClick: () => it.kind === "folder" ? openFolder(it) : openFile(it),
												onClick: (e) => e.detail === 1 ? void 0 : void 0,
												className: "flex items-center gap-2 text-left hover:underline",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-4 w-4 ${it.kind === "folder" ? "text-primary" : "text-muted-foreground"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium",
													children: it.name
												})]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 text-xs text-muted-foreground",
											children: new Date(it.updated_at).toLocaleDateString()
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 text-right text-xs text-muted-foreground",
											children: it.kind === "folder" ? "—" : fmtBytes(it.size_bytes)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex items-center justify-end gap-1",
												children: view === "trash" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													"aria-label": "Rename",
													onClick: () => restoreItem(it),
													className: "rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground",
													title: "Restore",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "h-3.5 w-3.5" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													"aria-label": "Delete",
													onClick: () => deleteForever(it),
													className: "rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
													title: "Delete forever",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
												})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
													it.kind === "file" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														"aria-label": "Download",
														onClick: () => downloadFile(it),
														className: "rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground",
														title: "Download",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														"aria-label": "Share",
														onClick: () => setShareTarget(it),
														className: "rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground",
														title: "Share",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "h-3.5 w-3.5" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														"aria-label": "Rename",
														onClick: () => setRenaming(it),
														className: "rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground",
														title: "Rename",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "h-3.5 w-3.5" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														"aria-label": "Delete",
														onClick: () => trashItem(it),
														className: "rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive",
														title: "Move to trash",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
													})
												] })
											})
										})
									]
								}, it.id);
							}) })]
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
						children: filtered.map((it) => {
							const Icon = iconFor(it);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onDoubleClick: () => it.kind === "folder" ? openFolder(it) : openFile(it),
								className: "group flex flex-col rounded-xl border border-border bg-background p-3 text-left transition hover:border-primary/40 hover:shadow-md",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-8 w-8 ${it.kind === "folder" ? "text-primary" : "text-muted-foreground"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: (e) => {
												e.stopPropagation();
												toggleStar(it);
											},
											className: "opacity-0 transition group-hover:opacity-100",
											children: it.starred ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 fill-amber-400 text-amber-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarOff, { className: "h-4 w-4 text-muted-foreground" })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 line-clamp-2 text-sm font-medium",
										children: it.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: it.kind === "folder" ? "Folder" : fmtBytes(it.size_bytes)
									})
								]
							}, it.id);
						})
					})
				})]
			}),
			renaming && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RenameDialog, {
				item: renaming,
				onClose: () => setRenaming(null),
				onSave: doRename
			}),
			shareTarget && me && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareDialog, {
				item: shareTarget,
				me,
				onClose: () => setShareTarget(null)
			})
		]
	});
}
function RenameDialog({ item, onClose, onSave }) {
	const [name, setName] = (0, import_react.useState)(item.name);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm",
		onClick: onClose,
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Dialog",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EscapeKey, { onEscape: onClose }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			onClick: (e) => e.stopPropagation(),
			className: "w-full max-w-md rounded-xl border border-border bg-background p-5 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-lg font-semibold",
					children: "Rename"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					autoFocus: true,
					value: name,
					onChange: (e) => setName(e.target.value),
					className: "mt-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => onSave(name),
						className: "rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground",
						children: "Save"
					})]
				})
			]
		})]
	});
}
function ShareDialog({ item, me, onClose }) {
	const [profiles, setProfiles] = (0, import_react.useState)([]);
	const [shares, setShares] = (0, import_react.useState)([]);
	const [query, setQuery] = (0, import_react.useState)("");
	const [perm, setPerm] = (0, import_react.useState)("view");
	const loadShares = async () => {
		const { data } = await supabase.from("drive_shares").select("*").eq("item_id", item.id);
		setShares(data ?? []);
	};
	(0, import_react.useEffect)(() => {
		loadShares();
	}, [item.id]);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			let req = supabase.from("profiles").select("id, full_name, email").neq("id", me).limit(6);
			if (query.trim()) req = req.ilike("full_name", `%${query}%`);
			const { data } = await req;
			if (!cancelled) setProfiles(data ?? []);
		})();
		return () => {
			cancelled = true;
		};
	}, [query, me]);
	const add = async (uid) => {
		await supabase.from("drive_shares").insert({
			item_id: item.id,
			user_id: uid,
			permission: perm
		});
		loadShares();
	};
	const remove = async (id) => {
		await supabase.from("drive_shares").delete().eq("id", id);
		loadShares();
	};
	const sharedProfiles = shares.map((s) => profiles.find((p) => p.id === s.user_id)).filter(Boolean);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm",
		onClick: onClose,
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Dialog",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EscapeKey, { onEscape: onClose }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			onClick: (e) => e.stopPropagation(),
			className: "w-full max-w-lg rounded-xl border border-border bg-background p-5 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "text-lg font-semibold",
					children: [
						"Share \"",
						item.name,
						"\""
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: query,
								onChange: (e) => setQuery(e.target.value),
								placeholder: "Search people…",
								className: "flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: perm,
								onChange: (e) => setPerm(e.target.value),
								className: "rounded-lg border border-border bg-background px-2 py-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "view",
										children: "Can view"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "comment",
										children: "Can comment"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "edit",
										children: "Can edit"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-h-48 overflow-y-auto rounded-lg border border-border",
							children: profiles.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => add(p.id),
								className: "flex w-full items-center gap-2 border-b border-border px-3 py-2 text-left text-sm last:border-0 hover:bg-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-semibold",
										children: (p.full_name || p.email).charAt(0).toUpperCase()
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex-1",
										children: p.full_name || p.email
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-primary",
										children: "Add"
									})
								]
							}, p.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground",
							children: "People with access"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 space-y-1",
							children: [shares.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Only you"
							}), shares.map((s) => {
								const p = sharedProfiles.find((x) => x?.id === s.user_id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex-1",
											children: p?.full_name || p?.email || s.user_id
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											children: s.permission
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											"aria-label": "Delete",
											onClick: () => remove(s.id),
											className: "rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
										})
									]
								}, s.id);
							})]
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground",
						children: "Done"
					})
				})
			]
		})]
	});
}
//#endregion
export { DrivePage as component };
