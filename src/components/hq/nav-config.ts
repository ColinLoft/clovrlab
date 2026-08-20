/**
 * Flat catalogue of every real page in HQ, derived from the per-workspace
 * navigation so admin pickers and route permissions can never drift from the
 * pages that actually exist.
 */
import { APP_NAV, type AppNavGroup, type AppNavItem } from "./app-nav";

export type NavItem = AppNavItem;
export type NavGroup = AppNavGroup;

function build(): NavGroup[] {
  const byLabel = new Map<string, Map<string, NavItem>>();
  for (const groups of Object.values(APP_NAV)) {
    for (const g of groups) {
      const bucket = byLabel.get(g.label) ?? new Map<string, NavItem>();
      for (const item of g.items) if (!bucket.has(item.to)) bucket.set(item.to, item);
      byLabel.set(g.label, bucket);
    }
  }
  return [...byLabel.entries()].map(([label, items]) => ({ label, items: [...items.values()] }));
}

export const navGroups: NavGroup[] = build();

/** Every route HQ knows about, in nav order. */
export const allNavItems: NavItem[] = navGroups.flatMap((g) => g.items);
