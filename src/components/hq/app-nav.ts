/**
 * Per-workspace navigation. Every team gets its own purpose-built pages —
 * these are not the same screens with different permissions.
 */
import {
  LayoutDashboard, Inbox, Calendar, HardDrive, Bell, CheckSquare, Timer, Lightbulb,
  Radar, Plane, ShieldCheck, Activity, Cpu, Bug, GitPullRequestArrow, Wrench, Binary,
  Map as MapIcon, Rocket, MessageSquareHeart, Factory, Boxes, ClipboardCheck, Truck,
  ServerCog, LifeBuoy, Network, Target, HeartHandshake, FileSignature, Coins,
  Gauge, ScrollText, IdCard, UserSearch, GraduationCap, Clock, CalendarDays, Award, Star,
  Building2, BarChart3, Settings, Grip, ArrowLeftRight, Landmark, Receipt, FileBarChart,
  BookOpen, ShoppingCart, BellRing,
} from "lucide-react";

export type AppNavItem = { label: string; to: string; icon: any; badge?: string };
export type AppNavGroup = { label: string; items: AppNavItem[] };

/** Tools every workspace keeps. */
const core = (extra: AppNavItem[] = []): AppNavGroup => ({
  label: "My Workspace",
  items: [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "Email", to: "/mail", icon: Inbox },
    { label: "Calendar", to: "/calendar", icon: Calendar },
    { label: "Drive", to: "/drive", icon: HardDrive },
    { label: "My Tasks", to: "/tasks", icon: CheckSquare },
    { label: "My Time", to: "/my-time", icon: Timer },
    { label: "Notifications", to: "/notifications", icon: Bell },
    ...extra,
  ],
});

/** Cross-team hand-offs: the chain of command between workspaces. */
const handoffs: AppNavGroup = {
  label: "Between Teams",
  items: [
    { label: "Team Requests", to: "/requests", icon: ArrowLeftRight },
    { label: "Directory", to: "/employees", icon: IdCard },
    { label: "Org Chart", to: "/org-chart", icon: Network },
  ],
};

export const APP_NAV: Record<string, AppNavGroup[]> = {
  ops: [
    core(),
    {
      label: "Mission Operations",
      items: [
        { label: "Mission Control", to: "/ops/control", icon: Radar },
        { label: "Live Map", to: "/ops/live-map", icon: MapIcon },
        { label: "Camera Network", to: "/ops/cameras", icon: Radar },
        { label: "Incidents & Dispatch", to: "/ops/incidents", icon: Activity },
        { label: "Detections", to: "/ops/detections", icon: Activity },
        { label: "Detection Logs", to: "/ops/logs", icon: ScrollText },
      ],
    },
    {
      label: "Flight Operations",
      items: [
        { label: "Response Fleet", to: "/ops/network-fleet", icon: Plane },
        { label: "Flight Log", to: "/ops/flights", icon: Plane },
        { label: "Airspace & Approvals", to: "/ops/airspace", icon: ShieldCheck },
        { label: "Fleet Readiness", to: "/ops/readiness", icon: Gauge },
        { label: "Situation Report", to: "/ops/sitrep", icon: ScrollText },
        { label: "Coverage Map", to: "/ops/coverage", icon: MapIcon },
        { label: "Maintenance", to: "/ops/maintenance", icon: Wrench },
        { label: "Paging & On-Call", to: "/ops/paging", icon: BellRing },
      ],
    },
    handoffs,
  ],
  eng: [
    core([{ label: "Notes", to: "/rd-ideas", icon: Lightbulb }]),
    {
      label: "Engineering",
      items: [
        { label: "Programs", to: "/eng/programs", icon: Cpu },
        { label: "Issue Triage", to: "/eng/issues", icon: Bug },
        { label: "Change Control", to: "/eng/changes", icon: GitPullRequestArrow },
        { label: "Hardware & BOM", to: "/eng/hardware", icon: Wrench },
        { label: "Firmware & Autonomy", to: "/eng/firmware", icon: Binary },
        { label: "Sprint Board", to: "/eng/board", icon: CheckSquare },
        { label: "Design Reviews", to: "/eng/reviews", icon: ClipboardCheck },
        { label: "Library", to: "/eng/library", icon: BookOpen },
      ],
    },
    handoffs,
  ],
  product: [
    core([{ label: "Notes", to: "/rd-ideas", icon: Lightbulb }]),
    {
      label: "Product & Program",
      items: [
        { label: "Roadmap", to: "/product/roadmap", icon: MapIcon },
        { label: "Release Trains", to: "/product/releases", icon: Rocket },
        { label: "Field Feedback", to: "/product/feedback", icon: MessageSquareHeart },
        { label: "Feature Portfolio", to: "/product/portfolio", icon: Boxes },
        { label: "Field Insights", to: "/product/insights", icon: BarChart3 },
        { label: "Operator Support", to: "/product/support", icon: LifeBuoy },
      ],
    },
    handoffs,
  ],
  mfg: [
    core(),
    {
      label: "Production",
      items: [
        { label: "Build Line", to: "/mfg/line", icon: Factory },
        { label: "Stockroom", to: "/mfg/stock", icon: Boxes },
        { label: "Quality", to: "/mfg/quality", icon: ClipboardCheck },
        { label: "Supply Chain", to: "/mfg/supply", icon: Truck },
        { label: "Build Schedule", to: "/mfg/orders", icon: CalendarDays },
        { label: "Returns & Repairs", to: "/mfg/returns", icon: Wrench },
        { label: "Aircraft Build Status", to: "/ops/readiness", icon: Plane },
      ],
    },
    handoffs,
  ],
  systems: [
    core(),
    {
      label: "Enterprise Systems",
      items: [
        { label: "Service Health", to: "/systems/services", icon: Activity },
        { label: "Detection Network", to: "/systems/detection", icon: Radar },
        { label: "Response Analytics", to: "/systems/analytics", icon: BarChart3 },

        { label: "Support Desk", to: "/systems/helpdesk", icon: LifeBuoy },
        { label: "Access & Identity", to: "/systems/access", icon: ShieldCheck },
        { label: "Application Register", to: "/systems/assets", icon: Boxes },
        { label: "Paging & On-Call", to: "/systems/paging", icon: BellRing },

        { label: "Systems Console", to: "/admin/it", icon: ServerCog },
        { label: "Slack Admin", to: "/admin/slack", icon: Grip },
      ],
    },
    handoffs,
  ],
  commercial: [
    core(),
    {
      label: "Funding & Partners",
      items: [
        { label: "Donors", to: "/fund/donors", icon: HeartHandshake },
        { label: "Grant Pipeline", to: "/fund/grants", icon: FileSignature },
        { label: "Gift Ledger", to: "/fund/donations", icon: Coins },
        { label: "Campaign Performance", to: "/fund/campaigns", icon: BarChart3 },
        { label: "Partnership Pipeline", to: "/fund/pipeline", icon: Target },
        { label: "Knowledge Base", to: "/kb", icon: BookOpen },
      ],
    },
    handoffs,
  ],
  exec: [
    core(),
    {
      label: "Leadership",
      items: [
        { label: "Org Briefing", to: "/exec/briefing", icon: Gauge },
        { label: "Objectives", to: "/exec/okrs", icon: Target },
        { label: "Decision Log", to: "/exec/decisions", icon: ScrollText },
        { label: "Announcements", to: "/exec/announcements", icon: MessageSquareHeart },
        { label: "Analytics", to: "/analytics", icon: BarChart3 },
      ],
    },
    {
      label: "Oversight",
      items: [
        { label: "Team Requests", to: "/requests", icon: ArrowLeftRight },
        { label: "Departments", to: "/admin/departments", icon: Building2 },
        { label: "Organization", to: "/admin/org", icon: Network },
        { label: "Financial Reports", to: "/financial-reports", icon: FileBarChart },
      ],
    },
  ],
  admin: [
    core(),
    {
      label: "People",
      items: [
        { label: "Team Directory", to: "/employees", icon: IdCard },
        { label: "Recruiting", to: "/hiring", icon: UserSearch },
        { label: "Onboarding", to: "/onboarding", icon: GraduationCap },
        { label: "Attendance", to: "/attendance", icon: Clock },
        { label: "Time Off", to: "/time-off", icon: CalendarDays },
        { label: "Certifications", to: "/certifications", icon: Award },
        { label: "Training", to: "/training", icon: GraduationCap },
        { label: "Performance", to: "/reviews", icon: Star },
        { label: "Handbook", to: "/admin/policies", icon: BookOpen },
      ],
    },
    {
      label: "Administration",
      items: [
        { label: "Invoices", to: "/invoices", icon: Receipt },
        { label: "Expenses", to: "/expenses", icon: Receipt },
        { label: "Accounting", to: "/accounting", icon: Landmark },
        { label: "Purchasing", to: "/purchase-orders", icon: ShoppingCart },
        { label: "Org Settings", to: "/admin/company", icon: Settings, badge: "Admin" },
      ],
    },
    handoffs,
  ],
  hq: [
    {
      label: "My Workspace",
      items: [
        { label: "Workspaces", to: "/workspaces", icon: Grip },
        ...core([{ label: "Notes", to: "/rd-ideas", icon: Lightbulb }]).items.filter((i) => i.to !== "/dashboard"),
      ],
    },
    {
      label: "Between Teams",
      items: [
        { label: "Team Requests", to: "/requests", icon: ArrowLeftRight },
        { label: "Teams", to: "/teams", icon: Network },
        { label: "Team Directory", to: "/employees", icon: IdCard },
        { label: "Org Chart", to: "/org-chart", icon: Network },
      ],
    },
  ],
};

export function navForApp(slug?: string | null): AppNavGroup[] | null {
  if (!slug) return null;
  return APP_NAV[slug] ?? null;
}
