import type { OrgApp } from "@/lib/hq/apps";
import { ExecDashboard } from "./dashboards/ExecDashboard";
import { ProductDashboard } from "./dashboards/ProductDashboard";
import { EngDashboard } from "./dashboards/EngDashboard";
import { MfgDashboard } from "./dashboards/MfgDashboard";
import { OpsDashboard } from "./dashboards/OpsDashboard";
import { SystemsDashboard } from "./dashboards/SystemsDashboard";
import { CommercialDashboard } from "./dashboards/CommercialDashboard";
import { AdminDashboard } from "./dashboards/AdminDashboard";

/**
 * Every workspace gets its own purpose-built dashboard — different data,
 * different layout, different information design. This only picks the right
 * one for the active app.
 */
export function WorkspaceDashboard({ app }: { app: OrgApp }) {
  switch (app.slug) {
    case "exec":
      return <ExecDashboard />;
    case "product":
      return <ProductDashboard />;
    case "eng":
      return <EngDashboard />;
    case "mfg":
      return <MfgDashboard />;
    case "ops":
      return <OpsDashboard />;
    case "systems":
      return <SystemsDashboard />;
    case "commercial":
      return <CommercialDashboard />;
    case "admin":
      return <AdminDashboard />;
    default:
      return <ExecDashboard />;
  }
}
