import { i as __toESM } from "../_runtime.mjs";
import { m as require_react } from "../_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { n as Section, r as SectionLabel, t as PageHeader } from "./Section-Bvhdy1hI.mjs";
import { t as Reveal } from "./Reveal-CackW1Ez.mjs";
import { t as CTAButton } from "./CTAButton-Ge38tcP0.mjs";
import { i as media, l as uavCapabilities, n as fieldConstraints, s as sensing, u as wf_aerial_default } from "./system-C-OlbEAm.mjs";
import { n as SensorNetwork, t as MissionControl } from "./MissionControl-Hm_BrXOP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/technology-Z-7upTbf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* RGB vs thermal comparison. The thermal view is a stylised concept
* visualisation, not captured sensor output.
*/
function ThermalCompare() {
	const [pos, setPos] = (0, import_react.useState)(52);
	const wrap = (0, import_react.useRef)(null);
	const move = (clientX) => {
		const el = wrap.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		const p = (clientX - rect.left) / rect.width * 100;
		setPos(Math.min(98, Math.max(2, p)));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		className: "m-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: wrap,
			className: "relative aspect-[16/10] w-full select-none overflow-hidden border border-border bg-[var(--night)]",
			onPointerMove: (e) => e.buttons === 1 && move(e.clientX),
			onPointerDown: (e) => move(e.clientX),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: wf_aerial_default,
					alt: "Aerial optical view of a forested ridge with early smoke",
					className: "absolute inset-0 h-full w-full object-cover",
					loading: "lazy",
					width: 1600,
					height: 1104
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-0",
					style: { clipPath: `inset(0 0 0 ${pos}%)` },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: wf_aerial_default,
						alt: "Concept thermal visualisation of the same ridge",
						className: "thermal-view absolute inset-0 h-full w-full object-cover",
						loading: "lazy",
						width: 1600,
						height: 1104
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "scanlines absolute inset-0",
						"aria-hidden": true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-y-0 w-px bg-[var(--signal)]",
					style: { left: `${pos}%` },
					"aria-hidden": true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: 2,
					max: 98,
					value: pos,
					onChange: (e) => setPos(Number(e.target.value)),
					"aria-label": "Compare optical and thermal views",
					className: "absolute inset-x-0 bottom-4 mx-auto w-[70%] accent-[var(--signal)]"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute left-4 top-4 border border-border bg-background/70 px-2 py-1 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-foreground/80",
					children: "RGB / optical"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute right-4 top-4 border border-[color:var(--signal)]/50 bg-background/70 px-2 py-1 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-[var(--signal)]",
					children: "Thermal · concept"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute bottom-16 left-4 font-mono text-[0.62rem] tracking-[0.16em] text-foreground/70",
					children: "38.9021 N · 120.5412 W · AGL 412 m · HDG 214°"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
			className: "mt-3 text-xs text-muted-foreground",
			children: "Concept visualisation. Thermal rendering is illustrative of intended capability, not captured sensor output."
		})]
	});
}
function TechnologyPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
					eyebrow: "Technology",
					title: "Sensors on the ground. Eyes in the air. Software in between.",
					lede: "Four technology tracks, developed together."
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			wide: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
						n: "01",
						tone: "light",
						children: "Sensor nodes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "display-cond mt-6 text-[clamp(2rem,4.6vw,3.6rem)] text-ink",
						children: "Detection starts on the ground."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-lg leading-relaxed text-muted-foreground",
						children: "Field-hardened, solar-powered nodes designed to sit unattended in remote terrain and report over low-bandwidth wireless links. Detection logic runs close to the sensor so the network can stay quiet until something matters."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-8 grid gap-px border border-border bg-border sm:grid-cols-2",
						children: sensing.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "bg-[var(--night)] px-5 py-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-ink",
								children: s.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs leading-relaxed text-muted-foreground",
								children: s.note
							})]
						}, s.label))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-xs text-muted-foreground",
						children: "Specifications are not finalised. Node counts and deployments do not exist yet."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: 120,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "blueprint-grid border border-border bg-[var(--night)] p-5 text-foreground/45",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SensorNetwork, { className: "aspect-[10/9]" })
					})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-y border-border bg-[var(--night)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				wide: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: media.benchImg,
						alt: "UAV airframe with camera payload under assembly on a workbench",
						className: "w-full border border-border object-cover",
						loading: "lazy",
						width: 1600,
						height: 1104
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
						delay: 120,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
								n: "02",
								tone: "light",
								children: "Aircraft & autonomy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "display-cond mt-6 text-[clamp(2rem,4.6vw,3.6rem)] text-ink",
								children: "Then we send eyes."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 text-lg leading-relaxed text-muted-foreground",
								children: "Airframe, payload, navigation, and link design are being developed against one job: get a useful sensor over a set of coordinates quickly, with a human able to intervene at any point."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-8 grid gap-px border border-border bg-border",
								children: uavCapabilities.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex flex-wrap items-baseline justify-between gap-3 bg-[var(--night)] px-5 py-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-[13rem] flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold text-ink",
											children: c.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs leading-relaxed text-muted-foreground",
											children: c.body
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "border border-border px-2.5 py-1 font-mono text-[0.56rem] uppercase tracking-[0.16em] text-foreground/70",
										children: c.state
									})]
								}, c.title))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 text-xs text-muted-foreground",
								children: "We do not claim full autonomy. Operator oversight is a design requirement, not a fallback."
							})
						]
					})]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			wide: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
						n: "03",
						tone: "light",
						children: "Thermal + visual intelligence"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "display-cond mt-6 text-[clamp(2rem,4.6vw,3.6rem)] text-ink",
						children: "Two sensors, one picture."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-lg leading-relaxed text-muted-foreground",
						children: "Optical imagery carries context a person can read instantly. Thermal is intended to surface heat that smoke, canopy, or darkness would otherwise hide. Paired with position, altitude, heading, and terrain, they become an observation rather than a photograph."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-8 space-y-2.5 text-sm text-muted-foreground",
						children: [
							"Georeferenced frames tied to aircraft position",
							"Heat-pattern context alongside optical detail",
							"Terrain and access visible in the same view",
							"Designed to be readable under time pressure"
						].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--signal)]",
								"aria-hidden": true
							}), x]
						}, x))
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: 120,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThermalCompare, {})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-y border-border bg-[var(--night)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				wide: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
						n: "04",
						tone: "light",
						children: "Mission control software"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "display-cond mt-6 max-w-3xl text-[clamp(2rem,4.6vw,3.6rem)] text-ink",
						children: "The layer that makes it one system."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 max-w-2xl text-lg text-muted-foreground",
						children: "Live map, sensor nodes, active alerts, aircraft position and flight path, thermal and RGB frames, weather, incident status, communications, and the mission timeline — in one place, with one record."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: 120,
					className: "mt-12",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MissionControl, {})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			wide: true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
					n: "05",
					tone: "light",
					children: "Field engineering"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "display-cond mt-6 max-w-3xl text-[clamp(2rem,4.6vw,3.6rem)] text-ink",
					children: "Designed for the field."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: 100,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-10 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3",
						children: fieldConstraints.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "bg-[var(--night)] px-6 py-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base font-semibold text-ink",
								children: f.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted-foreground",
								children: f.body
							})]
						}, f.title))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTAButton, {
						to: "/development",
						variant: "primary",
						children: "Development status"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTAButton, {
						to: "/join",
						variant: "ghost",
						className: "border border-border text-ink hover:bg-surface",
						children: "Build with us"
					})]
				})
			]
		})
	] });
}
//#endregion
export { TechnologyPage as component };
