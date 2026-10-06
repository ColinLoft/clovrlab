import { $n as Clock, $t as LayoutDashboard, Ar as Binary, B as ShieldCheck, Dr as Boxes, Er as Bug, Fn as FilePenLine, G as ServerCog, Ir as Award, J as ScrollText, Jn as Cpu, Kr as Activity, Ln as FileChartColumnIncreasing, M as SquareCheckBig, Mr as BellRing, Nt as MessageSquareHeart, Q as Rocket, R as ShoppingCart, Rt as Map$1, S as Timer, Sn as Gauge, T as Target, Tr as Building2, Tt as Network, U as Settings, Vr as ArrowLeftRight, Xt as Lightbulb, Zn as Coins, Zt as LifeBuoy, _ as Truck, _n as GraduationCap, at as Radar, bn as GitPullRequestArrow, er as ClipboardCheck, f as UserSearch, gr as ChartColumn, hn as Grip, in as Inbox, jr as Bell, k as Star, kr as BookOpen, pn as HardDrive, r as Wrench, rt as Receipt, sn as IdCard, tn as Landmark, un as HeartHandshake, ut as Plane, vr as Calendar, xr as CalendarDays, zn as Factory } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/nav-config-BQNdxmMi.js
/**
* Per-workspace navigation. Every team gets its own purpose-built pages —
* these are not the same screens with different permissions.
*/
/** Tools every workspace keeps. */
var core = (extra = []) => ({
	label: "My Workspace",
	items: [
		{
			label: "Dashboard",
			to: "/dashboard",
			icon: LayoutDashboard
		},
		{
			label: "Email",
			to: "/mail",
			icon: Inbox
		},
		{
			label: "Calendar",
			to: "/calendar",
			icon: Calendar
		},
		{
			label: "Drive",
			to: "/drive",
			icon: HardDrive
		},
		{
			label: "My Tasks",
			to: "/tasks",
			icon: SquareCheckBig
		},
		{
			label: "My Time",
			to: "/my-time",
			icon: Timer
		},
		{
			label: "Notifications",
			to: "/notifications",
			icon: Bell
		},
		...extra
	]
});
/** Cross-team hand-offs: the chain of command between workspaces. */
var handoffs = {
	label: "Between Teams",
	items: [
		{
			label: "Team Requests",
			to: "/requests",
			icon: ArrowLeftRight
		},
		{
			label: "Directory",
			to: "/employees",
			icon: IdCard
		},
		{
			label: "Org Chart",
			to: "/org-chart",
			icon: Network
		}
	]
};
var APP_NAV = {
	ops: [
		core(),
		{
			label: "Mission Operations",
			items: [
				{
					label: "Mission Control",
					to: "/ops/control",
					icon: Radar
				},
				{
					label: "Live Map",
					to: "/ops/live-map",
					icon: Map$1
				},
				{
					label: "Camera Network",
					to: "/ops/cameras",
					icon: Radar
				},
				{
					label: "Incidents & Dispatch",
					to: "/ops/incidents",
					icon: Activity
				},
				{
					label: "Detections",
					to: "/ops/detections",
					icon: Activity
				},
				{
					label: "Detection Logs",
					to: "/ops/logs",
					icon: ScrollText
				}
			]
		},
		{
			label: "Flight Operations",
			items: [
				{
					label: "Response Fleet",
					to: "/ops/network-fleet",
					icon: Plane
				},
				{
					label: "Flight Log",
					to: "/ops/flights",
					icon: Plane
				},
				{
					label: "Airspace & Approvals",
					to: "/ops/airspace",
					icon: ShieldCheck
				},
				{
					label: "Fleet Readiness",
					to: "/ops/readiness",
					icon: Gauge
				},
				{
					label: "Situation Report",
					to: "/ops/sitrep",
					icon: ScrollText
				},
				{
					label: "Coverage Map",
					to: "/ops/coverage",
					icon: Map$1
				},
				{
					label: "Maintenance",
					to: "/ops/maintenance",
					icon: Wrench
				},
				{
					label: "Paging & On-Call",
					to: "/ops/paging",
					icon: BellRing
				}
			]
		},
		handoffs
	],
	eng: [
		core([{
			label: "Notes",
			to: "/rd-ideas",
			icon: Lightbulb
		}]),
		{
			label: "Engineering",
			items: [
				{
					label: "Programs",
					to: "/eng/programs",
					icon: Cpu
				},
				{
					label: "Issue Triage",
					to: "/eng/issues",
					icon: Bug
				},
				{
					label: "Change Control",
					to: "/eng/changes",
					icon: GitPullRequestArrow
				},
				{
					label: "Hardware & BOM",
					to: "/eng/hardware",
					icon: Wrench
				},
				{
					label: "Firmware & Autonomy",
					to: "/eng/firmware",
					icon: Binary
				},
				{
					label: "Sprint Board",
					to: "/eng/board",
					icon: SquareCheckBig
				},
				{
					label: "Design Reviews",
					to: "/eng/reviews",
					icon: ClipboardCheck
				},
				{
					label: "Library",
					to: "/eng/library",
					icon: BookOpen
				}
			]
		},
		handoffs
	],
	product: [
		core([{
			label: "Notes",
			to: "/rd-ideas",
			icon: Lightbulb
		}]),
		{
			label: "Product & Program",
			items: [
				{
					label: "Roadmap",
					to: "/product/roadmap",
					icon: Map$1
				},
				{
					label: "Release Trains",
					to: "/product/releases",
					icon: Rocket
				},
				{
					label: "Field Feedback",
					to: "/product/feedback",
					icon: MessageSquareHeart
				},
				{
					label: "Feature Portfolio",
					to: "/product/portfolio",
					icon: Boxes
				},
				{
					label: "Field Insights",
					to: "/product/insights",
					icon: ChartColumn
				},
				{
					label: "Operator Support",
					to: "/product/support",
					icon: LifeBuoy
				}
			]
		},
		handoffs
	],
	mfg: [
		core(),
		{
			label: "Production",
			items: [
				{
					label: "Build Line",
					to: "/mfg/line",
					icon: Factory
				},
				{
					label: "Stockroom",
					to: "/mfg/stock",
					icon: Boxes
				},
				{
					label: "Quality",
					to: "/mfg/quality",
					icon: ClipboardCheck
				},
				{
					label: "Supply Chain",
					to: "/mfg/supply",
					icon: Truck
				},
				{
					label: "Build Schedule",
					to: "/mfg/orders",
					icon: CalendarDays
				},
				{
					label: "Returns & Repairs",
					to: "/mfg/returns",
					icon: Wrench
				},
				{
					label: "Aircraft Build Status",
					to: "/ops/readiness",
					icon: Plane
				}
			]
		},
		handoffs
	],
	systems: [
		core(),
		{
			label: "Enterprise Systems",
			items: [
				{
					label: "Service Health",
					to: "/systems/services",
					icon: Activity
				},
				{
					label: "Detection Network",
					to: "/systems/detection",
					icon: Radar
				},
				{
					label: "Response Analytics",
					to: "/systems/analytics",
					icon: ChartColumn
				},
				{
					label: "Support Desk",
					to: "/systems/helpdesk",
					icon: LifeBuoy
				},
				{
					label: "Access & Identity",
					to: "/systems/access",
					icon: ShieldCheck
				},
				{
					label: "Application Register",
					to: "/systems/assets",
					icon: Boxes
				},
				{
					label: "Paging & On-Call",
					to: "/systems/paging",
					icon: BellRing
				},
				{
					label: "Systems Console",
					to: "/admin/it",
					icon: ServerCog
				},
				{
					label: "Slack Admin",
					to: "/admin/slack",
					icon: Grip
				}
			]
		},
		handoffs
	],
	commercial: [
		core(),
		{
			label: "Funding & Partners",
			items: [
				{
					label: "Donors",
					to: "/fund/donors",
					icon: HeartHandshake
				},
				{
					label: "Grant Pipeline",
					to: "/fund/grants",
					icon: FilePenLine
				},
				{
					label: "Gift Ledger",
					to: "/fund/donations",
					icon: Coins
				},
				{
					label: "Campaign Performance",
					to: "/fund/campaigns",
					icon: ChartColumn
				},
				{
					label: "Partnership Pipeline",
					to: "/fund/pipeline",
					icon: Target
				},
				{
					label: "Knowledge Base",
					to: "/kb",
					icon: BookOpen
				}
			]
		},
		handoffs
	],
	exec: [
		core(),
		{
			label: "Leadership",
			items: [
				{
					label: "Org Briefing",
					to: "/exec/briefing",
					icon: Gauge
				},
				{
					label: "Objectives",
					to: "/exec/okrs",
					icon: Target
				},
				{
					label: "Decision Log",
					to: "/exec/decisions",
					icon: ScrollText
				},
				{
					label: "Announcements",
					to: "/exec/announcements",
					icon: MessageSquareHeart
				},
				{
					label: "Analytics",
					to: "/analytics",
					icon: ChartColumn
				}
			]
		},
		{
			label: "Oversight",
			items: [
				{
					label: "Team Requests",
					to: "/requests",
					icon: ArrowLeftRight
				},
				{
					label: "Departments",
					to: "/admin/departments",
					icon: Building2
				},
				{
					label: "Organization",
					to: "/admin/org",
					icon: Network
				},
				{
					label: "Financial Reports",
					to: "/financial-reports",
					icon: FileChartColumnIncreasing
				}
			]
		}
	],
	admin: [
		core(),
		{
			label: "People",
			items: [
				{
					label: "Team Directory",
					to: "/employees",
					icon: IdCard
				},
				{
					label: "Recruiting",
					to: "/hiring",
					icon: UserSearch
				},
				{
					label: "Onboarding",
					to: "/onboarding",
					icon: GraduationCap
				},
				{
					label: "Attendance",
					to: "/attendance",
					icon: Clock
				},
				{
					label: "Time Off",
					to: "/time-off",
					icon: CalendarDays
				},
				{
					label: "Certifications",
					to: "/certifications",
					icon: Award
				},
				{
					label: "Training",
					to: "/training",
					icon: GraduationCap
				},
				{
					label: "Performance",
					to: "/reviews",
					icon: Star
				},
				{
					label: "Handbook",
					to: "/admin/policies",
					icon: BookOpen
				}
			]
		},
		{
			label: "Administration",
			items: [
				{
					label: "Invoices",
					to: "/invoices",
					icon: Receipt
				},
				{
					label: "Expenses",
					to: "/expenses",
					icon: Receipt
				},
				{
					label: "Accounting",
					to: "/accounting",
					icon: Landmark
				},
				{
					label: "Purchasing",
					to: "/purchase-orders",
					icon: ShoppingCart
				},
				{
					label: "Org Settings",
					to: "/admin/company",
					icon: Settings,
					badge: "Admin"
				}
			]
		},
		handoffs
	],
	hq: [{
		label: "My Workspace",
		items: [{
			label: "Workspaces",
			to: "/workspaces",
			icon: Grip
		}, ...core([{
			label: "Notes",
			to: "/rd-ideas",
			icon: Lightbulb
		}]).items.filter((i) => i.to !== "/dashboard")]
	}, {
		label: "Between Teams",
		items: [
			{
				label: "Team Requests",
				to: "/requests",
				icon: ArrowLeftRight
			},
			{
				label: "Teams",
				to: "/teams",
				icon: Network
			},
			{
				label: "Team Directory",
				to: "/employees",
				icon: IdCard
			},
			{
				label: "Org Chart",
				to: "/org-chart",
				icon: Network
			}
		]
	}]
};
function navForApp(slug) {
	if (!slug) return null;
	return APP_NAV[slug] ?? null;
}
/**
* Flat catalogue of every real page in HQ, derived from the per-workspace
* navigation so admin pickers and route permissions can never drift from the
* pages that actually exist.
*/
function build() {
	const byLabel = /* @__PURE__ */ new Map();
	for (const groups of Object.values(APP_NAV)) for (const g of groups) {
		const bucket = byLabel.get(g.label) ?? /* @__PURE__ */ new Map();
		for (const item of g.items) if (!bucket.has(item.to)) bucket.set(item.to, item);
		byLabel.set(g.label, bucket);
	}
	return [...byLabel.entries()].map(([label, items]) => ({
		label,
		items: [...items.values()]
	}));
}
var navGroups = build();
navGroups.flatMap((g) => g.items);
//#endregion
export { navGroups as n, navForApp as t };
